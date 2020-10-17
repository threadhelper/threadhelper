// DEFAULT OPTIONS V IMPORTANT
export const defaultOptions = () => {return {
  name: 'options',
  getRTs: {name:'getRTs', type:'searchFilter', value:true},
  useBookmarks: {name:'useBookmarks', type:'searchFilter', value:true},
  useReplies: {name:'useReplies', type:'searchFilter', value:true},
  roboActive: {name:'roboActive', type:'featureFilter', value:false},
}}

export const defaultStorage = () =>{
  return{
    options:defaultOptions(),
    hasArchive: false,
    hasTimeline: false,
    latest_tweets: [],
    search_results: [],
    temp_archive: [],
    syncDisplay: `Hi, I don't have any tweets yet.`,
    sync: false,
  }
}