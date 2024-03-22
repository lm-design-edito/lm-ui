import { Component } from 'preact'
import styles from './styles.module.scss'
import copyIconBase64Data from './copy.svg'

type Props = {
  copy: string
}

type State = {
  copied: boolean
}

export default class Copyable extends Component<Props, State> {
  state: State = { copied: false }
  timeout: number | null = null
  constructor (props: Props) {
    super(props)
    this.handleCopyClick = this.handleCopyClick.bind(this)
  }

  async handleCopyClick () {
    const { props } = this
    await navigator.clipboard.writeText(props.copy)
    this.setState({ copied: true })
    if (this.timeout !== null) window.clearTimeout(this.timeout)
    this.timeout = window.setTimeout(() => {
      this.setState({ copied: false })
    }, 2000)
  }

  render () {
    const { props, state, handleCopyClick } = this
    const wrapperClasses = [styles['wrapper']]
    if (state.copied) wrapperClasses.push(styles['wrapper_copied'])
    return <div
      className={wrapperClasses.join(' ')}
      onClick={handleCopyClick}>
      <div className={styles['copy-btn']}>
        <img src={copyIconBase64Data} />
      </div>
      <div className={styles['copied']}>Copié dans le presse-papiers</div>
      <div className={styles['content']}>
        {props.children}
      </div>
    </div>
  }
}
