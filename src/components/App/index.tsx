import { Component } from 'preact'
import styles from './styles.module.scss'
import Header from 'components/Header'
import Home from 'components/Home'
import SidePanel from 'components/SidePanel'
import { Page } from 'pages'

type Props = {}

type State = {
  currentPageData: Page | null
}


export default class App extends Component<Props, State> {
  state: State = {
    currentPageData: null
  }

  constructor (props: Props) {
    super(props)
    this.togglePage = this.togglePage.bind(this)
  }

  togglePage (page: Page | null) {
    this.setState(curr => ({
      ...curr,
      currentPageData: curr.currentPageData === page
        ? null
        : page
    }))
  }

  render () {
    const { state } = this

    const wrapperClasses = [styles['wrapper']]
    if (state.currentPageData !== null) wrapperClasses.push(styles['wrapper_panel-open'])
    
    return <div className={wrapperClasses.join(' ')}>
      <div className={styles['header-slot']}>
        <Header />
      </div>
      <div className={styles['home-slot']}>
        <Home
          togglePage={this.togglePage} />
        <button onClick={() => this.togglePage(null)}>
          Toggle
        </button>
        <div style={{ height: '4000px' }}></div>
      </div>
      <div
        className={styles['opacifier']}
        onClick={() => this.togglePage(null)} />
      <div className={styles['side-panel-slot']}>
        <SidePanel />
      </div>
    </div>
  }
}
