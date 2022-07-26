/*
* @flow
*/
import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Switch, Route, useRouteMatch, useHistory } from "react-router";
import { Redirect } from "react-router-dom";
import styled from "styled-components";

import SettingsPage from "@components/SettingsPage.react";
import { SettingsManager } from "../SettingsManager";

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
  label: "General"
}, {
  name: "display",
  label: "Display"
}, {
  name: "prayer",
  label: "Prayer Times",
  forms: (sm: SettingsManager, i18n) => {
    return [{
      title: i18n.t("Calculation Method"),
      settings: [{
        title: i18n.t("Method"),
        setting: sm.getSettingByName("Method")
      }, {
        title: i18n.t("Asr"),
        setting: sm.getSettingByName("Madhab")
      }, {
        title: i18n.t("Isha"),
        setting: sm.getSettingByName("Shafaq")
      }]
    }, {
      title: i18n.t("Other Settings"),
      settings: [{
        title: i18n.t("High Latitude Rule"),
        setting: sm.getSettingByName("HighLatitudeRule"),
        help: i18n.t("Used to set a minimum time for Fajr and a max time for Isha when Fajr and Isha dissapears")
      }, {
        title: i18n.t("Polar Circle"),
        setting: sm.getSettingByName("PolarCircleResolution"),
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
  label: "Sounds"
}]

const page = (props): React$Node => {
  return <div style={{ color: "teal", backgroundColor: "white", width: "100%", height: "100%"}}>{props}</div>
}

const Settings = (props): React$Node => {
  const history = useHistory();
  const { i18n } = useTranslation();
  const match = useRouteMatch();
  const [selected, setSelected] = useState("");
  const sm = SettingsManager.fromConfigs(props.settings)

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
          return <Route key={`route-${s.name}`} path={`${match.path}/${s.name}`}
            render={
              () => <SettingsPage
                title={i18n.t(s.label)}
                forms={s.forms ? s.forms(sm, i18n) : []}
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
  settings: state.config.settings,
})

export default (connect(mapStateToProps)(Settings): any)
