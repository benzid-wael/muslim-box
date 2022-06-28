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
    // This will point to the 1st current time, this is useful to
    // select the exact sub portion of prayer time
    currentTime?: PrayerTime,
}>;

const initialState: State = {
    /*
    * This is used to for e reasons so far:
    *   - highlight last time prayer time was updated: setPrayerTimes / updateCurrentPrayer
    *   - update time shown in the digital clock
    */
    timestamp: 0,
    // used to ensure that we recompute prayer times every day
    day: "",
    prayers: [],
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
                prayers: payload,
            };
        },
        updateCurrentPrayer: (state) => {
            let currentIdx = -1
            let current: PrayerTime
            let currentTime: PrayerTime
            let next: PrayerTime
            const now = moment();

            state.prayers.map(p => {
                if(now > moment.unix(p.start)) {
                    currentIdx++
                }
                if(!currentTime && now > moment.unix(p.start) && now < moment.unix(p.end)) {
                    currentTime = p
                }
            })

            const lastIndex = state.prayers.length - 1
            // compute current prayer
            if (currentIdx > -1 && now > moment.unix(state.prayers[currentIdx].end)) {
                // we fall under a gap (no prayer at the time)
                // This will happen after sunrise
                //  as well as Isha if it ends before midnight
                current = null
            } else if (currentIdx > - 1) {
                current = state.prayers[currentIdx]
            }

            // compute next prayer
            if (currentIdx === -1) {
                next = state.prayers[0]
            } else if (currentIdx === lastIndex) {
                next = {
                    ...state.prayers[0],
                    start: moment(state.prayers[0].start).add(1, 'd').unix(),
                    end: moment(state.prayers[0].end).add(1, 'd').unix(),
                }
            } else {
                next = state.prayers[currentIdx + 1]
            }

            return {
                ...state,
                timestamp: moment().unix(),
                day: moment().format(DayFormat),
                current,
                currentTime,
                next,
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
