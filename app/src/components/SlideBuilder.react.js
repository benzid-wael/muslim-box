/*
* @flow
*/
import React from "react"
import type { Slide } from "@src/types"

import { useTranslation } from "react-i18next"

import QuranVerseSlide from "@components/QuranVerseSlide.react"
import PrayerSlide from "@components/PrayerSlide.react"

const SlideBuilder = ({slide}: {slide: Slide}): React$Element<any> => {
  const { i18n } = useTranslation();

  switch(slide?.type) {
    case "quran":
      return <QuranVerseSlide slide={slide} />
    case "current-prayer":
    case "next-prayer":
      return <PrayerSlide slide={slide} />
  }

  return <div>{i18n.t("Unsupported slide")}</div>
}

export default SlideBuilder;
