import { curProp, UrlModes } from '../types/types'
import { currentValue } from '../utils/putils';
import { getData, setData, msgBG, makeOnStorageChanged } from '../utils/dutils';
import { getMode, getCurrentUrl, getIdFromUrl } from '../utils/wutils'
import Kefir, { Observable, Observer, Subscription } from 'kefir';
import { obsAttributes } from '../utils/kefirMutationObs';
import {equals} from 'ramda'

(Kefir.Property.prototype as any).currentValue = currentValue;


export function onTabActivate(url){
  // console.log("tab activate", url)
  setData({current_url: window.location.href})
}

export const makeModeObs = (gotMsg$: any[])=>gotMsg$.map((x: { m: any; })=>x.m).filter((m: { type: string; }) => m.type == "tab-change-url").map((m: { url: any; })=>getMode(m.url))//.skipDuplicates()

// Returns a property (has a current value), not a stream
export function makeLastStatusObs(mode$: Observable<UrlModes, Error>): curProp<UrlModes>{
  const getCurrentId = _ => getMode() == UrlModes.status ? getIdFromUrl(getCurrentUrl()) : null
  const lastStatus$ = mode$.filter(equals(UrlModes.status)).map(_ => getIdFromUrl(getCurrentUrl())).toProperty(()=>getCurrentId(1))
  // const lastStatus$ = url$.map(m => getIdFromUrl(m.url)).toProperty(getCurrentId)
  return ((lastStatus$ as unknown) as curProp<UrlModes>)
}

export function makeBgColorObs(){
  const styleChange$ = obsAttributes(document.body, ['style'])
  return styleChange$
}