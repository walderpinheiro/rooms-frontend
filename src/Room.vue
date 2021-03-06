<template>
  <div>
    <Header/>
    <div id="content">
      <transition name="fade" mode="out-in" appear>
        <Grid v-if="stream" :stream="stream" :username="user"/>
        <Preview v-else  @stream="onSelectStream"/>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'
import Header from '@/components/header/Header.vue'
import Preview from '@/components/Preview.vue'
import Grid from '@/components/Grid.vue'

@Options({
  name: 'Room',
  components: { Header, Preview, Grid }
})
export default class Room extends Vue {
  private stream: MediaStream | null = null;
  private user!: string;
  onSelectStream ({ stream, username }: { stream: MediaStream; username: string}): void {
    this.stream = stream
    this.user = username
  }
}
</script>

<style lang="less">
#app {
  background: @theme[background];
  height: 100%;
  width: 100%;
  position: absolute;
}
#content {
  display: flex;
  width: 100%;
  position: absolute;
  height: calc(100% - 80px);
}
.inverse #content {
  background: @color-neutral-darkest
}
</style>
