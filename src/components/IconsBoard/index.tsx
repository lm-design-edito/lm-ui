import { Component } from 'preact'
import { IconJsonData, AppContext } from 'app'
import { Icons } from 'utils/icons'
import Icon from '@design-edito/new-app/components/UI/components/Icon'
import styles from './styles.module.scss'

type Props = {
  category: string
}

export default class IconsBoard extends Component<Props> {
  render () {
    const { props } = this
    return <AppContext.Consumer>
      {context => {
        const { iconsRegistryData } = context
        if (iconsRegistryData === null) return <>No icons !</>
        const iconsCategoriesData = Object
          .entries(iconsRegistryData)
          .reduce<Record<string, Record<string, IconJsonData>>>((reduced, [iconName, iconData]) => {
            const { category } = iconData
            const returned = { ...reduced }
            if (reduced[category] === undefined) { returned[category] = {} }
            const categoryData = returned[category] as Record<string, IconJsonData>
            categoryData[iconName] = iconData
            return returned
          }, {})
        const foundCategory = iconsCategoriesData[props.category]
        if (foundCategory === undefined) return <></>
        return <div className={styles['wrapper']}>
          <h5 className={styles['category']}>{props.category}</h5>
          <div className={styles['board']}>
          {Object.entries(foundCategory).map(([name, { description }]) => {
            const iconUrl = Icons.getUrlFromName(name)
            return <span className={styles['icon']}>
              <Icon url={iconUrl} description={description} />
            </span>
          })}
          </div>
        </div>
      }}
    </AppContext.Consumer>
  }
}
