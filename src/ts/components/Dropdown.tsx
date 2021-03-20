import { h } from 'preact';
import { useRef } from 'preact/hooks';
import { defaultTo } from 'ramda'; // Logic, Type, Relation, String, Math
import { useStgPath } from '../hooks/useStorage';
import { msgBG } from '../utils/dutils';
import { csEvent } from '../utils/ga';
import { FilterButton } from './Console';

const debug = false;

export function DropdownMenu({
  name,
  itemClickClose,
  closeMenu,
  componentItems,
  filterItems,
  items,
  debugItems,
}) {
  const dropdownRef = useRef(null);

  function DropdownItem(props) {
    const onClickItem = (e) => {
      csEvent('User', `${name} th-dropdown click`, props.id);
      props.effect();
      defaultTo(true, itemClickClose) ? closeMenu() : null;
    };
    return (
      <a href="#" className="menu-item hover:bg-hoverBg" onClick={onClickItem}>
        <span className="icon-button fill-current">{props.leftIcon}</span>
        {props.id}
        <span className="icon-right fill-current">{props.rightIcon}</span>
      </a>
    );
  }

  function DebugItem(props) {
    return process.env.NODE_ENV == 'development' ? DropdownItem(props) : null;
  }

  function FilterItem(props) {
    const [filterItem, setFilterItem] = useStgPath(props.path, true);
    const onClickItem = (e) => {
      csEvent('User', `${name} th-dropdown click`, props.screen_name);
      props.effect();
      defaultTo(true, itemClickClose) ? closeMenu() : null;
    };

    return (
      <a href="#" className="box-content menu-item" onClick={onClickItem}>
        {/* <span className="icon-button">{props.leftIcon}</span> */}
        <FilterButton
          name={props.screen_name}
          useFilter={filterItem}
          setFilter={setFilterItem}
          Icon={props.leftIcon}
        />
        {props.screen_name}
        <span
          className="x-icon"
          onClick={(_) => msgBG({ type: 'remove-account', id: props.id })}
        >
          {'X'}
        </span>
      </a>
    );
  }
  return (
    <div className="th-dropdown z-30" ref={dropdownRef}>
      {defaultTo([], componentItems).map((Item) => (
        <Item />
      ))}
      {defaultTo([], filterItems).map(
        (item: { id: any; screen_name: any; leftIcon: any; effect: any }) => (
          <FilterItem
            path={['activeAccounts', item.id, 'showTweets']}
            id={item.id}
            screen_name={item.screen_name}
            leftIcon={item.leftIcon}
            effect={item.effect}
          />
        )
      )}
      {defaultTo([], items).map(
        (item: { id: any; leftIcon: any; effect: any }) => (
          <DropdownItem
            id={item.id}
            leftIcon={item.leftIcon}
            effect={item.effect}
          />
        )
      )}
      {defaultTo([], debugItems).map(
        (item: { id: any; leftIcon: any; effect: any }) => (
          <DebugItem
            id={item.id}
            leftIcon={item.leftIcon}
            effect={item.effect}
          />
        )
      )}
    </div>
  );
}
