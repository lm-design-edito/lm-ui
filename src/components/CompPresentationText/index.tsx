import { Component } from 'preact'
import styles from './styles.module.scss'

export default class CompPresentationText extends Component<{}> {
  render () {
    return <p class={styles['wrapper']}>
      {this.props.children}
    </p>
  }
}
