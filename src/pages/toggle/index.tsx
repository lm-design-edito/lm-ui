import Toggle, { Props as ToggleProps } from '@design-edito/new-app/components/UI/components/Toggle'
import CompPage from 'components/CompPage'

export const id = 'toggle'
export const name = 'Toggle'
export const thumb = <Toggle
  size='medium'
  labelContent='Activer'
  defaultChecked={false} />
export const Content = () => <CompPage
  childComp={Toggle}
  scheme={{
    fallback: {
      size: 'medium',
      labelContent: 'Activer',
      defaultChecked: false
    },
    object: {
      preventPropertyCreation: true,
      properties: {
        customClass: { optional: true, scheme: { fallback: 'my-custom-class', string: true } },
        labelContent: { optional: true, scheme: { fallback: 'medium', string: true } },
        size: { optional: true, scheme: { fallback: 'medium', string: { rule: ['medium', 'small'] } } },
        defaultChecked: { optional: true, scheme: { fallback: false, boolean: true } }
      }
    }
  }}
  schemeTransform={schemeOutput => {
    const props = schemeOutput as ToggleProps
    let dkdll = `<comp name="ui">`
    dkdll += `\n  <string class="component">toggle</string>`
    if (props.customClass !== undefined)    { dkdll += `\n  <string class="customClass">${props.customClass.replaceAll('\n', ' ')}</string>` }
    if (props.labelContent !== undefined)   { dkdll += `\n  <string class="labelContent">${`${props.labelContent}`.replaceAll('\n', ' ')}</string>` }
    if (props.size !== undefined)           { dkdll += `\n  <string class="size">${props.size.replaceAll('\n', ' ')}</string>` }
    if (props.defaultChecked !== undefined) { dkdll += `\n  <boolean class="defaultChecked">${props.defaultChecked}</boolean>` }
    dkdll += `\n</comp>`
    return { props, dkdll }
  }} />
