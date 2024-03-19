import { render } from 'preact'
import App from 'providers/App'

const target = document.querySelector('.root')
if (target !== null) render(<App/>, target)
