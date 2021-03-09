import { useMemo } from 'react';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { createEpicMiddleware, combineEpics } from 'redux-observable';
import epics from './epics';
import tweetsReducer from './tweetsReducer';

let store;

const initStore = (preloadedState = {}) => {
  const reducers = combineReducers({ tweets: tweetsReducer });

  const epicMiddleware = createEpicMiddleware();
  const middlewares = [epicMiddleware];
  const isDevelopment = process?.env?.NODE_ENV !== 'production';

  let enhancer;
  if (isDevelopment) {
    const { composeWithDevTools } = require('redux-devtools-extension');
    const composeEnhancers = composeWithDevTools({});
    enhancer = composeEnhancers(applyMiddleware(...middlewares));
  }
  else {
    enhancer = applyMiddleware(...middlewares);
  }

  store = createStore(reducers, preloadedState, enhancer);
  epicMiddleware.run(combineEpics(epics));

  return store;
};

export const initializeStore = (preloadedState) => {
  let _store = store ?? initStore(preloadedState);

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = initStore({
      ...store.getState(),
      ...preloadedState,
    });
    // Reset the current store
    store = undefined;
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') {
    return _store;
  }
  // Create the store once in the client
  if (!store) {
    store = _store;
  }

  return _store;
}

export const useStore = (initialState) => {
  const store = useMemo(() => initializeStore(initialState), [initialState]);
  return store;
};
