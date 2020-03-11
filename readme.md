## Related Tweets

A Chrome browser extension that shows you related tweets on your own account.

Later:

- Box should go away when compose box goes away
- Box should always appear when compose box appears
- Use ecmascript modules
- Upload JSON file prompt
- Try it with Trump's tweets
- Think about better search algorithms
- Make sidebar look nice
- Add a paste button to insert the ID into your tweet in place
- Learn about chrome extension store

(Ask nosilverv for all his documents)

Known bugs:

- If whole text field is deleted, events (MutationObserver stuff) stop catching (need to set up a new catcher)
	- Typing events might also stop catching if you hit backspace? Or randomly? Might need a better way to watch the text field.