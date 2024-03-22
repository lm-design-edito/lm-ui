import { Component } from 'preact'
import Head from './Head'
import styles from './styles.module.scss'
import AppContext, { AppContextType } from 'providers/context'

type Props = {}

export default class SidePanel extends Component<Props> {
  latestNonNullCurrentPage: AppContextType['currentPage'] = null

  render () {
    return <AppContext.Consumer>
      {context => {
        if (context.currentPage !== null) {
          this.latestNonNullCurrentPage = context.currentPage
        }
        const { name, thumb, thumb_wide, content } = this.latestNonNullCurrentPage ?? {}
        return <div className={styles['wrapper']}>
          <div className={styles['head-slot']}>
            <Head content={name} onClick={() => context.togglePage(null)} />
          </div>
          <div className={styles['cover-slot']}>
            {thumb_wide ?? thumb}
            <div className={styles['cover-slot-no-click-layer']} />
          </div>
          <div className={styles['content-slot']}>{content}</div>
        </div>}}
    </AppContext.Consumer>
  }
}
