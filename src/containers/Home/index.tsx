import { Component } from 'preact'
import { pageGroups } from 'pages'
import AppContext from 'containers/context'
import CompCard from 'components/CompCard'
import styles from './styles.module.scss'

type Props = {}

export default class Home extends Component<Props> {
  render () {
    return <AppContext.Consumer>
      {context => <div className={styles['wrapper']}>
        {pageGroups
          .filter(pageGroup => pageGroup.pages.length > 0)
          .map(pageGroup => <div className={styles['section']}>
            <h3 className={styles['section__title']}>{pageGroup.name}</h3>
            <div
              className={styles['section__cards']}
              style={{ '--per-line': pageGroup.cardsPerLine }}>
              {pageGroup.pages.map(page => <div
                className={styles['section__card']}>
                <a onClick={() => context.togglePage(page)}>
                  <CompCard
                    thumbUrl={page.thumbUrl}
                    label={page.name} />
                </a>
              </div>)}
            </div>
          </div>)}
          <div style={{ height: '4000px' }}></div>
      </div>}
    </AppContext.Consumer>
  }
}
