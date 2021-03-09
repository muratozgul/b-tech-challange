import Actions from './actionTypes';

export const promiseLoadTweets = (payload = {}) => ({
  type: Actions.PROMISE_LOAD_TWEETS,
  payload,
});

export const resolveLoadTweets = ({ tweets, tweetIds, params }) => ({
  type: Actions.RESOLVE_LOAD_TWEETS,
  payload: { tweets, tweetIds, params },
});

export const rejectLoadTweets = (error, params) => ({
  type: Actions.REJECT_LOAD_TWEETS,
  payload: { params },
  error: { message: error.message },
});
