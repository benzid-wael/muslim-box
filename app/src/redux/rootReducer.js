import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
// import undoable from "easy-redux-undo";

import configReducer from "./slices/configSlice";
import prayerTimesReducer from "./slices/prayerTimesSlice";
import slideReducer from "./slices/slideSlice";
import userReducer from "./slices/userSlice";

const rootReducer = (history) => (
  combineReducers({
    router: connectRouter(history),
    config: configReducer,
    prayerTimes: prayerTimesReducer,
    slide: slideReducer,
    user: userReducer,
  })
);

export default rootReducer;
