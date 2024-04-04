import { Component, ComponentType, render } from 'preact'
import format from 'html-format'
import prism from 'prismjs'
import { JsonEditor, Scheme, Value as JsonValue } from 'components/JsonEditor'
import Drawer from 'components/Drawer'
import Separator from 'components/Separator'
import TabBar, { TabData } from 'components/TabBar'
import HorizontalSlider from 'components/HorizontalSlider'
import CodeHighlight from 'components/CodeHighlight'
import Copyable from 'components/Copyable'
import htmlFormat from 'utils/html-format'
import { PropsOf } from 'utils/typescript-utilities'
import settingsIconBase64Data from './settings.svg'
import closeIconBase64Data from './close.svg'
import styles from './styles.module.scss'

type SchemeTransformationsOutput<C extends ComponentType<any>> = {
  dkdll: string
  props: PropsOf<C>
}

export type Props<C extends ComponentType<any>> = {
  component: C
  initialProps: PropsOf<C>
  scheme: Scheme.Scheme
  schemeTransform: (schemeOutput: JsonValue) => SchemeTransformationsOutput<C>
}

type State<C extends ComponentType<any>> = {
  componentProps: PropsOf<C>
  drawerOpened: boolean
  activeTab: string | null
}

export default class CompEditor<C extends ComponentType<any>> extends Component<Props<C>, State<C>> {
  constructor (props: Props<C>) {
    super(props)
    this.state = {
      componentProps: props.initialProps,
      drawerOpened: false,
      activeTab: 'view'
    }
    this.handleCompPropsChange = this.handleCompPropsChange.bind(this)
    this.handleTabChange = this.handleTabChange.bind(this)
    this.toggleSettingsPanel = this.toggleSettingsPanel.bind(this)
    this.getComputedChildData = this.getComputedChildData.bind(this)
  }

  handleCompPropsChange (val: JsonValue) {
    this.setState(curr => ({
      ...curr,
      componentProps: val as PropsOf<C>
    }))
  }

  handleTabChange (val: string | undefined) {
    this.setState({ activeTab: val ?? null })
  }

  toggleSettingsPanel () {
    this.setState(curr => ({
      ...curr,
      drawerOpened: !curr.drawerOpened
    }))
  }

  getComputedChildData () {
    const { props: thisProps, state } = this
    const { dkdll, props } = thisProps.schemeTransform(state.componentProps)
    const fakeDiv = document.createElement('div')
    const child = <thisProps.component {...props} />
    render(child, fakeDiv)
    const html = format(fakeDiv.innerHTML)
    return { child, props, html, dkdll }
  }

  render () {
    const {
      props,
      state,
      handleCompPropsChange,
      toggleSettingsPanel,
      handleTabChange,
      getComputedChildData
    } = this

    const tabs: TabData[] = [
      { value: 'view', content: <>Aperçu</> },
      { value: 'html', content: <>HTML</> },
      { value: 'dkdll', content: <>Darkdouille</> }
    ]

    const compChildData = getComputedChildData()
    const {
      child,
      html: htmlTabContent,
      dkdll: dkdllTabContent
    } = compChildData

    const wrapperClasses = [styles['wrapper']]
    if (state.drawerOpened) wrapperClasses.push(styles['wrapper_opened'])

    const viewSlideClasses = [styles['display-slot__slide'], styles['display-slot__slide_view']]
    const htmlSlideClasses = [styles['display-slot__slide'], styles['display-slot__slide_html']]
    const dkdllSlideClasses = [styles['display-slot__slide'], styles['display-slot__slide_dkdll']]

    return <div className={wrapperClasses.join(' ')}>
      {/* Tabs */}
      <div className={styles['tabs-slot']}>
        <TabBar
          tabs={tabs}
          activeTab={state.activeTab ?? undefined}
          onTabClick={handleTabChange} />
      </div>
      
      {/* Display */}
      <div className={styles['display-slot']}>
        <HorizontalSlider
          activeSlide={state.activeTab ?? undefined}
          slides={[{
            id: 'view',
            content: <div className={viewSlideClasses.join(' ')}>{child}</div>
          }, {
            id: 'html',
            content: <div className={htmlSlideClasses.join(' ')}>
              <Copyable copy={htmlTabContent}>
                <div className={styles['rounded-wrapper']}>
                  <CodeHighlight
                    toHighlight={htmlFormat(htmlTabContent)}
                    grammar={prism.languages.html as Prism.Grammar}
                    language='html' />
                </div>
              </Copyable>
            </div>
          }, {
            id: 'dkdll',
            content: <div className={dkdllSlideClasses.join(' ')}>
              <Copyable copy={dkdllTabContent}>
                <div className={styles['rounded-wrapper']}>
                  <CodeHighlight
                    toHighlight={htmlFormat(dkdllTabContent)}
                    grammar={prism.languages.html as Prism.Grammar}
                    language='html' />
                </div>
              </Copyable>
            </div>
          }]} />
      </div>

      {/* Toggle settings */}
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

      {/* Settings */}
      <Drawer opened={state.drawerOpened}>
        <div className={styles['settings-slot']}>
          <JsonEditor
            initValue={props.initialProps}
            scheme={props.scheme}
            onChange={handleCompPropsChange} />
        </div>
      </Drawer>
    </div>
  }
}
