import React from "react";
import { Switch, Route } from "react-router";
import ROUTES from "Constants/routes";
import loadable from "@loadable/component";

// Load bundles asynchronously so that the initial render happens faster
// const ContextMenu = loadable(() =>
//   import(/* webpackChunkName: "ContextMenuChunk" */ "Pages/contextmenu/contextmenu")
// );

class Routes extends React.Component {
  render() {
    return (
      <Switch>
        {/*
        <Route exact path={ROUTES.WELCOME} component={Welcome}></Route>
        <Route path={ROUTES.ABOUT} component={About}></Route>
        */}
      </Switch>
    );
  }
}

export default Routes;
