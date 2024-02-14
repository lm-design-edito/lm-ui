import { Component, VNode } from 'preact'
import styles from './styles.module.scss'

type Props = {
  label: string | VNode
  thumb: string | VNode
}

export default class CompCard extends Component<Props> {
  render () {
    const { props } = this
    return <div className={styles['wrapper']}>
      {typeof props.thumb === 'string' && <img className={styles['thumb']} src={props.thumb} />}
      {typeof props.thumb !== 'string' && <div className={styles['thumb']}>{props.thumb}</div>}
      <div className={styles['label']}>{props.label}</div>
    </div>
  }
}
