import _ from 'lodash';
import Actions from './actionTypes';
import { ITweetsState, ITweetAction } from '../types';

const initialState: ITweetsState = {
  loading: false,
  tweets: {},
  tweetIds: [],
  newestTweetId: null,
  oldestTweetId: null,
};

const handlePromiseLoadTweets = (state: ITweetsState) => ({
  ...state,
  loading: true,
});

const handleResolveLoadTweets = (state: ITweetsState, action: ITweetAction) => {
  const { tweets, tweetIds, params } = action.payload;
  const newTweets = { ...state.tweets, ...tweets };
  let newTweetIds = [];
  if (params?.afterId) {
    newTweetIds = [...tweetIds, ...state.tweetIds, ];
  } else {
    newTweetIds = [...state.tweetIds, ...tweetIds];
  }

  if (tweetIds.some(tId => _.has(state.tweets, tId))) {
    newTweetIds = _.uniq(newTweetIds);
  }

  return {
    ...state,
    tweets: newTweets,
    tweetIds: newTweetIds,
    newestTweetId: _.first(newTweetIds),
    oldestTweetId: _.last(newTweetIds),
    loading: false,
  };
};

const handleRejectLoadTweets = (state: ITweetsState) => ({
  ...state,
  loading: false,
});

const tweetsReducer = (state = initialState, action: ITweetAction) => {
  switch (action.type) {
    case Actions.PROMISE_LOAD_TWEETS:
      return handlePromiseLoadTweets(state);
    case Actions.RESOLVE_LOAD_TWEETS:
      return handleResolveLoadTweets(state, action);
    case Actions.REJECT_LOAD_TWEETS:
      return handleRejectLoadTweets(state);
    default:
      return state;
  }
};

export default tweetsReducer;
