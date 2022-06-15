/*
* @flow
*/

import type { PrayerTime as PrayerTimeType } from "@src/types"

import React from "react"
import moment from "moment"
import momentDurationFormatSetup from "moment-duration-format"
import styled from "styled-components"

import i18n from "@localization/i18n.config"

const Main = styled.div`
  width: 50%;
  // height: 100%;
  margin: 8px;
  padding: 16px;
  background-color: ${props => props.primary ? "teal" : "white"};
  color: ${props => props.primary ? "white": "teal"};
  border-radius: 8px;
  display: flex;
  justify-content: center;
  box-shadow: 5px 5px 5px 0px rgba(0,0,0,0.3);
  filter: drop-shadow(5px 5px 5px rgba(0,0,0,0.3));
`

const Wrapper = styled.div`
  display: inline-table;
  padding: 8px;
  // width: 100%;
  // height: 100%;
  // position: relative;
`

const FancyText = styled.div`
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
`

const Item = styled.div`
  text-align: center;
  vertical-align: middle;
  box-sizing: border-box;
  width: 100%;
  padding: 2px;
`

const Name = styled(Item)`
  font-weight: 600;
  font-stretch: ultra-condensed;
  font-size: 24px;
  text-transform: uppercase;
`

const StartTime = styled(Item)`
  font-weight: 400;
  font-size: 48px;
  padding: 4px;
`

const EndTime = styled(StartTime)`
  font-weight: 800;
  background-color: ${props => !props.primary ? "teal" : "white"};
  color: ${props => !props.primary ? "white" : "teal"};
  border-radius: 4px;
`

type Props = $ReadOnly<{
  prayer: PrayerTimeType,
}>

const PrayerTime = (props: Props): React$Node => {
  const {prayer} = props;
  const start = moment.unix(prayer.start);
  const end = moment.unix(prayer.end);
  const remaining = moment.duration(end.diff(moment()))
  const showRemaining = prayer.isCurrent && remaining.asMinutes() < 20
  return <Main primary={prayer.isCurrent}>
    <Wrapper>
      <Name>{i18n.t(prayer.name)}</Name>
      <StartTime>{start.format("HH:mm")}</StartTime>
      <EndTime primary={prayer.isCurrent} style={showRemaining ? {color: "red"} : {}}>
        {showRemaining ? `${remaining.format("mm:ss")}` : end.format("HH:mm")}
      </EndTime>
    </Wrapper>
  </Main>
}

export default PrayerTime
