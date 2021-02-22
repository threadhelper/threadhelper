import Kefir, { Observable } from 'kefir';
import { equals, ifElse, isEmpty, isNil, nth, pipe } from 'ramda';
import { curProp, UrlModes } from '../types/types';
import { setData } from '../utils/dutils';
import { obsAdded, obsAttributes } from '../utils/kefirMutationObs';
import { currentValue } from '../utils/putils';
import { getCurrentUrl, getIdFromUrl, getMode } from '../utils/wutils';

(Kefir.Property.prototype as any).currentValue = currentValue;

const tweetButtonSelector = '[data-testid="SideNav_NewTweet_Button"]';

export function onTabActivate(url) {
  // console.log("tab activate", url)
  setData({ current_url: window.location.href });
}

export const makeModeObs = (gotMsg$: any[]) =>
  gotMsg$
    .map((x: { m: any }) => x.m)
    .filter((m: { type: string }) => m.type == 'tab-change-url')
    .map((m: { url: any }) => getMode(m.url)); //.skipDuplicates()

// Returns a property (has a current value), not a stream
export function makeLastStatusObs(
  mode$: Observable<UrlModes, Error>
): curProp<UrlModes> {
  console.log('makeLastStatusObs');
  const getCurrentId = (_) =>
    getMode() == UrlModes.status ? getIdFromUrl(getCurrentUrl()) : null;
  const lastStatus$ = mode$
    .filter(equals(UrlModes.status))
    .map((_) => getIdFromUrl(getCurrentUrl()))
    .toProperty(() => getCurrentId(1));
  // const lastStatus$ = url$.map(m => getIdFromUrl(m.url)).toProperty(getCurrentId)
  return (lastStatus$ as unknown) as curProp<UrlModes>;
}
const getBgColor = (x: HTMLElement) => x.style.backgroundColor;
export function makeBgColorObs() {
  const styleChange$ = obsAttributes(document.body, ['style']).map(getBgColor);
  return styleChange$;
}

const defaultAccent = 'rgb(0, 157, 255)';
const getAccent = (htmlList: NodeList) => {
  const elList = Array.from(htmlList);
  if (isNil(elList) || isEmpty(elList)) return defaultAccent;
  const el = elList[0] as Element;
  if (isNil(el) || isEmpty(el)) return defaultAccent;
  const color = window.getComputedStyle(el).backgroundColor;
  return color ?? defaultAccent;
};
export function makeThemeObs() {
  const accent$ = obsAdded(document, tweetButtonSelector, true)
    .map(getAccent)
    .toProperty(() => {
      const tweetButton = document.querySelector(tweetButtonSelector);
      if (isNil(tweetButton)) return defaultAccent;
      return (
        window.getComputedStyle(tweetButton).backgroundColor ?? defaultAccent
      );
    });
  accent$.log('accent$ theme');
  const bg$ = makeBgColorObs().toProperty(() => getBgColor(document.body));
  const theme$ = Kefir.combine([bg$, accent$], (bgColor, accentColor) => {
    return { bgColor, accentColor };
  });
  // .skipDuplicates(equals)

  theme$.log('theme$ in tabs');
  return theme$;
}
