<template>
  <div id="preview">
    <div class="preview__image">
      <h2 style="font-size:35px; margin-top: 50px; font-weight:300">Bem vindo ao Rooms</h2>
      <span style="margin-top:26px; display:block;font-weight:300">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris non rutrum ligula. Donec sit amet consectetur eros. Donec tincidunt at erat vitae aliquam. Cras pharetra ex sed pulvinar bibendum. Morbi congue nulla ac lacus tempus, in fringilla odio fermentum. Proin interdum viverra diam, eget porta nisi maximus eu. Sed iaculis pharetra magna, vitae dictum tellus egestas et.</span>
      <i aria-hidden="true"/>
    </div>
    <div class="preview__content">
      <div class="preview__wrapper">
        <video ref="videoPreview" class="ls-border-radius-md" autoplay muted/>
        <div class="preview__controls">
          <div :class="audioStatusClass" aria-hidden="true">
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
          </div>
          <button class="ls-shadow-level-1 ls-border-radius-md" @click="toogleAudio">
            <span class="material-icons" v-text="audioIcon"/>
          </button>
          <button class="ls-shadow-level-1 ls-border-radius-md hangout" @click="close">
            <span class="material-icons">call_end</span>
            <span>Encerrar</span>
          </button>
          <button class="ls-shadow-level-1 ls-border-radius-md" @click="toogleVideo">
            <span class="material-icons" v-text="videoIcon"/>
          </button>
        </div>
      </div>
      <div class="preview__form">
        <form @submit.prevent="onSubmit" novalidate>
          <span>Preparado para participar?</span>
          <InputText ref="input" style="width:100%; margin-top: 16px" label="Nome" placeholder="Nome do usuário"
                     :required="true" value="Lorem" v-model="username"/>
          <button class="preview__button" type="submit" v-text="'Entrar na sala'"/>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'
import { Ref, Watch } from 'vue-property-decorator'
import InputText from '@/components/form/Input.vue'
import Heading from '@/components/display/Heading.vue'
import hark from 'hark'

@Options({
  name: 'Preview',
  components: { InputText, Heading }
})
export default class Preview extends Vue {
  private stream: MediaStream | null = null;

  private username = 'Lorem'

  @Ref('input') readonly input!: InputText

  @Ref('videoPreview')
  private videoPreview!: HTMLVideoElement;

  @Watch('stream')
  onStreamChanged (newValue: MediaStream) {
    this.videoPreview.srcObject = newValue
  }

  onSubmit () {
    this.input.onBlur(null)
    if (this.stream) {
      this.$emit('stream', { stream: this.stream, username: this.username })
    }
  }

  private audioEnabled = true;
  private videoEnabled = true;
  private speaking = false

  get audioStatusClass () {
    return {
      'spreak-preview': true,
      speaking: this.speaking
    }
  }

  async mounted () {
    try {
      const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      })
      this.stream = stream
      const speechEvents = hark(stream, {})

      speechEvents.on('speaking', () => {
        this.speaking = true
      })
      speechEvents.on('stopped_speaking', () => {
        this.speaking = false
      })
    } catch (e) {
      alert('Verifique as permissões de uso da câmera e audio')
    }
  }

  get audioIcon () {
    return this.audioEnabled ? 'mic_off' : 'mic_none'
  }

  get videoIcon () {
    return this.videoEnabled ? 'videocam_off' : 'videocam'
  }

  toogleAudio () {
    if (this.stream) {
      this.stream.getAudioTracks()[0].enabled = !this.stream.getAudioTracks()[0].enabled
      this.audioEnabled = !this.audioEnabled
    }
  }

  toogleVideo () {
    if (this.stream) {
      this.stream.getVideoTracks()[0].enabled = !this.stream.getVideoTracks()[0].enabled
      this.videoEnabled = !this.videoEnabled
    }
  }

  close () {
    window.location.href = 'https://locaweb.com.br'
  }
}
</script>

