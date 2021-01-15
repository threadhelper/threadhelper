# Threadhelper

## Development Instructions
built extension is in ./dist, so load that into the browser

don't forget to `npm install`

npm run commands:

`npm run serve`: 
    - web-dev-server for building front-end stuff with hot-module replacement
`npm run web-ext`: 
    - build for development in firefox with live reloading (tkaes long time to start)
`npm run build-dev`: 
    - builds dev version for testing and debugging, 
    - with webpack-extension-reloader, 
`npm run build-prod`: 
    - builds final version for deployment, 
    - with webpack-bundle-analyzer
    - cleans before


## Rough description of how it works

[Whimsical diagrams](https://whimsical.com/threadhelper-6LhnuFH8f4BBLq9bmKetRd)

- `content-script` listens to twitter page events, renders and displays sidebars
- `background` gets action requests from cs.jsx, interacts with chrome.storage and Twitter API. 
- `worker` gets search and database requests from bg.jsx 

## Tech stack / Packages to know about
Front the back to the front

Devops
- Typescript
- Node
- Webpack
- Babel
- web-ext / web-dev-server
- browser   

General
- [ramda](https://ramdajs.com/) (functional utilities, very important)
- [kefir](https://kefirjs.github.io/kefir/) (functional reactive programming with stream. Like bacon.js but efficient, the backbone of the whole thing)
- [Folktale](https://folktale.origamitower.com/) (algebraic datatypes, not being used much yet)

Back-end
- [promise-worker](https://github.com/nolanlawson/promise-worker) (webworker whose requests return promises)
- [idb](https://github.com/jakearchibald/idb) (indexedDB with promises)
- [elasticlunr](http://elasticlunr.com/) (full-text search)

Front-end
- [preact](https://preactjs.com/) (lightweight React, for the front-end)
- [react-ga](https://github.com/react-ga/react-ga) (google analytics)
