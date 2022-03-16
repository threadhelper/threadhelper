import { UrlModes } from '../types/types';

export const getCurrentUrl = () => window.location.href;

export function getTwitterPageMode(url: string | null = null) {
  var pageURL = url == null ? getCurrentUrl() : url;
  var home = 'twitter.com/home';
  var compose = 'twitter.com/compose/tweet';
  var intent = 'twitter.com/intent/tweet';
  var notifications = 'twitter.com/notifications';
  var explore = 'twitter.com/explore';
  var bookmarks = 'twitter.com/i/bookmarks';
  var status = '/status/';
  if (pageURL.indexOf(home) > -1) {
    return UrlModes.home;
  } else if (pageURL.indexOf(compose) > -1 || pageURL.indexOf(intent) > -1) {
    return UrlModes.compose;
  } else if (pageURL.indexOf(notifications) > -1) {
    return UrlModes.notifications;
  } else if (pageURL.indexOf(explore) > -1) {
    return UrlModes.explore;
  } else if (pageURL.indexOf(bookmarks) > -1) {
    return UrlModes.bookmarks;
  } else if (pageURL.indexOf(status) > -1) {
    return UrlModes.status;
  } else {
    return UrlModes.other;
  }
}

export const getMetadataForPage = function (url) {
  var showTweet = url.match(
    /(?:twitter.com|mobile.twitter.com)\/(.*)\/status\/([0-9]*)(?:\/)?(?:\?.*)?$/
  );
  var home = url.match(
    /(?:twitter.com|mobile.twitter.com)\/home(?:\/)?(?:\?.*)?$/
  );
  var explore = url.match(
    /(?:twitter.com|mobile.twitter.com)\/explore(?:\/)?(?:\?.*)?$/
  );
  var search = url.match(
    /(?:twitter.com|mobile.twitter.com)\/search(?:\/)?(?:\?.*)?$/
  );
  var notifications = url.match(
    /(?:twitter.com|mobile.twitter.com)\/notifications(?:\/)?(?:\?.*)?$/
  );
  var messages = url.match(
    /(?:twitter.com|mobile.twitter.com)\/messages(?:\/)?(?:\?.*)?$/
  );
  var profile = url.match(
    /(?:twitter.com|mobile.twitter.com)\/([^/?]+)(?:\/with_replies|\/media|\/likes)?(?:\/)?(?:\?.*)?$/
  );
  var compose = url.match(
    /(?:twitter.com|mobile.twitter.com)\/compose\/tweet(?:\/)?(?:\?.*)?$/
  );
  var list = url.match(
    /(?:twitter.com|mobile.twitter.com)\/i\/lists\/([0-9]*)(?:\/)?(?:\?.*)?$/
  );
  var intentReply = url.match(
    /(?:twitter.com|mobile.twitter.com)\/intent\/tweet\?in_reply_to\=([0-9]*)?$/
  );
  var intent = url.match(
    /(?:twitter.com|mobile.twitter.com)\/intent\/tweet(?:\?.*)?$/
  );
  if (showTweet) {
    return {
      pageType: 'showTweet',
      username: showTweet[1],
      tweetId: showTweet[2],
      url: url,
    };
  } else if (home) {
    return {
      pageType: 'home',
      url: url,
    };
  } else if (compose) {
    return {
      pageType: 'compose',
      url: url,
    };
  } else if (intentReply) {
    return {
      pageType: 'intentReply',
      url: url,
      tweetId: intentReply[1],
    };
  } else if (intentReply) {
    return {
      pageType: 'intent',
      url: url,
    };
  } else if (explore) {
    return {
      pageType: 'explore',
      url: url,
    };
  } else if (search) {
    return {
      pageType: 'search',
      url: url,
    };
  } else if (notifications) {
    return {
      pageType: 'notifications',
      url: url,
    };
  } else if (messages) {
    return null;
  } else if (profile) {
    var username = profile[1];
    // certain URLs are special reserved pages, not actual profile pages
    if (username === 'login' || username === 'search-advanced') {
      return null;
    }
    return {
      pageType: 'profile',
      username: profile[1],
      url: url,
    };
  } else if (list) {
    return {
      pageType: 'list',
      listId: list[1],
      url: url,
    };
  } else {
    return null;
  }
};
