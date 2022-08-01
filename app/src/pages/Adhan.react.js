/*
* @flow
*/
import type { SettingConfig } from "@src/Setting";
import type { PrayerTime } from "@src/types";

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import ROUTES from "@constants/routes";
import AdhanSettings from "@src/AdhanSettings";

const Main = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${props => props.playing ? "#00a693" : "teal"};
`

const Wrapper = styled.div`
  position: absolute;
  top: 25%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Title = styled.h1`
  font-size: 6vw;
`

const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Hadith = styled.p`
  font-weight: 600;
  font-size: 2vw;
`

const Reference = styled.span`
  color: #cecece;
  font-size: 1vw;
  align-self: center;
`

export type StateProps = $ReadOnly<{
  timestamp: number,
  currentPrayer: PrayerTime,
  settings: Array<SettingConfig>,
}>

const DuaaDuringAdhan = (props) => {
  const { i18n } = useTranslation();
  return <Content direction={props.direction}>
    <Hadith>{i18n.t("DUAA_DURING_ADHAN")}</Hadith>
    <Reference>{i18n.t("Sahih Al-Bukhari {{hadith}}", {hadith: 614})}</Reference>
  </Content>
}

const DuaaAfterAdhan = (props) => {
  const { i18n } = useTranslation();
  const arr = [...Array(5).keys()].map(k => i18n.t(`DUAA_AFTER_ADHAN_${k}`))
  const hadith = arr[Math.floor(Math.random() * arr.length)]
  return <Content direction={props.direction}>
    <Hadith>{i18n.t("DUAA_AFTER_ADHAN")}</Hadith>
  </Content>
}

const Adhan = (props: StateProps) : React$Node => {
  const { i18n } = useTranslation();
  const history = useHistory();
  const adhanSettings = AdhanSettings.fromConfigs(props.settings)
  const adhan = adhanSettings.getAdhanSoundMetadata(props.currentPrayer?.name)
  const [audio] = useState<?Audio>(
    new Audio(adhan.sound)
  )
  const [state, setState] = useState({
    ended: false,
    play: false,
    duration: 300,
  });
  const prayer = i18n.t(props.currentPrayer?.name, {context: "name"});

  if(!props.settings || !props.currentPrayer) {
    return null
  }

  const togglePlay = () => {
    if (!state.ended && audio) {
      state.play ? audio.pause() : audio.play();
      setState({ ...state, play: !state.play });
    }
  }

  useEffect(() => {
    if(state.duration > 0) {
      setState(s => ({...s, duration: s.duration - 1}))
    } else if (!state.ended) {
      // if audio was not marked as ended, let's do it
      // and show after adhan adhkar
      setState(s => ({...s, ended: true, duration: 30}))
    } else {
      // it's time o get back to home page
      history.push(ROUTES.HOME);
    }
  }, [props.timestamp]);

  useEffect(() => {
    const timer = setTimeout(
      () => {
        const autoplay = adhanSettings.shoudlAutoPlay(props.currentPrayer?.name)
        console.error(`[Adhan] Adhan for ${props.currentPrayer?.name} prayer: enabled: ${autoplay}`)
        if (autoplay) {
          const durationInSeconds = adhan.durationInSeconds ? (adhan.durationInSeconds + 3) : 300
          setState({...state, duration: durationInSeconds})
          console.error(`[Adhan] auto playing adhan`)
          togglePlay()
        }
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    return () => {
      console.log("[Adhan] cleaned up");
      audio.pause();
      setState({...state, play: false})
    };
  }, []);

  return <Main onClick={togglePlay} playing={state.play}>
    <Wrapper>
      <Title>{ i18n.t("Now is the time for {{prayer}} prayer", {prayer}) }</Title>
      {
        state.ended
        ?
        <DuaaAfterAdhan direction={props.direction} />
        :
        <DuaaDuringAdhan direction={props.direction} />
      }
    </Wrapper>
  </Main>
}

const mapStateToProps = state => ({
  timestamp: state.prayerTimes.timestamp,
  currentPrayer: state.prayerTimes.current,
  settings: state.config.settings,
})

export default (connect(mapStateToProps)(Adhan): any);
