/*
* @flow
*/
import type { PrayerTime } from "@src/types"

import React, { useState, useEffect } from "react";
import { connect } from "react-redux"
import { useTranslation } from "react-i18next"
import styled from "styled-components"

import ADHAN from "@constants/adhan"
import { autoPlayAdhan, getAdhanMetadataForPrayer } from "@src/Adhan"
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
}>

type ComponentProps = $ReadOnly<{
}>

type Props = StateProps & ComponentProps;

const mapStateToProps = (state): StateProps => ({
  currentPrayer: state.prayerTimes.current,
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
  const { i18n } = useTranslation();
  const adhan = getAdhanMetadataForPrayer(props.currentPrayer?.name)
  const [audio] = useState(new Audio(adhan.sound))
  const [state, setState] = useState({
    ended: false,
    play: false,
  });

  const prayer = i18n.t(props.currentPrayer?.name, {context: "name"})

  if(!prayer) {
    return null
  }

  const togglePlay = () => {
    if (!state.ended) {
      state.play ? audio.pause() : audio.play();
      setState({ ...state, play: !state.play });
    }
  }

  useEffect(() => {
    const timer = setTimeout(
      () => {
        console.log(`[Adhan] auto playing adhan for ${props.currentPrayer?.name} prayer`)
        if (autoPlayAdhan(props.currentPrayer?.name)) {
          togglePlay()
        }
    }, 300)
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
