import Button, { Props as ButtonProps } from '@design-edito/new-app/components/UI/components/Button'
import CompPage from 'components/CompPage'

export const id = 'button'
export const name = 'Button'
export const thumb = <Button content='Click me' />
export const Content = () => <CompPage
  childComp={Button}
  scheme={{
    fallback: {
      content: 'En savoir plus',
      size: 'medium',
      secondary: false,
      squared: false,
      disabled: false,
      iconFirst: false
    },
    object: {
      preventPropertyCreation: true,
      properties: {
        customClass: { scheme: { fallback: 'my-custom-class', string: true }, optional: true },
        content: { scheme: { fallback: 'En savoir plus', string: true }, optional: true },
        size: { scheme: { fallback: 'medium', string: { rule: ['small', 'medium', 'large'] } } },
        secondary: { scheme: { fallback: false, boolean: true } },
        squared: { scheme: { fallback: false, boolean: true } },
        disabled: { scheme: { fallback: false, boolean: true } },
        iconContent: { scheme: { fallback: '', string: true }, optional: true },
        iconFirst: { scheme: { fallback: false, boolean: true } }
      }
    }
  }}
  schemeOutputToProps={output => output as ButtonProps}
  propsToDkdll={(props: ButtonProps) => {
    let output = `<comp name="ui">`
    output += `\n  <string class="component">button</string>`
    if (props.customClass !== undefined) output += `\n  <string class="customClass">${props.customClass.replaceAll('\n', ' ')}</string>`
    if (props.content !== undefined) output +=     `\n  <lm-html class="content">${`${props.content}`.replaceAll('\n', ' ')}</lm-html>`
    if (props.size !== undefined) output +=        `\n  <string class="size">${props.size}</string>`
    if (props.secondary !== undefined) output +=   `\n  <boolean class="secondary">${props.secondary}</boolean>`
    if (props.squared !== undefined) output +=     `\n  <boolean class="squared">${props.squared}</boolean>`
    if (props.disabled !== undefined) output +=    `\n  <boolean class="disabled">${props.disabled}</boolean>`
    if (props.iconContent !== undefined) output += `\n  <lm-html class="iconContent">${`${props.iconContent}`.replaceAll('\n', ' ')}</lm-html>`
    if (props.iconFirst !== undefined) output +=   `\n  <boolean class="iconFirst">${props.iconFirst}</boolean>`
    output += `\n</comp>`
    return output
  }} />
