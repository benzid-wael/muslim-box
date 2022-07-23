import React from "react";
import { Switch, Route, useLocation } from "react-router";
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

const NoMatch = () => {
  let location = useLocation();

  return (
    <div>
      <h3>
        No match for <code>{location.pathname}</code>
      </h3>
    </div>
  );
}


class MyRoutes extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path={ROUTES.HOME} component={Home}></Route>
        <Route exact path={ROUTES.Settings} component={Settings}></Route>
        <Route path="*" component={NoMatch} />
      </Switch>
    );
  }
}

export default MyRoutes;
