/*
 * @flow
 */
import type { SettingConfig } from "@src/Setting";
import type { Prayer } from "adhan";

import { Setting } from "@src/Setting";
import { capitalize } from "@src/utils";

export class SettingsManager {
  #settings: Array<Setting>;

  constructor(configs: Array<SettingConfig>) {
    this.loadConfigs(configs);
  }

  static fromConfigs(configs: Array<SettingConfig>): this {
    return new this(configs);
  }

  loadConfigs(configs: Array<SettingConfig>) {
    this.#settings = configs.map((cfg) => Setting.fromConfig(cfg));
  }

  getSettingByName(name: string): ?Setting {
    return this.#settings.find((s) => s.name === name);
  }

  getValue(name: string, fallback: string, defaultValue?: any): any {
    const primary = this.getSettingByName(name);
    const secondary = this.getSettingByName(fallback);
    if (primary && primary.value) return primary.value;
    else if (secondary) return secondary.value;
    else return defaultValue;
  }

  getPrayerSettingValue(name: string, prayer: Prayer, defaultValue?: any): any {
    const pSetting = `${capitalize(prayer)}${name}`;
    const result = this.getValue(pSetting, name, defaultValue);
    return result;
  }
}
