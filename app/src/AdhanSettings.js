/*
* @flow
*/
import type { AdhanSound, AdhanSoundMetadata, AdhanConfig } from "@src/types"
import type { SettingConfig } from "./Setting";

import { Prayer } from "adhan"

import ADHAN from "@constants/adhan"
import { SettingsManager } from "@src/SettingsManager"

import AdhanFajr from "@resources/audio/Adhan-fajr.mp3"
import AdhanMadinah from "@resources/audio/Adhan-Madinah.mp3"
import AdhanMakkah from "@resources/audio/Adhan-Makkah.mp3"
import AdhanMakkahDua from "@resources/audio/Adhan-Makkah-Dua.mp3"
import AdhanMakkah2 from "@resources/audio/Adhan-Makkah2.mp3"
import AdhanMakkahDua2 from "@resources/audio/Adhan-Makkah2-Dua.mp3"
import AdhanMisharyRashid from "@resources/audio/Adhan-Mishary-Rashid-Al-Afasy.mp3"
import AdhanTurkish from "@resources/audio/Adhan-Turkish.mp3"


class AdhanSettings extends SettingsManager {

  shoudlAutoPlay(prayer: Prayer): boolean {
    return this.getPrayerSettingValue("AutoplayAdhan", prayer)
  }

  getAdhanSoundMetadata(prayer: Prayer): AdhanSoundMetadata {
    const sound = this.getPrayerSettingValue("AdhanSound", prayer)
    return getAdhanMetadata(sound)
  }
}

export const getAdhanMetadata = (key: AdhanSound): AdhanSoundMetadata => {
  const config = {
    "adhan-fajr": {
      sound: AdhanFajr,
      durationInSeconds: 233,  // 3:53
      dua: false,
      fajr: true,
    },
    "adhan-madinah": {
      sound: AdhanMadinah,
      durationInSeconds: 207,  // 3:27
      dua: false,
    },
    "adhan-makkah": {
      sound: AdhanMakkah,
      durationInSeconds: 202,  // 3:22
      dua: false,
    },
    "adhan-makkah-dua": {
      sound: AdhanMakkahDua,
      durationInSeconds: 257,  // 4:17
      dua: true,
    },
    "adhan-makkah2": {
      sound: AdhanMakkah2,
      durationInSeconds: 210,  // 3:30
      dua: false,
    },
    "adhan-makkah2-dua": {
      sound: AdhanMakkahDua2,
      durationInSeconds: 246,  // 4:26
      dua: true,
    },
    "adhan-mishary-rashad": {
      sound: AdhanMisharyRashid,
      durationInSeconds: 160,  // 2:40
      dua: false,
    },
    "adhan-turkish": {
      sound: AdhanTurkish,
      durationInSeconds: 202,  // 3:22
      dua: false,
    },
  }

  return config[key] || config[ADHAN.DefaultAdhanSound]
}

export default AdhanSettings
