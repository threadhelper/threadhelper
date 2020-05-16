# Related Tweets

A Chrome browser extension that shows you related tweets on your own account.

## Description of files

- `manifest.json`: settings for chrome extension
- `contentScript.js`: manages html and interface
- `nlp.js`: provides NLP stuff
- `readme.md`: this file
- `style.css`: styling for extension components

## Installation:
- Download repository
- Settings -> Extensions -> Developer mode -> Load unpacked -> Select root folder

## Instructions
- If you close your twitter tab, or too much time passes, you'll have to get auth and load tweets again.
- If it's still not working after auth and loading, clear your cache.

## Todo items
- [ ] ML search
- [ ] automate auth and load
- [ ] requests with since_id for efficiency
- [ ] Search EVERY TWEET (go past latest 3200 tweets)



### MVP

- [x] Steal key from client fetch
- [x] Make a simple fetch
- [x] Download all of a user's tweet piecemeal
- [x] Store them in chrome storage api
- [x] Move bar to side

(Feature ideas are in the google doc)

oh one idea: links to your own tweets in the sidebar should appear in the sidebar

### Done or cancelled

- [x] Try it with Trump's tweets
- [x] Add a paste button to insert the ID into your tweet in place
- [x] Scroll on the preview
- [x] Use CSS files
- [x] Encapsulate nlp.js into a public function thing
- [x] Box should go away when compose box goes away
- [x] Box should always appear when compose box appears
- [ ] ~~Reverse the tweet-word datastructure?~~
  - [x] ~~Construct reverse tables~~
  - [ ] ~~use them~~
  - [x] more efficient top-k algorithm?
    - update: this alone is enough for instant results so i don't need to use anything else
  - [ ] ~~Better data structure in general maybe a db (note there's max a few thousand tweets)~~
- [ ] ~~Maybe the suggestion box should have a close button~~
- [ ] ~~Maybe clicking the corner icon makes the box come back~~
- [ ] ~~Use separate server??~~
- [ ] ~~Use twitter api??~~
- [ ] ~~Write a script to process twitter private data export~~
- [ ] ~~Use ecmascript modules?~~
- [ ] ~~Upload JSON file prompt?~~


(Ask nosilverv for all his documents)

## Project Info

- jQuery and plain js
- Strict mode turned on
- `prettier` code formatting
- Use `git clone --depth 1` because there will be old random shit in old versions
