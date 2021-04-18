import { useEffect, useState } from 'preact/hooks';
import { msgBG } from '../stg/dutils';

export const useStream = (stream, initialState) => {
  // const init = stream.currentValue != null ? stream.currentValue() : initialState
  // const init2 = init != null ? init : initialState
  // console.log(`init stream`, init)
  // const [current, setCurrent] = useState(init);
  const [current, setCurrent] = useState(initialState);

  useEffect(() => {
    const sub = stream.observe({
      value: setCurrent,
      error(error) {
        //   console.log('error:', error);
      },
      end() {
        //   console.log('end');
      },
    });

    return () => sub.unsubscribe();
  });

  // Just return our current value, since that's the thing we're interested in
  // (to render) when using this hook:
  return current;
};

export const _useStream = (stream, initialState = null) => {
  const [current, setCurrent] = useState(initialState);
  useEffect(() => {
    const sub = stream.observe({
      value: (x) => {
        setCurrent(x);
      },
      error(error) {},
      end() {},
    });

    return () => {
      // msgBG({ type: '_useStream unsubscribe' });
      sub.unsubscribe();
    };
  }, []);

  // Just return our current value, since that's the thing we're interested in
  // (to render) when using this hook:
  return [current, setCurrent];
};
