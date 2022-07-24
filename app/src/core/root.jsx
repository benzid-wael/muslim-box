/*
* @flow
*/
import type { GeoCoordinates, Slide } from "@src/types";
import type { SettingConfig } from "@src/Setting";

import React, { useEffect, useState } from "react";
import { ConnectedRouter } from "connected-react-router";
import { connect } from "react-redux";
import store, { history } from "@redux/store";
import styled from "styled-components";

import i18n from "@localization/i18n.config";
import { changeLanguage, loadSettings } from "@redux/slices/configSlice";
import { setBackendURLs, setCoordinates } from "@redux/slices/userSlice";
import { computePrayerTimes, updatePrayerTimes } from "@redux/slices/prayerTimesSlice";

import { SettingsManager } from "@src/SettingsManager";
import Navbar from "./Navbar";
import Routes from "./routes";
import "./root.css";


const loadI18nResources = (language) => {
  console.info(`[Renderer] language changed event received`);
  i18n.changeLanguage(language, (error, t) => {
    if (error) {
      console.error(`[Renderer] cannot change language: ${error}`);
    } else {
      store.dispatch(changeLanguage(language));
    }
  });
}

window.api.i18nextElectronBackend.onLanguageChange((args) => {
  loadI18nResources(args.lng);
});

window.api.onLanguageInitialized((message) => {
  loadI18nResources(message.language);
});

window.api.onGeocoordinatesChanged((message) => {
  console.log(`[Renderer] geo-coordinates changed: ${JSON.stringify(message)}`);
  store.dispatch(setCoordinates(message));
});

window.api.onBackendUrlChanged((message) => {
  store.dispatch(setBackendURLs(message));
});

const Main = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  background: teal;
  color: white;
`;

type StateProps = $ReadOnly<{
  coordinates: GeoCoordinates,
  timestamp: number,
  day: string,
  dispatch: (any) => void,
  slides: $ReadOnlyArray<Slide>,
  backendURL: string,
  settings: Array<SettingConfig>,
}>

type Props = $ReadOnly<{
  ...StateProps,
  history: typeof history,
}>;

const Root = (props: Props) => {
  const { history } = props;
  const [navbar, setNavbar] = useState(false);

  useEffect(() => {
    props.dispatch(loadSettings(props.backendURL));
  }, [props.backendURL])

  useEffect(() => {
    if(!props.settings || !props.coordinates) return

    const sm = SettingsManager.fromConfigs(props.settings);
    props.dispatch(computePrayerTimes(props.coordinates, sm));
  }, [props.day, props.coordinates, props.settings])

  useEffect(() => {
    const timer = setTimeout(
      () => {
        props.dispatch(updatePrayerTimes());
      },
      1000
    )
    return () => clearTimeout(timer)
  }, [props.timestamp])

  return (
    <Main
      onMouseMove={(event) => {
        if(!navbar && event.clientY < 50) {
          setNavbar(true);
        } else if(navbar && event.clientY >= 50) {
          setNavbar(false);
        }
      }}
    >
      <ConnectedRouter history={history}>
        <Navbar open={navbar} />
        <Routes />
      </ConnectedRouter>
    </Main>
  );
}

const mapStateToProps = state => ({
  coordinates: state.user.coordinates,
  timestamp: state.prayerTimes.timestamp,
  day: state.prayerTimes.day,
  slides: state.slide.slides,
  backendURL: state.user.backendURL,
  settings: state.config.present.settings,
})

export default (connect(mapStateToProps)(Root): any)
