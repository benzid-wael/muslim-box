/*
* @flow
*/
import type { GeoCoordinates, PrayerTime, PrayerTimeConfig, SlideFilter } from "@src/types";

import moment from "moment";
import {
  Coordinates,
  CalculationMethod,
  PrayerTimes,
  Prayer,
  SunnahTimes,
  Shafaq,
  HighLatitudeRule,
  Rounding,
  PolarCircleResolution,
} from "adhan";

import PRAYER_TIMES from "@constants/prayer";
import {
  getAdhanEndTime,
  getAfterAdhanEndTime,
  getIqamahStartTime,
  getIqamahEndTime,
  getAdhkarStartTime,
  getAdhkarEndTime,
  getAfterPrayerSunnahEndTime,
  getAdhkarSabahMasaaEndTime,
  getLastNightPrayerInfo,
  getHajirahStartTime,
  getHajirahEndTime,
} from "@src/Prayer";

type PTConfig = $ReadOnly<{
  // $FlowFixMe[value-as-type]
  prayer: Prayer,
  // $FlowFixMe[value-as-type]
  start: (pt: PrayerTimes, cfg: PrayerTimeConfig) => moment,
  // $FlowFixMe[value-as-type]
  end: (pt: PrayerTimes, cfg: PrayerTimeConfig) => moment,
  isPrayer?: boolean,
  internal?: boolean,
  visible?: boolean,
  modifier?: string,
  slide?: SlideFilter,
}>

const generatePT = (options: {
  prayer: Prayer,
  // $FlowFixMe[value-as-type]
  startFunc: (pt: PrayerTimes, cfg: PrayerTimeConfig) => moment,
  // $FlowFixMe[value-as-type]
  endFunc: (pt: PrayerTimes, cfg: PrayerTimeConfig) => moment,
  adhkarSabahMasaa?: "sabah" | "masaa",
  hasAfterPrayerSunnah?: boolean,  // by default false
}): Array<PTConfig> => {
  const {prayer, startFunc, endFunc} = options;
  // to be generated:
  // - adhan            adhan
  // - adhan:after      duaa after adhan
  // - prayer:before    sunnah before salat
  // - iqamah:before    reminder about iqama duaa
  // - iqamah           -
  // - prayer           black screen
  // - adhkar           adhkar after salat
  // - prayer:after     sunnah after salat

  const prayerId = prayer.toLowerCase()
  const afterPrayerSunnah = (
    !!options.hasAfterPrayerSunnah
    ?
    {
      prayer,
      start: (pt, cfg) => getAdhkarEndTime(startFunc, endFunc, pt, cfg),
      end: (pt, cfg) => getAfterPrayerSunnahEndTime(startFunc, endFunc, pt, cfg),
      isPrayer: true,
      internal: true,
      modifier: "prayer:after",
      slide: {
        onReachEnd: "reset",
        queries: [{
          name: "general",
          include: ["prayer:after"],
        }, {
          name: "prayer",
          include: [`prayer:after:${prayerId}`],
        }],
      }
    }
    :
    null
  )
  const adhkarSabahMasaaStartFunc = (pt, cfg) => {
    return (
      !!options.hasAfterPrayerSunnah
      ?
      getAfterPrayerSunnahEndTime(startFunc, endFunc, pt, cfg)
      :
      getAdhkarEndTime(startFunc, endFunc, pt, cfg)
    )
  }
  const adhkarSabahMasaa = (
    options.adhkarSabahMasaa != null
    ?
    {
      prayer,
      start: (pt, cfg) => adhkarSabahMasaaStartFunc(pt, cfg),
      end: (pt, cfg) => getAdhkarSabahMasaaEndTime(adhkarSabahMasaaStartFunc, endFunc, pt, cfg),
      isPrayer: true,
      internal: true,
      modifier: `time:${options.adhkarSabahMasaa}`,
      slide: {
        onReachEnd: "reset",
        queries: [{
          name: "general",
          include: [`time:${options.adhkarSabahMasaa}`],
        }],
      },
    }
    :
    null
  )

  const result = [{
    prayer,
    start: (pt, cfg) => startFunc(pt, cfg),
    end: (pt, cfg) => getAdhanEndTime(startFunc, endFunc, pt, cfg),
    isPrayer: true,
    internal: true,
    modifier: "adhan",
    slide: {
      onReachEnd: "reset",
      queries: [{
        name: "general",
        include: ["adhan"],
      }, {
        name: "prayer",
        include: [`adhan:${prayerId}`],
      }],
    },
  }, {
    prayer,
    start: (pt, cfg) => getAdhanEndTime(startFunc, endFunc, pt, cfg),
    end: (pt, cfg) => getAfterAdhanEndTime(startFunc, endFunc, pt, cfg),
    isPrayer: true,
    internal: true,
    modifier: "adhan:after",
    slide: {
      onReachEnd: "reset",
      queries: [{
        name: "general",
        include: ["adhan:after"],
      }],
    },
  }, {
    prayer,
    start: (pt, cfg) => getAfterAdhanEndTime(startFunc, endFunc, pt, cfg),
    end: (pt, cfg) => getIqamahStartTime(startFunc, endFunc, pt, cfg),
    isPrayer: true,
    internal: true,
    modifier: "prayer:before",
    slide: {
      onReachEnd: "reset",
      queries: [{
        name: "general",
        include: ["prayer:before"],
      }, {
        name: "prayer",
        include: [`prayer:before:${prayerId}`],
      }],
    },
  }, {
    prayer,
    start: (pt, cfg) => getIqamahStartTime(startFunc, endFunc, pt, cfg),
    end: (pt, cfg) => getIqamahEndTime(startFunc, endFunc, pt, cfg),
    isPrayer: true,
    internal: true,
    modifier: "iqamah",
    slide: {
      onReachEnd: "reset",
      queries: [{
        name: "general",
        include: ["iqamah"],
      }],
    }
  }, {
    prayer,
    start: (pt, cfg) => getIqamahEndTime(startFunc, endFunc, pt, cfg),
    end: (pt, cfg) => getAdhkarStartTime(startFunc, endFunc, pt, cfg),
    isPrayer: true,
    internal: true,
    modifier: "prayer",
  }, {
    prayer,
    start: (pt, cfg) => getAdhkarStartTime(startFunc, endFunc, pt, cfg),
    end: (pt, cfg) => getAdhkarEndTime(startFunc, endFunc, pt, cfg),
    isPrayer: true,
    internal: true,
    modifier: "adhkar",
    slide: {
      onReachEnd: "reset",
      queries: [{
        name: "general",
        include: ["adhkar"],
      }, {
        name: "prayer",
        include: [`adhkar:${prayerId}`],
      }],
    }
  },
  afterPrayerSunnah,
  adhkarSabahMasaa,
  {
    prayer,
    start: (pt, cfg) => startFunc(pt, cfg),
    end: (pt, cfg) => endFunc(pt, cfg),
    isPrayer: true,
    internal: false,
    visible: true,
  }]

  // $FlowFixMe[incompatible-return]
  return result.filter(item => item != null)
}

