import type { GeoCoordinates } from "@src/l10n"

import { createSlice } from "@reduxjs/toolkit";


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

const getCoordinates = async (apiKey: string): Promise<GeoCoordinates> => {
    // const response = await fetch(`https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`);
    return new Promise((resolve, reject) => {
        resolve({
            longitude: -0.127758,
            latitude: 51.507351,
        })
    });
}

// Export actions
export const { setLoading, setCoordinates } = slice.actions;

export const loadCoordinates = (): any => async (dispatch: any) => {
    try {
        dispatch(setLoading(true));
        const coordinates = await getCoordinates("FIXME");
        dispatch(setCoordinates(coordinates));
    } finally {
        dispatch(setLoading(false))
    }
}

// Export reducer
export default slice.reducer;
