import os
import tweepy

auth = tweepy.OAuthHandler(
    os.environ.get("consumer_key"), os.environ.get("consumer_secret")
)
auth.set_access_token(
    os.environ.get("access_token"), os.environ.get("access_token_secret")
)

api = tweepy.API(auth)

public_tweets = api.home_timeline()
for tweet in public_tweets:
    print(tweet.text)
