import type { GeoCoordinates } from "@src/l10n"

import { createSlice } from "@reduxjs/toolkit"

type Config = $ReadOnly<{
  isLoading: boolean,
  coordinates?: GeoCoordinates,
  city?: string,
  timezone?: string,
  backendURL?: string,
}>

const initial = {
  isLoading: false,
}

const slice = createSlice({
  name: "user",
  initialState: initial,
  reducers: {
    setLoading: (state, {payload}) => {
        return {...state, isLoading: payload}
    },
    setCoordinates: (state, {payload}) => {
        return {...state, ...payload}
    },
    setBackendURL: (state, {payload}: {payload: string}) => {
        return {...state, backendURL: payload}
    },
  }
});

// Export actions
export const { setBackendURL, setCoordinates, setLoading } = slice.actions;

// Export reducer
export default slice.reducer;
