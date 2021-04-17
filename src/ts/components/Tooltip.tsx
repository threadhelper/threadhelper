import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import '../../style/Tooltip.css';
import { useStorage } from '../hooks/useStorage';
import { getStg, setStg } from '../utils/dutils';

const GenericTooltip = ({
  children,
  direction,
  content,
  delay,
  className,
  active,
  showTip,
  hideTip,
}) => {
  let timeout;

  return (
    <div
      class={'Tooltip-Wrapper ' + (className ?? '')}
      // When to show the tooltip
      onMouseOver={showTip}
      onMouseOut={hideTip}
    >
      {/* Wrapping */}
      {children}
      {active && (
        <div
          style="font-size: 10px"
          class={`Tooltip-Tip max-w-32 min-w-max p-1 bg-opacity-90 rounded-md text-center tt-${
            direction || 'top'
          }`}
        >
          {/* Content */}
          {content}
        </div>
      )}
    </div>
  );
};

const Tooltip = (props) => {
  let timeout;
  const [active, setActive] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (hovering) {
      timeout = setTimeout(() => {
        setActive(true);
      }, props.delay || 800);
      return () => {
        clearTimeout(timeout);
      };
    } else {
      clearTimeout(timeout);
      setActive(false);
    }
  }, [hovering]);

  const showTip = () => {
    // console.log('showing tooltip', props);
    // timeout = setTimeout(() => {
    //   setActive(true);
    // }, props.delay || 800);
    setHovering(true);
  };

  const hideTip = () => {
    // clearInterval(timeout);
    // setActive(false);
    setHovering(false);
  };

  return <GenericTooltip {...{ ...props, active, showTip, hideTip }} />;
};

export const StgFlagTooltip = ({
  children,
  direction,
  content,
  delay,
  flagName,
  className,
}) => {
  let timeout;
  const [active, setActive] = useState(false);

  useEffect(() => {
    getStg(flagName).then((x) => setActive(x ?? false));
  }, []);

  const showTip = () => {
    timeout = setTimeout(() => {
      setActive(true);
    }, delay || 800);
  };

  const hideTip = () => {
    clearInterval(timeout);
    setActive(false);
    setStg(flagName, false);
    setStg();
  };

  return (
    <GenericTooltip
      {...{
        children,
        direction,
        content,
        delay,
        flagName,
        className,
        active,
        showTip,
        hideTip,
      }}
    />
  );
};

export default Tooltip;
