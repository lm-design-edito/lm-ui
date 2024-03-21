import { Component, ComponentProps, ComponentType, JSX } from 'preact'
import { JsonEditor, Scheme, Value as JsonValue } from 'components/JsonEditor'
import Drawer from 'components/Drawer'
import Separator from 'components/Separator'
import TabBar, { Props as TabBarProps, TabData } from 'components/TabBar'
import styles from './styles.module.scss'
import settingsIconBase64Data from './settings.svg'
import closeIconBase64Data from './close.svg'


type PropsOf<C extends ComponentType<any>> = JSX.LibraryManagedAttributes<C, ComponentProps<C>>

type Props<C extends ComponentType<any>> = {
  component: C
  initialProps: PropsOf<C>
  scheme: Scheme.Scheme
  onChange?: (newVal: PropsOf<C>) => void
}

type State<C extends ComponentType<any>> = {
  componentProps: PropsOf<C>
  drawerOpened: boolean
}

export default class CompEditor<C extends ComponentType<any>> extends Component<Props<C>, State<C>> {
  constructor (props: Props<C>) {
    super(props)
    this.state = {
      componentProps: props.initialProps,
      drawerOpened: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.toggleSettingsPanel = this.toggleSettingsPanel.bind(this)
  }

  handleChange (val: JsonValue) {
    const { onChange } = this.props
    if (onChange !== undefined) onChange(val as PropsOf<C>)
    this.setState(curr => ({
      ...curr,
      componentProps: val as PropsOf<C>
    }))
  }

  toggleSettingsPanel () {
    this.setState(curr => ({
      ...curr,
      drawerOpened: !curr.drawerOpened
    }))
  }

  render () {
    const { props, state, handleChange, toggleSettingsPanel } = this

    const tabs: TabData[] = [
      { value: 'view', content: <>Aperçu</> },
      { value: 'html', content: <>HTML</> },
      { value: 'dkdll', content: <>Darkdouille</> }
    ]

    const wrapperClasses = [styles['wrapper']]
    if (state.drawerOpened) wrapperClasses.push(styles['wrapper_opened'])
    return <div className={wrapperClasses.join(' ')}>
      <div className={styles['tabs-slot']}>
        <TabBar
          tabs={tabs}
          activeTab='view' />
      </div>
      <div className={styles['component-slot']}>
        <props.component {...state.componentProps} />
      </div>
      <div className={styles['toggle-settings-slot']}>
        <button
          className={styles['toggle-settings']}
          onClick={toggleSettingsPanel}>
          <img
            className={styles['toggle-settings__icon']}
            src={state.drawerOpened ? closeIconBase64Data : settingsIconBase64Data} />
          <span className={styles['toggle-settings__label']}>
            {state.drawerOpened ? 'Fermer' : 'Modifier les paramètres'}
          </span>
        </button>
      </div>
      <div className={styles['separator-slot']}>
        {state.drawerOpened && <Separator />}
      </div>
      <Drawer opened={state.drawerOpened}>
        <div className={styles['settings-slot']}>
          <JsonEditor
            initValue={props.initialProps}
            scheme={props.scheme}
            onChange={handleChange} />
        </div>
      </Drawer>
    </div>
  }
}
