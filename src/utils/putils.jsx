import {curry} from 'ramda';

//project utilities
export const flattenModule = (window,R)=>Object.entries(R).forEach(([name, exported]) => window[name] = exported);
export const inspect = curry ((prepend, x)=>{console.log(prepend, x); return x;})