const PrayerTimeConfigs: Array<PTConfig> = [
  {
    prayer: "Midnight",
    start: (pt, cfg) => getLastNightPrayerInfo(pt).middleOfTheNight,
    end: (pt, cfg) => getLastNightPrayerInfo(pt).lastThirdOfTheNight,
    isPrayer: false,
    internal: true,
  },
  {
    prayer: "Last Third",
    start: (pt, cfg) => getLastNightPrayerInfo(pt).lastThirdOfTheNight,
    end: (pt, cfg) => getLastNightPrayerInfo(pt).sahar,
    isPrayer: false,
    internal: true,
  },
  {
    prayer: "Sahar",
    start: (pt, cfg) => getLastNightPrayerInfo(pt).sahar,
    end: (pt, cfg) => moment(pt.fajr),
    isPrayer: false,
    internal: true,
  },
  ...generatePT({
    prayer: Prayer.Fajr,
    startFunc: (pt, cfg) => moment(pt.fajr),
    endFunc: (pt, cfg) => moment(pt.sunrise),
    adhkarSabahMasaa: "sabah",
  }),
  {
    prayer: Prayer.Sunrise,
    start: (pt, cfg) => moment(pt.sunrise),
    end: (pt, cfg) => moment(pt.sunrise).add(20, "minutes"),
    isPrayer: false,
    visible: true,
  },
  {
    prayer: "Dhuha",
    start: (pt, cfg) => moment(pt.sunrise).add(20, "minutes"),
    end: (pt, cfg) => getHajirahStartTime(pt),
    isPrayer: true,
    internal: true,
  },
  {
    prayer: "Hajirah",
    start: (pt, cfg) => getHajirahStartTime(pt),
    end: (pt, cfg) => getHajirahEndTime(pt),
    isPrayer: true,
    internal: true,
  },
  {
    prayer: "Zawal",
    start: (pt, cfg) => getHajirahEndTime(pt),
    end: (pt, cfg) => moment(pt.dhuhr),
    isPrayer: false,
    internal: true,
  },
  ...generatePT({
    prayer: Prayer.Dhuhr,
    startFunc: (pt, cfg) => moment(pt.dhuhr),
    endFunc: (pt, cfg) => moment(pt.asr),
    hasAfterPrayerSunnah: true,
  }),
  ...generatePT({
    prayer: Prayer.Asr,
    startFunc: (pt, cfg) => moment(pt.asr),
    endFunc: (pt, cfg) => moment(pt.maghrib),
    adhkarSabahMasaa: "masaa",
  }),
  ...generatePT({
    prayer: Prayer.Maghrib,
    startFunc: (pt, cfg) => moment(pt.maghrib),
    endFunc: (pt, cfg) => moment(pt.isha),
    hasAfterPrayerSunnah: true,
  }),
  ...generatePT({
    prayer: Prayer.Isha,
    startFunc: (pt, cfg) => moment(pt.isha),
    endFunc: (pt, cfg) => {
      const sunnahTimes = new SunnahTimes(pt);
      return moment(sunnahTimes.middleOfTheNight);
    },
    hasAfterPrayerSunnah: true,
  }),
  {
    prayer: Prayer.Fajr,
    start: (pt, cfg) => {
      const tomorrow = moment(pt.date).add(1, "day")
      const tPT = new PrayerTimes(pt.coordinates, tomorrow.toDate(), pt.calculationParameters)
      return moment(tPT.fajr)
    },
    end: (pt, cfg) => {
      const tomorrow = moment(pt.date).add(1, "day")
      const tPT = new PrayerTimes(pt.coordinates, tomorrow.toDate(), pt.calculationParameters)
      return moment(tPT.sunrise)
    },
    isPrayer: true,
    visible: false,
  },
];

