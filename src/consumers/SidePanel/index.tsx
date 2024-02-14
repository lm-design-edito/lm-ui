import { Component } from 'preact'
import Head from './Head'
import styles from './styles.module.scss'
import AppContext from 'providers/context'

type Props = {}

export default class SidePanel extends Component<Props> {
  render () {
    return <AppContext.Consumer>
      {context => <div className={styles['wrapper']}>
        <div className={styles['head-slot']}>
          <Head
            onClick={() => context.togglePage(null)}
            content={context.currentPage?.name} />
        </div>
        <div className={styles['content-slot']}>
          {context.currentPage?.content}
        </div>
      </div>}
    </AppContext.Consumer>
  }
}
