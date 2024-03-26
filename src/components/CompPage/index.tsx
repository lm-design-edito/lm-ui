import { Component, ComponentType } from 'preact'
import { Scheme, Value as JsonValue } from 'components/JsonEditor'
import CompPresentationText from 'components/CompPresentationText'
import CompEditor from 'components/CompEditor'
import { PropsOf } from 'utils/typescript-utilities'
import styles from './styles.module.scss'

type Props<C extends ComponentType<any>> = {
  childComp: C
  scheme: Scheme.Scheme
  schemeOutputToProps: (output: JsonValue) => PropsOf<C>
  propsToDkdll: (props: PropsOf<C>) => string
}

export default class CompPage<C extends ComponentType<any>> extends Component<Props<C>> {
  render () {
    const { props } = this
    return <div className={styles['wrapper']}>
      <div className={styles['presentation-slot']}>
        <CompPresentationText>
          I am a simple button.
        </CompPresentationText>
      </div>
      <div className={styles['edition-slot']}>
        <CompEditor
          component={props.childComp}
          initialProps={props.scheme.fallback as PropsOf<C>}
          scheme={props.scheme}
          schemeOutputToProps={props.schemeOutputToProps}
          propsToDkdll={props.propsToDkdll} />
      </div>
    </div>
  }
}
