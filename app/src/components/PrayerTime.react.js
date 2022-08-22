/*
 * @flow
 */

import type { PrayerTime as PrayerTimeType } from "@src/types";

import React from "react";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import "moment-timezone";

const Main = styled.div`
  width: 50%;
  margin: 8px;
  background-color: ${(props) => (props.primary ? "teal" : "white")};
  color: ${(props) => (props.primary ? "white" : "teal")};
  border-radius: 8px;
  display: flex;
  justify-content: center;
  box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.3);
  filter: drop-shadow(5px 5px 5px rgba(0, 0, 0, 0.3));
`;

const Wrapper = styled.div`
  display: inline-table;
  padding: 8px;
  // width: 100%;
  // height: 100%;
  // position: relative;
`;

const FancyText = styled.div`
  position: relative;
  // top: 50%;
  // transform: translateY(-50%);
  text-align: center;
`;

const Item = styled.div`
  text-align: center;
  vertical-align: middle;
  box-sizing: border-box;
  width: 100%;
  padding: 2px;
`;

const Name = styled(Item)`
  font-weight: 600;
  font-stretch: ultra-condensed;
  font-size: 24px;
  text-transform: uppercase;
`;

const StartTime = styled(Item)`
  font-weight: 400;
  font-size: 36px;
  padding: 4px;
  margin: 8px 4px;
`;

const IqamahTime = styled(StartTime)`
  font-weight: 800;
  color: #4169e1;
  background-color: white;
  border-radius: 4px;
`;

const EndTime = styled(IqamahTime)`
  font-size: 48px;
  font-weight: 400;
  background-color: ${(props) => (!props.primary ? "teal" : "white")};
  color: ${(props) => (!props.primary ? "white" : "teal")};
`;

type Props = $ReadOnly<{
  prayer: PrayerTimeType,
  isCurrent?: boolean,
  endTimeReminderInMinutes: number,
  timezone?: string,
}>;

const PrayerTime = (props: Props): React$Node => {
  const { prayer, isCurrent, timezone } = props;
  const { i18n } = useTranslation();
  // If no timezone is passed, we will fall to the defined user locale
  const start = !timezone ? moment.unix(prayer.start) : moment.unix(prayer.start).tz(timezone);
  const end = !timezone ? moment.unix(prayer.end) : moment.unix(prayer.end).tz(timezone);
  const iqamah = !timezone ? moment.unix(prayer.iqamah) : moment.unix(prayer.iqamah).tz(timezone);
  const showIqamahTime = iqamah && moment.duration(iqamah.diff(moment())) > 0;
  const remaining = moment.duration(end.diff(moment()));
  const showRemaining = isCurrent && remaining.asMinutes() < props.endTimeReminderInMinutes;
  return (
    <Main primary={isCurrent}>
      <Wrapper>
        <Name>{i18n.t(prayer.name)}</Name>
        <StartTime>{start.format("HH:mm")}</StartTime>
        <IqamahTime primary={isCurrent} style={!showIqamahTime ? { color: "gray" } : {}}>
          {showIqamahTime ? iqamah.format("HH:mm") : "-"}
        </IqamahTime>
        <EndTime primary={isCurrent} style={showRemaining ? { color: "red" } : {}}>
          {showRemaining ? `${remaining.format("mm:ss")}` : end.format("HH:mm")}
        </EndTime>
      </Wrapper>
    </Main>
  );
};

export default PrayerTime;
