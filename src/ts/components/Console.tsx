import { h } from 'preact';
import { useState } from 'preact/hooks';
import { curry, pipe, prop } from 'ramda'; // Function
import ReactTooltip from 'react-tooltip';
import BookmarkIcon from '../../images/bookmark.svg';
import LightningIcon from '../../images/lightning.svg';
import ReplyIcon from '../../images/reply.svg';
import RetweetIcon from '../../images/retweet.svg';
import ShuffleIcon from '../../images/shuffle.svg';
import { useOption } from '../hooks/useStorage';
import { csEvent } from '../utils/ga';

export function FilterButton(props: {
  Icon: any;
  name: string;
  useFilter: boolean;
  setFilter: any;
}) {
  const Icon = props.Icon;
  // console.log('FilterButton', {Icon})
  // useEffect(()=>console.log('FilterButton', {props, Icon}), []);
  return (
    <span class={props.name}>
      <input
        id={props.name}
        name={props.name}
        class="filter-checkbox"
        type="checkbox"
        checked={props.useFilter}
        onChange={(event) => handleInputChange(props.setFilter, event)}
      ></input>
      <label for={props.name}>
        <a data-tip="React-tooltip" data-for={props.name}>
          <Icon
            class="box-content filter-icon hoverHighlight"
            onClick={(_) => _}
          />{' '}
        </a>
      </label>
      <ReactTooltip
        id={props.name}
        delayShow={300}
        place="bottom"
        type="dark"
        effect="solid"
      >
        <span style="color: var(--main-txt-color);">{`Filter ${props.name}`}</span>
      </ReactTooltip>
    </span>
  );
}
//
export function Console() {
  // const [text, setText] = useState('[console text]');
  const [text, setText] = useState('[console text]');
  // TODO make these generate themselves
  const [getRTs, setGetRTs] = useOption('getRTs');
  const [useBookmarks, setUseBookmarks] = useOption('useBookmarks');
  const [useReplies, setUseReplies] = useOption('useReplies');
  const [idleMode, setIdleMode] = useOption('idleMode');
  const [searchMode, setSearchMode] = useOption('searchMode');

  const idle2Bool = (idleMode: string) =>
    idleMode === 'random' ? true : false; // String -> Bool
  const bool2Idle = (val) => (val ? 'random' : 'timeline'); // Bool -> String

  const searchMode2Bool = (idleMode: string) =>
    idleMode === 'semantic' ? true : false; // String -> Bool
  const bool2SearchMode = (val) => (val ? 'semantic' : 'fulltext'); // Bool -> String

  return (
    <div class="console">
      <div id="filters">
        <FilterButton
          name={'useShuffle'}
          useFilter={idle2Bool(idleMode)}
          setFilter={pipe(bool2Idle, setIdleMode)}
          Icon={ShuffleIcon}
        />
        {process.env.NODE_ENV == 'development' ? (
          <FilterButton
            name={'searchMode'}
            useFilter={searchMode2Bool(searchMode)}
            setFilter={pipe(bool2SearchMode, setSearchMode)}
            Icon={LightningIcon}
          />
        ) : null}
        <span></span>
        <FilterButton
          name={'getRTs'}
          useFilter={getRTs}
          setFilter={setGetRTs}
          Icon={RetweetIcon}
        />
        <FilterButton
          name={'useBookmarks'}
          useFilter={useBookmarks}
          setFilter={setUseBookmarks}
          Icon={BookmarkIcon}
        />
        <FilterButton
          name={'useReplies'}
          useFilter={useReplies}
          setFilter={setUseReplies}
          Icon={ReplyIcon}
        />
      </div>
    </div>
  );
}

const getTargetVal = (target: { type: string; checked: any; value: any }) =>
  target.type === 'checkbox' ? target.checked : target.value;
const handleInputChange = curry((_set: (x: any) => unknown, event) => {
  csEvent(
    'User',
    `Toggled filter ${event.target.id} to ${getTargetVal(event.target)}`,
    event.target.id,
    getTargetVal(event.target) ? 1 : 0
  );
  pipe(prop('target'), getTargetVal, _set)(event);
});
