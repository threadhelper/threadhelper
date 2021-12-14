import { isNil, isEmpty, equals } from 'ramda';
import { UrlModes } from '../types/types';
import { isExist } from '../utils/putils';
import { getTwitterPageMode, getCurrentUrl } from './twitterPageReader';
export const url_regex =
  /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
export const last_tweet_id = 0;
export const editorClass = 'DraftEditor-editorContainer';
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
  const body_text = allTexts[1];
  if (isNil(body_text)) return null;
  const full_text = body_text.textContent;

  return full_text;
};

export function getTweetId(tweet: {
  querySelectorAll: (arg0: string) => any[];
}) {
  // get ID from the tweet card DOM element
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

export function makeLastStatusObs(mode$: Observable<UrlModes, Error>) {
  // Returns a property (has a current value), not a stream
  const getCurrentId = (_) =>
    getTwitterPageMode() == UrlModes.status
      ? getIdFromUrl(getCurrentUrl())
      : null;
  const lastStatus$ = mode$
    .filter(equals(UrlModes.status))
    .map((_) => getIdFromUrl(getCurrentUrl()))
    .toProperty(() => getCurrentId(1));
  return lastStatus$;
}
