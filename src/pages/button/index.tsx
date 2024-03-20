import { Component, render } from 'preact'
import format from 'html-format'
import Button, { Props as ButtonProps } from '@design-edito/new-app/components/UI/components/Button'
import { JsonEditor, Value as JsonValue, Scheme } from 'components/JsonEditor'

export const id = 'button'
export const name = 'Button'
export const thumb = <Button content="En savoir plus" />

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
      iconContent: { scheme: { fallback: '', string: true }, optional: true },
      size: { scheme: { fallback: 'medium', string: { rule: ['small', 'medium', 'large'] } } },
      disabled: { scheme: { fallback: false, boolean: true } },
      squared: { scheme: { fallback: false, boolean: true } },
      secondary: { scheme: { fallback: false, boolean: true } },
      iconFirst: { scheme: { fallback: false, boolean: true } }
    }
  }
}

type Props = {}
type State = {
  buttonProps: ButtonProps,
  buttonHtml?: string
}

export const Content = class ButtonPage extends Component<Props, State> {
  $buttonWrapper: HTMLDivElement | null = null
  state: State = {
    buttonProps: buttonInitProps,
    buttonHtml: undefined
  }

  constructor (props: Props) {
    super(props)
    this.syncButtonDomAfterRender = this.syncButtonDomAfterRender.bind(this)
  }

  componentDidMount (): void {
    this.syncButtonDomAfterRender()
  }

  componentDidUpdate (): void {
    this.syncButtonDomAfterRender()
  }

  syncButtonDomAfterRender () {
    const { $buttonWrapper } = this
    if ($buttonWrapper === null) return;
    const buttonHtml = $buttonWrapper.innerHTML
    this.setState(curr => {
      if (curr.buttonHtml === buttonHtml) return null;
      return { ...curr, buttonHtml }
    })
  }

  render () {
    const { state } = this
    const tempContainer = document.createElement('div')
    render(<Button {...state.buttonProps} />, tempContainer)
    return <div>
      <JsonEditor
        initValue={this.state.buttonProps as JsonValue}
        scheme={buttonPropsScheme}
        onChange={val => this.setState({ buttonProps: val as ButtonProps })} />
      <div ref={n => { this.$buttonWrapper = n }}>
        <Button {...state.buttonProps} />
      </div>
      <pre>
        {format(tempContainer.innerHTML)}
      </pre>
    </div>
  }
}
