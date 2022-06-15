/*
* @flow
*/

import type { Language, Localization } from "@src/types"

const getDefaults = (lang: Language): Localization => {
  const defaults = {
    language: lang,
    hijriDateFormat: 'en-GB-u-ca-islamic',
    direction: 'ltr',
    dateFormat: 'dddd D MMMM YYYY',
    timeFormat: 'HH:mm:ss',
  };

  const custom = {
    en: {},
    ar: {
      hijriDateFormat: 'ar-TN-u-ca-islamic',
      direction: 'rtl',
    },
    fr: {
      hijriDateFormat: 'fr-FR-u-ca-islamic',
    }
  }

  return {
    ...defaults,
    ...custom[lang]
  }
}

export const locale = (config: Localization, exclude?: $ReadOnlyArray<$Keys<Localization>>): Localization => {
  const result = Object.assign({}, getDefaults(config.language), config)
  const excludeKeys = exclude || []
  // remove excluded fields from the result
  return Object.keys(result).reduce((object, key) => {
    if (!excludeKeys.includes(key)) {
      // $FlowFixMe[incompatible-return]
      object[key] = result[key]
    }
    return object
  }, {})
}
