import React from "react";
import { ConnectedRouter } from "connected-react-router";
import { Provider } from "react-redux";

import Routes from "Core/routes";
import i18n from "I18n/i18n.config";
import { changeLanguage } from "Redux/slices/configSlice";
import store from "Redux/store";

import Nav from "./nav";
import "./root.css";

window.api.i18nextElectronBackend.onLanguageChange((args) => {
  i18n.changeLanguage(args.lng, (error, t) => {
    if (error) {
      console.error(`cannot change language: ${error}`);
    } else {
      store.dispatch(changeLanguage(args.lng));
    }
  });
});

class Root extends React.Component {
  render() {
    const { store, history } = this.props;

    return (
      <React.Fragment>
        <Provider store={store}>
          <ConnectedRouter history={history}>
            {/* <Nav history={history}></Nav> */}
            <Routes></Routes>
          </ConnectedRouter>
        </Provider>
      </React.Fragment>
    );
  }
}

export default Root;
