import { Component, VNode } from 'preact'
import { AppContext } from 'app'
import styles from './styles.module.scss'

type Props = {
  id: string
  label: string | VNode
  cover: string | VNode
}

export default class PageThumb extends Component<Props> {
  render () {
    const { props } = this
    return <AppContext.Consumer>
      {context => {
        const clickHandler = () => context.newTogglePage(props.id)
        return <div className={styles['wrapper']} onClick={clickHandler}>
          {typeof props.cover === 'string' && <img className={styles['cover']} src={props.cover} />}
          {typeof props.cover !== 'string' && <div className={styles['cover']}>{props.cover}</div>}
          <div className={styles['no-click-layer']} />
          <div className={styles['label']}>{props.label}</div>
        </div>}}
    </AppContext.Consumer>
  }
}
