import Button, { Props as ButtonProps } from '@design-edito/new-app/components/UI/components/Button'
import CompPage from 'components/CompPage'
import { handlersScheme } from './_utils/scheme-helpers'

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
        customClass: { optional: true, scheme: { fallback: 'my-custom-class', string: true } },
        content: { optional: true, scheme: { fallback: 'En savoir plus', string: true } },
        size: { optional: true, scheme: { fallback: 'medium', string: { rule: ['small', 'medium', 'large'] } } },
        secondary: { optional: true, scheme: { fallback: false, boolean: true } },
        squared: { optional: true, scheme: { fallback: false, boolean: true } },
        disabled: { optional: true, scheme: { fallback: false, boolean: true } },
        iconContent: { optional: true, scheme: { fallback: '', string: true } },
        iconFirst: { optional: true, scheme: { fallback: false, boolean: true } },
        onClick: { optional: true, scheme: handlersScheme }
      }
    }
  }}
  schemeOutputToProps={output => output as ButtonProps}
  propsToDkdll={(props: ButtonProps) => {
    let output = `<comp name="ui">`
    output += `\n  <string class="component">button</string>`
    if (props.customClass !== undefined) { output += `\n  <string class="customClass">${props.customClass.replaceAll('\n', ' ')}</string>` }
    if (props.content !== undefined)     { output += `\n  <lm-html class="content">${`${props.content}`.replaceAll('\n', ' ')}</lm-html>` }
    if (props.size !== undefined)        { output += `\n  <string class="size">${props.size}</string>` }
    if (props.secondary !== undefined)   { output += `\n  <boolean class="secondary">${props.secondary}</boolean>` }
    if (props.squared !== undefined)     { output += `\n  <boolean class="squared">${props.squared}</boolean>` }
    if (props.disabled !== undefined)    { output += `\n  <boolean class="disabled">${props.disabled}</boolean>` }
    if (props.iconContent !== undefined) { output += `\n  <lm-html class="iconContent">${`${props.iconContent}`.replaceAll('\n', ' ')}</lm-html>` }
    if (props.iconFirst !== undefined)   { output += `\n  <boolean class="iconFirst">${props.iconFirst}</boolean>` }
    // [WIP] onClick
    output += `\n</comp>`
    return output
  }} />
