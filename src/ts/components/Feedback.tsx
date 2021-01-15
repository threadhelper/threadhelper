//@ts-check
import { h, render } from 'preact';
let _h = h;
import '@babel/polyfill';
import { useState, useEffect, useCallback } from 'preact/hooks';
// @ts-expect-error ts-migrate(2691) FIXME: An import path cannot end with a '.tsx' extension.... Remove this comment to see the full error message
import { initGA, Event, PageView, UA_CODE } from '../utils/ga.tsx';
const FeedbackForm = (props) => {
    const [text, setText] = useState('');
    const [kind, setKind] = useState('Feedback');
    const [submitted, setSubmitted] = useState(false);
    useEffect(() => { console.log(`Feedback change`, [text, kind]); }, [text, kind]);
    const onSubmit = () => { setSubmitted(true); Event('Feedback', kind, text); };
    return (<div id="feedback-form">
      
      <textarea id="feedback-text" rows={4} name="feedback-text" onChange={e => setText((e.target as any).value)} autoFocus placeholder="Give us some feedback!"></textarea>

      <div id={"feedback-type"} onChange={e => setKind((e.target as any).value)}>
          <span> <input type="radio" value="feedback" name="feedback-type" checked={true}/> Feedback </span>
          <span> <input type="radio" value="bug" name="feedback-type" onChange={e => { e.preventDefault(); }}/> Bug Report </span>
          <button id="feedback-button" onClick={onSubmit} name={'Submit'} onChange={e => { e.preventDefault(); }}>{'Submit'}</button>
      </div>
      <br />
      {submitted ? 'Thank you!' : null}
    </div>);
};
export default FeedbackForm;
