import { Component, VNode, render } from 'preact'
import prism from 'prismjs'
import format from 'html-format'
import styles from './styles.module.scss'
import './styles.scss'

type Props = {
  toHighlight: VNode | Element | string
  grammar: Prism.Grammar
  language: string
}

export default class CodeHighlight extends Component<Props> {
  render () {
    const { props } = this
    const fakeDiv = document.createElement('div')
    if (props.toHighlight instanceof Element) {
      fakeDiv.appendChild(props.toHighlight)
    } else if (typeof props.toHighlight === 'string') {
      fakeDiv.innerHTML = props.toHighlight
    } else {
      render(<>{props.toHighlight}</>, fakeDiv)
    }
    let formatted = fakeDiv.innerHTML
    console.log(formatted)
    // if (props.language === 'html') { formatted = format(formatted) }
    const highlighted = prism.highlight(
      formatted,
      props.grammar,
      props.language
    )
    console.log(highlighted)
    return <pre>
      <code
        className={styles['wrapper']}
        dangerouslySetInnerHTML={{ __html: highlighted }} />
    </pre>
  }
}
