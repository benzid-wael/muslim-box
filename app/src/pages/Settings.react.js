/*
* @flow
*/
import type { SettingConfig } from "@src/Setting";

import React, { useEffect, useState } from "react";

import moment from "moment";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Switch, Route, useRouteMatch, useHistory } from "react-router";
import { Redirect } from "react-router-dom";
import styled from "styled-components";

import SettingsPage from "@components/SettingsPage.react";


const Main = styled.section`
  display: grid;
  grid-template-columns: 25% auto;
  grid-gap: 1rem;
  margin: 2rem;
  overflow: scroll;
`

const Content = styled.section`
  /* take twice as much width as the other two sidebars */
  margin: 0;
`

const Menu = styled.section`
  display: inline-grid;
  grid-gap: .5rem;
  // grid-auto-rows: min-content;
  align-items: start;
  font-weight: 400;
  font-size: 1.3rem;
`

const MenuItem = styled.div`
  box-sizing: border-box;
  padding: 2rem;

  & > a,
  & > a:hover,
  & > a:visited {
    all: unset;
  }

  &.active {
    background-color: white;
    color: teal;
    border-left: olive solid ${props => props.direction === "rtl" ? 0 : "6px"};
    border-right: olive solid ${props => props.direction === "rtl" ? "6px" : 0};
  }

  &.active,
  &:focus,
  &:hover {
    font-weight: 800;
    font-size: 1.8rem;
    background-color: #fefefe;
    color: teal;
  }
`

const SETTINGS = [{
  name: "general",
  label: "General",
  forms: (i18n) => {
    const example = 1658930560
    const now = moment.unix(example)
    return [{
      title: i18n.t("Localization"),
      settings: [{
        title: i18n.t("Date Format"),
        setting: "DateFormat",
        renderOption: (option, locale) => {
          moment.locale(locale);
          return now.format(option);
        }
      }, {
        title: i18n.t("Time Format"),
        setting: "TimeFormat",
        renderOption: (option, locale) => {
          moment.locale(locale);
          return now.format(option);
        }
      }]
    }]
  }
}, {
  name: "display",
  label: "Display",
  forms: (i18n) => {
    return [{
      title: i18n.t("Slider"),
      settings: [{
        title: i18n.t("Reading Speed (words per minute)"),
        setting: "WordsPerMinute",
      }, {
        title: i18n.t("Page Size"),
        setting: "PageSize",
      }, {
        title: i18n.t("Animation"),
        setting: "EnableAnimation",
      }, {
        title: i18n.t("Random Quran Verses"),
        setting: "EnableVerseOfTheDayAPI",
      }]
    }, {
      title: i18n.t("Prayer"),
      settings: [{
        title: i18n.t("Prayer Reminder"),
        setting: "PrayerReminderEveryNSlides",
      }, {
        title: i18n.t("Prayer Reminder Duration"),
        setting: "PrayerReminderDurationInSeconds",
      }]
    }, {
      title: i18n.t("Other"),
      settings: [{
        title: i18n.t("After last slide"),
        setting: "OnReachEndStrategy",
      }, {
        title: i18n.t("Repeat Ratio"),
        setting: "PageRepeatRatioNOutOfOne",
      }, {
        title: i18n.t("Default Slide Duration"),
        setting: "DefaultSlidingDurationInSeconds",
      }, {
        title: i18n.t("Minimum Slide Duration"),
        setting: "MinimumSlideDurationInSeconds",
      }]
    }]
  }
}, {
  name: "prayer",
  label: "Prayer Times",
  forms: (i18n) => {
    return [{
      title: i18n.t("Calculation Method"),
      settings: [{
        title: i18n.t("Method"),
        setting: "Method"
      }, {
        title: i18n.t("Asr"),
        setting: "Madhab"
      }, {
        title: i18n.t("Isha"),
        setting: "Shafaq"
      }]
    }, {
      title: i18n.t("Other Settings"),
      settings: [{
        title: i18n.t("High Latitude Rule"),
        setting: "HighLatitudeRule",
        help: i18n.t("Used to set a minimum time for Fajr and a max time for Isha when Fajr and Isha dissapears")
      }, {
        title: i18n.t("Polar Circle"),
        setting: "PolarCircleResolution",
        help: i18n.t("Strategy used to resolve undefined prayer times for areas located in polar circles")
      },
      ]
    }]
  }
}, {
  name: "alerts",
  label: "Alerts"
}, {
  name: "sounds",
  label: "Sounds",
  forms: (i18n) => {
    return [{
      title: i18n.t("Adhan"),
      settings: [{
        title: i18n.t("Play adhan at prayer times"),
        setting: "AutoplayAdhan",
      }, {
        title: i18n.t("Fajr"),
        setting: "FajrAutoplayAdhan",
        hidden: (sm) => sm.getValue("AutoplayAdhan"),
      }, {
        title: i18n.t("Dhuhr"),
        setting: "DhuhrAutoplayAdhan",
        hidden: (sm) => sm.getValue("AutoplayAdhan"),
      }, {
        title: i18n.t("Asr"),
        setting: "AsrAutoplayAdhan",
        hidden: (sm) => sm.getValue("AutoplayAdhan"),
      }, {
        title: i18n.t("Maghrib"),
        setting: "MaghribAutoplayAdhan",
        hidden: (sm) => sm.getValue("AutoplayAdhan"),
      }, {
        title: i18n.t("Isha"),
        setting: "IshaAutoplayAdhan",
        hidden: (sm) => sm.getValue("AutoplayAdhan"),
      }]
    }, {
      title: i18n.t("Muezzin"),
      settings: [{
        title: i18n.t("Fajr"),
        setting: "FajrAdhanSound"
      }, {
        title: i18n.t("Dhuhr"),
        setting: "DhuhrAdhanSound"
      }, {
        title: i18n.t("Asr"),
        setting: "AsrAdhanSound"
      }, {
        title: i18n.t("Maghrib"),
        setting: "MaghribAdhanSound"
      }, {
        title: i18n.t("Isha"),
        setting: "IshaAdhanSound"
      }]
    }]
  },
}]

const page = (props): React$Node => {
  return <div style={{ color: "teal", backgroundColor: "white", width: "100%", height: "100%"}}>{props}</div>
}

const Settings = (props): React$Node => {
  const history = useHistory();
  const { i18n } = useTranslation();
  const match = useRouteMatch();
  const [selected, setSelected] = useState("");

  const navigate = (name) => {
    setSelected(name)
    history.push(`${match.path}/${name}`)
  }

  return <Main>
    <Menu>
      {
        SETTINGS.map( s => {
          return <MenuItem
            name={s.name}
            className={`${ (selected === s.name || (!selected && s.name === "general")) ? "active" : "" }`}
            direction={props.direction}
            onClick={() => navigate(s.name)}
          >
              { i18n.t(s.label) }
          </MenuItem>
        })
      }
    </Menu>
    <Content>
      <Switch key={match.path}>
        {SETTINGS.map(s => {
          const forms = s.forms ? s.forms(i18n) : []
          return <Route key={`route-${s.name}`} path={`${match.path}/${s.name}`}
            render={
              () => <SettingsPage
                title={i18n.t(s.label)}
                forms={forms}
              />
            }
          />
        })}
        <Redirect from="/" to={`${match.path}/general`} />
        <Route path={match.path}>
          <h3>{ i18n.t("PageNotFound") }</h3>
        </Route>
      </Switch>
    </Content>
  </Main>
}

const mapStateToProps = state => ({
  direction: state.config.general.direction,
})

export default (connect(mapStateToProps)(Settings): any)
