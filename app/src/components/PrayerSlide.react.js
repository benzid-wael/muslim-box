/*
* @flow
*/
import type {
  CurrentPrayerSlide,
  NextPrayerSlide,
  PrayerTime,
} from "@src/types";

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import moment from "moment";
import Slide from "@components/Slide.react";

const Time = styled.h2`
  font-weight: 800;
  font-size: 16px;
  font-size: 8vw;
  margin-top: -4px;
`

type StateProps = $ReadOnly<{
  currentPrayer?: PrayerTime,
  nextPrayer?: PrayerTime,
}>

type ComponentProps = $ReadOnly<{
  slide: NextPrayerSlide | CurrentPrayerSlide,
}>

type Props = StateProps & ComponentProps;

const mapStateToProps = (state): StateProps => ({
    currentPrayer: state.prayerTimes.current,
    nextPrayer: state.prayerTimes.next,
})


const getConfig = (
  i18n,
  slide: NextPrayerSlide | CurrentPrayerSlide,
  currentPrayer: PrayerTime,
  nextPrayer: PrayerTime,
) => {
  const { type } = slide
  const prayer = type === "next-prayer" ? nextPrayer : currentPrayer
  const prayerName = i18n.t(prayer.name, {context: "name"})
  const configMap = {
    isPrayer: {
      true: {
        type: {
          "next-prayer": {
            title: i18n.t("The call to prayer of {{prayer}} is in", {prayer: prayerName}),
            time: prayer.start
          },
          "current-prayer": {
            title: i18n.t("{{prayer}} time will end in", {prayer: prayerName}),
            time: prayer.end
          },
        }
      },
      false: {
        type: {
          "next-prayer": {
            title: i18n.t("{{prayer}} is in", {prayer: prayerName}),
            time: prayer.start
          },
          "current-prayer": {
            title: i18n.t("{{prayer}} time will end in", {prayer: prayerName}),
            time: prayer.end
          },
        }
      }
    }
  }

  return configMap.isPrayer[prayer.isPrayer].type[slide.type]
}

const PrayerSlideComponent = (props: Props): React$Node => {
  const { i18n } = useTranslation();
  const [now, setNow] = useState<number>(moment.now())

  useEffect(() => {
    const timer = setTimeout(
      () => {
        setNow(moment.now())
    }, 500)
    return () => clearTimeout(timer)
  }, [now])

  const { type } = props.slide
  const index = props.slide.reference
    ?
    props.slide.reference.index || props.slide.reference.indexes[0]
    :
    null;

  const prayer = type === "next-prayer" ? props.nextPrayer : props.currentPrayer

  if(!prayer) {
    return null
  }

  const config = getConfig(i18n, props.slide, props.currentPrayer, props.nextPrayer)
  const time = moment.unix(config.time)
  const remaining = moment.duration(time.diff(moment(now)))

  return <Slide
    title={config.title}
    content={<Time>{remaining.format("HH:mm:ss")}</Time>}
  />
}

export default (connect(mapStateToProps)(PrayerSlideComponent): any)
