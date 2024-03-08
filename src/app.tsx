import { render } from 'preact'
import App from 'providers/App'
import LmPagePromise from './lm-page-loader'

const LmPage = await LmPagePromise
const appNames = LmPage.Apps.Name
const audioquoteRenderer = await LmPage.Apps.load(appNames.AUDIOQUOTE)
const { Component: AudioQuote } = await audioquoteRenderer({}, '')
console.log(AudioQuote)

const target = document.querySelector('.root')
if (target !== null) render(<App/>, target)
