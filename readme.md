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
- [ ] ~~Reverse the tweet-word datastructure?~~
  - [x] ~~Construct reverse tables~~
  - [ ] ~~use them~~
  - [x] more efficient top-k algorithm?
    - update: this alone is enough for instant results so i don't need to use anything else
  - [ ] ~~Better data structure in general maybe a db (note there's max a few thousand tweets)~~
- [ ] Think about more intelligent search algorithms in general
- [ ] Add click-to-search for keywords in tweets
  - [ ] Search for one keyword
  - [ ] Click to do a thing on words in sidebar
  - [ ] Click on words in compose box
  - [ ] Maybe completely replace compose box?
  - [ ] Button to go back to full tweet search
  - [ ] Is just a twitter search sidebar better?
- [ ] Have bar on side when there's room
- [ ] Is it better to have the sidebar floating 'inside' twitter container or be like a "browser sidebar" that looks like it's not part of twitter?
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
