import { createContext } from 'preact'
import { pageGroups, getPageGroup, getPage, Page } from 'pages'
import App from './App'

export type AppContextType = {
  togglePage: App['togglePage']
  toggleDarkMode: App['toggleDarkmode']
  pageGroups: typeof pageGroups
  getPageGroup: typeof getPageGroup
  getPage: typeof getPage
  currentPage: Page | null
}

export const defaultContext: AppContextType = {
  togglePage: () => {},
  toggleDarkMode: () => {},
  pageGroups,
  getPageGroup,
  getPage,
  currentPage: null
}

const AppContext = createContext<AppContextType>(defaultContext)

export default AppContext
