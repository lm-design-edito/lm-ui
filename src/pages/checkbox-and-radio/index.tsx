import CheckboxOrRadio, { Props as CheckboxOrRadioProps } from '@design-edito/new-app/components/UI/components/CheckboxOrRadio'
import CompPage from 'components/CompPage'

export const id = 'checkbox'
export const name = 'Checkbox & radio'
export const thumb = <div>
  <CheckboxOrRadio type="checkbox" labelContent="Checkbox" />
  <div style={{ height: 16 }} />
  <CheckboxOrRadio type="radio" labelContent="Radio button" />
</div>

export const Content = () => <CompPage
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
  schemeOutputToProps={output => output as CheckboxOrRadioProps}
  propsToDkdll={(props: CheckboxOrRadioProps) => {
    let output = `<comp name="ui">`
    output += `\n  <string class="component">${props.type}</string>`
    if (props.customClass !== undefined)  { output += `\n  <string class="customClass">${props.customClass.replaceAll('\n', ' ')}</string>` }
    if (props.labelContent !== undefined) { output += `\n  <string class="labelContent">${`${props.labelContent}`.replaceAll('\n', ' ')}</string>` }
    if (props.disabled !== undefined)     { output += `\n  <boolean class="disabled">${props.disabled}</boolean>` }
    if (props.error !== undefined)        { output += `\n  <boolean class="error">${props.error}</boolean>` }
    output += `\n</comp>`
    return output
  }} />
