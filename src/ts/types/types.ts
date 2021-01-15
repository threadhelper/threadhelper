// import { string } from "prop-types"

import { Observable, Property } from "kefir";


export interface curProp<T> extends Property<T,Error>{
    currentValue:(this:Observable<T,Error>)=>any;
}

export enum UrlModes{
    home, compose, notifications, explore, bookmarks, status, other
}
export interface UserInfo {
    name: string;
    screen_name: string,
    id: number,
    id_str: string,
    location: string,
    derived: any,
    url: string,
    description: string,
    protected:boolean,
    verified: boolean,
    followers_count: number,
    friends_count: number,
    listed_count: number,
    favourites_count: number,
    statuses_count: number,
    profile_banner_url: string,
    profile_image_url_https: string, 
    default_profile: boolean,
    default_profile_image: boolean,
    withheld_in_countries: string[],
    withheld_scope: string,
    // there's more
}

export interface Credentials {
    'authorization': string;
    'x-csrf-token': string;
    name?: string;
}

export interface fetchInit { 
    credentials: string; 
    headers: Credentials; 
}