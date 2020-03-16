# Related Tweets

A Chrome browser extension that shows you related tweets on your own account.

## Description of files

- `content_script.js`: manages html and interface
- `getRelated.js`: provides NLP stuff
- `manifest.json`: settings for chrome extension
- `nosilverv.js`: His tweets
- `readme.md`: this file
- `stemmer.js`: one function for word stemming, from node package `stemmer`
- `stopwords.js`: just a list of stopwords, taken from python's nltk
- `style.css`: styling for extension components
- `trump.js`: trump tweets

## Todo items

- [ ] Reverse the tweet-word datastructure maybe
  - [ ] Better data structure in general maybe a db (note there's max a few thousand tweets)
- [ ] Encapsulate getRelated.js into a public function thing
- [x] Box should go away when compose box goes away
- [x] Box should always appear when compose box appears
- [ ] ~~Maybe the suggestion box should have a close button~~
- [ ] ~~Maybe clicking the corner icon makes the box come back~~
- [ ] Bar could be on the side when there's room and below otherwise
- [ ] Write a script to process twitter private data export
- [ ] Use ecmascript modules
- [ ] Upload JSON file prompt
- [ ] Use chrome storage API
- [ ] Use twitter api??
- [ ] Use separate server??
- [ ] Use actual user's tweets
- [ ] Try it with Trump's tweets
- [ ] Think about better search algorithms
- [ ] Make sidebar look nice
- [ ] Add a paste button to insert the ID into your tweet in place
- [ ] Learn about chrome extension store
- [ ] Scroll on the preview
- [x] Use CSS files

- [ ] Enable github issues and put these todos there
- [ ] Trump tweet links don't work - is that the data or a bug?
- [ ] Only search on word boundary

(Ask nosilverv for all his documents)

## Project Info

- jQuery! Strict mode on. `Prettier` code formatting
- Use `git clone --depth 1` because there will be old random shit in old versions
