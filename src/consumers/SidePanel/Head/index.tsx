import { Component, VNode } from 'preact'
import styles from './styles.module.scss'
import backArrowBase64Data  from './back-arrow.svg'

type Props = {
  content?: VNode | string
  onClick?: () => void
}

export default class Head extends Component<Props> {
  render () {
    const { props } = this
    return <div
      className={styles['wrapper']}
      onClick={props.onClick}>
      <img className={styles['icon']} src={backArrowBase64Data} />
      <span className={styles['label']}>{props.content}</span>
    </div>
  }
}
