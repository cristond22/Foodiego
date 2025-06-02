import { createStore } from "redux";
import rootReducer from "./reducers"; // index.js inside reducers folder

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
