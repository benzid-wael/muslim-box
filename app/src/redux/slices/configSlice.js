import type { Language, Localization } from "@src/l10n"
import type { SettingConfig } from "@src/Setting"

import { createSlice } from "@reduxjs/toolkit";

import { locale } from "@src/l10n";
import { loadConfigs } from "@src/SettingRepository";


type Config = $ReadOnly<{
  general: Localization,
  settings: Array<SettingConfig>,
}>

const stored = window.api.store.initial();
const defaultConfig = {
  general: locale({language: "en"}),
  settings: [],
}
const initial = Object.keys(stored).length > 0 ? stored : defaultConfig;

const slice = createSlice({
  name: "config",
  initialState: initial,
  reducers: {
    changeLanguage: (state, {payload}: {payload: Language}) => ({
      ...state,
      general: locale({language: payload})
    }),
    initSettings: (state, {payload}: {payload: Array<SettingConfig>}) => ({...state, settings: payload})
  }
});

// Export actions
export const { changeLanguage, initSettings } = slice.actions;

export const loadSettings = (backendUrl: string): any => async (dispatch: any) => {
  const configs = await loadConfigs(backendUrl);
  dispatch(initSettings(configs));
}

// Export reducer
export default slice.reducer;
