import { Component, VNode } from 'preact'
import styles from './styles.module.scss'

type Props = {
  toggled?: boolean
  onToggle?: () => void
}

export default class ColorModeToggler extends Component<Props> {
  render () {
    const { props } = this
    const wrapperClasses = [styles['wrapper']]
    if (props.toggled) wrapperClasses.push(styles['wrapper_toggled'])
    return <div className={wrapperClasses.join(' ')}>
      <div className={styles['label']}>Darkmode</div>
      <div
        class={styles['toggler']}
        onClick={props.onToggle}>
        <div class={styles['toggler-button']} />
      </div>
    </div>
  }
}
