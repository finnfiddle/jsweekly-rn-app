import { createStore, combineReducers } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage';
import initialState from '../../data/initialState.json';

export const ADD_ISSUE = 'ADD_ISSUE';
export const ADD_ARTICLE = 'ADD_ARTICLE';
export const COUNT_ISSUES = 'COUNT_ISSUES';
export const UNSCRAPEABLE_ISSUE = 'UNSCRAPEABLE_ISSUE';

export const rootReducer = combineReducers({
  totalIssues: (state = initialState.totalIssues, action) => {
    switch(action.type) {
      case COUNT_ISSUES:
        return action.payload;
      default:
        return state;
    }
  },
  unscrapeableIssues: (state = initialState.unscrapeableIssues, action) => {
    switch(action.type) {
      case UNSCRAPEABLE_ISSUE:
        return state.includes(action.payload) ? state : state.concat(action.payload);
      default:
        return state;
    }
  },
  latestIssueAdded: (state = initialState.latestIssueAdded, action) => action.type === ADD_ISSUE ?
    (state === 'X' ? 1 : state + 1) : 
    state,
  issues: (state = initialState.issues, action) => {
    switch(action.type) {
      case ADD_ISSUE: {
        return action.payload ? 
          state.concat(action.payload).sort((a, b) => b.id - a.id) :
          state;
      }
    }
    return state; 
  },
  articles: (state = initialState.articles, action) => {
    switch(action.type) {
      case ADD_ARTICLE: {
        return state.filter(({ href }) => href === action.payload.href).length ?
          state :
          state.concat(action.payload);
      }
    }
    return state;
  }
});

export default () => {
  const persistConfig = {
    key: 'root',
    storage,
  };
  
  const persistedReducer = persistReducer(persistConfig, rootReducer);
  let store = createStore(persistedReducer, undefined);
  let persistor = persistStore(store, null);
  return { store, persistor };
}