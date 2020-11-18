// DEFAULT OPTIONS V IMPORTANT
export const defaultOptions = () => {return {
  name: 'options',
  getRTs: {name:'getRTs', type:'searchFilter', value:true},
  useBookmarks: {name:'useBookmarks', type:'searchFilter', value:true},
  useReplies: {name:'useReplies', type:'searchFilter', value:true},
  idleMode: {name:'idleMode', type:'idleMode', value:'timeline'}, // {'random', 'timeline'}
  roboActive: {name:'roboActive', type:'featureFilter', value:false},
}}

export const defaultStorage = () =>{
  return{
    options:defaultOptions(),
    hasArchive: false,
    hasTimeline: {}, // {id_str: Bool}
    activeAccounts: [], //{screen_name: String, id_str: String, showTweets: Bool, ...}
    latest_tweets: [],
    search_results: [],
    temp_archive: [],
    syncDisplay: `Hi, I don't have any tweets yet.`,
    sync: false,
  }
}