import { Component, render, createContext } from 'preact'
import isRecord from '@design-edito/tools/utils/agnostic/is-record/index.js'
// import { pageGroups, getPageGroup, getPage, Page } from 'pages'
import { PageData, getPage as newGetPage } from 'new-pages'
import Home from 'components/Home'
import SidePanel from 'components/SidePanel'
import Header from 'components/Header'
import ColorModeToggler from 'components/ColorModeToggler'
import getBrowserDefaultScrollbarWidth from 'utils/get-browser-default-scrollbar-width'
import styles from './styles.module.scss'
import './styles.scss'

/* * * * * * * * * * * * * * * * * 
 * Context
 * * * * * * * * * * * * * * * * */

export type IconJsonData = {
  category: string
  description: string
}

export type AppContextType = {
  iconsRegistryData: Record<string, IconJsonData> | null
  // togglePage: App['togglePage']
  toggleDarkMode: App['toggleDarkmode']
  // pageGroups: typeof pageGroups
  // getPageGroup: typeof getPageGroup
  // getPage: typeof getPage
  // currentPage: Page | null
  newTogglePage: (id: string | null) => void
  newCurrentPageId: string | null
  newGetPageData: (id: string) => PageData | null
}

export const defaultContext: AppContextType = {
  iconsRegistryData: null,
  // togglePage: () => {},
  toggleDarkMode: () => {},
  // pageGroups,
  // getPageGroup,
  // getPage,
  // currentPage: null,
  newTogglePage: (id: string | null) => console.log('you wanna toggle page', id),
  newCurrentPageId: null,
  newGetPageData: newGetPage
}

export const AppContext = createContext<AppContextType>(defaultContext)

/* * * * * * * * * * * * * * * * * 
 * App
 * * * * * * * * * * * * * * * * */

const defaultScrollBarWidth = getBrowserDefaultScrollbarWidth()

type Props = {}

type State = {
  // currentPageData: Page | null
  newCurrentPageId: string | null
  isDarkmode: boolean
  iconsRegistryData: Record<string, IconJsonData> | null
  iconsRegistryLoading: boolean
  iconsRegistryError: Error | null
}

class App extends Component<Props, State> {
  state: State = {
    // currentPageData: null,
    newCurrentPageId: null,
    isDarkmode: false,
    iconsRegistryData: null,
    iconsRegistryLoading: true,
    iconsRegistryError: null
  }

  constructor (props: Props) {
    super(props)
    this.fetchIconsRegistry = this.fetchIconsRegistry.bind(this)
    // this.togglePage = this.togglePage.bind(this)
    this.newTogglePage = this.newTogglePage.bind(this)
    this.toggleDarkmode = this.toggleDarkmode.bind(this)
  }

  componentDidMount(): void {
    this.fetchIconsRegistry()
  }

  async fetchIconsRegistry (): Promise<void> {
    this.setState({ iconsRegistryLoading: true })
    const demoPageUrl = new URL(window.location.href)
    const registryUrl = new URL('/icons/registry.json', demoPageUrl)
    const response = await window.fetch(registryUrl)
    const data = await response.json()
    const isValid = isRecord(data) && Object.values(data).every(val => {
      const valIsRecord = isRecord(val)
      if (!valIsRecord) return false
      const { category, description } = val
      return typeof category === 'string'
        && typeof description === 'string'
    })
    if (!isValid) return this.setState({
      iconsRegistryData: null,
      iconsRegistryLoading: false,
      iconsRegistryError: new Error(`Registry must be a JSON formatted file of shape Record<string, IconJsonData> @ ${registryUrl.toString()}`)
    })
    return this.setState({
      iconsRegistryData: data as Record<string, IconJsonData>,
      iconsRegistryLoading: false,
      iconsRegistryError: null
    })
  }

  // togglePage (page: Page | null) {
  //   this.setState(curr => ({
  //     ...curr,
  //     currentPageData: curr.currentPageData === page
  //       ? null
  //       : page
  //   }))
  // }

  newTogglePage (id: string | null) {
    this.setState(curr => ({
      ...curr,
      newCurrentPageId: curr.newCurrentPageId === id
        ? null
        : id
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

    const globalContext = {
      ...defaultContext,
      // togglePage: this.togglePage,
      newTogglePage: this.newTogglePage,
      toggleDarkmode: this.toggleDarkmode,
      // currentPage,
      newCurrentPageId: state.newCurrentPageId,
      iconsRegistryData: state.iconsRegistryData
    }

    const newCurrentPageId = state.newCurrentPageId
    const newCurrentPageData = newCurrentPageId !== null ? newGetPage(newCurrentPageId) : null

    const wrapperClasses = [styles['wrapper']]
    if (newCurrentPageData !== null) wrapperClasses.push(styles['wrapper_panel-open'])
    const wrapperStyle = { '--scrollbar-width': `${defaultScrollBarWidth}px` }
    
    return <AppContext.Provider value={globalContext}>
      <div
        data-color-mode={state.isDarkmode ? 'dark' : 'light'}
        className={wrapperClasses.join(' ')}
        style={wrapperStyle}>
        {/* Header */}
        <div className={styles['header-slot']}>
          <Header />
        </div>
        
        {/* Color mode */}
        <div className={styles['color-mode-toggler-slot']}>
          <ColorModeToggler 
            toggled={state.isDarkmode}
            onToggle={this.toggleDarkmode} />
        </div>
        
        {/* Home */}
        <div className={styles['home-slot']}>
          {(() => {
            if (state.iconsRegistryLoading) return <>Loading...</>
            if (state.iconsRegistryError) return <code>{state.iconsRegistryError.message}</code>
            return <Home />
          })()}
        </div>
        
        {/* Side panel */}
        <div
          className={styles['opacifier']}
          onClick={() => this.newTogglePage(null)} />
        <div className={styles['side-panel-slot']}>
          <SidePanel />
        </div>
      </div>
    </AppContext.Provider>
  }
}

const target = document.querySelector('.root')
if (target !== null) render(<App/>, target)
