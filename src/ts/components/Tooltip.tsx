import { h } from 'preact';
import { useState } from 'preact/hooks';
import '../../style/Tooltip.css';

const Tooltip = (props) => {
  let timeout;
  const [active, setActive] = useState(false);

  const showTip = () => {
    console.log('showing tooltip', props);
    timeout = setTimeout(() => {
      setActive(true);
    }, props.delay || 800);
  };

  const hideTip = () => {
    clearInterval(timeout);
    setActive(false);
  };

  return (
    <div
      class="Tooltip-Wrapper"
      // When to show the tooltip
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
    >
      {/* Wrapping */}
      {props.children}
      {active && (
        <div
          //   style={
          //     'background-color: var(--main-bg-color); color: var(--main-txt-color);;'
          //   }
          class={`Tooltip-Tip max-w-32 min-w-max p-1 bg-opacity-90 rounded-md text-xs text-center tt-${
            props.direction || 'top'
          }`}
        >
          {/* Content */}
          {props.content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
