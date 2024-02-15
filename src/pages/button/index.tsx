import Configurator from 'components/Configurator'
import { ValueEditor } from 'components/JsonEditor'
import { Component } from 'preact'

export const id = 'button'
export const name = 'Button'
export const thumb = <>I am thumb</>

type Props = {}
type State = any

export const content = class ButtonPage extends Component<Props, State> {
  state: State = { value: {} }
  render () {
    return <ValueEditor
      path={['ROOT']}
      value={this.state.value}
      onChange={val => {
        this.setState(curr => {
          console.log(JSON.stringify(val, null, 2))
          return {
            ...curr,
            value: val
          }
        })
      }} />
    // return <div>
    //   <Configurator
    //     valueListener={val => this.setState(() => val)}
    //     name='button-props'
    //     options={[{
    //       type: 'boolean',
    //       name: 'Jean-Mich'
    //     }, {
    //       type: 'select',
    //       name: 'Claude',
    //       options: [
    //         { label: 'L', value: 'large' },
    //         { label: 'M', value: 'medium' },
    //         { label: 'S', value: 'small' }
    //       ]
    //     }]} />
    // </div>
  }
}
