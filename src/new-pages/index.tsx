import { VNode } from 'preact'
import PageThumb from 'components/PageThumb'

type PartialPageData = {
  id: string
  title: string
  cover: VNode | string
  pageContent: VNode
}

export type PageData = PartialPageData & {
  thumb: VNode
}

function fillPageData (partial: PartialPageData): PageData {
  return {
    ...partial,
    thumb: <PageThumb
      id={partial.id}
      label={partial.title}
      cover={partial.cover} />
  }
}

export function getPage (id: string): PageData | null {
  const found = Object
    .entries(allPages)
    .find(([, pageData]) => pageData.id === id)
  if (found === undefined) return null
  const [, pageData] = found
  return pageData
}

/* * * * * * * * * * * * * * * * * * * 
 * Components
 * * * * * * * * * * * * * * * * * * */

import scrllgngnCoverBase64Img from './Scrllgngn/thumb.svg'
import ScrllgngnPage from './Scrllgngn'
export const scrllgngn: PageData = fillPageData({
  id: 'scrllgngn',
  title: 'Scrllgngn',
  cover: <img src={scrllgngnCoverBase64Img} />,
  pageContent: <ScrllgngnPage />
})

import audioquoteCoverBase64Img from './Audioquote/thumb.svg'
import AudioquotePage from './Audioquote'
export const audioquote: PageData = fillPageData({
  id: 'audioquote',
  title: 'Audioquote',
  cover: <img src={audioquoteCoverBase64Img} />,
  pageContent: <AudioquotePage />
})

/* * * * * * * * * * * * * * * * * * * 
 * UI
 * * * * * * * * * * * * * * * * * * */

import ButtonPage from './Button'
import Button from '@design-edito/new-app/components/UI/components/Button'
export const button: PageData = fillPageData({
  id: 'button',
  title: 'Button',
  cover: <Button content='Click me' />,
  pageContent: <ButtonPage />
})

import CheckboxOrRadioPage from './CheckboxOrRadio'
import CheckboxOrRadio from '@design-edito/new-app/components/UI/components/CheckboxOrRadio'
export const checkboxOrRadio: PageData = fillPageData({
  id: 'checkbox',
  title: 'Checkbox & Radio',
  cover: <div>
    <CheckboxOrRadio type="checkbox" labelContent="Checkbox" />
    <div style={{ height: 16 }} />
    <CheckboxOrRadio type="radio" labelContent="Radio button" />
  </div>,
  pageContent: <CheckboxOrRadioPage />
})

import TabsPage from './Tabs'
import Tabs from '@design-edito/new-app/components/UI/components/Tabs'
import Tab from '@design-edito/new-app/components/UI/components/Tab'
export const tabs: PageData = fillPageData({
  id: 'tabs',
  title: 'Tabs',
  cover: <Tabs tabs={[
    <Tab active={true} content={<>Gaz</>} />,
    <Tab active={false} content={<>Charbon</>} />,
    <Tab active={false} content={<>Pétrole</>} />,
    <Tab active={false} content={<>Viandox</>} />
  ]} />,
  pageContent: <TabsPage />
})

import TogglePage from './Toggle'
import Toggle from '@design-edito/new-app/components/UI/components/Toggle'
export const toggle: PageData = fillPageData({
  id: 'toggle',
  title: 'Toggle',
  cover: <Toggle
    size='medium'
    labelContent='Activer'
    defaultChecked={false} />,
  pageContent: <TogglePage />
})


/* * * * * * * * * * * * * * * * * * * 
 * Export all
 * * * * * * * * * * * * * * * * * * */
const allPages = {
  scrllgngn,
  audioquote,
  button,
  checkboxOrRadio,
  tabs,
  toggle
}

export default allPages
