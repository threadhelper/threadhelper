// Size of the small timeline update
export const update_size = 200;
// nr of search results (and idle tweets) fetched
export const n_tweets_results = 20;
// Size of each batch of queue work
export const queue_load = 2000;
// nr of tweets rendered in display pre-api fetch
export const pre_render_n = 5;
//time between full timeline scrapes
const aWeek = 1000 * 60 * 60 * 24 * 7;
const threeDays = 1000 * 60 * 60 * 24 * 3;
export const timeline_scrape_interval = threeDays;
