<template>
  <h1 id="logo">
    <img id="logo__image" src="@/assets/images/rooms.png" alt=""/>
    <strong id="logo__title" class="ls-margin-left-nano">Rooms</strong>
  </h1>
</template>

<script lang="ts">

import { Vue, Options } from 'vue-class-component'

@Options({
  name: 'Logo'
})
export default class Logo extends Vue {}
</script>

<style scoped lang="less">
#logo {
  display: inline-block;
  #logo__image{
    width: 45px;
    vertical-align: middle;
  }
  #logo__title{
    vertical-align: middle;
    color: @theme[font-color];
    font-size: 23px
  }
}
.inverse #logo #logo__title {
  color: white
}
</style>
