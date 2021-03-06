# Building

- don't forget to `npm install`
- `npm run watch`: extension auto reloads every time you edit and save code.
- `npm run build-dev`: development build, `build` folder, auto reloads when you make changes to the code
- `npm run build-prod`: production build, `dist` folder, makes a `.zip` file too
- You need to install the extension manually the first time. In your browser: Extensions > Developer mode on > Load unpacked > build folder.

#Notes

- Typescript is used for type checking, but we're compiling with Babel, so no need to follow all the rules.
- ignore the `dev` folder

# Get Started

## TH architecture

- Browser extensions have background scripts (bg) and content scripts (cs).
- ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fxiqo%2FZXKdz1png0.png?alt=media&token=53740a6e-4477-4e6a-9c06-de5bd2c2d945)
- cs.jsx listens to twitter page events, renders and displays sidebars
- bg.jsx gets RPC action requests from cs.jsx, processes data in queues stored in chrome.storage
  - `scrapeWorker` interacts with Twitter API, mostly to get tweets and users.
  - `idbWorker` interacts with IndexedDB to save tweets, users, and update the search index.
  - `searchWorker` interacts with the elasticlunr search index.
- [Browser Extensions basics](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)

## Basic dataflows:

To give you an idea of the operations that happend and how data flows inside Threadhelper.

- Scraping
  - User logs into twitter
  - `background.tsx` gets auth tokens headers that are scraped from HTTP by functions in `auth.jsx`
  - `scrapeWorker` gets user info, bookmarks, and timeline tweets from twitter API with `auth`
  - converts tweets and users into `thTweet` format (less data)
  - `idbWorker` saves `thTweet`s and users to `IndexedDB`
  - On updating `IndexedDB`, update the `elasticlunr` Index (which we use to search)
- Searching
  - Compose observer observes writing on Twitter
  - `query` is set in `chrome.storage`
  - `background` observes `query` in `chrome.storage`, asks `searchWorker` to search
  - `searchWorker` searches the index, gets the results from `IndexedDB` and returns them
  - `background` saves to `search_results` in `chrome.storage`
  - `Display` observes `search_results` and displays them
- Archive Loading
  - Upload `tweet.js` file from settings menu
  - They are put into `queue_tempArchive`
  - `background` observes `queue_tempArchive` and asks `scrapeWorker` to `patchArchive` with the information that's missing (users, mostly)
  - converts them to `thTweet`s

# Relevant Tech

| Package                                                                              | Description                                                                                                |
| ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| [preact](https://preactjs.com/)                                                      | lightweight React                                                                                          |
| [Tailwind](https://tailwindcss.com/)                                                 | inline styles                                                                                              |
| [chrome-extension-async](https://github.com/KeithHenry/chromeExtensionAsync#readme)  | Promise wrapper for the Chrome extension API so that it can be used with async/await rather than callbacks |
| [idb](https://github.com/jakearchibald/idb)                                          | indexedDB with promises                                                                                    |
| [elasticlunr](http://elasticlunr.com/)                                               | full-text search                                                                                           |
| [kefir](https://kefirjs.github.io/kefir/)                                            | streams like bacon.js but efficient                                                                        |
| [ramda](https://ramdajs.com/)                                                        | functional utilities, very important                                                                       |
| Node                                                                                 | Package management                                                                                         |
| Babel                                                                                | Compiling TS to JS                                                                                         |
| Webpack                                                                              | Automating builds                                                                                          |
