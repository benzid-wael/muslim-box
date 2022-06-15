/*
* @flow
*/
import React from "react"
import { connect } from "react-redux"
import styled from "styled-components"

import Clock from "@components/Clock.react"
import PrayerTime from "@components/PrayerTime.react"
import Slider from "@components/Slider.react"

const Main = styled.div`
  height: 100%;
  display: grid;
  grid-template-rows: auto 25%;
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
  prayers: $ReadOnlyArray<PrayerTime>
}>

const mapStateToProps = state => ({
  prayers: state.prayerTimes.prayers,
})

const Home = (props: StateProps): React$Node => {
    return <Main>
      <Content>
        <Slider />
      </Content>
      <Footer>
        <Clock />
        <PrayerTimeWrapper>
          {props.prayers.map((prayer: PrayerTime, i: number) => {
            const isLastItem = i == props.prayers.length - 1
            return <>
              <PrayerTime prayer={prayer} />
            </>
          })}
        </PrayerTimeWrapper>
      </Footer>
    </Main>
}

export default (connect(mapStateToProps)(Home): any)
