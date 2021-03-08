import { h, Fragment, render, Component } from 'preact';
import {
  useState,
  useRef,
  useEffect,
  useContext,
  useCallback,
} from 'preact/hooks';
import { csEvent } from '../utils/ga';
import { getActiveComposer } from '../utils/wutils';
import { thTweet } from '../types/tweetTypes';
import ReplyIcon from '../../images/reply.svg';
import RetweetIcon from '../../images/retweet.svg';
import LikeIcon from '../../images/like.svg';
import FullLikeIcon from '../../images/like_full.svg';
import PencilIcon from '../../images/pencil.svg';
import LinkIcon from '../../images/link.svg';
import { andThen, any, defaultTo, isNil, last, pipe, prop } from 'ramda';
import {
  sendLikeRequest,
  sendRetweetRequest,
  sendUnlikeRequest,
  sendUnretweetRequest,
  fetchStatus,
} from '../bg/twitterScout';
import { useStorage } from '../hooks/useStorage';
import { AuthContext } from './ThreadHelper';
import { apiSearchToTweet } from '../bg/tweetImporter';
import { inspect } from '../utils/putils';
import { DropdownMenu } from './Dropdown';
import { Media } from './Media';
import defaultProfilePic from '../../images/defaultProfilePic.png';
import Tooltip from './Tooltip';

const isProduction = process.env.NODE_ENV != 'development';

const getUserUrl = (username: string) => `https://twitter.com/${username}`;
const getTweetUrl = (tweet: thTweet) =>
  getUserUrl(tweet.username) + `/status/${tweet.id}`;

const formatNumber = function (number) {
  if (number >= 1000000) {
    return (number / 1000000).toPrecision(2) + 'M';
  }
  if (number >= 10000) {
    return Math.floor(number / 1000) + 'K';
  } else if (number >= 1000) {
    return (number / 1000).toPrecision(2) + 'K';
  } else {
    return number.toString();
  }
};

const countReplies = (t) => t.reply_count ?? 0;
export const ReplyAction = ({ tweet }) => {
  const [count, setCount] = useState(countReplies(tweet));
  const [hover, setHover] = useState(false);

  useEffect(() => {
    setCount(countReplies(tweet));
    return () => {};
  }, []);

  return (
    <div
      class="flex cursor-pointer"
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div class="relative w-5 h-5 inline-flex items-center justify-center">
        <div
          class={`absolute inset-0 rounded-full -m-2 transition-colors duration-200 ${
            hover ? 'bg-twitterBlue bg-opacity-10 ' : ''
          }`}
        ></div>
        <ReplyIcon class={`fill-current ${hover ? 'text-twitterBlue' : ''}`} />
      </div>
      <span
        class="px-3 h-5 items-center inline-flex"
        style={{ minWidth: 'calc(1em + 24px)' }}
      >
        {count > 0 ? formatNumber(count) : ''}
      </span>
    </div>
  );
};

const countRts = (t) =>
  (t.retweet_count ?? (t.retweeted ? 1 : 0)) + (t.quote_count ?? 0);
