import React from "react";

import { useTranslation } from "react-i18next";
import { Switch, Route, useLocation } from "react-router";
import { Redirect } from "react-router-dom";
import loadable from "@loadable/component";

import ROUTES from "@constants/routes";

// Load bundles asynchronously so that the initial render happens faster
const Home = loadable(() =>
  import(/* webpackChunkName: "HomeChunk" */ "@pages/Home.react")
);

// Load bundles asynchronously so that the initial render happens faster
const Settings = loadable(() =>
  import(/* webpackChunkName: "SettingsChunk" */ "@pages/Settings.react")
);

// Load bundles asynchronously so that the initial render happens faster
const Adhan = loadable(() =>
  import(/* webpackChunkName: "AdhanChunk" */ "@pages/Adhan.react")
);

const NoMatch = () => {
  const location = useLocation();
  const { i18n } = useTranslation();

  return (
    <div>
      <h3>
        { i18n.t("PageNotFound") } <code>{location.pathname}</code>
      </h3>
    </div>
  );
}


class MyRoutes extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path={ROUTES.HOME} component={Home}></Route>
        <Route path={ROUTES.SETTINGS} component={Settings}></Route>
        <Route path={ROUTES.ADHAN} component={Adhan}></Route>
        <Route path="*" component={NoMatch} />
      </Switch>
    );
  }
}

export default MyRoutes;
