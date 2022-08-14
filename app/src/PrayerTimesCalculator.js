/*
 * @flow
 */
import type { GeoCoordinates } from "@src/types";
import type { SettingsManager } from "@src/SettingsManager";

import {
  Coordinates,
  CalculationMethod,
  CalculationParams,
  HighLatitudeRule,
  Madhab,
  PolarCircleResolution,
  PrayerTimes,
  Rounding,
  Shafaq,
} from "adhan";

export class PrayerTimesCalculator {
  #sm: SettingsManager;

  constructor(sm: SettingsManager) {
    this.#sm = sm;
  }

  paramsFromMethod(): CalculationParams {
    // CalculationMethods: MuslimWorldLeague, MoonsightingCommittee, ...
    const cfg = this.#sm.getValue("Method", "", "Other");
    const method = cfg in CalculationMethod ? CalculationMethod[cfg] : CalculationMethod.Other;
    return method();
  }

  get madhab(): Madhab {
    const cfg = this.#sm.getValue("Madhab");
    switch (cfg) {
      case "Hanafi":
        return Madhab.Hanafi;
      case "Shafi":
      default:
        return Madhab.Shafi;
    }
  }

  get shafaq(): Shafaq {
    const cfg = this.#sm.getValue("Shafaq");
    return {
      General: Shafaq.General,
      Abyad: Shafaq.Abyad,
      Ahmer: Shafaq.Ahmer,
    }[cfg];
  }

  highLatitudeRule(coordinates: Coordinates): HighLatitudeRule {
    const cfg = this.#sm.getValue("HighLatitudeRule");
    switch (cfg) {
      case "Auto":
        return HighLatitudeRule.recommended(coordinates);
      case "MiddleOfTheNight":
        return HighLatitudeRule.MiddleOfTheNight;
      case "SeventhOfTheNight":
        return HighLatitudeRule.SeventhOfTheNight;
      case "TwilightAngle":
        return HighLatitudeRule.TwilightAngle;
      default:
        return HighLatitudeRule.recommended(coordinates);
    }
  }

  get rounding(): Rounding {
    const cfg = this.#sm.getValue("Rounding");
    switch (cfg) {
      case "Up":
        return Rounding.Up;
      case "Nearest":
        return Rounding.Nearest;
      case "None":
        return Rounding.None;
      default:
        return Rounding.Up;
    }
  }

  get useMethodAngles(): boolean {
    return this.#sm.getValue("OverrideMethodAngles");
  }

  fajrAngle(params: CalculationParams): number {
    return this.useMethodAngles ? params.fajrAngle : this.#sm.getValue("FajrAngle");
  }

  ishaAngle(params: CalculationParams): number {
    return this.useMethodAngles ? params.ishaAngle : this.#sm.getValue("IshaAngle");
  }

  get polarCircleResolution(): PolarCircleResolution {
    const cfg = this.#sm.getValue("PolarCircleResolution");
    switch (cfg) {
      case "Unresolved":
        return PolarCircleResolution.Unresolved;
      case "AqrabBalad":
        return PolarCircleResolution.AqrabBalad;
      case "AqrabYaum":
        return PolarCircleResolution.AqrabYaum;
      default:
        return PolarCircleResolution.AqrabBalad;
    }
  }

  params(coordinates: Coordinates): CalculationParams {
    const params = this.paramsFromMethod();
    params.madhab = this.madhab;
    params.shafaq = this.shafaq;
    params.highLatitudeRule = this.highLatitudeRule(coordinates);
    params.rounding = this.rounding;
    params.polarCircleResolution = this.polarCircleResolution;

    // custom angles
    params.fajrAngle = this.fajrAngle(params);
    params.ishaAngle = this.ishaAngle(params);

    return params;
  }

  prayerTimes(position: GeoCoordinates, date: Date): PrayerTimes {
    // For configuration, see https://github.com/batoulapps/adhan-js/blob/master/METHODS.md
    const { latitude, longitude } = position;
    const coordinates = new Coordinates(latitude, longitude);
    return new PrayerTimes(coordinates, date, this.params(coordinates));
  }
}
