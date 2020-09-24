import { h, render } from 'preact';

export function Welcome2TH(props){
  return (
    <div style="width=200px">
      <spam>Welcome to Thread Helper! 🧵 Just open Twitter and you should see our sidebar :).</spam>
    </div>
  )
}

render(<Welcome2TH />, document.body);

