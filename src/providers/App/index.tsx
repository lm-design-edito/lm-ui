import { Component } from 'preact'
import styles from './styles.module.scss'
import getBrowserDefaultScrollbarWidth from 'utils/get-browser-default-scrollbar-width'
import { Page } from 'pages'
import AppContext, { defaultContext } from 'providers/context'
import Header from 'components/Header'
import ColorModeToggler from 'components/ColorModeToggler'
import Home from 'consumers/Home'
import SidePanel from 'consumers/SidePanel'

// const LmPage: any = await import('https://assets-decodeurs.lemonde.fr/design-edito/v1.beta/shared/index.js?idle')
const LmPage: any = await import('http://localhost:3000/shared/index.js?idle')

const defaultScrollBarWidth = getBrowserDefaultScrollbarWidth()

type Props = {}

type State = {
  currentPageData: Page | null
  isDarkmode: boolean
}

export default class App extends Component<Props, State> {
  state: State = {
    currentPageData: null,
    isDarkmode: false
  }

  constructor (props: Props) {
    super(props)
    this.togglePage = this.togglePage.bind(this)
    this.toggleDarkmode = this.toggleDarkmode.bind(this)
  }

  togglePage (page: Page | null) {
    this.setState(curr => ({
      ...curr,
      currentPageData: curr.currentPageData === page
        ? null
        : page
    }))
  }

  toggleDarkmode () {
    this.setState(curr => ({
      ...curr,
      isDarkmode: !curr.isDarkmode
    }))
  }

  render () {
    const { state } = this
    const currentPage = state.currentPageData

    const globalContext = {
      ...defaultContext,
      togglePage: this.togglePage,
      toggleDarkmode: this.toggleDarkmode,
      currentPage,
      LmPage
    }

    const wrapperClasses = [styles['wrapper']]
    if (currentPage !== null) wrapperClasses.push(styles['wrapper_panel-open'])
    const wrapperStyle = { '--scrollbar-width': `${defaultScrollBarWidth}px` }
    
    return <AppContext.Provider value={globalContext}>
      <div
        className={wrapperClasses.join(' ')}
        style={wrapperStyle}>
        <div className={styles['header-slot']}>
          <Header />
        </div>
        <div className={styles['color-mode-toggler-slot']}>
          <ColorModeToggler
            toggled={state.isDarkmode}
            onToggle={this.toggleDarkmode} />
        </div>
        <div className={styles['home-slot']}>
          <Home />
        </div>
        <div
          className={styles['opacifier']}
          onClick={() => this.togglePage(null)} />
        <div className={styles['side-panel-slot']}>
          <SidePanel />
        </div>
      </div>
    </AppContext.Provider>
  }
}
