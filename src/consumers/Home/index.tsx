import { Component } from 'preact'
import { pageGroups } from 'pages'
import AppContext from 'providers/context'
import CompCard from 'components/CompCard'
import styles from './styles.module.scss'

type Props = {}

export default class Home extends Component<Props> {
  render () {
    return <AppContext.Consumer>
      {context => <div className={styles['wrapper']}>
        {pageGroups
          .map(pageGroup => {
            return <div className={styles['section']}>
              <h3 className={styles['section__title']}>{pageGroup.name}</h3>
              
              {/* Cards display */}
              {pageGroup.type === 'cards' && <div
                className={styles['section__cards']}
                style={{ '--per-line': pageGroup.cardsPerLine }}>
                {pageGroup.pages.map(page => <div
                  className={styles['section__card']}>
                  <a onClick={() => context.togglePage(page)}>
                    <CompCard thumb={page.thumb} label={page.name} />
                  </a>
                </div>)}
              </div>}

              {/* Contents display */}
              {pageGroup.type === 'content' && <div className={styles['section__contents']}>
                {pageGroup.pages.map(page => <>
                  <div className={styles['section__content-name']}>{page.name}</div>
                  <div className={styles['section__content']}>{page.content}</div>
                </>)}
              </div>}
            </div>
          })
        }
        <div style={{ height: '4000px' }}></div>
      </div>}
    </AppContext.Consumer>
  }
}
