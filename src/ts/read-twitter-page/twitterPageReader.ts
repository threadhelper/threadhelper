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
