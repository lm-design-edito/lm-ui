import { Component } from 'preact'
import AppContext from 'providers/context'
import { Icons } from 'utils/icons'
import Icon from '@design-edito/new-app/components/UI/components/Icon'

export default class IconsBoard extends Component {
  render () {
    return <AppContext.Consumer>
      {context => {
        const { iconsRegistryData } = context
        if (iconsRegistryData === null) return <>No icons !</>
        return <>
          {Object.entries(iconsRegistryData).map(([name, description]) => {
            const iconUrl = Icons.getUrlFromName(name)
            return <Icon
              url={iconUrl}
              description={description} />
          })}
          —————
          {Object.entries(iconsRegistryData).map(([name, description]) => {
            const iconUrl = Icons.getUrlFromName(name)
            return <Icon
              url={iconUrl}
              description={description}
              asImg={true}
              maskColor='red' />
          })}
        </>
      }}
    </AppContext.Consumer>
  }
}
