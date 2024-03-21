import { Component } from 'preact'
import styles from './styles.module.scss'

type Props = {
  opened?: boolean
}

type State = {
  targetHeight: number | null
}

export default class Drawer extends Component<Props, State> {
  state: State = { targetHeight: null }
  $inner: HTMLDivElement | null = null
  getInnerTargetHeightInterval: number | null = null

  constructor (props: Props) {
    super(props)
    this.getInnerTargetHeight = this.getInnerTargetHeight.bind(this)
  }

  componentDidMount(): void {
    this.getInnerTargetHeight()
    this.getInnerTargetHeightInterval = window.setInterval(this.getInnerTargetHeight, 50)
  }
  
  componentDidUpdate(): void {
    this.getInnerTargetHeight()
  }

  componentWillUnmount(): void {
    const { getInnerTargetHeightInterval } = this
    if (getInnerTargetHeightInterval === null) return;
    window.clearInterval(getInnerTargetHeightInterval)
    this.getInnerTargetHeightInterval = null
  }

  getInnerTargetHeight () {
    const { $inner } = this
    if ($inner === null) return;
    const { height } = $inner.getBoundingClientRect()
    this.setState(curr => {
      if (curr.targetHeight === height) return null
      return { ...curr, targetHeight: height }
    })
  }

  render () {
    const { props, state } = this
    const wrapperStyle = {
      ['--target-height']: `${state.targetHeight ?? 0}px`
    }
    const wrapperClasses = [styles['wrapper']]
    if (props.opened) wrapperClasses.push(styles['wrapper_opened'])
    console.log(wrapperClasses)
    return <div
      style={wrapperStyle}
      className={wrapperClasses.join(' ')}>
      <div
        ref={n => { this.$inner = n }}
        className={styles['inner']}>
        {this.props.children}
      </div>
    </div>
  }
}
