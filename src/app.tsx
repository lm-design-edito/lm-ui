import { render } from 'preact'
import App from 'providers/App'

import { isObject, Json, Scheme, ValueEditor } from 'components/JsonEditor/index2'

const scheme: Scheme.Scheme = {
  fallback: 'ho',
  string: {
    rule: ['hey', 'ho', 'lets go!'],
    fallback: 'lets go!'
  }
}

const input = 'coucou'

const target = document.querySelector('.root')
// if (target !== null) render(<App/>, target)
if (target !== null) render(<ValueEditor value={input} scheme={scheme} />, target)
