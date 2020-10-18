import { h, render } from 'preact';
import '@babel/polyfill'
import { useEffect, useCallback, useState } from 'preact/hooks';
import { FeedbackForm } from './Feedback.jsx'
import tutorialImgLoader from './TutorialImgs.jsx'
import img1 from '../../images/tutorial/1.jpg'
import img2 from '../../images/tutorial/2.jpg'
import img3 from '../../images/tutorial/3.jpg'
import img4 from '../../images/tutorial/4.jpg'
import img5 from '../../images/tutorial/5.jpg'
import img6 from '../../images/tutorial/6.jpg'
import img7 from '../../images/tutorial/7.jpg'

const getImage = src=><img class="tutorial-image"src={src} />

const usePageN = (n0, nMax)=>{
  const[page, setPage] = useState(n0)
  const decPage = ()=>{page <= n0 ? null : setPage(page-1)}
  const incPage = ()=>{page >= nMax ? null : setPage(page+1)}
  return [page, incPage, decPage, setPage]
}

const VideoTutorial = ()=>{
  // return (<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/voCpNvldCjk" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>)
  return (<iframe width="100%" src="https://www.youtube-nocookie.com/embed/voCpNvldCjk" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>)

}

export function Tutorial(props){
  const [imgs, setImgs] = useState(tutorialImgLoader())
  const tutorialPages = 
  // [{text:<span>Welcome to Thread Helper! 🧵 Just open Twitter and you should see our sidebar. Have feedback? <a href="#" onClick={_=>setPage(pages.length)}>Click here and write it down.</a></span>, 
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
   {text:<span>Thread Helper! <a href="#" onClick={_=>setPage(1)}>Click here to follow the tutorial again.</a></span>, 
   img:null},
  ]
  const [pages, setPages] = useState(tutorialPages)
  const [page, incPage, decPage, setPage] = usePageN(1, pages.length)

  useEffect(()=>{console.log({page,pages})},[page, pages])

  return (
    <div id="tutorial-window">
        <div id='tutorial-nav'>
          <div id='tutorial-prev' class='nav-arrow float-right'><a href="#" onClick={decPage}>{'< '}</a></div> 
          <div id='tutorial-nav-next' class='nav-arrow float-right'><a href="#" onClick={incPage}>{' >'}</a></div> 
          <div id='tutorial-nav-index' class='float-right'>{page}/{pages.length}</div>
        </div>
      <div id='block1' style="width: 100%">
        <br />
        <TutorialPage text={pages[page-1].text} img={pages[page-1].img}></TutorialPage>
      </div>
      <div id="block2">
        {page >= pages.length ? <FeedbackForm/> : null}
      </div>
    </div>
  )
}

export function TutorialPage(props){
  return (
    <div id='tutorial' style="width: 280px">
      {props.img}
      {props.text}
    </div>
  )
}