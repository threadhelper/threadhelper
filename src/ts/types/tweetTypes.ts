
export interface thImg {
    current_text:string,
    url:string,
}
export interface thUrl {
    current_text:string,
    display:string,
    expanded:string,
}

export type TweetId = string;
export interface thTweet { 
    account: string,
    has_media?: boolean; 
    has_quote?: boolean, 
    id: TweetId; 
    is_bookmark: boolean,
    is_quote_up: false,
    media: (thImg | any)[],
    mentions: string[]; 
    name: string; 
    profile_image?: string; 
    quote?: thTweet|null;
    reply_to: string|null; 
    retweeted: boolean,
    text: string; 
    time?: string; 
    urls?: thUrl[] | any[];
    username: string; 
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