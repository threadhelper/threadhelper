import { createContext, h } from 'preact';
import { useRef, useState } from 'preact/hooks';
import { Header } from './Header';
import { Display } from './Display';

const FeedDisplayMode = createContext('idle');

export default function ThreadHelper(props: any) {
  const [active, setActive] = useState(true);
  const myRef = useRef(null);

  return (
    <div class="ThreadHelper" ref={myRef}>
      <Sidebar active={active} />
    </div>
  );
}

function Sidebar(props: { active: any }) {
  return (
    // <FeedDisplayMode.Provider value={{ state, dispatch }}>
    <div class="sidebar">
      <Header />
      {/* {roboActive ? <Robo active={props.active} streams={props.streams}/> : null} */}
      <Display />
    </div>
    // </FeedDisplayMode.Provider>
  );
}
