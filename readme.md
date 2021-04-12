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

# Tech stack / Packages to know about

Front the back to the front

Project

- Node
- Chrome extension reloader
- Babel
- Webpack

Functional Utilities

- [kefir](https://kefirjs.github.io/kefir/) (streams like bacon.js but efficient, the backbone of the whole thing)
- [ramda](https://ramdajs.com/) (functional utilities, very important)
- chrome

Back-end

- [chrome-extension-async](https://github.com/KeithHenry/chromeExtensionAsync#readme) (Promise wrapper for the Chrome extension API so that it can be used with async/await rather than callbacks)
- [idb](https://github.com/jakearchibald/idb) (indexedDB with promises)
- [elasticlunr](http://elasticlunr.com/) (full-text search)

Front-end

- [Tailwind](https://tailwindcss.com/) (inline styles)
- [preact](https://preactjs.com/) (lightweight React, for the front-end)
