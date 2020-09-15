//project utilities
export const flattenModule = (window,R)=>Object.entries(R).forEach(([name, exported]) => window[name] = exported);
