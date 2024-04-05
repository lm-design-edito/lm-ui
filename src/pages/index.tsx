import { VNode } from 'preact'
import * as audioquoteData from './audioquote'
import * as scrllgngnData from './scrllgngn'
import * as buttonData from './button'
import * as tabsData from './tabs'
import * as toggleData from './toggle'
import * as checkboxAndRadioData from './checkbox-and-radio'

type AnyPage = {
  id: string
  name: string | VNode
  content: string | VNode
}

type CardPage = AnyPage & {
  thumb: string | VNode
  thumb_wide?: string | VNode
}

type ContentPage = AnyPage & {}

export type Page = CardPage | ContentPage

type AnyPageGroup = {
  id: string,
  name: string | VNode
}

type CardsPageGroup = AnyPageGroup & {
  type: 'cards'
  cardsPerLine: number
  pages: CardPage[]
}

type ContentPageGroup = AnyPageGroup & {
  type: 'content'
  pages: ContentPage[]
}

export type PageGroup = CardsPageGroup | ContentPageGroup

export const pageGroups: PageGroup[] = [{

  /* * * * * * * * * * * * * * * * *
   * COMPONENTS
   * * * * * * * * * * * * * * * * */

  id: 'components',
  name: 'Components',
  type: 'cards',
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
  type: 'cards',
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
  type: 'content',
  pages: [{
    id: 'some-icon',
    name: 'SomeIcon',
    content: <>I am an icon</>
  }, {
    id: 'some-ico2n',
    name: 'SomeIco2n',
    content: <>I am an icon</>
  }, 
  {
    id: 'some-ico3n',
    name: 'SomeIc3on',
    content: <>I am an icon</>
  }]
}, {

  /* * * * * * * * * * * * * * * * *
   * FONTS
   * * * * * * * * * * * * * * * * */

  id: 'fonts',
  name: 'Fonts',
  type: 'content',
  pages: []
}, {

  /* * * * * * * * * * * * * * * * *
   * COLORS
   * * * * * * * * * * * * * * * * */

  id: 'colors',
  name: 'Colors',
  type: 'content',
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
