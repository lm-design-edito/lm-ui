import { Component, ComponentType } from 'preact'
import { Scheme } from 'components/JsonEditor'
import CompPresentationText from 'components/CompPresentationText'
import CompEditor, { Props as CompEditorProps } from 'components/CompEditor'
import { PropsOf } from 'utils/typescript-utilities'
import styles from './styles.module.scss'

type Props<C extends ComponentType<any>> = {
  childComp: C
  scheme: Scheme.Scheme
  schemeTransform: CompEditorProps<C>['schemeTransform']
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
          schemeTransform={props.schemeTransform} />
      </div>
    </div>
  }
}
