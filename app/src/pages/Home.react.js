/*
* @flow
*/
import type { PrayerTime as PrayerTimeType } from "@src/types";

import React, { useEffect, useState } from "react";
import { connect } from "react-redux"
import styled from "styled-components"

import Clock from "@components/Clock.react"
import Slider from "@components/Slider.react"
import AdhanSlide from "@components/AdhanSlide.react";
import ImageSlide from "@components/ImageSlide.react";
import PrayerTime from "@components/PrayerTime.react";

import bg from "@resources/bg.png"

const Main = styled.div`
  height: 100%;
  display: grid;
  grid-template-rows: auto 25%;
`

const BackgroundImage = styled.img`
  opacity: 0.2;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 80%;
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
}>

const mapStateToProps = state => ({
  prayers: state.prayerTimes.prayers,
  currentPrayer: state.prayerTimes.current,
  currentTime: state.prayerTimes.currentTime,
})

const getView = (key?: string) => {
  switch(key) {
    case "adhan":
      return <AdhanSlide />
  }

  return <Slider />
}

const Home = (props: StateProps): React$Node => {
  const [view, showView] = useState("slider");

  useEffect(() => {
    showView(props.currentTime?.modifier)
  }, [props.currentTime])

  return <Main>
    <BackgroundImage src={bg} />

    <Content>
      { getView(view) }
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
              <PrayerTime prayer={prayer} isCurrent={isCurrent} />
            </>
          })
        }
      </PrayerTimeWrapper>
    </Footer>
  </Main>
}

export default (connect(mapStateToProps)(Home): any)
