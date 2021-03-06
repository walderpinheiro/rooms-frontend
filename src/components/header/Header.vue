<template>
  <header>
    <Logo/>
  </header>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import Logo from './components/Logo.vue'

@Options({
  name: 'Header',
  components: { Logo }
})
export default class Header extends Vue {
}
</script>

<style scoped lang="less">
header{
  padding: 0 36px;
  height: 80px;
  display: flex;
  align-items: center;
}
.inverse header {
  background: @color-neutral-darkest
}
</style>
