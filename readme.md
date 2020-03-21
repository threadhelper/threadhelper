# Related Tweets

A Chrome browser extension that shows you related tweets on your own account.

## Description of files

- `manifest.json`: settings for chrome extension
- `contentScript.js`: manages html and interface
- `nlp.js`: provides NLP stuff
- `readme.md`: this file
- `stemmer.js`: one function for word stemming, from node package `stemmer`
- `stopwords.js`: just a list of stopwords, taken from python's nltk
- `style.css`: styling for extension components
- `trump.js`: trump tweets

## Todo items

- [ ] Use actual user's tweets
  - [ ] Steal key from client fetch
  - [ ] Make my own simple fetch
  - [ ] Fetch all of a user's tweets
  - [ ] Store them in the chrome storage api
- [ ] Reverse the tweet-word datastructure?
  - [ ] Better data structure in general maybe a db (note there's max a few thousand tweets)
  - [ ] Think about better search algorithms in general
- [ ] Have bar on side when there's room
- [ ] Make sidebar look nice
- [ ] Learn about chrome extension store
- [ ] Only search on word boundary?
- [x] Try it with Trump's tweets
- [x] Add a paste button to insert the ID into your tweet in place
- [x] Scroll on the preview
- [x] Use CSS files
- [x] Encapsulate nlp.js into a public function thing
- [x] Box should go away when compose box goes away
- [x] Box should always appear when compose box appears
- [ ] ~~Maybe the suggestion box should have a close button~~
- [ ] ~~Maybe clicking the corner icon makes the box come back~~
- [ ] ~~Use separate server??~~
- [ ] ~~Use twitter api??~~
- [ ] ~~Write a script to process twitter private data export~~
- [ ] ~~Use ecmascript modules?~~
- [ ] ~~Upload JSON file prompt?~~

(Ask nosilverv for all his documents)

## Project Info

- jQuery! Strict mode on. `Prettier` code formatting
- Use `git clone --depth 1` because there will be old random shit in old versions
