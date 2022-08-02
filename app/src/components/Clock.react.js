/*
 * @flow
 */

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import moment from "moment";
import styled from "styled-components";

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
`;

const Time = styled.div`
  font-size: 64px;
  font-weight: 800;
  text-align: center;
`;

const DateWrapper = styled.div`
  font-size: 18px;
  font-weight: 400;
  text-align: center;
`;

const mapStateToProps = (state) => ({
  timestamp: state.prayerTimes.timestamp,
  locale: state.config.general.locale,
  dateFormat: state.config.general.dateFormat,
  timeFormat: state.config.general.timeFormat,
  settings: state.config.settings,
  hijriDateFormat: state.config.general.hijriDateFormat,
});

const Clock = (props): React$Node => {
  const [state, setState] = useState({ time: "", date: "", hijri: "" });

  const dateFormatSetting = props.settings?.filter((s) => s.name == "DateFormat");
  const timeFormatSetting = props.settings?.filter((s) => s.name == "TimeFormat");
  const dateFormat = dateFormatSetting.length ? dateFormatSetting[0].value : props.dateFormat;
  const timeFormat = timeFormatSetting.length ? timeFormatSetting[0].value : props.timeFormat;

  useEffect(() => {
    moment.locale(props.locale);

    const date = moment.unix(props.timestamp);
    const hijriDate = new Intl.DateTimeFormat(props.hijriDateFormat, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
    setState({
      time: date.format(timeFormat),
      date: date.format(dateFormat),
      hijriDate: hijriDate,
    });
  }, [props.timestamp, props.locale]);

  return (
    <Main>
      <Time>{state.time}</Time>
      <DateWrapper>{state.date}</DateWrapper>
      <DateWrapper>{state.hijriDate}</DateWrapper>
    </Main>
  );
};

export default (connect(mapStateToProps)(Clock): any);
