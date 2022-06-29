/*
* @flow
*/
import type { PrayerTime, Language, LayoutDirection } from "@src/types";

import React, { useState, useEffect } from "react";
import { connect } from "react-redux"
import { useTranslation } from "react-i18next"
import styled from "styled-components"

import AdhanMadinah from "@resources/audio/Adhan-Madinah.mp3";

const Main = styled.div`
  display: table;
  position: relative;
  width: calc(100% - 80px);
  height: 100%;
  margin: 0 40px;
  direction: ${props => props.direction}
`

const Title = styled.h1`
  font-weight: 800;
  font-size: 24px;
  font-size: 3vw;
`

const Inner = styled.div`
  display: table-cell;
  vertical-align: middle;
  text-align: center;
  font-weight: 400;
  font-size: 12px;
  font-size: 3vw;
`

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
  direction: LayoutDirection,
  currentPrayer: PrayerTime,
}>

type ComponentProps = $ReadOnly<{
  silent?: boolean; // silent mode by default
}>

type Props = StateProps & ComponentProps;

const mapStateToProps = (state): StateProps => ({
  direction: state.config.present.general.direction,
  currentPrayer: state.prayerTimes.next,
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

const Slide = (props: Props): React$Node => {
  const { i18n } = useTranslation();
  const [audio] = useState(new Audio(AdhanMadinah))
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
        console.log(`[Adhan] playing adhan`)
        togglePlay()
    }, 300)
    return () => clearTimeout(timer)
  }, [props.silent])

  return <Main direction={props.direction} onClick={togglePlay}>
    <Inner>
        <Title>{i18n.t("Now is the time for {{prayer}} prayer", {prayer})}</Title>

        {state.ended
          ?
          <DuaaAfterAdhan direction={props.direction} />
          :
          <DuaaDuringAdhan direction={props.direction} />
        }
    </Inner>
  </Main>
}

export default (connect(mapStateToProps)(Slide): any)
