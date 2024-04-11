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
        return <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {Object.entries(iconsRegistryData).map(([name, [description, category]]) => {
            const iconUrl = Icons.getUrlFromName(name)
            return <div style={{ padding: 32 }}>
              {category}
              <Icon
                url={iconUrl}
                description={description} />
            </div>
          })}
        </div>
      }}
    </AppContext.Consumer>
  }
}