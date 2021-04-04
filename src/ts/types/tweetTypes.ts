import { Status, User } from 'twitter-d';

export interface StatusObj {
  [id: string]: Status;
}
export interface UserObj {
  [id: string]: User;
}

interface ScoutUserAndTweets {
  users: UserObj;
  tweets: Status[];
}

export interface ArchTweet extends Status {}
export interface thImg {
  current_text: string;
  url: string;
}
export interface thUrl {
  current_text: string;
  display: string;
  expanded: string;
}

export type UserId = string;
export type TweetId = string;

// 0.3.6 we add user_id
export interface thTweet {
  id: TweetId;
  text: string;
  username: string;
  name: string;
  media: (thImg | any)[];
  mentions: string[];
  user_id: string;
  account?: string;
  has_media?: boolean;
  has_quote?: boolean;
  orig_id?: TweetId; // in retweets, orig id is the id of the retweet, and id is the id of the tweet retweeted
  is_bookmark?: boolean;
  is_quote_up?: boolean;
  profile_image?: string;
  quote?: thTweet | null;
  reply_to: string | null;
  retweeted?: boolean;
  favorited?: boolean;
  time?: number;
  urls?: thUrl[] | any[];
  reply_count?: number;
  retweet_count?: number;
  quote_count?: number;
  favorite_count?: number;
  conversation_id?: string;
}
export interface thTweet03 {
  id: TweetId;
  text: string;
  username: string;
  name: string;
  media: (thImg | any)[];
  mentions: string[];
  account?: string;
  has_media?: boolean;
  has_quote?: boolean;
  orig_id?: TweetId; // in retweets, orig id is the id of the retweet, and id is the id of the tweet retweeted
  is_bookmark?: boolean;
  is_quote_up?: boolean;
  profile_image?: string;
  quote?: thTweet | null;
  reply_to: string | null;
  retweeted?: boolean;
  favorited?: boolean;
  time?: number;
  urls?: thUrl[] | any[];
  reply_count?: number;
  retweet_count?: number;
  quote_count?: number;
  favorite_count?: number;
  conversation_id?: string;
}

export interface thTweet02 {
  id: TweetId;
  text: string;
  username: string;
  name: string;
  media: (thImg | any)[];
  mentions: string[];
  account?: string;
  has_media?: boolean;
  has_quote?: boolean;
  // orig_id?: TweetId;
  is_bookmark?: boolean;
  is_quote_up?: boolean;
  profile_image?: string;
  quote?: thTweet | null;
  reply_to: string | null;
  retweeted?: boolean;
  // favorited?: boolean;
  time?: number;
  urls?: thUrl[] | any[];
  reply_count?: number;
  retweet_count?: number;
  // quote_count?: number;
  // favorite_count?: number;
  // conversation_id?: string;
}

export interface IndexTweet {
  id: TweetId;
  text: string;
  name: string;
  username: string;
  reply_to: string;
  mentions: string;
  is_bookmark: boolean;
  account: string;
}
