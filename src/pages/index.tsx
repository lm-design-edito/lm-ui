import { VNode } from 'preact'
import * as audioquoteData from './audioquote'
import * as scrllgngnData from './scrllgngn'
import * as buttonData from './button'
import * as tabsData from './tabs'
import * as toggleData from './toggle'
import * as checkboxAndRadioData from './checkbox-and-radio'

export type Page = {
  id: string,
  name: string | VNode
  thumb: string | VNode
  thumb_wide?: string | VNode
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
    id: scrllgngnData.id,
    name: scrllgngnData.name,
    thumb: scrllgngnData.thumb,
    content: <scrllgngnData.Content />
  }, {
    id: audioquoteData.id,
    name: audioquoteData.name,
    thumb: audioquoteData.thumb,
    content: <audioquoteData.Content />
  }]
}, {

  /* * * * * * * * * * * * * * * * *
   * UI
   * * * * * * * * * * * * * * * * */

  id: 'ui',
  name: 'UI',
  cardsPerLine: 3,
  pages: [{
    id: buttonData.id,
    name: buttonData.name,
    thumb: buttonData.thumb,
    content: <buttonData.Content />
  }, {
    id: tabsData.id,
    name: tabsData.name,
    thumb: tabsData.thumb,
    content: <tabsData.Content />
  }, {
    id: toggleData.id,
    name: toggleData.name,
    thumb: toggleData.thumb,
    content: <toggleData.Content />
  }, {
    id: checkboxAndRadioData.id,
    name: checkboxAndRadioData.name,
    thumb: checkboxAndRadioData.thumb,
    content: <checkboxAndRadioData.Content />
  }]
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
