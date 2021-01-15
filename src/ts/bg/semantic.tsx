/* For interacting with semantic search */
import { Status as Tweet } from 'twitter-d';
import { User } from 'twitter-d';
import { fetchInit } from '../types/types'
import { getData, setData, makeOnStorageChanged } from '../utils/dutils';
import * as R from 'ramda';
import { __, curry, pipe, andThen, map, filter, reduce, tap, apply, tryCatch, otherwise } from 'ramda'; // Function
import { prop, propEq, propSatisfies, path, pathEq, hasPath, assoc, assocPath, values, mergeLeft, mergeDeepLeft, keys, lens, lensProp, lensPath, pick, project, set, length, indexBy } from 'ramda'; // Object
import { head, tail, take, isEmpty, any, all, includes, last, dropWhile, dropLastWhile, difference, append, fromPairs, forEach, nth, pluck, reverse, uniq, slice } from 'ramda'; // List
import { equals, ifElse, when, both, either, isNil, is, defaultTo, and, or, not, T, F, gt, lt, gte, lte, max, min, sort, sortBy, split, trim, multiply } from 'ramda'; // Logic, Type, Relation, String, Math
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
    console.log('[DEBUG] jsonFetch ', {url, json})
    return fetch(url, {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(json),
    })
    .then(response => {
        // console.log('[DEBUG] jsonFetch response' , {body:response.body})
        const x = response.json()
        return x
    })
    .then(data => {
        console.log('jsonFetch Success:', data);
        return data
    })
    .catch((error) => {
        console.error('Error:', {error});
        return {}
    });
}

export const reqSemanticSearch = (query:string) => jsonFetch('http://localhost:5000/search', {"query": query})

export const reqSemIndexTweets = (tweets:thTweet[]) => jsonFetch('http://localhost:5000/makeIndex', {'tweets': tweets}) //put tweets into semantic index


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

export const doSemanticSearch = async (query:string): Promise<string[]>=>{
    return pipe(
        reqSemanticSearch, 
        andThen(pipe(
            prop('res'),
            values, 
            // map(pipe<object, string[], string>(keys, nth(0)))
            ))
        )(query)
}