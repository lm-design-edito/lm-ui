import { Component } from 'preact'
import styles from './styles.module.scss'

export default class Header extends Component {
  render () {
    return <div className={styles['wrapper']}>
      M | La crypte
      <div className={styles['separator']}></div>
    </div>
  }
}
