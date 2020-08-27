// utils for functional programing (install a module like Ramda later)

// compose :: ((a -> b), (b -> c),  ..., (y -> z)) -> a -> z
export const compose = (...fns) => (...args) => fns.reduceRight((res, fn) => [fn.call(null, ...res)], args)[0];

// curry :: ((a, b, ...) -> c) -> a -> b -> ... -> c
export function curry(fn) {
  const arity = fn.length;

  return function $curry(...args) {
    if (args.length < arity) {
      return $curry.bind(null, ...args);
    }

    return fn.call(null, ...args);
  };
}

//property getter
export const prop = curry((property, object) => object[property]);
