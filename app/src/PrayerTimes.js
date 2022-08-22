/*
 * @flow
 */
import type { GeoCoordinates, PrayerTime, PrayerTimeConfig, SlideFilter, Time } from "@src/types";
import type { SettingsManager } from "@src/SettingsManager";

import moment from "moment";
import { PrayerTimes, Prayer, SunnahTimes } from "adhan";

import PRAYER from "@constants/prayer";
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
import { PrayerTimesCalculator } from "@src/PrayerTimesCalculator";
import { capitalize } from "@src/utils";

type PTConfig = $ReadOnly<{
  // $FlowFixMe[value-as-type]
  prayer: Prayer,
  // $FlowFixMe[value-as-type]
  start: (pt: PrayerTimes, cfg: PrayerTimeConfig) => moment,
  // $FlowFixMe[value-as-type]
  end: (pt: PrayerTimes, cfg: PrayerTimeConfig) => moment,
  // $FlowFixMe[value-as-type]
  iqamah?: (pt: PrayerTimes, cfg: PrayerTimeConfig) => moment,
  isPrayer?: boolean,
  internal?: boolean,
  visible?: boolean,
  modifier?: string,
  slide?: SlideFilter,
}>;

const getPrayerTimeConfig = (sm: SettingsManager, prayer: Prayer): PrayerTimeConfig => {
  const iqamahTimeString = sm.getPrayerSettingValue("IqamahTime", prayer);
  const iqamahTimeFunc = (value: string): ?Time => {
    if (value) {
      const [hour, minute] = value.split(":");
      const time = moment({ hour, minute });
      return {
        hour,
        minute,
      };
    }
    return null;
  };
  const iqamahTime = iqamahTimeFunc(iqamahTimeString);
  return {
    adhanDurationInMinutes: sm.getPrayerSettingValue("AdhanDurationInMinutes", prayer, PRAYER.AdhanDurationInMinutes),
    afterAdhanDurationInMinutes: sm.getPrayerSettingValue(
      "AfterAdhanDurationInMinutes",
      prayer,
      PRAYER.AfterAdhanDurationInMinutes
    ),
    iqamahAfterInMinutes: sm.getPrayerSettingValue("IqamahAfterInMinutes", prayer, PRAYER.IqamahAfterInMinutes),
    iqamahTime: iqamahTime,
    iqamahDurationInMinutes: sm.getPrayerSettingValue(
      "IqamahDurationInMinutes",
      prayer,
      PRAYER.IqamahDurationInMinutes
    ),
    prayerDurationInMinutes: sm.getPrayerSettingValue(
      "PrayerDurationInMinutes",
      prayer,
      PRAYER.PrayerDurationInMinutes
    ),
    adhkarDurationInMinutes: sm.getPrayerSettingValue(
      "AdhkarDurationInMinutes",
      prayer,
      PRAYER.AdhkarDurationInMinutes
    ),
    afterPrayerSunnahDurationInMinutes: sm.getPrayerSettingValue(
      "AfterPrayerSunnahDurationInMinutes",
      prayer,
      PRAYER.AfterPrayerSunnahDurationInMinutes
    ),
    adhkarSabahMasaaDurationInMinutes: sm.getPrayerSettingValue(
      "AdhkarSabahMasaaDurationInMinutes",
      prayer,
      PRAYER.AdhkarSabahMasaaDurationInMinutes
    ),
    saharTimeDurationInMinutes: sm.getPrayerSettingValue(
      "SaharTimeDurationInMinutes",
      prayer,
      PRAYER.SaharTimeDurationInMinutes
    ),
    zawalDurationInMinutes: sm.getPrayerSettingValue("ZawalDurationInMinutes", prayer, PRAYER.ZawalDurationInMinutes),
  };
};

const getPrayerTimeConfigs = (sm: SettingsManager): $ReadOnlyMap<Prayer, PrayerTimeConfig> => {
  const res = new Map<Prayer, PrayerTimeConfig>();
  const prayers = ["", Prayer.Fajr, Prayer.Dhuhr, Prayer.Asr, Prayer.Maghrib, Prayer.Isha];
  prayers.map((p) => {
    res.set(p, getPrayerTimeConfig(sm, p));
  });

  return res;
};

