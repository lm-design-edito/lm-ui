import { Component } from 'preact'
import Button, { Props as ButtonProps } from '@design-edito/new-app/components/UI/components/Button'
import { Value as JsonValue, Scheme } from 'components/JsonEditor'
import CompPresentationText from 'components/CompPresentationText'
import CompEditor from 'components/CompEditor'

export const id = 'button'
export const name = 'Button'
export const thumb = <Button content="En savoir plus" />

const buttonInitProps = {
  content: 'En savoir plus',
  size: 'medium',
  secondary: false,
  squared: false,
  disabled: false,
  iconFirst: false
} as ButtonProps

const buttonPropsScheme: Scheme.Scheme = {
  fallback: buttonInitProps as JsonValue,
  object: {
    preventPropertyCreation: true,
    properties: {
      customClass: { scheme: { fallback: 'my-custom-class', string: true }, optional: true },
      content: { scheme: { fallback: 'En savoir plus', string: true }, optional: true },
      size: { scheme: { fallback: 'medium', string: { rule: ['small', 'medium', 'large'] } } },
      secondary: { scheme: { fallback: false, boolean: true } },
      squared: { scheme: { fallback: false, boolean: true } },
      disabled: { scheme: { fallback: false, boolean: true } },
      iconContent: { scheme: { fallback: '', string: true }, optional: true },
      iconFirst: { scheme: { fallback: false, boolean: true } }
    }
  }
}

type Props = {}

function buttonPropsToDkdll (props: ButtonProps): string {
  let output = `<comp name="button">`
  if (props.customClass !== undefined) output += `\n  <string class="customClass">${props.customClass}</string>`
  if (props.content !== undefined) output +=     `\n  <lm-html class="content">${props.content}</lm-html>`
  if (props.size !== undefined) output +=        `\n  <string class="size">${props.size}</string>`
  if (props.secondary !== undefined) output +=   `\n  <boolean class="secondary">${props.secondary}</boolean>`
  if (props.squared !== undefined) output +=     `\n  <boolean class="squared">${props.squared}</boolean>`
  if (props.disabled !== undefined) output +=    `\n  <boolean class="disabled">${props.disabled}</boolean>`
  if (props.iconContent !== undefined) output += `\n  <lm-html class="iconContent">${props.iconContent}</lm-html>`
  if (props.iconFirst !== undefined) output +=   `\n  <boolean class="iconFirst">${props.iconFirst}</boolean>`
  output += `\n</comp>`
  return output
}

export const Content = class ButtonPage extends Component<Props> {
  render () {
    return <div>
      <CompPresentationText>
        I am a simple button.
      </CompPresentationText>
      <CompEditor
        component={Button}
        initialProps={buttonInitProps}
        scheme={buttonPropsScheme}
        onChange={val => this.setState({ buttonProps: val })}
        propsToDkdll={buttonPropsToDkdll} />
    </div>
  }
}
