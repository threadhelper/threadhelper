import { h, render } from 'preact'; //let _h = h;
import '@babel/polyfill'
import { useEffect, useCallback, useState } from 'preact/hooks';
// @ts-expect-error ts-migrate(2691) FIXME: An import path cannot end with a '.tsx' extension.... Remove this comment to see the full error message
import FeedbackForm from './Feedback.tsx'
// @ts-expect-error ts-migrate(2691) FIXME: An import path cannot end with a '.tsx' extension.... Remove this comment to see the full error message
import tutorialImgLoader from './TutorialImgs.tsx'
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../images/tutorial/1.jpg' o... Remove this comment to see the full error message
import img1 from '../../images/tutorial/1.jpg'
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../images/tutorial/2.jpg' o... Remove this comment to see the full error message
import img2 from '../../images/tutorial/2.jpg'
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../images/tutorial/3.jpg' o... Remove this comment to see the full error message
import img3 from '../../images/tutorial/3.jpg'
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../images/tutorial/4.jpg' o... Remove this comment to see the full error message
import img4 from '../../images/tutorial/4.jpg'
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../images/tutorial/5.jpg' o... Remove this comment to see the full error message
import img5 from '../../images/tutorial/5.jpg'
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../images/tutorial/6.jpg' o... Remove this comment to see the full error message
import img6 from '../../images/tutorial/6.jpg'
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../images/tutorial/7.jpg' o... Remove this comment to see the full error message
import img7 from '../../images/tutorial/7.jpg'

const getImage = (src: string)=><img className="tutorial-image"src={src} />

const usePageN = (n0: number, nMax: number)=>{
  const[page, setPage] = useState(n0)
  const decPage = ()=>{page <= n0 ? null : setPage(page-1)}
  const incPage = ()=>{page >= nMax ? null : setPage(page+1)}
  return [page, incPage, decPage, setPage]
}

const VideoTutorial = ()=>{
  // return (<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/voCpNvldCjk" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>)
  // @ts-expect-error ts-migrate(2322) FIXME: Type '{ width: string; src: string; frameBorder: s... Remove this comment to see the full error message
  return (<iframe width="100%" src="https://www.youtube-nocookie.com/embed/voCpNvldCjk" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>)

}

// console.log('hi', {h, render})

const Tutorial = (props) => {
  const [imgs, setImgs] = useState(tutorialImgLoader())
  const tutorialPages = 
  // [{text:<span>Welcome to Thread Helper! 🧵 Just open Twitter and you should see our sidebar. Have feedback? <a href="#" onClick={_=>setPage(pages.length)}>Click here and write it down.</a></span>, 
  // @ts-expect-error ts-migrate(2349) FIXME: This expression is not callable.
  [{text:<span>Welcome to Thread Helper! Just open Twitter and you should see our sidebar. Have feedback? <a href="#" onClick={_=>setPage(pages.length)}>Click here and write it down.</a></span>, 
    img:VideoTutorial(),},
   {text:<span>{'ThreadHelper is a new app that finds you the tweets you need as you type.'}</span>, 
   img:getImage(img1)},
   {text:<span>{'As you type, the results on the sidebar change. You can click them to copy their link and easily paste them into the tweet you\'re writing to generate a quote tweet.'}</span>, 
   img:getImage(img2)},
   {text:<span>{'ThreadHelper has 3 filters: Retweets, Bookmarks, and Replies.'}</span>, 
    img:getImage(img3)},
  //  {text:<span>{'Retweets'}</span>, 
  //  img:getImage(img4)},
  //  {text:<span>{'Bookmarks'}</span>, 
  //  img:getImage(img5)},
  //  {text:<span>{'Replies'}</span>, 
  //  img:getImage(img6)},
   {text:<span>{'You can upload your archive by clicking "(load archive)". It\'s stored on your machine, so we never see it ourselves.'}</span>, 
   img:getImage(img7)},
  //  {text:<span>Thread Helper! 🧵 <a href="#" onClick={_=>setPage(1)}>Click here to follow the tutorial again.</a></span>, 
   // @ts-expect-error ts-migrate(2349) FIXME: This expression is not callable.
   {text:<span>Thread Helper! <a href="#" onClick={_=>setPage(1)}>Click here to follow the tutorial again.</a></span>, 
   img:null},
  ]
  const [pages, setPages] = useState(tutorialPages)
  const [page, incPage, decPage, setPage] = usePageN(1, pages.length)

  useEffect(()=>{console.log({page,pages})},[page, pages])

  return (
    <div id="tutorial-window">
        <div id='tutorial-nav'>
          {/* @ts-expect-error ts-migrate(2322) FIXME: Type 'number | StateUpdater<number>' is not assign... Remove this comment to see the full error message */}
          <div id='tutorial-prev' className='nav-arrow float-right'><a href="#" onClick={decPage}>{'< '}</a></div> 
          {/* @ts-expect-error ts-migrate(2322) FIXME: Type 'number | StateUpdater<number>' is not assign... Remove this comment to see the full error message */}
          <div id='tutorial-nav-next' className='nav-arrow float-right'><a href="#" onClick={incPage}>{' >'}</a></div> 
          <div id='tutorial-nav-index' className='float-right'>{page}/{pages.length}</div>
        </div>
      <div id='block1'>
        <br />
        {/* @ts-expect-error ts-migrate(2362) FIXME: The left-hand side of an arithmetic operation must... Remove this comment to see the full error message */}
        <TutorialPage text={pages[page-1].text} img={pages[page-1].img}></TutorialPage>
      </div>
      <div id="block2">
        {page >= pages.length ? <FeedbackForm/> : null}
      </div>
    </div>
  )
}

function TutorialPage(props){
  return (
    <div id='tutorial'>
      {props.img}
      {props.text}
    </div>
  )
}

export default Tutorial;
