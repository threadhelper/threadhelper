import { h, render } from 'preact';
import '@babel/polyfill'
import { useEffect, useCallback, useState } from 'preact/hooks';
import { FeedbackForm } from './Feedback.jsx'


const usePageN = (n0, nMax)=>{
  const[page, setPage] = useState(n0)
  const decPage = ()=>{page <= n0 ? null : setPage(page-1)}
  const incPage = ()=>{page >= nMax ? null : setPage(page+1)}
  return [page, incPage, decPage, setPage]
}

export function Tutorial(props){
  const tutorialPages = 
  [{text:<span>Welcome to Thread Helper! 🧵 Just open Twitter and you should see our sidebar. Have feedback? <a href="#" onClick={_=>setPage(pages.length)}>Click here and write it down.</a></span>, img:null,},
   {text:<span>{'[tutorial placeholder]'}</span>, img:null},
   {text:<span>Welcome to Thread Helper! 🧵 <a href="#" onClick={_=>setPage(1)}>Click here to follow the tutorial again.</a></span>, img:null}]
  const [pages, setPages] = useState(tutorialPages)
  const [page, incPage, decPage, setPage] = usePageN(1, pages.length)

  useEffect(()=>{console.log({page,pages})},[page, pages])

  return (
    <div id="tutorial-window">
      <div id='block1' style="width: 100%">
        <TutorialPage text={pages[page-1].text} img={pages[page-1].img}></TutorialPage>
        <br />
        <div id='tutorial-nav'>
          <div id='tutorial-prev' class='nav-arrow float-right'><a href="#" onClick={decPage}>{'< '}</a></div> 
          <div id='tutorial-nav-next' class='nav-arrow float-right'><a href="#" onClick={incPage}>{' >'}</a></div> 
          <div id='tutorial-nav-index' class='float-right'>{page}/{pages.length}</div>
        </div>
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
      {props.text}
      {props.img}
    </div>
  )
}