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
}>;

const initialState: State = {
    /*
    * This is used to for e reasons so far:
    *   - highlight last time prayer time was updated: setPrayerTimes / updateCurrentPrayer
    *   - update time shown in the digital clock
    */
    timestamp: 0,
    // this is used to ensure that we recompute prayer times every day
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
            let current = null;
            const now = moment();
            return {
                ...state,
                timestamp: moment().unix(),
                day: moment().format(DayFormat),
                prayers: state.prayers.map(
                    p => {
                        if(now > moment.unix(p.start) && now < moment.unix(p.end) && !current) {
                            current = p
                            return {...p, isCurrent: true}
                        } else {
                            return {...p, isCurrent: false}
                        }
                    }
                ),
            }
        }
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
