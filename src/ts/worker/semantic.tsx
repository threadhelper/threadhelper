/* For interacting with semantic search */
import { andThen, pipe, prop, values } from 'ramda'; // Function
import { thTweet } from '../types/tweetTypes';

// export const jsonFetch = async (url:string, json:object): Promise<object> => {
//     console.log('[DEBUG] jsonFetch ', {url, json})
//     return fetch(url, {
//         method: 'POST', // or 'PUT'
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(json),
//     })
//     .then(response => {
//         return response.json()
//     })
//     .then(data => {
//         console.log('jsonFetch Success:', data);
//         return data
//     })
//     .catch((error) => {
//         console.error('Error:', {error});
//         return {}
//     });
// }

export const jsonFetch = async (url, json) => {
  console.log('[DEBUG] jsonFetch ', { url, json });
  return fetch(url, {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(json),
  })
    .then((response) => {
      // console.log('[DEBUG] jsonFetch response' , {body:response.body})
      const x = response.json();
      return x;
    })
    .then((data) => {
      console.log('jsonFetch Success:', data);
      return data;
    })
    .catch((error) => {
      console.error('Error:', { error });
      return {};
    });
};

export const reqSemanticSearch = (query: string) =>
  jsonFetch('http://localhost:5000/search', { query: query });

export const reqSemIndexTweets = (tweets: thTweet[]) =>
  jsonFetch('http://localhost:5000/makeIndex', { tweets: tweets }); //put tweets into semantic index

// export const reqSemanticSearch = async (query:string): Promise<object> => {
//     const data = JSON.stringify({"query": query});
//     return fetch('http://localhost:5000/search', {
//         method: 'POST', // or 'PUT'
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log('semanticSearch Success:', data);
//         return data
//     })
//     .catch((error) => {
//         console.error('Error:', error);
//         return {}
//     });
// }

export const doSemanticSearch = async (query: string): Promise<string[]> => {
  return pipe(reqSemanticSearch, andThen(pipe(prop('res'), values)))(query);
};