const RetweetAction = ({ tweet }: { tweet: thTweet }) => {
  const [active, setActive] = useState(tweet.retweeted ?? false);
  const [count, setCount] = useState(countRts(tweet));
  const [id, setId] = useState(tweet.id);
  const auth = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    setActive(tweet.retweeted ?? false);
    setCount(countRts(tweet));
    setId(tweet.id);
    return () => {};
  }, []);

  const onFunc = () => {
    setActive(true);
    setCount(count + 1);
    sendRetweetRequest(auth, id);
  };
  const offFunc = () => {
    setActive(false);
    setCount(count - 1);
    sendUnretweetRequest(auth, id);
  };

  var quoteTweet = useCallback(
    function () {
      window.open(
        `https://twitter.com/intent/tweet?url=https://twitter.com/${tweet.username}/status/${tweet.id}`,
        '_blank'
      );
    },
    [tweet]
  );

  const makeRtItems = () => {
    return [
      // {id: 'Load Archive', leftIcon: <GearIcon />, effect: ()=>{}},
      {
        id: active ? 'Undo Retweet' : 'Retweet',
        leftIcon: <RetweetIcon class="mr-3 w-4 h-4 fill-current" />,
        effect: active ? offFunc : onFunc,
      },
      {
        id: 'Quote Tweet',
        leftIcon: <PencilIcon class="mr-3 w-4 h-4 fill-current" />,
        effect: quoteTweet,
      },
    ];
  };

  return (
    <div
      class="flex cursor-pointer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        class={`relative w-5 h-5 inline-flex items-center ${
          active || hover ? 'text-green-600 ' : ''
        }`}
        // onClick={active ? offFunc : onFunc}
        onClick={() => {
          setOpen(!open);
        }}
      >
        <div
          class={`absolute inset-0 rounded-full -m-2 transition-colors duration-200 ${
            hover ? 'bg-green-600 bg-opacity-10 ' : ''
          }`}
        ></div>
        <RetweetIcon class="fill-current" />
      </div>
      <span
        class={`px-3 h-5 items-center inline-flex ${
          active || hover ? 'text-green-600 ' : ''
        }`}
        style={{ minWidth: 'calc(1em + 24px)' }}
      >
        {count > 0 ? formatNumber(count) : ''}
      </span>
      {open && (
        <DropdownMenu
          name={'rt-button'}
          componentItems={[]}
          filterItems={[]}
          items={makeRtItems()}
          debugItems={[]}
          closeMenu={() => setOpen(false)}
          itemClickClose={true}
        />
      )}
    </div>
  );
};

const countFavs = (t) => t.favorite_count ?? (t.favorited ? 1 : 0);
const LikeAction = ({ tweet }) => {
  const [active, setActive] = useState(tweet.favorited ?? false);
  const [count, setCount] = useState(countFavs(tweet));
  const [id, setId] = useState(count);
  const [hover, setHover] = useState(false);
  const auth = useContext(AuthContext);

  useEffect(() => {
    setActive(tweet.favorited ?? false);
    setCount(countFavs(tweet));
    setId(tweet.id);
    return () => {};
  }, []);

  const onFunc = (e) => {
    setActive(true);
    setCount(count + 1);
    sendLikeRequest(auth, id);
  };
  const offFunc = (e) => {
    setActive(false);
    setCount(count - 1);
    sendUnlikeRequest(auth, id);
  };

  return (
    <div
      class="flex cursor-pointer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        class={
          (active ? `text-red-700 ` : ``) +
          'w-5 h-5 inline-flex items-center relative'
        }
        onClick={active ? offFunc : onFunc}
      >
        <div
          class={`absolute inset-0 rounded-full -m-2 transition-colors duration-200 ${
            hover ? 'bg-red-600 bg-opacity-10 ' : ''
          }`}
        ></div>
        {active ? (
          <FullLikeIcon class="fill-current" />
        ) : (
          <LikeIcon class={`fill-current ${hover ? 'text-red-700' : ''}`} />
        )}
      </div>
      <span
        class={`px-3 h-5 items-center inline-flex ${
          active || hover ? `text-red-700 ` : ``
        }`}
        style={{ minWidth: 'calc(1em + 24px)' }}
      >
        {count > 0 ? formatNumber(count) : ''}
      </span>
    </div>
  );
};

export const CopyAction = ({
  url,
  setCopyText,
}: {
  url: string | null;
  setCopyText;
}) => {
  const linkField = useRef(null);
  const [copied, setCopied] = useState(false);
  const [hover, setHover] = useState(false);

  let copyUrl = function (e: Event) {
    if (isNil(url)) return;
    csEvent('User', 'Clicked tweet', '');

    const input = getActiveComposer();
    linkField.current.style.display = 'flex';
    linkField.current.select();
    document.execCommand('copy');
    linkField.current.style.display = 'none';

    selectComposer(input);
    setCopied(true);
    setTimeout(function () {
      setCopied(false);
    }, 1000);
    return;
  };

  return (
    <div
      class="flex cursor-pointer"
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <textarea class="th-link hidden" ref={linkField}>
        {url}
      </textarea>

      <Tooltip content={'Copy URL'} direction="bottom">
        <div
          class="relative w-5 h-5 inline-flex items-center justify-center"
          onClick={copyUrl}
        >
          <div
            class={
              'absolute inset-0 rounded-full -m-2 transition-colors duration-2000 ' +
              (hover && !isNil(url) ? 'bg-blue-500 bg-opacity-10 ' : '') +
              (isNil(url) ? 'text-red-200 ' : '')
            }
          ></div>
          <LinkIcon />
        </div>
      </Tooltip>
      <span
        class="px-3 h-5 inline-flex"
        style={{ minWidth: 'calc(1em + 24px)' }}
      >
        {copied ? 'copied!' : null}
      </span>
    </div>
  );
};

export function Tweet({ tweet, score }: { tweet: thTweet; score?: number }) {
  // placeholder is just text
  // const [auth, setAuth] = useStorage('auth', null);
  const [copyText, setCopyText] = useState('copy');
  const [_tweet, setTweet] = useState(tweet);
  const [profilePicSrc, setProfilePicSrc] = useState(() => {
    return prop('profile_image', tweet) ?? defaultProfilePic;
  });
  // const [favCount, setFavCount] = useState(0);
  // const [replyCount, setReplyCount] = useState(0);
  // const [rtCount, setRtCount] = useState(0);
  // const [rtActive, setRtActive] = useState(false);
  // const [favActive, setFavActive] = useState(false);

  const setCounts = (t) => {
    // setReplyCount(t.reply_count ?? 0);
    // setRtCount(
    //   (t.retweet_count ?? (t.retweeted ? 1 : 0)) + (t.quote_count ?? 0)
    // );
    // setFavCount(t.favorite_count ?? (t.favorited ? 1 : 0));
    // setRtActive(t.retweeted ?? false);
    // setFavActive(t.favorited ?? false);
  };

  useEffect(() => {
    setCounts(_tweet);
    return () => {};
  }, [_tweet]);

  let reply_text = '';
  try {
    reply_text = getReplyText(tweet.reply_to, tweet.mentions);
  } catch (e) {
    console.log('ERROR [getReplyText]', { e, tweet });
  }

  const reformattedText = (tweet) =>
    reformatText(
      tweet.text,
      tweet.reply_to,
      tweet.mentions,
      tweet.urls,
      tweet.media
    );
  const maybeMedia = (tweet) =>
    tweet.has_media ? renderMedia(tweet.media) : '';
  const maybeQuote = (tweet) =>
    tweet.has_quote ? renderQuote(tweet.quote, tweet.has_media) : '';

  return (
    <div class="px-4 py-3 border-b border-borderBg transition-colors duration-200 cursor-pointer hover:bg-white hover:bg-opacity-5">
      <div class="flex">
        <div class="mr-3">
          <div class="relative w-9 h-9 rounded-full transition-colors duration-200">
            <a href={getUserUrl(tweet.username)}>
              <div class="w-full h-full absolute rounded-full inset-0 transition-colors duration-200 hover:bg-black hover:bg-opacity-15"></div>
              <img
                class="rounded-full"
                src={profilePicSrc}
                onError={() => setProfilePicSrc(defaultProfilePic)}
              />
            </a>
          </div>
        </div>
        <div class="flex-grow">
          <div>
            <div class="flex flex-shrink font-medium text-lsm">
              <div class="flex-initial text-lsm font-bold overflow-ellipsis whitespace-nowrap overflow-hidden">
                <a href={getUserUrl(tweet.username)}>{tweet.name}</a>
              </div>
              <div class="flex-initial ml-1 text-neutral overflow-ellipsis whitespace-nowrap overflow-hidden">
                <a href={getUserUrl(tweet.username)}>@{tweet.username}</a>
              </div>
              <div class="px-1 text-neutral">·</div>
              <div class="flex-none text-neutral">
                <a class="hover:underline" href={getTweetUrl(tweet)}>
                  {getTimeDiff(tweet.time)}
                </a>
              </div>
            </div>
            <div class="ml-1 text-neutral overflow-ellipsis whitespace-nowrap overflow-hidden">
              <a href={getUserUrl(tweet.username)}>@{tweet.username}</a>
            </div>
            <div class="px-1 text-neutral flex-shrink-0">·</div>
            <div class="text-neutral hover:underline flex-shrink-0">
              <a href={getTweetUrl(tweet)}>{getTimeDiff(tweet.time)}</a>
            </div>
          </div>
          <div class="mt-3 max-w-md	flex justify-between text-neutral">
            <div class="flex">
              <ReplyAction tweet={_tweet} />
            </div>
            <div class="flex">
              <RetweetAction tweet={_tweet} />
            </div>
            <div class="flex">
              <LikeAction tweet={_tweet} />
            </div>
            <div class="flex">
              <CopyAction
                url={
                  isNil(prop('unavailable', tweet)) ? getTweetUrl(tweet) : null
                }
                setCopyText={setCopyText}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const UnavailableHover = ({ score }) => {
  return (
    <div class="absolute inset-0 rounded-sm bg-opacity-0 flex items-center justify-center bg-gray-200 hover:cursor-default hover:bg-opacity-70">
      <div class="flex flex-col items-center z-20 text-base font-medium bg-transparent">
        <div class=" text-red-700 ">{'tweet unavailable'}</div>
        {isNil(score) || process.env.NODE_ENV != 'development' ? null : (
          <div class=" text-green-400">{`score: ${score.toFixed(2)}`}</div>
        )}
      </div>
    </div>
  );
};

const selectComposer = (input: HTMLElement) => {
  if (isNil(input)) return;
  input.focus();
  // https://stackoverflow.com/questions/24115860/set-caret-position-at-a-specific-position-in-contenteditable-div
  // There will be multiple spans if multiple lines, so we get the last one to set caret to the end of the last line.
  // let _span = $(input).find('span[data-text=true]').last()[0];
  let _span = last(Array.from(input.querySelectorAll('span[data-text=true]')));
  // If there's some writing on it, otherwise _span will be undefined
  if (_span != null) {
    var text = _span.firstChild;
    var range = document.createRange();
    range.setStart(text, text.length);
    range.setEnd(text, text.length);
    var sel = window.getSelection();
    sel?.removeAllRanges()!; //ts override of "Object is possibly 'null'."
    sel?.addRange(range)!; //ts override of "Object is possibly 'null'."
  }
};

const shortMonths = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export function getTimeDiff(time: string | number | Date) {
  let now = new Date();
  let timeDate = new Date(time);
  let diff = now.getTime() - timeDate.getTime(); // In milliseconds.
  let seconds = Math.floor(diff / 1000);
  if (seconds < 60) {
    return `${seconds}s`;
  }
  let mins = Math.floor(seconds / 60);
  if (mins < 60) {
    return `${mins}m`;
  }
  let hours = Math.floor(mins / 60);
  if (hours < 24) {
    return `${hours}h`;
  }
  let month = shortMonths[timeDate.getMonth()];
  let day = timeDate.getDate();
  let thisYear = new Date(now.getFullYear(), 0);
  return timeDate > thisYear
    ? `${month} ${day}`
    : `${month} ${day}, ${timeDate.getFullYear()}`;
}

function getReplyText(reply_to, mentions: string | any[]) {
  if (reply_to === null) {
    return '';
  } else if (mentions.length === 1 || mentions.length === 0) {
    return `Replying to @${reply_to}`;
  }

  // Count number of mentions that occur at the beginning of the tweet. Begin at -1 because mentions
  // will include reply_to.
  let numOthers = -1;
  let nextIndex = 0;
  for (var mention of mentions) {
    if (mention.indices[0] !== nextIndex) {
      break;
    }
    numOthers++;
    nextIndex = mention.indices[1] + 1;
  }
  let otherWord = numOthers === 1 ? 'other' : 'others';
  return `Replying to @${reply_to} and ${numOthers} ${otherWord}`;
}

function replaceBetween(
  originalString: string,
  start: number,
  end: number,
  replacement: string
) {
  return (
    originalString.substr(0, start) + replacement + originalString.substr(end)
  );
}

function reformatText(
  text,
  reply_to = null,
  _mentions = null,
  urls = null,
  media = null
) {
  const mentions = defaultTo([], _mentions);
  let ret = text;
  let charsRemoved = 0;
  // Cut out reply_to + any mentions at the beginning.
  if (reply_to !== null) {
    let nextIndex = 0;
    for (var mention of mentions) {
      if (mention.indices[0] !== nextIndex) {
        break;
      }
      // Plus one to get rid of the space between usernames.
      ret = replaceBetween(
        ret,
        mention.indices[0] - charsRemoved,
        mention.indices[1] - charsRemoved + 1,
        ''
      );
      charsRemoved += mention.indices[1] - mention.indices[0] + 1;
      nextIndex = mention.indices[1] + 1;
    }
  }
  if (urls !== null) {
    for (var url of urls) {
      if (url.expanded.includes('https://twitter.com')) {
        ret = ret.replace(url.current_text, '');
      } else {
        ret = ret.replace(url.current_text, url.display);
      }
    }
  }
  if (media !== null) {
    for (var m of media) {
      ret = ret.replace(m.current_text, '');
    }
  }

  return ret;
}

function renderMedia(media: string | any[], inQuote?: boolean) {
  //@miguel: I had to refactor this code, hope you understand why :)
  let images = Array.isArray(media) ? media : [{ url: media }];

  return <Media media={images} inQuote={inQuote} />;
}

function renderQuote(quote: thTweet, parent_has_media) {
  if (quote != null) {
    let timeDiff = getTimeDiff(quote.time);
    let replyText = getReplyText(quote.reply_to, quote.mentions);
    try {
      replyText = getReplyText(quote.reply_to, quote.mentions);
    } catch (e) {
      console.log('ERROR [getReplyText]', { e, quote });
    }
    let text = reformatText(
      quote.text,
      quote.reply_to,
      quote.mentions,
      null,
      quote.media
    );

    const media = quote.has_media ? renderMedia(quote.media, true) : null;

    const template = (
      <div class="mt-3 border border-borderBg rounded-2xl transition-colors duration-200 cursor-pointer hover:bg-white hover:bg-opacity-5">
        <div class="p-3 pb-1">
          <div class="flex">
            <div class="flex flex-shrink font-medium text-lsm items-center h-6">
              <div class="w-5 h-5 mr-2 flex items-center justify-center">
                <a href={getUserUrl(quote.username)}>
                  <img
                    class="rounded-full"
                    src={prop('profile_image', quote) ?? defaultProfilePic}
                  />
                </a>
              </div>
              <div class="flex-initial text-lsm font-bold overflow-ellipsis whitespace-nowrap overflow-hidden leading-none">
                <a href={getUserUrl(quote.username)}>{quote.name}</a>
              </div>
              <div class="flex-initial ml-1 text-neutral overflow-ellipsis whitespace-nowrap overflow-hidden leading-none">
                <a href={getUserUrl(quote.username)}>@{quote.username}</a>
              </div>
              <div class="px-1 text-neutral leading-none">·</div>
              <div class="flex-none text-neutral leading-none">
                <a class="hover:underline" href={getTweetUrl(quote)}>
                  {timeDiff}
                </a>
              </div>
            </div>
          </div>
          <div>
            <div class="text-neutral">{replyText}</div>
            {text}
          </div>
        </div>
        {media}
      </div>
    );

    return template;
  } else {
    let template = (
      <div class="th-quote th-unavailable">
        <div class="th-quote-content">
          <div class="th-quote-content-main">
            <div class="th-quote-content-main-text">
              This Tweet is unavailable.
            </div>
          </div>
        </div>
      </div>
    );
    return template;
  }
}
