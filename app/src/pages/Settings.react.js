/*
* @flow
*/
import React, { useEffect, useState, useMemo } from "react";

import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Switch, Route, useRouteMatch, useHistory, useLocation } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";


const Main = styled.section`
  display: grid;
  grid-template-columns: 25% auto;
  grid-gap: 1rem;
  margin: 2rem;
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
  name: "",  /* we need to use it as index page */
  label: "General"
}, {
  name: "display",
  label: "Display"
}, {
  name: "prayer",
  label: "Prayer Times"
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
            className={`${ selected === s.name ? "active" : "" }`}
            direction={props.direction}
            onClick={() => navigate(s.name)}
          >
            { i18n.t(s.label) }
          </MenuItem>
        })
      }
    </Menu>
    <Content>
      <Switch>
        {SETTINGS.map(s => {
          return <Route exact path={`${match.path}/${s.name}`}
            component={() => page(s.name)}
          />
        })}
        <Route path={match.path}>
          <h3>{ i18n.t("PageNotFound") }</h3>
        </Route>
      </Switch>
    </Content>
  </Main>
}


const MemoizedSettings = (props): React$Node => {

  const result = useMemo(
    () => {
    return <Settings
      direction={props.direction}
      settings={props.settings}
    />
  }, [props.direction, props.settings]);

  return result;
}


const mapStateToProps = state => ({
  direction: state.config.present.general.direction,
  settings: state.config.present.settings,
})

export default (connect(mapStateToProps)(MemoizedSettings): any)
