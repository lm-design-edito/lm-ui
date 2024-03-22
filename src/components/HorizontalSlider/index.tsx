import { Component, VNode } from 'preact'
import clamp from '@design-edito/new-app/utils/clamp'
import styles from './styles.module.scss'

type Props = {
  slides: Array<{
    content: VNode,
    id: string
  }>
  activeSlide?: string
}

export default class HorizontalSlider extends Component<Props> {
  render () {
    const { props } = this
    const rawActiveSlidePos = props.slides.findIndex(({ id }) => id === props.activeSlide)
    const activeSlidePos = clamp(rawActiveSlidePos, 0, Infinity)
    const wrapperStyle = {
      ['--slides-width']: `${props.slides.length * 100}%`,
      ['--slide-width']: `calc(100% / ${props.slides.length})`,
      ['--slides-offset']: `${-100 * activeSlidePos}%`,
    }
    return <div
      className={styles['wrapper']}
      style={wrapperStyle}>
      <div className={styles['slides']}>
        {props.slides.map(({ content, id }) => {
          const slideClasses = [styles['slide']]
          if (id === props.activeSlide) slideClasses.push(styles['slide_active'])
          return <div className={slideClasses.join(' ')}>
            {content}
          </div>
        })}
      </div>
    </div>
  }
}
