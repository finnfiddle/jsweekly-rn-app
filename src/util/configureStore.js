import { createStore, combineReducers } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage';

export const ADD_ISSUE = 'ADD_ISSUE';
export const ADD_ARTICLE = 'ADD_ARTICLE';
export const COUNT_ISSUES = 'COUNT_ISSUES';
export const UNSCRAPEABLE_ISSUE = 'UNSCRAPEABLE_ISSUE';

const rootReducer = combineReducers({
  totalIssues: (state = 'Y', action) => {
    switch(action.type) {
      case COUNT_ISSUES:
        return action.payload;
      default:
        return state;
    }
  },
  unscrapeableIssues: (state = [], action) => {
    switch(action.type) {
      case UNSCRAPEABLE_ISSUE:
        return state.includes(action.payload) ? state : state.concat(action.payload);
      default:
        return state;
    }
  },
  latestIssueAdded: (state = 'X', action) => action.type === ADD_ISSUE ?
    (state === 'X' ? 1 : state + 1) : 
    state,
  issues: (state = [], action) => {
    switch(action.type) {
      case ADD_ISSUE: {
        return action.payload ? 
          state.concat(action.payload).sort((a, b) => b.id - a.id) :
          state;
      }
    }
    return state; 
  },
  articles: (state = [], action) => {
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

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export default () => {
  let store = createStore(persistedReducer, undefined)
  let persistor = persistStore(store)
  return { store, persistor }
}