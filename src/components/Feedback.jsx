import { h, render } from 'preact';
import '@babel/polyfill'
import { useState, useEffect, useCallback } from 'preact/hooks';
import { initGA, Event, PageView, UA_CODE } from '../utils/ga.jsx'


export const FeedbackForm = (props) => {
  const [text, setText] = useState('')
  const [kind, setKind] = useState('Feedback')
  const [submitted, setSubmitted] = useState(false)

  useEffect(()=>{console.log(`Feedback change`, [text,kind])},[text,kind])
  const onSubmit = () => {setSubmitted(true); Event('Feedback', kind, text)}
  return(
    <div id="feedback-form">
      {/* <label for="feedback-text">Give us some feedback!</label> */}
      <textarea id="feedback-text" rows="4"
        name="feedback-text"
        onChange={e=>setText(e.target.value)}
        autofocus
        placeholder="Give us some feedback!"
      ></textarea>

      <div id={"feedback-type"} onChange={e=>setKind(e.target.value)}>
          <input type="radio" value="feedback" name="feedback-type" checked="true"> Feedback </input>
          <input type="radio" value="bug" name="feedback-type" onChange={e=>{e.preventDefault()}}> Bug Report </input>
          <button id="feedback-button" onClick={onSubmit} name={'Submit'} onChange={e=>{e.preventDefault()}}>{'Submit'}</button> 
      </div>
      <br />
      {submitted ? 'Thank you!' : null}
    </div>
  )
}