/*
* @flow
*/
import type { SettingConfig } from "./Setting";
import type { Prayer } from "adhan";

import { Setting } from "@src/Setting"
import { capitalize } from "@src/utils"

export class SettingsManager {
    #settings: Array<Setting>;

    constructor(configs: Array<SettingConfig>) {
      this.loadConfigs(configs)
    }

    static fromConfigs(configs: Array<SettingConfig>): SettingsManager {
      return new SettingsManager(configs)
    }

    loadConfigs(configs: Array<SettingConfig>) {
      this.#settings = configs.map(cfg => Setting.fromConfig(cfg))
    }

    #getFirst(name: string): ?Setting {
      return this.#settings.find(s => s.name === name)
    }

    getValue(name: string, fallback: string): any {
      const primary = this.#getFirst(name)
      const secondary = this.#getFirst(fallback)
      if (primary && primary.value) return primary.value
      else if (secondary) return secondary.value
    }

    getPrayerSettingValue(name: string, prayer: Prayer): any {
      const pSetting = `${capitalize(prayer)}${name}`
      return this.getValue(pSetting, name)
    }
}
