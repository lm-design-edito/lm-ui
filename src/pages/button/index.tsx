import Configurator from 'components/Configurator'
import { Component } from 'preact'

export const id = 'button'
export const name = 'Button'
export const thumb = <>I am thumb</>

export const content = class ButtonPage extends Component {
  render () {
    return <div>
      <Configurator
        valueListener={val => console.log(JSON.stringify(val, null, 2))}
        name='button-props'
        options={[{
          type: 'boolean',
          name: 'Jean-Mich'
        }, {
          type: 'select',
          name: 'Claude',
          options: [
            { label: 'L', value: 'large' },
            { label: 'M', value: 'medium' },
            { label: 'S', value: 'small' }
          ]
        }]} />
    </div>
  }
}
