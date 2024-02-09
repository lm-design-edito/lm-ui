import { Component, VNode } from 'preact'
import styles from './styles.module.scss'

type Props = {
  label: string | VNode
  thumbUrl: string
}

export default class CompCard extends Component<Props> {
  render () {
    const { props } = this
    return <div className={styles['wrapper']}>
      <div className={styles['thumb']}>{props.thumbUrl}</div>
      <div className={styles['label']}>{props.label}</div>
    </div>
  }
}