export const getPrayerTimes = (
  position: GeoCoordinates,
  date: Date,
  cfg?: $ReadOnlyMap<Prayer, PrayerTimeConfig>,
): Array<PrayerTime> => {
  try {
    // For configuration, see https://github.com/batoulapps/adhan-js/blob/master/METHODS.md
    const {latitude, longitude} = position;
    const coordinates = new Coordinates(latitude, longitude);
    // CalculationMethods: MuslimWorldLeague, MoonsightingCommittee, ...
    const params = CalculationMethod.MoonsightingCommittee();
    // Shafaq: Ahmer, Abyad
    params.shafaq = Shafaq.Ahmer;
    // HighLatitudeRule: MiddleOfTheNight, SeventhOfTheNight, TwilightAngle or .recommended(coordinates)
    params.highLatitudeRule = HighLatitudeRule.recommended(coordinates);
    // Rounding: Nearest, Up, None
    params.rounding = Rounding.Up;
    // PolarCircleResolution: AqrabBalad, AqrabYaum, Unresolved
    params.polarCircleResolution = PolarCircleResolution.AqrabBalad;
    console.log(`Calcuating prayer times on ${date.toLocaleDateString()} for location: [${longitude}, ${latitude}]`)
    const prayerTimes = new PrayerTimes(coordinates, date, params);
    return PrayerTimeConfigs
      .map(config => {
        try {
          const ptConfig = cfg?.get(config.prayer) || {}
          const start = config.start(prayerTimes, ptConfig)
          const end = config.end(prayerTimes, ptConfig)
          const suffix = config.modifier ? `[${config.modifier}]` : ""
          console.log(`${config.prayer}${suffix} ${start.format("HH:mm")} -> ${end.format("HH:mm")}`)

          return {
            name: config.prayer,
            start: start?.unix(),
            end: end?.unix(),
            isPrayer: config.isPrayer,
            internal: config.internal,
            visible: config.visible,
            modifier: config.modifier,
            slide: config.slide,
            // isCurrent: prayerTimes.currentPrayer() === config.prayer,
          }
        } catch(err) {
          console.error(`cannot compute prayer time: ${err}`)
        }
      })
      .filter(pt => pt);
  } catch (err) {
    return [];
  }
}

export default getPrayerTimes;
