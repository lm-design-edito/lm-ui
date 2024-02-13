import { Component, VNode } from 'preact'
import styles from './styles.module.scss'

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
      {'<—'} {props.content}
    </div>
  }
}
