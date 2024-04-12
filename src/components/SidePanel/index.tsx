import { Component } from 'preact'
import { AppContext } from 'app'
import Head from './Head'
import styles from './styles.module.scss'

type Props = {}

export default class SidePanel extends Component<Props> {
  latestPageId: string | null = null
  render () {
    return <AppContext.Consumer>
      {context => {
        const { newCurrentPageId, newGetPageData, newTogglePage } = context
        if (newCurrentPageId !== null) { this.latestPageId = newCurrentPageId }
        const { latestPageId } = this
        const pageData = latestPageId !== null ? newGetPageData(latestPageId) : null
        if (pageData === null) return <></>
        const { title, cover, pageContent } = pageData
        const handleCloseClick = () => newTogglePage(null)
        return <div className={styles['wrapper']}>
          <div className={styles['head-slot']}><Head content={title} onClick={handleCloseClick} /></div>
          <div className={styles['cover-slot']}>{cover}</div>
          <div className={styles['content-slot']}>{pageContent}</div>
        </div>
      }}
    </AppContext.Consumer>
  }
}
