import { useEffect, useMemo } from 'preact/hooks';
import { andThen, path, pipe } from 'ramda';
import { _useStream } from './useStream';
import { getOptions, makeStgPathObs, setOption } from '../utils/dutils';
import { inspect, nullFn } from '../utils/putils';

export function useOption(name) {
  const useStgObs = useMemo(() => makeStgPathObs(['options', name, 'value']), [
    name,
  ]);
  // const [option, setOption] = useState(true);
  const [option, setOption] = _useStream(useStgObs);

  const setOptionBG = pipe(
    setOption(name),
    andThen(pipe(path([name, 'value']), inspect(`set ${name}`), setOption))
  );

  useEffect(() => {
    useStgObs.onValue(nullFn);
    //init
    getOptions().then(pipe(path([name, 'value']), setOption));
    return () => {
      useStgObs.offValue(nullFn);
    };
  }, []);

  return [option, setOptionBG];
}
