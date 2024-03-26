import Tabs, { Props as TabsProps } from '@design-edito/new-app/components/UI/components/Tabs'
import Tab, { Props as TabProps } from '@design-edito/new-app/components/UI/components/Tab'
import CompPage from 'components/CompPage'
import { isObject } from 'components/JsonEditor'

export const id = 'tabs'
export const name = 'Tabs'
export const thumb = <Tabs tabs={[
  <Tab active={true} content={<>Gaz</>} />,
  <Tab active={false} content={<>Charbon</>} />,
  <Tab active={false} content={<>Pétrole</>} />,
  <Tab active={false} content={<>Viandox</>} />
]} />
export const Content = () => <CompPage
  childComp={Tabs}
  scheme={{
    fallback: {
      tabs: [
        { active: true, content: 'Actif' },
        { active: false, content: 'Inactif' }
      ]
    },
    object: {
      preventPropertyCreation: true,
      properties: {
        customClass: {
          optional: true,
          scheme: {
            fallback: 'my-custom-class',
            string: true
          }
        },
        tabs: {
          optional: true,
          scheme: {
            fallback: [
              { active: true, content: 'Actif' },
              { active: false, content: 'Inactif' }
            ],
            array: {
              values: new Array(100).fill(null).map(() => ({
                optional: true,
                scheme: {
                  fallback: {},
                  object: {
                    preventPropertyCreation: true,
                    properties: {
                      customClass: { optional: true, scheme: { fallback: 'my-custom-class', string: true } },
                      active: { optional: true, scheme: { fallback: false, boolean: true } },
                      content: { optional: true, scheme: { fallback: 'Empty tab', string: true } },
                      iconContent: { optional: true, scheme: { fallback: '', string: true } },
                      iconFirst: { optional: true, scheme: { fallback: false, boolean: true } }
                    }
                  }
                }
              }))
            }
          }
        }
      }
    }
  }}
  schemeOutputToProps={(output): TabsProps => {
    if (!isObject(output)) return {}
    const returned: TabsProps = {}
    const { customClass, tabs } = output
    returned.customClass = customClass as string | undefined
    returned.tabs = (tabs as TabProps[] | undefined)?.map(tabData => <Tab {...tabData} />)
    return returned
  }}
  propsToDkdll={(props: TabsProps) => {
    let output = `<comp name="ui">`
    output += `\n  <string class="component">tabs</string>`
    if (props.customClass !== undefined) output += `\n  <string class="customClass">${props.customClass.replaceAll('\n', ' ')}</string>`
    if (props.tabs !== undefined) {
      output += `\n  <array class="tabs">`
      props.tabs.forEach(_tabData => {
        const tabData = _tabData as TabProps
        output += `\n    <record>`
        if (tabData.customClass !== undefined) { output += `\n      <string class="customClass">${tabData.customClass.replaceAll('\n', ' ')}</string>` }
        if (tabData.active !== undefined)      { output += `\n      <boolean class="active">${tabData.active}</boolean>` }
        if (tabData.content !== undefined)     { output += `\n      <string class="content">${`${tabData.content}`.replaceAll('\n', ' ')}` }
        if (tabData.iconContent !== undefined) { output += `\n      <string class="iconContent">${`${tabData.iconContent}`.replaceAll('\n', ' ')}</string>` }
        if (tabData.iconFirst !== undefined)   { output += `\n      <boolean class="iconFirst">${tabData.iconFirst}</boolean>` }
        output += `\n    </record>`
      })
      output += `\n  </array>`
    }
    output += `\n</comp>`
    return output
  }} />
