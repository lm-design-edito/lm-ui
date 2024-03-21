import { Component } from 'preact'
import thumbBase64Data from './thumb.svg'
import CompPresentationText from 'components/CompPresentationText'

export const id = 'audioquote'
export const name = 'AudioQuote'
export const thumb = <img src={thumbBase64Data} />
export class Content extends Component<{}> {
  render () {
    return <>
      <CompPresentationText>
        I am AudioQuote.
      </CompPresentationText>
    </>
  }
}
