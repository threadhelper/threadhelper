import { isNil, isEmpty } from 'ramda';
import { UrlModes } from '../types/types';
import { isExist } from '../utils/putils';
export const url_regex =
  /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
export const last_tweet_id = 0;
export const editorClass = 'DraftEditor-editorContainer';
const editorSelector = '.DraftEditor-editorContainer';
const tweetButtonSelector = '[data-testid="SideNav_NewTweet_Button"]';
export const repliedTimeSelector =
  'div[aria-labelledby="modal-header"][role="dialog"] time';

export const getRepliedToUsername = () => {
  const time = document.querySelector(repliedTimeSelector);
  if (isNil(time)) return null;
  const usernameTexts = time.parentElement.parentElement.children;
  if (isEmpty(usernameTexts)) return null;
  const screen_name = usernameTexts[0].textContent.match(/.*@((\w){1,15})/);
  return screen_name;
};

export const getRepliedToText = () => {
  const time = document.querySelector(repliedTimeSelector);
  if (isNil(time)) return null;
  const allTexts =
    time.parentElement?.parentElement?.parentElement?.parentElement
      ?.parentElement?.parentElement?.children;
  if (!isExist(allTexts)) return null;
  console.log('getRepliedToText', { time, allTexts });
  const body_text = allTexts[1];
  if (isNil(body_text)) return null;
  const full_text = body_text.textContent;

  return full_text;
};

// gets all twitter tabs
export function getTwitterTabIds() {
  return new Promise(function (resolve, reject) {
    chrome.tabs.query(
      { url: '*://twitter.com/*', currentWindow: true },
      function (tabs: any[]) {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
          reject(chrome.runtime.lastError.message);
        } else {
          resolve(
            tabs.map((tab: { id: any }) => {
              return tab.id;
            })
          );
        }
      }
    );
  });
}

export const getComposers = () => document.querySelectorAll(editorSelector);
export const getActiveComposer = () => {
  // @ts-expect-error ts-migrate(2461) FIXME: Type 'NodeListOf<Element>' is not an array type.
  const comps = [...getComposers()];
  let comp = null;
  switch (comps.length) {
    case 0:
      break;
    case 1:
      comp = comps[comps.length - 1];
      break;
    default:
      comp = comps[comps.length - 2];
      break;
  }
  return comp;
};

export const getCurrentUrl = () => window.location.href;

export function getMode(url: string | null = null) {
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

const isHomeSidebar = () => {
  const sugHome = document.getElementsByClassName('sug_home');
  if (sugHome.length > 0) {
    if (sugHome[0].children.length > 0) {
      return true;
    }
  } else {
    return false;
  }
  return false;
};

const isFloatSidebar = () => {
  const sugCompose = document.getElementsByClassName('sug_compose');
  if (sugCompose.length > 0) {
    if (sugCompose[0].children.length > 0) {
      return true;
    }
  } else {
    return false;
  }
  return false;
};

export function isSidebar(mode) {
  switch (mode) {
    case 'home':
      return document.getElementsByClassName('sug_home').length > 0;
    case 'compose':
      return isFloatSidebar();
    default:
      return false;
  }
}

export const containsOrContained = (a: Element, b: Element): boolean =>
  b.contains(a) || a.contains(b);

export const elIntersect = (selector: string, elem: Element): boolean =>
  Array.from(document.querySelectorAll(selector)).some((s: Element) =>
    containsOrContained(elem, s)
  );

export const elContained = (selector: string, elem: Element): boolean =>
  Array.from(document.querySelectorAll(selector)).some((s: Element) =>
    s.contains(elem)
  );
// true if active element contains or is contained by the element of interest
export function isFocused(selector) {
  // return isNil(document.activeElement) ? false : elIntersect(selector, document.activeElement)
  return elIntersect(selector, document.activeElement);
}

// export function isComposeFocused(){
//   return activeComposer ? activeComposer.contains(document.activeElement) : false
// }

// get ID from the tweet card DOM element
export function getTweetId(tweet: {
  querySelectorAll: (arg0: string) => any[];
}) {
  // console.log(tweet)
  // let date = $(tweet).find('time')[0]
  let date = tweet.querySelectorAll('time')[0];
  let linkEl = date.parentNode;
  let link = linkEl.href;
  let link_spl = link.split('/');
  let tid = link_spl[link_spl.length - 1];
  return tid;
}

// get tweet id from status url
export function getIdFromUrl(url: string) {
  let link_split = url.split('/');
  let tid = link_split[link_split.length - 1];
  return tid;
}

function setTheme(
  bg_color: string,
  txt_color: string,
  border_color: string,
  accent_color: string,
  tooltip_color: string,
  bg_hover_color: string,
  search_bg_color: string
) {
  let root = document.documentElement;
  root.style.setProperty('--main-bg-color', bg_color);
  root.style.setProperty('--main-txt-color', txt_color);
  root.style.setProperty('--main-border-color', border_color);
  root.style.setProperty('--accent-color', accent_color);
  root.style.setProperty('--tooltip-color', tooltip_color);
  root.style.setProperty('--bg-hover-color', bg_hover_color);
  root.style.setProperty('--search-bg-color', search_bg_color);
}

// function setTheme(bg, accent) {
//   let root = document.documentElement;

// }

export function updateTheme(theme = null) {
  const defaultAccent = 'rgb(0, 157, 255)';
  const light_theme = 'rgb(255, 255, 255)';
  const dim_theme = 'rgb(21, 32, 43)';
  const black_theme = 'rgb(0, 0, 0)';
  theme = isNil(theme)
    ? {
        bgColor: document.body.style['background-color'],
        accentColor: defaultAccent,
      }
    : theme;

  console.log('updateTheme', { theme });

  switch (theme.bgColor) {
    case light_theme:
      setTheme(
        '#f5f8fa',
        'black',
        '#e1e8ed',
        theme.accentColor,
        '#666666',
        'rgba(0,0,0,0.05)',
        'rgb(235, 238, 240)'
      );
      break;
    case dim_theme:
      setTheme(
        '#192734',
        'white',
        '#38444d',
        theme.accentColor,
        '#4d6072',
        'rgba(255,255,255,0.05)',
        'rgb(21, 32, 43)'
      );
      break;
    case black_theme:
      setTheme(
        'black',
        'white',
        '#2f3336',
        theme.accentColor,
        '#495a69',
        'rgba(255,255,255,0.05)',
        'rgb(32, 35, 39)'
      );
      break;
    default:
      setTheme(
        '#f5f8fa',
        'black',
        '#e1e8ed',
        theme.accentColor,
        '#666666',
        'rgba(0,0,0,0.05)',
        'rgb(235, 238, 240)'
      );
      break;
  }
}
