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
    }, props.delay || 100);
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
          class={`max-w-32 min-w-max opacity-90 text-center Tooltip-Tip tt-${
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
