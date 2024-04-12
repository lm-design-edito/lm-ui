import CheckboxOrRadio, { Props as CheckboxOrRadioProps } from '@design-edito/new-app/components/UI/components/CheckboxOrRadio'
import CompPage from 'components/CompPage'

const CheckboxOrRadioPage = () => <CompPage
  childComp={CheckboxOrRadio}
  scheme={{
    fallback: {
      type: 'checkbox',
      labelContent: 'Check me!',
      // [WIP] implement default checked
    },
    object: {
      preventPropertyCreation: true,
      properties: {
        type: { optional: false, scheme: { fallback: 'checkbox', string: { rule: ['checkbox', 'radio'] } } },
        customClass: { optional: true, scheme: { fallback: 'my-custom-class', string: true } },
        labelContent: { optional: true, scheme: { fallback: 'medium', string: true } },
        disabled: { optional: true, scheme: { fallback: false, boolean: true } },
        error: { optional: true, scheme: { fallback: false, boolean: true } }
      }
    }
  }}
  schemeTransform={schemeOutput => {
    const props = schemeOutput as CheckboxOrRadioProps
    let dkdll = `<comp name="ui">`
    dkdll += `\n  <string class="component">${props.type}</string>`
    if (props.customClass !== undefined)  { dkdll += `\n  <string class="customClass">${props.customClass.replaceAll('\n', ' ')}</string>` }
    if (props.labelContent !== undefined) { dkdll += `\n  <string class="labelContent">${`${props.labelContent}`.replaceAll('\n', ' ')}</string>` }
    if (props.disabled !== undefined)     { dkdll += `\n  <boolean class="disabled">${props.disabled}</boolean>` }
    if (props.error !== undefined)        { dkdll += `\n  <boolean class="error">${props.error}</boolean>` }
    dkdll += `\n</comp>`
    return { props, dkdll }
  }}
  htmlTransform={i => i} />

export default CheckboxOrRadioPage
