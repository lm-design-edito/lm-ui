import { Component, VNode } from 'preact'
import styles from './styles.module.scss'

export type Props = {
  name: string
}

export default class Section extends Component<Props> {
  render () {
    const { props } = this
    return <div className={styles['wrapper']}>
      <h3 className={styles['name']}>{props.name}</h3>
      <div className={styles['content']}>{props.children}</div>
    </div>
  }
}
