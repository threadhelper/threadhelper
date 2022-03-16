import Kefir, { Observable, Observer } from 'kefir';
import { equals, ifElse, isEmpty, isNil, nth, pipe } from 'ramda';
import { curProp, UrlModes } from '../types/types';
import { obsAdded, obsAttributes } from '../utils/kefirMutationObs';
import { currentValue } from '../utils/putils';
import { getIdFromUrl } from './openTweetReader';
import { getCurrentUrl, getTwitterPageMode } from './twitterPageReader';

(Kefir.Property.prototype as any).currentValue = currentValue;

const tweetButtonSelector = '[data-testid="SideNav_NewTweet_Button"]';
const defaultAccentColor = 'rgb(0, 157, 255)';

const getBgColor = (x: HTMLElement) => x.style.backgroundColor;

export function makeBgColorObs() {
  const styleChange$ = obsAttributes(document.body, ['style']).map(getBgColor);
  return styleChange$;
}

const getAccent = (htmlList: NodeList) => {
  const elList = Array.from(htmlList);
  if (isNil(elList) || isEmpty(elList)) return defaultAccentColor;
  const el = elList[0] as Element;
  if (isNil(el) || isEmpty(el)) return defaultAccentColor;
  const color = window.getComputedStyle(el).backgroundColor;
  return color ?? defaultAccentColor;
};

const initAccent = () => {
  const tweetButton = document.querySelector(tweetButtonSelector);
  if (isNil(tweetButton)) return defaultAccentColor;
  return (
    window.getComputedStyle(tweetButton).backgroundColor ?? defaultAccentColor
  );
};

const getInitBgColor = () => getBgColor(document.body);

export function makeThemeObs(document: Document) {
  const accent$ = obsAdded(document, tweetButtonSelector, true)
    .map(getAccent)
    .toProperty(initAccent);
  const bg$ = makeBgColorObs().toProperty(getInitBgColor);
  const theme$ = Kefir.combine([bg$, accent$], (bgColor, accentColor) => {
    return { bgColor, accentColor };
  }).toProperty(() => {
    return { accentColor: initAccent(), bgColor: getInitBgColor() };
  });

  return theme$;
}
