/*
* @flow
*/
import type { PrayerTime as PrayerTimeType } from "@src/types";
import type { SettingConfig } from "@src/Setting";

import React, { useEffect, useState } from "react";
import { connect } from "react-redux"
import styled from "styled-components"

import PRAYER from "@constants/prayer";
import Clock from "@components/Clock.react"
import Slider from "@components/Slider.react"
import AdhanSlide from "@components/AdhanSlide.react";
import ImageSlide from "@components/ImageSlide.react";
import PrayerTime from "@components/PrayerTime.react";
import { SliderSettings } from "@src/SliderSettings";
import bg from "@resources/bg.jpg";

const Main = styled.div`
  height: 100%;
  display: grid;
  grid-template-rows: auto 25%;

  &::before {
    content: "";
    background-image: url(${props => props.backgroundImage});
    background-repeat: ${props => props.repeat};
    background-size: contain;
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    opacity: 0.25;
  }
`

const Content = styled.section`
`

const Footer = styled.footer`
  position: relative;
  bottom: 0;
  background-color: white;
  color: teal;

  display: grid;
  grid-template-columns: 25% auto;
`

const PrayerTimeWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;

  /* Then we define how is distributed the remaining space */
  justify-content: space-around;
`

type StateProps = $ReadOnly<{
  prayers: $ReadOnlyArray<PrayerTimeType>,
  currentPrayer?: PrayerTimeType,
  currentTime?: PrayerTimeType,
  settings: Array<SettingConfig>,
}>

const mapStateToProps = state => ({
  prayers: state.prayerTimes.prayers,
  currentPrayer: state.prayerTimes.current,
  currentTime: state.prayerTimes.currentTime,
  settings: state.config.present.settings,
})

const getView = (key?: string, settings: SliderSettings) => {
  switch(key) {
    case "adhan":
      return <AdhanSlide />
  }

  return <Slider settings={settings} />
}

const Home = (props: StateProps): React$Node => {
  const [view, showView] = useState("slider");
  const sm = SliderSettings.fromConfigs(props.settings);

  useEffect(() => {
    showView(props.currentTime?.modifier)
  }, [props.currentTime])

  return <Main backgroundImage={bg}>
    <Content>
      { getView(view, sm) }
    </Content>
    <Footer>
      <Clock />
      <PrayerTimeWrapper>
        {props.prayers
          .filter(p => p.visible)
          .map((prayer: PrayerTimeType, i: number) => {
            const isLastItem = i == props.prayers.length - 1
            const isCurrent = props.currentPrayer?.name === prayer.name
            return <>
              <PrayerTime
                prayer={prayer}
                isCurrent={isCurrent}
                endTimeReminderInMinutes={sm.getPrayerSettingValue(
                  "EndTimeReminderInMinutes",
                  prayer.name,
                  PRAYER.EndTimeReminderInMinutes,
                )}
              />
            </>
          })
        }
      </PrayerTimeWrapper>
    </Footer>
  </Main>
}

export default (connect(mapStateToProps)(Home): any)
