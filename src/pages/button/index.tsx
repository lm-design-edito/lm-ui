import { JsonEditor, Value as JsonValue, Scheme } from 'components/JsonEditor'
import { Component } from 'preact'

import Button, { Props as ButtonProps } from '@design-edito/new-app/components/UI/components/Button'

export const id = 'button'
export const name = 'Button'
export const thumb = <>I am thumb</>

const buttonInitProps = {
  content: 'En savoir plus',
  size: 'medium',
  disabled: false,
  squared: false,
  secondary: false,
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
      disabled: { scheme: { fallback: false, boolean: true } },
      squared: { scheme: { fallback: false, boolean: true } },
      secondary: { scheme: { fallback: false, boolean: true } },
      iconContent: { scheme: { fallback: '', string: true }, optional: true },
      iconFirst: { scheme: { fallback: false, boolean: true } }
    }
  }
}

type Props = {}
type State = {
  buttonProps: ButtonProps
}

export const Content = class ButtonPage extends Component<Props, State> {
  state: State = { buttonProps: buttonInitProps }

  render () {
    const { state } = this
    return <div>
      <JsonEditor
        initValue={this.state.buttonProps as JsonValue}
        scheme={buttonPropsScheme}
        onChange={val => this.setState({ buttonProps: val as ButtonProps })} />
      <Button {...state.buttonProps} />
    </div>
  }
}
