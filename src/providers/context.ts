import { createContext } from 'preact'
import { pageGroups, getPageGroup, getPage, Page } from 'pages'
import App from './App'

type AppContextType = {
  togglePage: App['togglePage']
  toggleDarkMode: App['toggleDarkmode']
  pageGroups: typeof pageGroups
  getPageGroup: typeof getPageGroup
  getPage: typeof getPage
  currentPage: Page | null
  LmPage: any
}

export const defaultContext = {
  togglePage: () => {},
  toggleDarkMode: () => {},
  pageGroups,
  getPageGroup,
  getPage,
  currentPage: null,
  LmPage: {}
}

const AppContext = createContext<AppContextType>(defaultContext)

export default AppContext
