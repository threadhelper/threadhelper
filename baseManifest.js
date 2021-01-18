export default{
  "name": "ThreadHelper",
  "description": "A serendipity engine on the Twitter sidebar.",
  // "version": "0.2.3.2",
  "browser_action": {
    "default_icon": {
      "16": "images/extension/thread_16.png",
      "32": "images/extension/thread_32.png",
      "48": "images/extension/thread_48.png",
      "128": "images/extension/thread_128.png"
    },
    "default_title": "ThreadHelper",
    "default_popup": "popup.html"        
  },
  "permissions": [
    "storage",
    "unlimitedStorage",
    "webRequest",
    "https://api.twitter.com/",
    "https://*.twitter.com/*",
    "ws://localhost/*",
    "http://localhost/*",
    "http://127.0.0.1/*"
  ],
  "manifest_version": 2,
  "content_scripts": [
    {
      "matches": ["https://*.twitter.com/*"],
      "js": ["content-script.js"]
    }
  ],
  "background": {
    "scripts": ["background.js"]
  },
  "icons": {
    "16": "images/extension/thread_16.png",
    "32": "images/extension/thread_32.png",
    "48": "images/extension/thread_48.png",
    "128": "images/extension/thread_128.png"
  },
  "content_security_policy": "script-src 'self'; object-src 'self';"

}