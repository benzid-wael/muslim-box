/*
* @flow
*/

import type { Slide, Language } from "@src/types"

import { createSlice } from "@reduxjs/toolkit"

type Callback = () => void | null;
type State = $ReadOnly<{
    isLoading: boolean;
    position: number;
    slides: $ReadOnlyArray<Slide>;
}>;

const initialState: State = {
    isLoading: false,
    position: -1,
    slides: [],
};

const slice: any = createSlice({
    name: "slides",
    initialState,
    reducers: {
        setLoading: (state, {payload}: {payload: boolean}) => {
            return {...state, isLoading: payload}
        },
        setPosition: (state, {payload}: {payload: number}) => {
            return {...state, position: payload}
        },
        addSlides: (state, {payload}: {payload: $ReadOnlyArray<Slide>}) => {
            return {...state, slides: [...state.slides, ...payload]}
        },
        movePrevious: (state) => {
            if (state.position > 0) {
                return { ...state, position: state.position - 1 }
            } else {
                return { ...state, position: state.slides.length - 1 }
            }
        },
        moveNext: (state) => {
            if (state.position < state.slides.length - 1) {
                return { ...state, position: state.position + 1 }
            } else {
                return { ...state, position: 0 }
            }
        },
        reset: (state, {payload}: {payload?: $ReadOnlyArray<Slide>}) => {
            return {
                ...state,
                position: 0,
                slides: payload || [],
            }
        }
    }
});

// Extract the action creators object and the reducer
const { actions, reducer } = slice;
// Extract and export each action creator by name
export const { setLoading, setPosition, addSlides, moveNext, movePrevious, reset } = actions;

export const resetSlides = (slides: $ReadOnlyArray<Slide>): any => async (dispatch: any) => {
    console.log(`resetting slide controller: ${slides.length} slides to be loaded`)
    try {
        dispatch(setLoading(true));
        dispatch(reset(slides));
    } finally {
        dispatch(setLoading(false))
    }
}

export default reducer;
