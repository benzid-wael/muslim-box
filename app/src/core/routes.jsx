import React from "react";
import { Switch, Route } from "react-router";
import loadable from "@loadable/component";

import ROUTES from "@constants/routes";

// Load bundles asynchronously so that the initial render happens faster
const Home = loadable(() =>
  import(/* webpackChunkName: "HomeChunk" */ "@pages/Home.react")
);

class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path={ROUTES.Home} component={Home}></Route>
        {/* <Route path={ROUTES.ABOUT} component={About}></Route> */}
      </Switch>
    );
  }
}

export default Routes;
