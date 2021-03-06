<template>
  <component :class="styleClass" :is="type" v-text="text"/>
</template>

<script lang="ts">
import { Prop } from 'vue-property-decorator'
import { Options, Vue } from 'vue-class-component'

@Options({
  name: 'Heading'
})
export default class Heading extends Vue {
  @Prop({ default: 'h2' })
  private type!: string

  @Prop({ required: true })
  private text!: string

  @Prop({ default: 'md' })
  private size!: string;

  get styleClass () {
    return {
      [`font-size-${this.size}`]: true,
      heading: true
    }
  }
}
</script>

<style scoped lang="less">
.heading{
  line-height: @line-height-tight;
  font-weight: @font-weight-bold;
  color: @color-brand-primary-darkest;
  font-size: @font-size-lg;
  margin-bottom: @spacing-stack-xxxs
}
.inverse {
  .heading{
    color: @color-neutral-lightest;
  }
}
</style>
