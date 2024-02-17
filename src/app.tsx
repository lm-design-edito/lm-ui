import { render } from 'preact'
import App from 'providers/App'

import { isObject } from 'components/JsonEditor/index2'

console.log(isObject(new String()))

const target = document.querySelector('.root')
if (target !== null) render(<App/>, target)