<style scoped lang="less">
#preview{
  width: 100%;
  padding: 16px 36px 36px;
  display: flex;
  .preview__image{
    min-width: 400px;
    flex: 1 1 300px;
    i{
      background: url('/img/video.jpg') no-repeat bottom;
      background-size: auto 100%;
      height: 600px;
      width: 100%;
      margin-top: 0;
      display: block;
    }
  }
  .preview__content{
    flex: 1 1 600px;
    max-width: 1200px;
    .preview__wrapper{
      position: relative;
      .preview__controls {
        position: absolute;
        width: 80%;
        margin: 0 10%;
        display: flex;;
        bottom: 70px;
        z-index: 2;
        align-items: center;
        justify-content: center;
        .spreak-preview{
          position: absolute;
          left: 34px;
          bottom: -48px;
        }
        .speaking {
          .bar{
            animation: sound 0ms -800ms linear infinite alternate;
          }
        }
        .bar {
          background: #E20074;
          bottom: 1px;
          height: 3px;
          position: absolute;
          width: 3px;
        }
        @keyframes sound {
          0% {
            opacity: .35;
            height: 3px;
          }
          100% {
            opacity: 1;
            height: 28px;
          }
        }
        .bar:nth-child(1)  { left: 1px; animation-duration: 474ms; }
        .bar:nth-child(2)  { left: 5px; animation-duration: 433ms; }
        .bar:nth-child(3)  { left: 9px; animation-duration: 407ms; }
        .bar:nth-child(4)  { left: 13px; animation-duration: 458ms; }
        button {
          display: inline-block;
          background: #fff;
          cursor: pointer;
          margin-left: 8px;
          padding: 10px 22px;
          border: 0 !important;
          outline: none !important;

          span {
            color: @color-brand-primary-dark;
            vertical-align: middle;
          }

          &:hover {
            span {
              color: @color-brand-secondary-medium;
            }
          }
        }
        .hangout{
          span {
            color: @color-brand-secondary-dark;
          }
          span:nth-child(2){
            margin-left: 8px;
          }
          &:hover {
            background: @color-brand-secondary-medium;
            span {
              color: white;
            }
          }
        }
      }
    }
    video{
      width: 80%;
      margin: 0 auto;
      display: block;
      position: relative;
      z-index: 1;
      object-fit: cover;
      -moz-transform: scaleX(-1);
      -o-transform: scaleX(-1);
      -webkit-transform: scaleX(-1);
      transform: scaleX(-1);
      box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    }
    .preview__form{
      width: 500px;
      height: 200px;
      margin: -50px auto 0 auto;
      padding: 24px;
      background: #fff;
      display: block;
      position: relative;
      z-index: 2;
      box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
      .preview__button{
        width: 100%;
        padding: 16px 0;
        margin-top: 16px;
        cursor: pointer;
        background: @color-highlight-darkest;
        color: white;
        text-transform: uppercase;
        font-width: 500;
      }
    }
  }
  #userinfo {
    width: 500px;
    display: inline-block;
    vertical-align: middle;
    border: none
  }
  #video__wrapper {
    display: inline-block;
    vertical-align: middle;
    width: calc( 100% - 500px);
    video {
      width: calc(100% - 36px);
      max-height: 770px;
      object-fit: cover;
      -moz-transform: scaleX(-1);
      -o-transform: scaleX(-1);
      -webkit-transform: scaleX(-1);
      transform: scaleX(-1);
    }
  }
  #preview__video{
    display: flex;
    flex-wrap: wrap;
  }
  #preview__info{
    background: white;
    width: 100%
  }
  #preview__buttons{
    width: 100%;
    margin-top: 26px;
    display: flex;
    justify-content: center;
  }

}
.inverse {
  #preview{
    #userinfo {
      background:  @color-neutral-darkest;
      border: 0
    }
  }

}
.button{
  outline: 0;
  background: @color-brand-secondary-light;
  border: @border-width-thin solid @color-brand-secondary-lightest;
  color: white;
  padding: @spacing-squish-xs;
  min-width: 148px;
  line-height: @line-height-tight;
  font-size: @font-size-sm;
  font-weight: @font-weight-regular;
  cursor: pointer;
  &:hover {
    border: @border-width-thin solid @color-brand-secondary-dark;;
    background: @color-brand-secondary-medium;
  }
  &:focus{
    border: @border-width-thin solid @color-brand-primary-darkest;
    background: #eedadf;
    color:  @color-brand-primary-darkest
  }
}
</style>
