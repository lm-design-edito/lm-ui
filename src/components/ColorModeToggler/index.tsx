import { Component } from 'preact'
import styles from './styles.module.scss'

import Toggle from '@design-edito/new-app/components/UI/components/Toggle'

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
      <div onClick={props.onToggle}><Toggle /></div>
    </div>
  }
}
