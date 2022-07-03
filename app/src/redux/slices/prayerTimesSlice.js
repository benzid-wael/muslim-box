/*
* @flow
*/

import type { GeoCoordinates, PrayerTime } from "@src/types";

import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";

import { getPrayerTimes } from "@src/PrayerTimes";

type State = $ReadOnly<{
  timestamp: number,
  day: string,
  prayers: Array<PrayerTime>,
  current?: PrayerTime,
  next?: PrayerTime,
  times: Array<PrayerTime>,
  currentTime?: PrayerTime,
}>;

const initialState: State = {
  /*
  * This is used to for e reasons so far:
  * - highlight last time prayer time was updated: setPrayerTimes / updateCurrentPrayer
  * - update time shown in the digital clock
  */
  timestamp: 0,
  // used to ensure that we recompute prayer times every day
  day: "",
  prayers: [],
  times: [],
};

const DayFormat = "D-MM-YYYY";

const slice: any = createSlice({
  name: "prayerTimes",
  initialState,
  reducers: {
    setPrayerTimes: (state, {payload}) => {
      return {
        ...state,
        timestamp: moment().unix(),
        day: moment().format(DayFormat),
        prayers: payload.filter(pt => !pt.internal),
        times: payload,
      };
    },
    updateCurrentPrayer: (state) => {
      let currentIdx = -1
      let current: PrayerTime
      let next: PrayerTime
      let currentTime: PrayerTime
      const now = moment();

      for(var i=0; i < state.prayers.length - 1; i++) {
        const p = state.prayers[i]
        const start = moment.unix(p.start)
        const end = moment.unix(p.end)
        if(!current && now > start && now < end) {
          current = p
          next = state.prayers[i + 1]
          break
        }
      }

      state.times.map(p => {
        const start = moment.unix(p.start)
        const end = moment.unix(p.end)
        if(!currentTime && now > start && now < end) {
          currentTime = p
        }
      })

      return {
        ...state,
        timestamp: moment().unix(),
        day: moment().format(DayFormat),
        current,
        next,
        currentTime,
      }
    },
  }
});


// Extract the action creators object and the reducer
const { actions, reducer } = slice;
// Extract and export each action creator by name
export const { tick, setPrayerTimes, updateCurrentPrayer } = actions;

export const computePrayerTimes = (position: GeoCoordinates): any => (dispatch: any) => {
  const date = new Date(Date.now());
  const prayerTimes = getPrayerTimes(position, date);
  dispatch(setPrayerTimes(prayerTimes));
}

export const updatePrayerTimes = (): any => (dispatch: any) => {
  console.log(`⏳ updatePrayerTimes`)
  dispatch(updateCurrentPrayer());
}

export default reducer;
