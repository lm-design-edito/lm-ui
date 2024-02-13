import { render } from 'preact'
import App from 'containers/App'

const target = document.querySelector('.root')
if (target !== null) render(<App/>, target)
