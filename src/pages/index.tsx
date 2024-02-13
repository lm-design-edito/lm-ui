import { VNode } from 'preact'

export type Page = {
  id: string,
  name: string | VNode
  thumbUrl: string
  content: string | VNode
}

export type PageGroup = {
  id: string,
  name: string | VNode
  cardsPerLine: number
  pages: Page[]
}

export const pageGroups: PageGroup[] = [{

  /* * * * * * * * * * * * * * * * *
   * COMPONENTS
   * * * * * * * * * * * * * * * * */
  id: 'components',
  name: 'Components',
  cardsPerLine: 2,
  pages: [{
    id: 'scrllgngn',
    name: 'Scrllgngn',
    thumbUrl: 'thumb-url.com/img.jpg',
    content: <>The content of Scrllgngn.</>
  }, {
    id: 'audioquote',
    name: 'Audioquote',
    thumbUrl: 'thumb-url.com/img.jpg',
    content: <>The content of Audioquote.</>
  }]
}, {

  /* * * * * * * * * * * * * * * * *
   * UI
   * * * * * * * * * * * * * * * * */
  id: 'ui',
  name: 'UI',
  cardsPerLine: 3,
  pages: []
}, {

  /* * * * * * * * * * * * * * * * *
   * ICONS
   * * * * * * * * * * * * * * * * */
  id: 'icons',
  name: 'Icons',
  cardsPerLine: 3,
  pages: []
}]

export function getPageGroup (id: string) {
  return pageGroups.find(group => group.id === id)
}

export function getPage (id: string) {
  return pageGroups.reduce((found: Page | undefined, group) => {
    if (found !== undefined) return found
    const foundPage = group.pages.find(page => page.id === id)
    return foundPage
  }, undefined)
}
