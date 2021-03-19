const isDevelopment = process.env.NODE_ENV !== 'production';
const isServe = process.env.DEV_MODE == 'serve';

module.exports = {
  name: 'ThreadHelper',
  description: 'A serendipity engine on the Twitter sidebar.',

  browser_action: {
    default_icon: {
      16: 'public/extension/thread_16.png',
      32: 'public/extension/thread_32.png',
      48: 'public/extension/thread_48.png',
      128: 'public/extension/thread_128.png',
    },
    default_title: 'ThreadHelper',
    // default_popup: 'popup.html',
  },

  // "declarative_net_request" : {
  //   "rule_resources" : [{
  //     "id": "ruleset_1",
  //     "enabled": true,
  //     "path": "rules_1.json"
  //   }, {
  //     "id": "ruleset_2",
  //     "enabled": false,
  //     "path": "rules_2.json"
  //   }]
  // },
  // optional_permissions: ['webRequest'],

  permissions: [
    'storage',
    'unlimitedStorage',
    'webRequest',
    // "declarativeNetRequest",
    // "declarativeNetRequestFeedback",
    'https://api.twitter.com/',
    'https://*.twitter.com/*',
    ...(isServe || isDevelopment
      ? [
          'ws://localhost/*',
          'http://localhost/*',
          'http://127.0.0.1/*',
          // 'webRequest',
          // 'webRequestBlocking',
        ]
      : []),
  ],
  manifest_version: 2,
  content_scripts: [
    {
      matches: ['https://*.twitter.com/*'],
      js: ['content-script.bundle.js'],
    },
    ...(isServe || isDevelopment
      ? [
          {
            // matches: ['ws://localhost/*', 'http://localhost/*', 'http://127.0.0.1/*'],
            matches: ['http://localhost/*'],
            js: ['devCs.bundle.js'],
          },
        ]
      : []),
  ],
  background: {
    scripts: ['background.bundle.js'],
    persistent: true,
    // persistent: false,
  },
  icons: {
    16: 'public/extension/thread_16.png',
    32: 'public/extension/thread_32.png',
    48: 'public/extension/thread_48.png',
    128: 'public/extension/thread_128.png',
  },
  content_security_policy: "script-src 'self' blob:; object-src 'self' blob:;",
  // "content_security_policy": "default-src 'self' data: 'unsafe-eval' 'unsafe-inline' blob; script-src 'self'; object-src 'self'",
  // browser_specific_settings: {
  //   gecko: {
  //     id: '{5e51829e-7295-4747-bcaf-585510eb379c}',
  //   },
  // },
};
