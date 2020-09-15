import { useEffect, useState } from 'react';

export const useStream = (stream, initialState) => {
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

// export default useStream;