import { Component } from 'preact'
import getBrowserDefaultScrollbarWidth from 'utils/get-browser-default-scrollbar-width'
import AppContext, { defaultContext } from 'providers/context'
import Home from 'consumers/Home'
import SidePanel from 'consumers/SidePanel'
import { Page } from 'pages'
import Header from 'components/Header'
import ColorModeToggler from 'components/ColorModeToggler'
import styles from './styles.module.scss'
import './styles.scss'
import isRecord from '@design-edito/tools/utils/agnostic/is-record/index.js'

const defaultScrollBarWidth = getBrowserDefaultScrollbarWidth()

type Props = {}

type State = {
  currentPageData: Page | null
  isDarkmode: boolean
  iconsRegistryData: Record<string, string> | null
  iconsRegistryLoading: boolean
  iconsRegistryError: Error | null
}

export default class App extends Component<Props, State> {
  state: State = {
    currentPageData: null,
    isDarkmode: false,
    iconsRegistryData: null,
    iconsRegistryLoading: true,
    iconsRegistryError: null
  }

  constructor (props: Props) {
    super(props)
    this.fetchIconsRegistry = this.fetchIconsRegistry.bind(this)
    this.togglePage = this.togglePage.bind(this)
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
    const isValid = isRecord(data) && Object.values(data).every(val => typeof val === 'string')
    if (!isValid) return this.setState({
      iconsRegistryData: null,
      iconsRegistryLoading: false,
      iconsRegistryError: new Error(`Registry must be a JSON formatted file of shape Record<string, string> @ ${registryUrl.toString()}`)
    })
    return this.setState({
      iconsRegistryData: data as Record<string, string>,
      iconsRegistryLoading: false,
      iconsRegistryError: null
    })
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
      iconsRegistryData: state.iconsRegistryData
    }

    const wrapperClasses = [styles['wrapper']]
    if (currentPage !== null) wrapperClasses.push(styles['wrapper_panel-open'])
    const wrapperStyle = {
      '--scrollbar-width': `${defaultScrollBarWidth}px`
    }
    
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
          onClick={() => this.togglePage(null)} />
        <div className={styles['side-panel-slot']}>
          <SidePanel />
        </div>
      </div>
    </AppContext.Provider>
  }
}
