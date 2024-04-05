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
  schemeTransform={schemeOutput => {
    const props = schemeOutput as ButtonProps
    let dkdll = `<comp name="ui">`
    dkdll += `\n  <string class="component">button</string>`
    if (props.customClass !== undefined) { dkdll += `\n  <string class="customClass">${props.customClass.replaceAll('\n', ' ')}</string>` }
    if (props.content !== undefined)     { dkdll += `\n  <lm-html class="content">${`${props.content}`.replaceAll('\n', ' ')}</lm-html>` }
    if (props.size !== undefined)        { dkdll += `\n  <string class="size">${props.size}</string>` }
    if (props.secondary !== undefined)   { dkdll += `\n  <boolean class="secondary">${props.secondary}</boolean>` }
    if (props.squared !== undefined)     { dkdll += `\n  <boolean class="squared">${props.squared}</boolean>` }
    if (props.disabled !== undefined)    { dkdll += `\n  <boolean class="disabled">${props.disabled}</boolean>` }
    if (props.iconContent !== undefined) { dkdll += `\n  <lm-html class="iconContent">${`${props.iconContent}`.replaceAll('\n', ' ')}</lm-html>` }
    if (props.iconFirst !== undefined)   { dkdll += `\n  <boolean class="iconFirst">${props.iconFirst}</boolean>` }
    // Handlers
    // delete props.onClick;
    const schemeOnClick = (schemeOutput as any).onClick as string[] | undefined
    if (schemeOnClick !== undefined)     { dkdll += `\n  <array class="onClick">${schemeOnClick
      .map(handlerName => `<string>${handlerName}</string>`)
      .join('\n    ')
    }</array>` }

    dkdll += `\n</comp>`
    return { props, dkdll }
  }}
  htmlTransform={htmlString => {
    let returned: string = ''
    returned += `<!-- Structure -->`
    returned += htmlString + '\n'
    returned += `<!-- Styles -->`
    returned += `<link rel="stylesheet" href="http://some.url.com/file.css">`
    return returned
  }} />
