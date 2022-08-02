import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";
import * as Sentry from "@sentry/electron";

import Root from "@root/Root.react";
import i18n from "@localization/i18n.config";
import store, { history } from "@redux/store";

Sentry.init({ dsn: "https://7be09d9523de40bc84b57affd0b45e22@o100308.ingest.sentry.io/6475421" });

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
