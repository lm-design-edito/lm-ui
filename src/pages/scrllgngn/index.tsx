import { Component } from 'preact'
import thumbBase64Data from './thumb.svg'
import CompPresentationText from 'components/CompPresentationText'

export const id = 'scrllgngn'
export const name = 'Scrllgngn'
export const thumb = <img src={thumbBase64Data} />
export class Content extends Component<{}> {
  render () {
    return <>
      <CompPresentationText>
        I am scrllgngn
      </CompPresentationText>
    </>
  }
}
