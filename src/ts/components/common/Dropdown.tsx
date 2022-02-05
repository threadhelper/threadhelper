import { h } from 'preact';
import { useRef } from 'preact/hooks';
import { defaultTo } from 'ramda'; // Logic, Type, Relation, String, Math

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
      props.effect();
      defaultTo(true, itemClickClose) ? closeMenu() : null;
    };
    return (
      <a
        href="#"
        className="p-3 hover:bg-hoverBg flex items-center text-mainTxt"
        onClick={onClickItem}
      >
        <span className="icon-button">{props.leftIcon}</span>
        {props.id}
        <span className="icon-right fill-current">{props.rightIcon}</span>
      </a>
    );
  }

  function DebugItem(props) {
    return process.env.NODE_ENV == 'development' ? DropdownItem(props) : null;
  }

  return (
    <div>
      <div
        className="bg-mainBg z-30 rounded-md shadow-highlighted absolute top-full left-0"
        style={{ width: '150px' }}
        ref={dropdownRef}
      >
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
      <div
        class="fixed inset-0 z-10 cursor-default"
        onClick={() => closeMenu()}
      />
    </div>
  );
}
