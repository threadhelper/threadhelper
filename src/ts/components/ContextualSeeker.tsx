import { Fragment, h } from 'preact';
import { useContext, useEffect } from 'preact/hooks';
import {
  curry,
  defaultTo,
  filter,
  isEmpty,
  isNil,
  map,
  nth,
  pipe,
  prop,
  propEq,
  reverse,
  sortBy,
  trim,
} from 'ramda';
import { apiSearchToTweet } from '../bg/tweetImporter';
import { searchAPI, tweetLookupQuery } from '../bg/twitterScout';
import { getRepliedToText } from '../domInterface/wutils';
import { rpcBg, setStg } from '../stg/dutils';
import { inspect, isExist } from '../utils/putils';
import {
  AuthContext,
  ContextualResults,
  FeedDisplayMode,
} from './ThreadHelper';
import { useCurrentTwitterPage } from './TtReader';

export function ContextualSeeker() {
  const auth = useContext(AuthContext);
  const currentPage = useCurrentTwitterPage();
  const { feedDisplayMode, dispatchFeedDisplayMode } = useContext(
    FeedDisplayMode
  );
  const { contextualResults, setContextualResults } = useContext(
    ContextualResults
  );

  useEffect(() => {
    const contextualSearch = async () => {
      console.log('[DEBUG] ContextualSeeker > Page', { currentPage, auth });
      if (isNil(currentPage) || isNil(auth)) return;

      switch (prop('pageType', currentPage)) {
        case 'showTweet':
          if (!isNil(auth)) {
            const results = await showTweetContext(
              dispatchFeedDisplayMode,
              currentPage.tweetId,
              auth
            );
            setContextualResults(results);
          }
          break;
        case 'compose':
          const textRepliedTo = getRepliedToText();
          const isReply = !isNil(textRepliedTo);
          if (isReply) {
            const results = await submitContextSearch(
              dispatchFeedDisplayMode,
              textRepliedTo
            );
            setContextualResults(results);
          }
          break;
        case 'intentReply':
          const _textRepliedTo = getRepliedToText();
          const hasText = isExist(_textRepliedTo);
          console.log(
            'ContextualSeeker page: Compose' +
              ` ${defaultTo('', _textRepliedTo)}`
          );
          if (hasText) {
            const _results = await submitContextSearch(
              dispatchFeedDisplayMode,
              _textRepliedTo
            );
            setContextualResults(_results);
          } else {
            if (!isNil(auth)) {
              const _results = await showTweetContext(
                dispatchFeedDisplayMode,
                currentPage.tweetId,
                auth
              );
              setContextualResults(_results);
            }
          }
          break;
        default:
          console.log('ContextualSeeker handleContext', { currentPage });
          setStg('context_results', []);
          setStg('contextQuery', '');
          dispatchFeedDisplayMode({
            action: 'emptyContextSearch',
            tweets: [],
          });
      }
    };
    contextualSearch();
    return () => {};
  }, [currentPage, auth]);
  return <></>;
}

const reqContextSearch = async (query) => {
  // msgBG({ type: 'search', query });
  setStg('contextQuery', query);
  const searchResults = await rpcBg('contextualSeek', { query });
  return searchResults;
};

const lookupTweetText = curry(async (auth, id) => {
  return tweetLookupQuery(auth, [id]).then(
    pipe(nth(0), prop('full_text'), defaultTo(''))
  );
});

const submitContextSearch = curry(async (dispatch, query: string) => {
  const q = defaultTo('', query);
  if (isEmpty(trimNewlines(q))) {
    dispatch({
      action: 'emptyContextSearch',
      tweets: [],
    });
  } else {
    dispatch({
      action: 'submitContextSearch',
      tweets: [],
    });
    return await reqContextSearch(q);
  }
});

const QtApiSearch = curry(async (auth, tweetId) => {
  return await searchAPI(auth, 'quoted_tweet_id:' + tweetId)
    .then(({ users, tweets }) =>
      pipe(
        () => tweets,
        filter(propEq('quoted_status_id_str', tweetId)),
        sortBy(prop('favorite_count')),
        reverse,
        inspect('qt req'),
        map(apiSearchToTweet),
        map((tweet) => {
          return { tweet };
        }),
        defaultTo([])
      )()
    )
    .catch((e) => {
      console.error('QtApiSearch', { e, auth, tweetId });
    });
});

const showTweetContext = curry(async (dispatch, tweetId, auth) => {
  const qts = await QtApiSearch(auth, tweetId);
  if (!isEmpty(qts) && !isNil(qts)) {
    // setStg('qts', qts);
    dispatch({
      action: 'gotQts',
      tweets: [],
    });
    return qts;
  } else {
    const query = await lookupTweetText(auth, tweetId);
    return await submitContextSearch(dispatch, query);
  }
});

const trimNewlines = (str) =>
  trim(str).replace(/(^\s*(?!.+)\n+)|(\n+\s+(?!.+)$)/g, '');
