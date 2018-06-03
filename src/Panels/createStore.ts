import { applyMiddleware, combineReducers, compose, createStore, Store } from 'redux';
import logger from 'redux-logger';
import promiseMiddleware from 'redux-promise-middleware';

// Import Reducers
import { panels } from './Panel';

export default function configureStore(initialState?: any): Store {
  const reducers = combineReducers({
    panels,
  });

  const isDevelopment = process.env.NODE_ENV === 'development';

  const middleware = isDevelopment ? [
    logger,
    promiseMiddleware(),
  ] : [
    promiseMiddleware(),
  ];

  // In development, use the browser's Redux dev tools extension if installed
  // const enhancers = [];
  // if (isDevelopment && typeof window !== 'undefined' && window.devToolsExtension) {
  //   enhancers.push(window.devToolsExtension());
  // }

  if (initialState) {
    return createStore(
      reducers,
      initialState,
      compose(applyMiddleware(...middleware)),
    );
  }

  return createStore(
    reducers,
    compose(applyMiddleware(...middleware)),
  );
}
