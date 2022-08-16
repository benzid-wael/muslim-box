import type { Language, Localization } from "@src/l10n";
import type { SettingConfig } from "@src/Setting";

import { createSlice } from "@reduxjs/toolkit";

import { locale } from "@src/l10n";
import { loadConfigs, updateSettingValue, unsetSettings as _unsetSettings } from "@src/SettingRepository";

type Config = $ReadOnly<{
  general: Localization,
  settings: Array<SettingConfig>,
}>;

const stored = window.api.store.initial();
const defaultConfig = {
  general: locale({ language: "en" }),
  settings: [],
};
const initial = Object.keys(stored).length > 0 ? stored : defaultConfig;

const slice = createSlice({
  name: "config",
  initialState: initial,
  reducers: {
    changeLanguage: (state, { payload }: { payload: Language }) => ({
      ...state,
      general: locale({ language: payload }),
    }),
    initSettings: (state, { payload }: { payload: Array<SettingConfig> }) => ({ ...state, settings: payload }),
    updateSetting: (state, { payload }: { payload: SettingConfig }) => {
      return {
        ...state,
        settings: [...state.settings.filter((s) => s.name != payload.name), payload],
      };
    },
    updateSettings: (state, { payload }: { payload: SettingConfig }) => {
      const settings = payload.map((s) => s.name);
      return {
        ...state,
        settings: [...state.settings.filter((s) => !settings.include(s.name)), ...payload],
      };
    },
  },
});

// Export actions
export const { changeLanguage, initSettings, updateSetting } = slice.actions;

export const loadSettings =
  (backendUrl: string): any =>
  async (dispatch: any) => {
    const configs = await loadConfigs(backendUrl);
    dispatch(initSettings(configs));
  };

export const patchSetting =
  (backendUrl: string, setting: Setting): any =>
  async (dispatch: any) => {
    const config = await updateSettingValue(backendUrl, setting);
    dispatch(updateSetting(config));
  };

export const unsetSettings =
  (backendUrl: string, settings: Array<string>): any =>
  async (dispatch: any) => {
    const configs = await _unsetSettings(backendUrl, settings);
    dispatch(updateSettings(configs));
  };

// Export reducer
export default slice.reducer;
