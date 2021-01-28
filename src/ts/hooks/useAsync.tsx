import { Fragment, h } from 'preact';
import { useEffect } from 'preact/hooks';

export function useAsync(asyncFn, onSuccess) {
  useEffect(() => {
    let isMounted = true;
    asyncFn().then((data) => {
      if (isMounted) onSuccess(data);
    });
    return () => {
      isMounted = false;
    };
  }, [asyncFn, onSuccess]);
}
