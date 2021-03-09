export interface ITweet {
  id: number | string
  image: string
  text: string
  username: string
  timeStamp: number
}

export interface IApiParams {
  count?: number,
  beforeId?: number | string,
  afterId?: number | string,
}

export interface IReduxAction {
  type: string,
  payload?: object,
  error?: { message: string }
}

export interface ITweetAction extends IReduxAction {
  payload: {
    beforeId?: number | string,
    afterId?: number | string,
    tweetIds?: string[],
    tweets?: { [id: string]: ITweet },
    params?: IApiParams,
  }
}

export interface ITweetsState {
  loading: boolean,
  tweets: { [id: string]: ITweet },
  tweetIds: string[],
  newestTweetId: number | string,
  oldestTweetId: number | string,
}
