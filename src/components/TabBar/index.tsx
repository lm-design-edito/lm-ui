import { Component, VNode } from 'preact'
import styles from './styles.module.scss'

export type TabData = {
  content: VNode | string
  value: string
}

export type Props = {
  activeTab?: string
  tabs?: Array<TabData>
  onTabClick?: (clickedTab?: string) => void
}

export default class TabBar extends Component<Props> {
  constructor (props: Props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick (clickedTab: string) {
    const { props } = this
    if (props.onTabClick === undefined) return;
    props.onTabClick(clickedTab)
  }

  render () {
    const { props } = this
    return <div className={styles['wrapper']}>
      {props.tabs?.map(tabData => {
        const isActive = props.activeTab === tabData.value
        const tabClasses = [styles['tab']]
        if (isActive) tabClasses.push(styles['tab_active'])
        return <div
          className={tabClasses.join(' ')}
          onClick={() => this.handleClick(tabData.value)}>
          {tabData.content}
        </div>
      })}
    </div>
  }
}