const generatePT = (options: {
  prayer: Prayer,
  // $FlowFixMe[value-as-type]
  startFunc: (pt: PrayerTimes, cfg: PrayerTimeConfig) => moment,
  // $FlowFixMe[value-as-type]
  endFunc: (pt: PrayerTimes, cfg: PrayerTimeConfig) => moment,
  adhkarSabahMasaa?: "sabah" | "masaa",
  hasAfterPrayerSunnah?: boolean, // by default false
}): Array<PTConfig> => {
  const { prayer, startFunc, endFunc } = options;
  // to be generated:
  // - adhan            adhan
  // - adhan:after      duaa after adhan
  // - prayer:before    sunnah before salat
  // - iqamah:before    reminder about iqama duaa
  // - iqamah           -
  // - prayer           black screen
  // - adhkar           adhkar after salat
  // - prayer:after     sunnah after salat

  const prayerId = prayer.toLowerCase();
  const afterPrayerSunnah = options.hasAfterPrayerSunnah
    ? {
        prayer,
        start: (pt, cfg) => getAdhkarEndTime(startFunc, endFunc, pt, cfg),
        end: (pt, cfg) => getAfterPrayerSunnahEndTime(startFunc, endFunc, pt, cfg),
        isPrayer: true,
        internal: true,
        modifier: "prayer:after",
        slide: {
          onReachEnd: "reset",
          queries: [
            {
              name: "general",
              include: ["prayer:after"],
            },
            {
              name: "time",
              include: [`prayer:after:${prayerId}`],
            },
          ],
        },
      }
    : null;
  const adhkarSabahMasaaStartFunc = (pt, cfg) => {
    return options.hasAfterPrayerSunnah
      ? getAfterPrayerSunnahEndTime(startFunc, endFunc, pt, cfg)
      : getAdhkarEndTime(startFunc, endFunc, pt, cfg);
  };
  const adhkarSabahMasaa =
    options.adhkarSabahMasaa != null
      ? {
          prayer,
          start: (pt, cfg) => adhkarSabahMasaaStartFunc(pt, cfg),
          end: (pt, cfg) => getAdhkarSabahMasaaEndTime(adhkarSabahMasaaStartFunc, endFunc, pt, cfg),
          isPrayer: true,
          internal: true,
          modifier: `time:${options.adhkarSabahMasaa}`,
          slide: {
            onReachEnd: "reset",
            queries: [
              {
                name: "general",
                include: ["adhkar:sabah_masaa"],
              },
              {
                name: "time",
                include: [`time:${options.adhkarSabahMasaa}`],
              },
            ],
          },
        }
      : null;

  const result = [
    {
      prayer,
      start: (pt, cfg) => startFunc(pt, cfg),
      end: (pt, cfg) => getAdhanEndTime(startFunc, endFunc, pt, cfg),
      isPrayer: true,
      internal: true,
      modifier: "adhan",
      slide: {
        onReachEnd: "reset",
        queries: [
          {
            name: "general",
            include: ["adhan"],
          },
          {
            name: "time",
            include: [`adhan:${prayerId}`],
          },
        ],
      },
    },
    {
      prayer,
      start: (pt, cfg) => getAdhanEndTime(startFunc, endFunc, pt, cfg),
      end: (pt, cfg) => getAfterAdhanEndTime(startFunc, endFunc, pt, cfg),
      isPrayer: true,
      internal: true,
      modifier: "adhan:after",
      slide: {
        onReachEnd: "reset",
        queries: [
          {
            name: "general",
            include: ["adhan:after"],
          },
        ],
      },
    },
    {
      prayer,
      start: (pt, cfg) => getAfterAdhanEndTime(startFunc, endFunc, pt, cfg),
      end: (pt, cfg) => getIqamahStartTime(startFunc, endFunc, pt, cfg),
      isPrayer: true,
      internal: true,
      modifier: "prayer:before",
      slide: {
        onReachEnd: "reset",
        queries: [
          {
            name: "general",
            include: ["prayer:before"],
          },
          {
            name: "time",
            include: [`prayer:before:${prayerId}`],
          },
        ],
      },
    },
    {
      prayer,
      start: (pt, cfg) => getIqamahStartTime(startFunc, endFunc, pt, cfg),
      end: (pt, cfg) => getIqamahEndTime(startFunc, endFunc, pt, cfg),
      isPrayer: true,
      internal: true,
      modifier: "iqamah",
      slide: {
        onReachEnd: "reset",
        queries: [
          {
            name: "general",
            include: ["iqamah"],
          },
        ],
      },
    },
    {
      prayer,
      start: (pt, cfg) => getIqamahEndTime(startFunc, endFunc, pt, cfg),
      end: (pt, cfg) => getAdhkarStartTime(startFunc, endFunc, pt, cfg),
      isPrayer: true,
      internal: true,
      modifier: "prayer",
    },
    {
      prayer,
      start: (pt, cfg) => getAdhkarStartTime(startFunc, endFunc, pt, cfg),
      end: (pt, cfg) => getAdhkarEndTime(startFunc, endFunc, pt, cfg),
      isPrayer: true,
      internal: true,
      modifier: "adhkar",
      slide: {
        onReachEnd: "reset",
        queries: [
          {
            name: "general",
            include: ["adhkar:prayer"],
          },
          {
            name: "time",
            include: [`adhkar:prayer:${prayerId}`],
          },
        ],
      },
    },
    afterPrayerSunnah,
    adhkarSabahMasaa,
    {
      prayer,
      start: (pt, cfg) => startFunc(pt, cfg),
      end: (pt, cfg) => endFunc(pt, cfg),
      iqamah: (pt, cfg) => getIqamahStartTime(startFunc, endFunc, pt, cfg),
      isPrayer: true,
      internal: false,
      visible: true,
    },
  ];

  // $FlowFixMe[incompatible-return]
  return result.filter((item) => item != null);
};

