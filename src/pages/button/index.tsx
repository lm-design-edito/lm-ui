import { JsonEditor, Value as JsonValue, Scheme } from 'components/JsonEditor'
import { Component } from 'preact'

export const id = 'button'
export const name = 'Button'
export const thumb = <>I am thumb</>

const buttonPropsScheme: Scheme.Scheme = {
  fallback: {
    size: 'M',
    squared: false,
    secondary: false
  },
  object: {
    preventPropertyCreation: true,
    properties: {
      size: { scheme: { fallback: 'M', string: { rule: ['S', 'M', 'L'] } } },
      squared: { scheme: { fallback: false, boolean: true } },
      secondary: { scheme: { fallback: false, boolean: true } }
    }
  }
}

const buttonInitProps = buttonPropsScheme.fallback

type Props = {}
type State = {
  buttonProps: JsonValue
}

export const content = class ButtonPage extends Component<Props, State> {
  state: State = { buttonProps: buttonInitProps }
  render () {
    return <div>
      Button props:&nbsp;<span>
        <JsonEditor
          initValue={this.state.buttonProps}
          scheme={buttonPropsScheme}
          onChange={val => this.setState({ buttonProps: val })} />
      </span>
    </div>
  }
}
