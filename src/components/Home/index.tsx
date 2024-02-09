import { Component } from 'preact'
import { pageGroups, Page } from 'pages'
import CompCard from 'components/CompCard'
import styles from './styles.module.scss'

type Props = {
  togglePage: (page: Page | null) => void
}

export default class Home extends Component<Props> {
  render () {
    const { props } = this
    return <div className={styles['wrapper']}>
      {pageGroups
        .filter(pageGroup => pageGroup.pages.length > 0)
        .map(pageGroup => <div className={styles['section']}>
          <h3 className={styles['section__title']}>{pageGroup.name}</h3>
          <div
            className={styles['section__cards']}
            style={{ '--per-line': pageGroup.cardsPerLine }}>
            {pageGroup.pages.map(page => <div
              className={styles['section__card']}
              onClick={() => props.togglePage(page)}>
              <CompCard
                thumbUrl={page.thumbUrl}
                label={page.name} />
            </div>)}
          </div>
        </div>)}
    </div>
  }
}
