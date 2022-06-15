import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import undoable from "easy-redux-undo";

import homeReducer from "./components/home/homeSlice";
import counterReducer from "./components/counter/counterSlice";
import complexReducer from "./components/complex/complexSlice";
import configReducer from "./slices/configSlice";

const rootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    config: configReducer,
    home: homeReducer,
    undoable: undoable(
      combineReducers({
        counter: counterReducer,
        complex: complexReducer
      })
    )
  });

export default rootReducer;
