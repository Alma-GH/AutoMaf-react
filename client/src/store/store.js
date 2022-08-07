
import {composeWithDevTools} from "redux-devtools-extension";
import {createStore, combineReducers} from "redux";
import {testReducer} from "./reducers/testReducer";


const rootReducers = combineReducers({
  test: testReducer,
})

export const store = createStore(rootReducers, composeWithDevTools())