<template>
  <div class="room">
    <div class="room__grid">
     <video class="room__principal" :srcObject="principal.stream" autoplay :muted="principal.isUser(stream.id)"/>
      <div class="room__videos">
        <video v-for="peer in streamVideos" :key="peer.id" :srcObject="peer.stream" autoplay :muted="peer.isUser(stream.id)"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'
import { Inject, Prop } from 'vue-property-decorator'
import Peer from 'peerjs'
import { Socket } from 'socket.io-client'

class User {
  private readonly _id!: string
  private _stream: MediaStream
  private _username: string
  private principal = false
  private call!: Peer.MediaConnection

  constructor (stream: MediaStream, username: string) {
    this._stream = stream
    this._username = username
    this._id = stream.id
  }

  get username (): string {
    return this._username
  }

  get id (): string {
    return this._id
  }

  isUser (id: string): boolean {
    return this._id === id
  }

  hasStream (): boolean {
    return !!this._stream
  }

  get stream (): MediaStream {
    return this._stream
  }

  get isPrincipal (): boolean {
    return this.principal
  }

  public setMediaConnection (call: Peer.MediaConnection): User {
    this.call = call
    return this
  }
}

@Options({
  name: 'Grid'
})
export default class Grid extends Vue {
  @Prop()
  private stream!: MediaStream

  @Prop()
  private username!: string;

  private peer!: Peer

  private users: User[] = []

  @Inject('socket')
  private socket!: Socket

  get principal (): User {
    return this.users.find(u => u.isPrincipal && !u.isUser(this.stream.id.toString())) || new User(this.stream, this.username)
  }

  get streamVideos () {
    return this.users.filter(u => !u.isUser(this.principal.id))
  }

  mounted () {
    this.users.push(new User(this.stream, this.username))
    this.peer = new Peer(this.stream.id, {
      host: 'localhost',
      port: 3001
    })
    if (this.socket.connected) {
      this.peer.on('open', () => {
        this.socket.emit('join-room', { room: 10, user: { username: this.username, id: this.stream.id.toString() } })
        this.socket.on('user-connected', (user: {id: string; username: string}) => {
          if (user.id !== this.stream.id) {
            this.connectToNewUser(user)
          }
        })
      })
      this.peer.on('call', (call: Peer.MediaConnection) => {
        call.answer(this.stream)
        call.on('stream', (userVideoStream: MediaStream) => {
          this.socket.emit('userInfo', { room: 10, id: userVideoStream.id.toString() }, (data: any) => {
            if (!this.users.find(u => u.isUser(userVideoStream.id.toString()))) {
              this.users.push(new User(userVideoStream, data.username).setMediaConnection(call))
            }
          })
        })
      })
    } else {
      alert('Não foi possivel estabelecer conexão com servidor')
    }
  }

  connectToNewUser (user: {id: string; username: string}) {
    const call: Peer.MediaConnection = this.peer.call(user.id, this.stream)
    call.on('stream', userVideoStream => {
      if (!this.users.find(u => u.isUser(user.id))) {
        this.users.push(new User(userVideoStream, user.username).setMediaConnection(call))
      }
    })
  }
}
</script>

<style scoped lang="less">
.room {
  width: 100%;
  padding: 16px 36px 36px;
  display: flex;
  position: relative;
  .room__grid{
    width: calc(100% - 450px);
    position: relative;
    display: flex;
    height: fit-content;
    .room__principal {
      width: 100%;
      background: #121212;
      min-height: 800px;
      object-fit: cover;
      border-radius: 5px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    }
    .room__videos {
      width: 100%;
      display: flex;
      height: 150px;
      position: absolute;
      flex-direction: row-reverse;
      bottom: 0;
      overflow: auto;
      video{
        margin-right: 8px;
      }
    }
  }
}
</style>
