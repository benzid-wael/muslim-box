/*
* @flow
*/
import type { GeoCoordinates, Slide } from "@src/types";

import React, { useEffect } from "react";
import { ConnectedRouter } from "connected-react-router";
import { connect } from "react-redux";
import store, { history } from "@redux/store";
import styled from "styled-components";

import i18n from "@localization/i18n.config";
import { changeLanguage } from "@redux/slices/configSlice";
import { setBackendURLs, setCoordinates } from "@redux/slices/userSlice";
import { computePrayerTimes, updatePrayerTimes } from "@redux/slices/prayerTimesSlice";

import Nav from "./nav";
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
}>

type Props = $ReadOnly<{
  ...StateProps,
  history: typeof history,
}>;

const Root = (props: Props) => {
  const { history } = props;

  useEffect(() => {
    props.dispatch(computePrayerTimes(props.coordinates));
  }, [props.day, props.coordinates])

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
    <Main>
      <ConnectedRouter history={history}>
        {/* <Nav history={history}></Nav> */}
        <Routes></Routes>
      </ConnectedRouter>
    </Main>
  );
}

const mapStateToProps = state => ({
  coordinates: state.user.coordinates,
  timestamp: state.prayerTimes.timestamp,
  day: state.prayerTimes.day,
  slides: state.slide.slides,
})

export default (connect(mapStateToProps)(Root): any)
