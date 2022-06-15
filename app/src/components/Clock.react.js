/*
* @flow
*/

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import moment from "moment"
import styled from "styled-components"

import i18n from "@localization/i18n.config";

const Main = styled.div`
  display: inline-grid;
  grid-template-rows: auto;
  margin: auto;
  justify-content: center;
  vertical-align: middle;
  // width: 94%;
  // height: 92%;
  // box-shadow: 5px 5px 5px 0px rgba(0,0,0,0.3);
  // filter: drop-shadow(5px 5px 5px rgba(0,0,0,0.3));
`

const Time = styled.div`
  font-size: 64px;
  font-weight: 800;
  text-align: center;
`

const DateWrapper = styled.div`
  font-size: 18px;
  font-weight: 400;
  text-align: center;
  direction: ${props => props.direction};
`

const mapStateToProps = state => ({
  timestamp: state.prayerTimes.timestamp,
  language: state.config.present.general.language,
  direction: state.config.present.general.direction,
  dateFormat: state.config.present.general.dateFormat,
  timeFormat: state.config.present.general.timeFormat,
  hijriDateFormat: state.config.present.general.hijriDateFormat,
})

const Clock = (props): React$Node => {
  const [state, setState] = useState({time: "", date: "", hijri: ""});

  useEffect(() => {
    moment.locale(props.language)

    const date = moment.unix(props.timestamp)
    const hijriDate = new Intl.DateTimeFormat(
      props.hijriDateFormat,
      {day: "numeric", month: "long", year : "numeric"},
    ).format(date);
    setState({
      time: date.format(props.timeFormat),
      date: date.format(props.dateFormat),
      hijriDate: hijriDate,
    });
  }, [props.timestamp, props.locale]);

  return <Main>
    <Time>{state.time}</Time>
    <DateWrapper direction={props.direction}>{state.date}</DateWrapper>
    <DateWrapper direction={props.direction}>{state.hijriDate}</DateWrapper>
  </Main>
}

export default (connect(mapStateToProps)(Clock): any);
