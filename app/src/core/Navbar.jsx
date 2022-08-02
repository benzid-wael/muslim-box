import React, { useCallback, useState, useEffect } from "react";

import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { validateLicenseRequest, validateLicenseResponse } from "secure-electron-license-keys";

import ROUTES from "@constants/routes";
import homeIcon from "@resources/images/icons/home.svg";
import settingsIcon from "@resources/images/icons/settings.svg";
import "bulma/css/bulma.css";

const Nav = styled.nav`
  // overflow-x: hidden; /* Disable horizontal scroll */

  @keyframes opening {
    from {
      -webkit-transform: translateY(100%);
      -ms-transform: translateY(100%);
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      -webkit-transform: translateY(0);
      -ms-transform: translateY(0);
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes closing {
    from {
      -webkit-transform: translateY(0);
      -ms-transform: translateY(0);
      transform: translateY(0);
      opacity: 1;
    }
    to {
      -webkit-transform: translateY(100%);
      -ms-transform: translateY(100%);
      transform: translateY(100%);
      opacity: 0;
    }
  }

  -webkit-animation: ${(props) => props.event} 1s ease;
  animation: ${(props) => props.event} 1s ease;
  -webkit-animation-iteration-count: 1;
  animation-iteration-count: 1;
`;

const License = (props): React$Node => {
  const [open, setOpen] = useState(false);
  const [license, setLicense] = useState({
    licenseValid: false,
    allowedMajorVersions: "",
    allowedMinorVersions: "",
    appVersion: "",
    licenseExpiry: "",
  });

  useEffect(() => {
    if (!open && props.open) {
      setOpen(true);
    }
  }, [props.open]);

  useEffect(() => {
    window.api.licenseKeys.onReceive(validateLicenseResponse, function (data) {
      // If the license key/data is valid
      if (data.success) {
        // Here you would compare data.appVersion to
        // data.major, data.minor and data.patch to
        // ensure that the user's version of the app
        // matches their license
        setLicense({
          licenseValid: true,
          allowedMajorVersions: data.major,
          allowedMinorVersions: data.minor,
          allowedPatchVersions: data.patch,
          appVersion: data.appVersion,
          licenseExpiry: data.expire,
        });
      } else {
        setLicense({
          licenseValid: false,
        });
      }
    });

    // cleanup function: will be executed before unmount
    return () => {
      window.api.licenseKeys.clearRendererBindings();
    };
  });

  const onClose = () => {
    setOpen(false);
    props?.onClose();
  };

  return (
    <div className={`modal ${!!open ? "is-active" : ""}`}>
      <div className="modal-background"></div>
      <div className="modal-content">
        {license.licenseValid ? (
          <div className="box">
            The license key for this product has been validated and the following versions of this app are allowed for
            your use:
            <div>
              <strong>Major versions:</strong> {license.allowedMajorVersions} <br />
              <strong>Minor versions:</strong> {license.allowedMinorVersions} <br />
              <strong>Patch versions:</strong> {license.allowedPatchVersions} <br />
              <strong>Expires on:</strong> {!license.licenseExpiry ? "never!" : license.licenseExpiry} <br />(
              <em>
                App version:
                {` v${license.appVersion.major}.${license.appVersion.minor}.${license.appVersion.patch}`}
              </em>
              )
              <br />
            </div>
          </div>
        ) : (
          <div className="box">
            <div>The license key is not valid.</div>
            <div>
              If you'd like to create a license key, follow these steps:
              <ol style={{ marginLeft: "30px" }}>
                <li>
                  Install this package globally (<strong>npm i secure-electron-license-keys-cli -g</strong>).
                </li>
                <li>
                  Run <strong>secure-electron-license-keys-cli</strong>.
                </li>
                <li>
                  Copy <strong>public.key</strong> and <strong>license.data</strong> into the <em>root</em> folder of
                  this app.
                </li>
                <li>
                  Re-run this app (ie. <strong>npm run dev</strong>).
                </li>
                <li>
                  If you'd like to further customize your license keys, copy this link into your browser:{" "}
                  <a href="https://github.com/reZach/secure-electron-license-keys-cli">
                    https://github.com/reZach/secure-electron-license-keys-cli
                  </a>
                  .
                </li>
              </ol>
            </div>
          </div>
        )}
      </div>
      <button className="modal-close is-large" aria-label="close" onClick={onClose}></button>
    </div>
  );
};

const Navbar = (props): React$Node => {
  const { open } = props;
  const history = useHistory();
  const [state, setState] = useState({
    open: false,
    event: "",
    mobileMenuActive: false,
    licenseModalActive: false,
  });

  const openNavbar = () => {
    setState({ ...state, open: true, event: "opening" });
  };

  const closeNavbar = () => {
    // setState({...state, event: "closing"})
    // setTimeout(() => { setState({...state, open: false, event: "closed"}) }, 1000)
  };

  useEffect(() => {
    if (!state.open && open) {
      openNavbar();
    } else if (state.open && !open && !state.licenseModalActive) {
      closeNavbar();
    }
  }, [open]);

  // Using a custom method to navigate because we
  // need to close the mobile menu if we navigate to
  // another page
  const navigate = (url) => {
    history.push(url);
    closeNavbar();
  };

  const toggleLicenseModal = () => {
    if (!open) {
      closeNavbar();
    }
    setState({
      ...state,
      licenseModalActive: !state.licenseModalActive,
    });
  };

  const toggleMobileMenu = () => {
    setState({
      ...state,
      mobileMenuActive: !state.mobileMenuActive,
    });
  };

  if (!state.open) return null;

  const mobileMenuActive = state.open && state.mobileMenuActive;
  const desktopMenuActive = state.open && !state.mobileMenuActive;

  return (
    <Nav className="navbar" role="navigation" aria-label="main navigation" event={state.event}>
      <div className="navbar-brand">
        <a
          role="button"
          className={`navbar-burger ${mobileMenuActive ? "is-active" : ""}`}
          data-target="navbarBasicExample"
          aria-label="menu"
          aria-expanded="false"
          onClick={toggleMobileMenu}>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div id="navbarBasicExample" className={`navbar-menu ${desktopMenuActive ? "is-active" : ""}`}>
        <License open={state.licenseModalActive} onClose={toggleLicenseModal} />

        <div className="navbar-end">
          <a className="navbar-item" onClick={() => navigate(ROUTES.SETTINGS)}>
            <img src={settingsIcon} style={{ height: "100%" }} />
          </a>
          <a className="navbar-item" onClick={() => navigate(ROUTES.HOME)}>
            <img src={homeIcon} style={{ height: "100%" }} />
          </a>
          {/* <Link path={ROUTES.HOME} className="navbar-item">
            <img src={homeIcon} style={{ height: "100%" }}/>
          </Link> */}
          <div className="navbar-item">
            <div className="buttons">
              <a className="button is-light" onClick={toggleLicenseModal}>
                Check license
              </a>
            </div>
          </div>
        </div>
      </div>
    </Nav>
  );
};

export default Navbar;
