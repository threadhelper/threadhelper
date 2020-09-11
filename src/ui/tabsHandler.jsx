import { getData, setData, msgBG, makeOnStorageChanged } from '../utils/dutils.jsx';
import { getMode, getCurrentUrl, getIdFromUrl } from '../utils/wutils.jsx'
import { setUpTrendsListener } from './sidebarHandler.jsx'
import Kefir from 'kefir';
import { obsAttributes } from '../utils/kefirMutationObs.jsx';


export function onTabActivate(url){
  // console.log("tab activate", url)
  setData({current_url: window.location.href})
}

export const makeModeObs = (gotMsg$)=>gotMsg$.map(x=>x.m).filter(m => m.type == "tab-change-url").map(m=>getMode(m.url))//.skipDuplicates()

// Returns a property (has a current value), not a stream
export function makeLastStatusObs(mode$){
  const getCurrentId = _=> getMode() == "status" ? getIdFromUrl(getCurrentUrl()) : null
  const lastStatus$ = mode$.filter(m=>m=="status").map(_ => getIdFromUrl(getCurrentUrl())).toProperty(getCurrentId)
  // const lastStatus$ = url$.map(m => getIdFromUrl(m.url)).toProperty(getCurrentId)
  return lastStatus$
}

export function makeBgColorObs(){
  const styleChange$ = obsAttributes(document.body, ['style'])
  return styleChange$
}