module.exports = {
  // Global options:
  verbose: true,
  // Command options:
  build: {
    overwriteDest: true,
  },
  run: {
    target: ['firefox-desktop'],
    firefox: 'firefox',
    firefoxProfile:
      '/mnt/c/Users/frsc/Documents/Projects/th/devopsTh/web-ext/ffProfiles/th',
    profileCreateIfMissing: true,
    keepProfileChanges: true,
    startUrl: ['www.twitter.com'],
  },
  ignoreFiles: ['package-lock.json'],
  sourceDir: 'build',
};
