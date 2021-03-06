<template>
  <div class="input" :class="validation.styleClass()">
    <label>
      <span class="input__label" v-text="label"/>
      <input type="text" :placeholder="placeholder" @focus="onFocus" @blur="onBlur" v-model="defaultValue"
             :required="required" :novalidate="true"/>
      <strong v-if="validation.displayValidation()">O preenchimento do campo é obrigatório</strong>
    </label>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator'

class Validation {
  private untouched: boolean;
  private touched: boolean;
  private valid: boolean;
  private invalid: boolean;
  private dirty: boolean;
  private focused: boolean

  constructor (valid = false) {
    this.valid = valid
    this.invalid = false
    this.dirty = false
    this.untouched = true
    this.touched = false
    this.focused = false
  }

  focus () {
    this.touched = true
    this.untouched = false
    this.focused = true
  }

  blur () {
    this.focused = false
    this.dirty = false
  }

  displayValidation (): boolean {
    return this.invalid && !this.focused
  }

  validate (valid: boolean) {
    this.valid = valid
    this.invalid = !valid
  }

  styleClass (): {} {
    return {
      'ls-touched': this.touched,
      'ls-untouched': this.untouched,
      'ls-valid': this.valid,
      'ls-invalid': this.invalid,
      'ls-focused': this.focused
    }
  }
}

@Options({
  name: 'Input'
})
export default class Input extends Vue {
  @Prop({ default: 'label' })
  private label!: string;

  @Prop()
  private placeholder?: string;

  @Prop({ default: false })
  private required!: boolean;

  @Prop()
  private value!: string

  private defaultValue = this.value;

  private validation = new Validation(!this.required);

  @Watch('value')
  onValueChanged (newValue: string) {
    this.$emit('change', newValue)
  }

  onFocus (event: Event) {
    this.validation.focus()
    this.$emit('focus', event)
  }

  public onBlur (event: Event | null) {
    this.$emit('blur', event)
    if (this.required) {
      this.validate()
    }
    this.validation.blur()
  }

  validate () {
    this.validation.validate(!!this.defaultValue)
  }
}
</script>

<style scoped lang="less">
.input{
  min-width: 50px;
  .input__label{
    display: block;
    font-size: @font-size-xs;
    line-height: @line-height-tight;
    letter-spacing: @letter-spacing-medium;
    font-weight: @font-weight-regular;
    color: if((@theme[theme] = 'dark'), @color-neutral-lightest, @color-brand-primary-darkest) ;
    margin-bottom: @spacing-stack-quarck;
  }
  input {
    border: @border-width-hairline solid @color-neutral-medium;
    border-bottom-color: if((@theme[theme] = 'dark'), @color-neutral-lightest, @color-neutral-darkest);
    line-height: @line-height-large;
    height: 40px;
    letter-spacing: @letter-spacing-medium;
    outline: 0!important;
    color: if((@theme[theme] = 'dark'), @color-neutral-lightest, @color-brand-primary-darkest) ;
    padding: @spacing-squish-nano;
    font-size: @font-size-xs;
    width: 100%;
    background: if((@theme[theme] = 'dark'), @color-neutral-darkest, @color-neutral-lightest) ;
    &::placeholder {
      font-size: @font-size-xs;
      line-height: @line-height-large;
      color: if((@theme[theme] = 'dark'), @color-neutral-lightest, @color-neutral-darkest) ;
      opacity: @opacity-level-medium;
      letter-spacing: @letter-spacing-medium;
      font-weight: @font-weight-regular
    }
    &:focus {
      border: @border-width-hairline solid if((@theme[theme] = 'dark'), @color-neutral-lightest, @color-neutral-darkest)
    }
  }
  strong {
    font-size: @font-size-xs;
  }
}
.ls-invalid:not(.ls-focused) {
  .input__label{
    color: if((@theme[theme] = 'dark'), @color-warning-medium, @color-brand-secondary-lightest)
  }
  input {
    border: @border-width-hairline solid if((@theme[theme] = 'dark'), @color-warning-medium, @color-brand-secondary-lightest)
  }
  strong {
    color: if((@theme[theme] = 'dark'), @color-warning-medium, @color-brand-secondary-lightest)
  }
}
.ls-valid:not(.ls-focused) {
  .input__label{
    color: @color-success-medium
  }
  input {
    border: @border-width-hairline solid @color-success-medium
  }
  strong {
    color: @color-success-medium
  }
}
.inverse {
  .input {
    .input__label{
      color: @color-neutral-lightest
    }
    input {
      background: @color-neutral-darkest;
      border-bottom-color: @color-neutral-lightest;
      color: @color-neutral-lightest;
      &::placeholder {
        color: @color-neutral-lightest;
      }
      &:focus {
        border: @border-width-hairline solid  @color-neutral-lightest
      }
    }
  }
  .ls-invalid:not(.ls-focused) {
    .input__label{
      color:@color-warning-medium
    }
    input {
      border: @border-width-hairline solid @color-warning-medium
    }
    strong {
      color: @color-warning-medium
    }
  }
}
</style>