const PrayerTimeConfigs: Array<PTConfig> = [
  {
    prayer: "Midnight*",
    start: (pt, cfg) => getLastNightPrayerInfo(pt, cfg).middleOfTheNight,
    end: (pt, cfg) => getLastNightPrayerInfo(pt, cfg).lastThirdOfTheNight,
    isPrayer: false,
    internal: true,
    slide: {
      onReachEnd: "reset",
      queries: [
        {
          name: "general",
          include: ["time:night:midnight"],
        },
      ],
    },
  },
  {
    prayer: "Last Third*",
    start: (pt, cfg) => getLastNightPrayerInfo(pt, cfg).lastThirdOfTheNight,
    end: (pt, cfg) => getLastNightPrayerInfo(pt, cfg).sahar,
    isPrayer: false,
    internal: true,
    slide: {
      onReachEnd: "reset",
      queries: [
        {
          name: "general",
          include: ["time:night:last_third"],
        },
      ],
    },
  },
  {
    prayer: "Sahar*",
    start: (pt, cfg) => getLastNightPrayerInfo(pt, cfg).sahar,
    end: (pt, cfg) => moment(pt.fajr),
    isPrayer: false,
    internal: true,
    slide: {
      onReachEnd: "reset",
      queries: [
        {
          name: "general",
          include: ["time:night:sahar"],
        },
      ],
    },
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
    end: (pt, cfg) => getHajirahStartTime(pt, cfg),
    isPrayer: true,
    internal: true,
    slide: {
      onReachEnd: "reset",
      queries: [
        {
          name: "general",
          include: ["time:dhuha"],
        },
      ],
    },
  },
  {
    prayer: "Hajirah",
    start: (pt, cfg) => getHajirahStartTime(pt, cfg),
    end: (pt, cfg) => getHajirahEndTime(pt, cfg),
    isPrayer: true,
    internal: true,
    slide: {
      onReachEnd: "reset",
      queries: [
        {
          name: "general",
          include: ["time:hajirah"],
        },
      ],
    },
  },
  {
    prayer: "Zawal",
    start: (pt, cfg) => getHajirahEndTime(pt, cfg),
    end: (pt, cfg) => moment(pt.dhuhr),
    isPrayer: false,
    internal: true,
    slide: {
      onReachEnd: "reset",
      queries: [
        {
          name: "general",
          include: ["time:before:zawal"],
        },
      ],
    },
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
    prayer: "Midnight",
    start: (pt, cfg) => {
      const sunnahTimes = new SunnahTimes(pt);
      return moment(sunnahTimes.middleOfTheNight);
    },
    end: (pt, cfg) => {
      const sunnahTimes = new SunnahTimes(pt);
      return moment(sunnahTimes.lastThirdOfTheNight);
    },
    isPrayer: false,
    internal: true,
    slide: {
      onReachEnd: "reset",
      queries: [
        {
          name: "general",
          include: ["time:night:midnight"],
        },
      ],
    },
  },
  {
    prayer: "Last Third",
    start: (pt, cfg) => {
      const sunnahTimes = new SunnahTimes(pt);
      return moment(sunnahTimes.lastThirdOfTheNight);
    },
    end: (pt, cfg) => {
      const tomorrow = moment(pt.date).add(1, "day");
      const tPT = new PrayerTimes(pt.coordinates, tomorrow.toDate(), pt.calculationParameters);
      return moment(tPT.fajr);
    },
    isPrayer: false,
    internal: true,
    slide: {
      onReachEnd: "reset",
      queries: [
        {
          name: "general",
          include: ["time:night:last_third"],
        },
      ],
    },
  },
  {
    prayer: Prayer.Fajr,
    start: (pt, cfg) => {
      const tomorrow = moment(pt.date).add(1, "day");
      const tPT = new PrayerTimes(pt.coordinates, tomorrow.toDate(), pt.calculationParameters);
      return moment(tPT.fajr);
    },
    end: (pt, cfg) => {
      const tomorrow = moment(pt.date).add(1, "day");
      const tPT = new PrayerTimes(pt.coordinates, tomorrow.toDate(), pt.calculationParameters);
      return moment(tPT.sunrise);
    },
    isPrayer: true,
    visible: false,
  },
];

