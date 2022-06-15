import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";

import Root from "@core/root";
import i18n from "@localization/i18n.config";
import store, { history } from "@redux/store";
// import "bulma/css/bulma.css";

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>
      <Suspense fallback="loading">
        <Root history={history} />
      </Suspense>
    </Provider>
  </I18nextProvider>,
  document.getElementById("target")
);
