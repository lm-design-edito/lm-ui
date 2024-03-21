import { Component } from 'preact'
import Head from './Head'
import styles from './styles.module.scss'
import AppContext, { AppContextType } from 'providers/context'

type Props = {}
type State = {
  currentPage: AppContextType['currentPage']
}

export default class SidePanel extends Component<Props, State> {
  lastNonNullCurrentPage: AppContextType['currentPage'] = null
  state: State = {
    currentPage: null
  }

  render () {
    const { state } = this
    return <AppContext.Consumer>
      {context => {
        if (context.currentPage !== null) {
          this.lastNonNullCurrentPage = context.currentPage
        }
        const { name, thumb, thumb_wide, content } = this.lastNonNullCurrentPage ?? {}
        return <div className={styles['wrapper']}>
          <div className={styles['head-slot']}>
            <Head content={name} onClick={() => context.togglePage(null)} />
          </div>
          <div className={styles['cover-slot']}>{thumb_wide ?? thumb}</div>
          <div className={styles['content-slot']}>{content}</div>
        </div>}}
    </AppContext.Consumer>
  }
}
