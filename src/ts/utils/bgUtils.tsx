import { Observable } from 'kefir'
import PromiseWorker from 'promise-worker'
import { assoc, curry, defaultTo, filter, isNil, map, not, path, pipe, prop, reduce } from 'ramda' // Function
import { User } from 'twitter-d'
import { apiToTweet, validateTweet } from '../bg/tweetImporter'
import { ReqDefaultTweetsMsg, ReqSearchMsg } from '../types/msgTypes'
import { IdleMode, Option, SearchFilters, SearchMode, StorageChange } from '../types/stgTypes'
import { Credentials } from '../types/types'
import { getData, getOption, makeOptionObs, makeStgItemObs, removeData, resetStorage } from './dutils'
import { n_tweets_results } from './params'
import { curVal } from './putils'



export const getDateFormatted = () => (new Date()).toLocaleString()
export const twitter_url = /https?:\/\/(www\.)?twitter.com\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
export const apiBookmarkToTweet = pipe(apiToTweet, assoc('is_bookmark', true))

export const saferTweetMap = (fn: (x:any) => any) => pipe( // saferMap :: [x] -> [x]
  defaultTo([]), 
  filter(pipe(isNil, not)), 
  filter(validateTweet), 
  map(fn),
  ) // fn -> ([x] -> [fn(x)])

  // auth
export const makeInit = (auth: Credentials) : RequestInit => {
    return {
      credentials: "include",
      headers: {
        authorization: auth.authorization,
        "x-csrf-token": auth['x-csrf-token']
      }
    };
  }
export const compareAuths = (a: Credentials, b: Credentials)=>{return a.authorization == b.authorization && a["x-csrf-token"] == b.["x-csrf-token"]}
export const validateAuth = (x: Credentials)=>(prop('authorization', x) != null && prop("x-csrf-token", x) != null)

  // worker
export const msgSomeWorker = curry( async (worker, msg): Promise<any> => {console.log('[DEBUG] messaging worker', {msg}); return worker.postMessage(msg)}) // msgWorker :: worker -> msg -> Promise

  //chrome storage
export const isOptionSame = curry ((name: string | number, x: { oldVal: any; newVal: any })=> (isNil(x.oldVal) && isNil(x.newVal)) || (!isNil(x.oldVal) && !isNil(x.newVal) && (path(['oldVal', name, 'value'],x) === path(['newVal', name, 'value'],x))) )
// makeOptionsObs :: String -> a
export const _makeOptionObs = curry (async (optionsChange$: Observable<StorageChange, any>, itemName: string): Promise<Observable<Option, any>>  => {
  const initVal = await getOption(itemName)
  return makeOptionObs(optionsChange$,itemName).toProperty(()=>initVal)
})
// makeStgObs :: String -> a
export const _makeStgObs = curry (async (itemName) => {
  const initVal = await getData(itemName)
  return makeStgItemObs(itemName).toProperty(()=>initVal)
})
export const combineOptions = (...args: Option[]): SearchFilters => pipe(reduce((a,b)=>assoc(b.name, b.value, a),{}))(args)

export const makeReqDefaultTweetsMsg = (filters:SearchFilters, idleMode: IdleMode, accsShown:User[]): ReqDefaultTweetsMsg => {return{
  type:'getDefaultTweets',
  n_tweets: n_tweets_results, 
  filters: filters, 
  idle_mode: idleMode,
  accsShown: accsShown,
}}
// export const makeReqSearchMsg = (getSearchMode: () => any, filters: () => any, getAccsShown: ()=> any, query: string): object=>{return { // MakeReqSearchMsg :: String -> msg
export const makeReqSearchMsg = (searchMode: SearchMode, filters: SearchFilters, accsShown:User[], query: string): ReqSearchMsg => {return {
  type:'searchIndex', 
  filters:filters,
  searchMode: searchMode,
  accsShown: accsShown,
  n_results: n_tweets_results,
  query: query,
}}


  // Worker requests
// const msgWorker = msgSomeWorker(worker)  // msgWorker :: msg -> Promise
export const isWorkerReady = async (pWorker: PromiseWorker) => msgSomeWorker(pWorker, {type:'isWorkerReady'}) // isWorkerReady :: () -> Promise int
export const howManyTweetsDb = async (pWorker: PromiseWorker) => msgSomeWorker(pWorker, {type:'howManyTweetsDb'}) // howManyTweetsDb :: () -> Promise int
export const addAccount = curry(async (pWorker: PromiseWorker, userInfo: User)  => msgSomeWorker(pWorker, {type:'addAccount', res: userInfo})) // addAccount :: IMPURE [id] -> Promise ()
export const removeAccount = curry(async (pWorker: PromiseWorker, id: string) => msgSomeWorker(pWorker, {type:'removeAccount', id:id})) // removeAccount :: IMPURE [id] -> Promise ()
export const addUser = curry(async (pWorker: PromiseWorker, userInfo: User) => msgSomeWorker(pWorker, {type:'addUser', res:userInfo})) // addUser :: IMPURE [id] -> Promise ()
export const removeUser = curry(async (pWorker: PromiseWorker, userInfo: User) => msgSomeWorker(pWorker, {type:'removeUser', res:userInfo.id_str})) // removeUser :: IMPURE [id] -> Promise ()
export const updateTimeline = curry(async (pWorker: PromiseWorker, res: any[]) => msgSomeWorker(pWorker, {type:'updateTimeline', res:res})) // updateTimeline :: IMPURE [id] -> Promise ()
export const addTweets = curry(async (pWorker: PromiseWorker, res: any[] ) => msgSomeWorker(pWorker, {type:'addTweets', res:res})) // addTweets :: IMPURE [id] -> Promise ()
export const removeTweets = curry(async (pWorker: PromiseWorker, ids:string[]) => msgSomeWorker(pWorker, {type:'removeTweets', res:ids})) // removeTweets :: IMPURE [id] -> Promise()
export const removeTweet = curry(async (pWorker: PromiseWorker, id:string) => removeTweets(pWorker, [id]))
export const dbClear =  async (pWorker: PromiseWorker) => msgSomeWorker(pWorker, {type:'dbClear'}) // dbClear :: IMPURE () -> Promise ()
export const resetIndex =  async (pWorker: PromiseWorker) => msgSomeWorker(pWorker, {type:'resetIndex'}) // resetIndex :: IMPURE () -> Promise ()
// export const doSearch = curry(async (pWorker: PromiseWorker, getSearchMode: () => any,  getFilters: () => any, accsShown$, query: string) => msgSomeWorker(pWorker, makeReqSearchMsg(getSearchMode, getFilters, ()=>curVal(accsShown$), query))); // doSearch :: IMPURE String -> Promise [tweet]
export const getDefaultTweets = curry(async (pWorker: PromiseWorker, getFilters: () => any, idleMode$, accsShown$, ) => msgSomeWorker(pWorker, makeReqDefaultTweetsMsg(getFilters, ()=>curVal(idleMode$), ()=>curVal(accsShown$))))// getDefaultTweets :: IMPURE () -> Promise [tweet]

export const clearTempArchive = _=>removeData(["temp_archive"])
export const resetData = (pWorker: PromiseWorker): Promise<any> => {console.log('[INFO] Resetting storage'); return Promise.all([resetStorage(), dbClear(pWorker)]) }
