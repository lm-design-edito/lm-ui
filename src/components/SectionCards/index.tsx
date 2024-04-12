import { Component, toChildArray } from 'preact'
import styles from './styles.module.scss'

export type Props = {
  cardsPerLine: number
}

export default class SectionCards extends Component<Props> {
  render () {
    const { props } = this
    const childArray = toChildArray(props.children)
    return <div
      className={styles['wrapper']}
      style={{ '--per-line': props.cardsPerLine }}>
      {childArray.map(child => <div className={styles['card']}>
        {child}
      </div>)}
    </div>
  }
}
