import type { Language, Localization } from "@src/l10n"

import { createSlice } from "@reduxjs/toolkit";

import { locale } from "@src/l10n";

type Config = $ReadOnly<{
  general: Localization,
}>

const initial = {
  general: locale({language: "en"})
}

const slice = createSlice({
  name: "config",
  initialState: initial,
  reducers: {
    changeLanguage: (state, {payload}: {payload: Language}) => ({
      ...state,
      general: locale({language: payload})
    }),
    changeConfig: (state, {payload}: {payload: Localization}) => payload,
  }
});

// Export actions
export const { changeLanguage, changeConfig } = slice.actions;

// Export reducer
export default slice.reducer;
