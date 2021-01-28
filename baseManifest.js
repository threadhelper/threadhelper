const isDevelopment = process.env.NODE_ENV !== 'production';

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
    default_popup: 'popup.html',
  },
  permissions: [
    'storage',
    'unlimitedStorage',
    'webRequest',
    'https://api.twitter.com/',
    'https://*.twitter.com/*',
    ...(isDevelopment
      ? ['ws://localhost/*', 'http://localhost/*', 'http://127.0.0.1/*']
      : []),
  ],
  manifest_version: 2,
  content_scripts: [
    {
      matches: ['https://*.twitter.com/*'],
      js: ['content-script.bundle.js'],
    },
  ],
  background: {
    scripts: ['background.bundle.js'],
  },
  icons: {
    16: 'public/extension/thread_16.png',
    32: 'public/extension/thread_32.png',
    48: 'public/extension/thread_48.png',
    128: 'public/extension/thread_128.png',
  },
  content_security_policy: "script-src 'self'; object-src 'self';",
};
