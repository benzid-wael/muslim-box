import type { GeoCoordinates } from "@src/l10n"

import { createSlice } from "@reduxjs/toolkit"

import { getCoordinates } from "@src/GeoLocation"

type Config = $ReadOnly<{
  isLoading: boolean,
  coordinates?: GeoCoordinates,
}>

const initial = {
  isLoading: false
}

const slice = createSlice({
  name: "user",
  initialState: initial,
  reducers: {
    setLoading: (state, {payload}) => {
        return {...state, isLoading: payload}
    },
    setCoordinates: (state, {payload}: {payload: GeoCoordinates}) => {
        return {...state, coordinates: payload}
    }
  }
});

// Export actions
export const { setLoading, setCoordinates } = slice.actions;

export const loadCoordinates = (apiKey?: string): any => async (dispatch: any) => {
    try {
        dispatch(setLoading(true));
        const coordinates = await getCoordinates(apiKey);
        dispatch(setCoordinates(coordinates));
    } finally {
        dispatch(setLoading(false))
    }
}

// Export reducer
export default slice.reducer;
