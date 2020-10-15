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
    <div id="feedback-form" style="background-color: #E0E8F0; width:100%;">
      {/* <label for="feedback-text">Give us some feedback!</label> */}
      <textarea id="feedback-text" rows="4"
        name="feedback-text"
        onChange={e=>setText(e.target.value)}
        autofocus
        placeholder="Give us some feedback!"
        style="width:97%;"
      ></textarea>

      <div id={"feedback-type"} onChange={e=>setKind(e.target.value)} style="display:flex; justify-content: space-between; font-size:10px;">
          <input type="radio" value="feedback" name="feedback-type" checked="true" /> Feedback
          <input type="radio" value="bug" name="feedback-type" /> Bug Report
          <button id="feedback-button" onClick={onSubmit} style="font-size:10px;" name={'Submit'}>{'Submit'}</button> 
      </div>
      <br />
      {submitted ? 'Thank you!' : null}
    </div>
  )
}