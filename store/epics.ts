import { combineEpics, ofType } from 'redux-observable';
import { map, filter, delay, concatMap, catchError } from 'rxjs/operators';
import { from, of } from 'rxjs';
import _ from 'lodash';
import Actions from './actionTypes';
import { resolveLoadTweets, rejectLoadTweets } from './actions';
import restClient from './api';
import { ITweetAction, IApiParams } from '../types';

const loadTweetsEpic = (action$, store$) => (
  action$.pipe(
    ofType(Actions.PROMISE_LOAD_TWEETS),
    concatMap((action: ITweetAction) => {
      const params: IApiParams = { count: 8 };
      if (action.payload?.beforeId != null) {
        params.beforeId = action.payload.beforeId;
      }
      else if (action.payload?.afterId != null) {
        params.afterId = action.payload.afterId;
      }
      const source = from(restClient.get('/api', { params }));
      return source.pipe(
        map(res => {
          const tweets = _.keyBy(res.data, 'id');
          const tweetIds = res.data.map(t => t.id);
          return resolveLoadTweets({ tweets, tweetIds, params });
        }),
        catchError(error => of(rejectLoadTweets(error, params))),
      );
    }),
    catchError(error => of(rejectLoadTweets(error, {}))),
  )
);

const loadEveryTwoSecondsEpic = (action$, store$) => (
  action$.pipe(
    ofType(Actions.RESOLVE_LOAD_TWEETS),
    filter((action: ITweetAction) => action.payload?.params?.beforeId == null),
    delay(10000),
    map(() => {
      const { newestTweetId } = store$.value.tweets;
      return {
        type: Actions.PROMISE_LOAD_TWEETS,
        payload: { afterId: newestTweetId },
      }
    }),
  )
);

const retryIfRequestFailedEpic = (action$, store$) => (
  action$.pipe(
    ofType(Actions.REJECT_LOAD_TWEETS),
    delay(2000),
    map((action: ITweetAction) => {
      return {
        type: Actions.PROMISE_LOAD_TWEETS,
        payload: { ...action.payload?.params },
      };
    }),
  )
);

export default combineEpics(
  loadTweetsEpic,
  loadEveryTwoSecondsEpic,
  retryIfRequestFailedEpic,
);
