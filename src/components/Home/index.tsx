import { Component } from 'preact'
import PageThumb from 'components/PageThumb'
import Section from 'components/Section'
import SectionCards from 'components/SectionCards'
import styles from './styles.module.scss'
import pagesData from 'new-pages'
import IconsBoard from 'components/IconsBoard'

type Props = {}

export default class Home extends Component<Props> {
  render () {
    return <>
      <div className={styles['wrapper']}>
        <Section name='Components'>
          <SectionCards cardsPerLine={2}>
            {pagesData.audioquote.thumb}
            {pagesData.scrllgngn.thumb}
          </SectionCards>
        </Section>

        <Section name='UI'>
          <SectionCards cardsPerLine={3}>
            {pagesData.button.thumb}
            {pagesData.checkboxOrRadio.thumb}
            {pagesData.tabs.thumb}
            {pagesData.toggle.thumb}
          </SectionCards>
        </Section>

        <Section name='Icons'>
          <SectionCards cardsPerLine={2}>
            Edit me bitch
          </SectionCards>
          <IconsBoard category='Navigation' />
          <IconsBoard category='Fonctionnalités' />
          <IconsBoard category='Divers' />
          <IconsBoard category='Social' />
          <IconsBoard category='Médias' />
        </Section>

        <Section name='Fonts'>
          Fonts...
        </Section>

        <Section name='Colors'>
          Colors...
        </Section>

        <div style={{ height: '800px' }} />
      </div>
    </>
  }
}

// <AppContext.Consumer>
//         {context => <div className={styles['wrapper']}>
//           {pageGroups
//             .map(pageGroup => {
//               return <div className={styles['section']}>
//                 <h3 className={styles['section__title']}>{pageGroup.name}</h3>
//                 
//                 {/* Cards display */}
//                 {pageGroup.type === 'cards' && <div
//                   className={styles['section__cards']}
//                   style={{ '--per-line': pageGroup.cardsPerLine }}>
//                   {pageGroup.pages.map(page => <div
//                     className={styles['section__card']}>
//                     <a onClick={() => context.togglePage(page)}>
//                       <PageThumb id={page.id} cover={page.thumb} label={page.name} />
//                     </a>
//                   </div>)}
//                 </div>}
// 
//                 {/* Contents display */}
//                 {pageGroup.type === 'content' && <div className={styles['section__contents']}>
//                   {pageGroup.pages.map(page => <>
//                     <div className={styles['section__content-name']}>{page.name}</div>
//                     <div className={styles['section__content']}>{page.content}</div>
//                   </>)}
//                 </div>}
//               </div>
//             })
//           }
//           <div style={{ height: '4000px' }}></div>
//         </div>}
//       </AppContext.Consumer>