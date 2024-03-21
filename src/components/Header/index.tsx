import { Component } from 'preact'
import styles from './styles.module.scss'
import logoBase64Data from './logo-m.svg'

export default class Header extends Component {
  render () {
    return <div className={styles['wrapper']}>
      <div className={styles['logo-slot']}>
        <img className={styles['logo']} src={logoBase64Data} />
        <span className={styles['crypt']}>La crypte</span>
        <div className={styles['separator']}></div>
      </div>
    </div>
  }
}