export const getPrayerTimes = (position: GeoCoordinates, date: Date, sm: SettingsManager): Array<PrayerTime> => {
  try {
    const configs: $ReadOnlyMap<Prayer, PrayerTimeConfig> = getPrayerTimeConfigs(sm);

    const prayerTimesCalculator = new PrayerTimesCalculator(sm);
    console.log(`[getPrayerTimes] Calcuating prayer times on ${date.toLocaleDateString()}`);
    const prayerTimes = prayerTimesCalculator.prayerTimes(position, date);
    return PrayerTimeConfigs.map((config) => {
      try {
        // We are computing only config for mandatory prayer times, for other
        //  times (e.g. Sahar), we will fallback to the default config (key is empty string)
        const ptConfig = configs?.get(config.prayer) || configs?.get("");
        const start = config.start(prayerTimes, ptConfig);
        const end = config.end(prayerTimes, ptConfig);
        const iqamah = !!config?.iqamah ? config.iqamah(prayerTimes, ptConfig) : null;
        const suffix = config.modifier ? `[${config.modifier}]` : "";
        console.debug(`[getPrayerTimes] ${config.prayer}${suffix} ${start.format("HH:mm")} -> ${end.format("HH:mm")}`);

        return {
          name: config.prayer,
          start: start?.unix(),
          end: end?.unix(),
          iqamah: iqamah?.unix(),
          isPrayer: config.isPrayer,
          internal: config.internal,
          visible: config.visible,
          modifier: config.modifier,
          slide: config.slide,
          // isCurrent: prayerTimes.currentPrayer() === config.prayer,
        };
      } catch (err) {
        console.error(`[getPrayerTimes] cannot compute prayer time: ${err}`);
      }
    }).filter((pt) => pt);
  } catch (err) {
    console.error(`[getPrayerTimes] cannot compute prayer times: ${err}`);
    return [];
  }
};

export default getPrayerTimes;
