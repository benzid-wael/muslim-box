/*
* @flow
*/
import type { PrayerTime } from "@src/types";
import type { SettingConfig } from "@src/Setting";

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import AdhanSettings from "@src/AdhanSettings";
import Slide from "@components/Slide.react";

const Matn = styled.h3`
  font-weight: 600;
  font-size: 12px;
  font-size: 2vw;
  color: gray;
`

const Hadith = styled.p`
`

const Reference = styled.span`
  font-weight: 600;
  font-size: 12px;
  font-size: 2vw;
  color: gray;
`

type StateProps = $ReadOnly<{
  currentPrayer: PrayerTime,
  settings: Array<SettingConfig>,
}>

type ComponentProps = $ReadOnly<{
}>

type Props = StateProps & ComponentProps;

const mapStateToProps = (state): StateProps => ({
  currentPrayer: state.prayerTimes.current,
  settings: state.config.present.settings,
})

const DuaaDuringAdhan = (props) => {
  const { i18n } = useTranslation();
  return <div direction={props.direction}>
    <Matn>{i18n.t("The prophet PBUH said")}:</Matn>
    <Hadith>{i18n.t("DUAA_DURING_ADHAN")}</Hadith>
    <Reference>{i18n.t("Sahih Al-Bukhari {{hadith}}", {hadith: 614})}</Reference>
  </div>
}

const DuaaAfterAdhan = (props) => {
  const { i18n } = useTranslation();
  const arr = [...Array(5).keys()].map(k => i18n.t(`DUAA_AFTER_ADHAN_${k}`))
  const hadith = arr[Math.floor(Math.random() * arr.length)]
  return <div direction={props.direction}>
    <Matn>{i18n.t("The prophet PBUH said")}:</Matn>
    <Hadith>{i18n.t("DUAA_AFTER_ADHAN")}</Hadith>
  </div>
}

const AdhanSlideComponent = (props: Props): React$Node => {

  if(!props.settings || !props.currentPrayer) {
    return null
  }

  const { i18n } = useTranslation();
  const adhanSettings = AdhanSettings.fromConfigs(props.settings)
  const adhan = adhanSettings.getAdhanSoundMetadata(props.currentPrayer?.name)
  const [audio] = useState<?Audio>(
    new Audio(adhan.sound)
  )
  const [state, setState] = useState({
    ended: false,
    play: false,
  });

  const prayer = i18n.t(props.currentPrayer?.name, {context: "name"})

  const togglePlay = () => {
    if (!state.ended && audio) {
      state.play ? audio.pause() : audio.play();
      setState({ ...state, play: !state.play });
    }
  }

  useEffect(() => {
    const timer = setTimeout(
      () => {
        const autoplay = adhanSettings.shoudlAutoPlay(props.currentPrayer?.name)
        console.log(`[Adhan] Adhan for ${props.currentPrayer?.name} prayer: enabled: ${autoplay}`)
        if (autoplay) {
          console.debug(`[Adhan] auto playing adhan`)
          togglePlay()
        }
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    return () => {
      console.log("[Adhan] cleaned up");
    };
  }, []);

  return <Slide
    title={i18n.t("Now is the time for {{prayer}} prayer", {prayer})}
    onClick={togglePlay}
    content={state.ended
      ?
      <DuaaAfterAdhan direction={props.direction} />
      :
      <DuaaDuringAdhan direction={props.direction} />
    }
  />
}

export default (connect(mapStateToProps)(AdhanSlideComponent): any)
