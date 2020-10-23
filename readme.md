# Development Instructions
built extension is in ./dist, so load that into the browser

don't forget to `npm install`

`npm run watch`
- extension auto reloads every time you edit and save code.

`npm run build`
- just builds

# Rough description of how it works
- cs.jsx listens to twitter page events, renders and displays sidebars
- bg.jsx gets action requests from cs.jsx, interacts with chrome.storage and Twitter API. 
- worker/worker.jsx gets search and database requests from bg.jsx 

# Tech stack / Packages to know about
Front the back to the front

Project
- Node
- Chrome extension reloader
- Babel
- Webpack
General
- [kefir](https://kefirjs.github.io/kefir/) (streams like bacon.js but efficient, the backbone of the whole thing)
- [ramda](https://ramdajs.com/) (functional utilities, very important)
- [Folktale](https://folktale.origamitower.com/) (algebraic datatypes, not being used much yet)
Back-end
- [promise-worker](https://github.com/nolanlawson/promise-worker) (webworker whose requests return promises)
- [idb](https://github.com/jakearchibald/idb) (indexedDB with promises)
- [elasticlunr](http://elasticlunr.com/) (full-text search)
Front-end
- sass (better css, not being very well used)
- [preact](https://preactjs.com/) (lightweight React, for the front-end)
- [react-ga](https://github.com/react-ga/react-ga) (google analytics)
