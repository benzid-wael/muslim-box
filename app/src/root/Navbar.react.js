/*
* @flow
*/
import type { LayoutDirection } from "@src/types";

import React, { useCallback, useState, useEffect } from "react";

import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  validateLicenseRequest,
  validateLicenseResponse,
} from "secure-electron-license-keys";
import { connect } from "react-redux";

import ROUTES from "@constants/routes";
import homeIcon from "@resources/icons/home.svg";
import settingsIcon from "@resources/icons/settings.svg";


const Main = styled.section`
  // position: absolute;
  // z-index: 100;
  top: 0;
  height: 3rem;
  width: 100%;
  background-color: white;
  color: teal;

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

  -webkit-animation: ${props => props.event} 1s ease;
  animation: ${props => props.event} 1s ease;
  -webkit-animation-iteration-count: 1;
  animation-iteration-count: 1;
`

const Menu = styled.div`
  display: flex;
  justify-content: ${props => props.direction === "rtl" ? "flex-start" : "flex-end"};
  width: 100%;
  height: 100%;
`

const MenuItem = styled.div`
  display: inline;
  padding: 8px;
  margin: 0;
  z-index: 1000;
  cursor: not-allowed;
`

type ComponentProps = $ReadOnly<{
  open: boolean,
}>

type StateProps = $ReadOnly<{
  direction: LayoutDirection,
}>

type Props = ComponentProps & StateProps;

const Navbar = (props: Props): React$Node => {
  const { open, direction } = props;
  const history = useHistory();
  const [state, setState] = useState({
    open: false,
    event: "",
    direction: "ltr",
    licenseModalActive: false,
  })

  const openNavbar = () => {
    setState({...state, open: true, event: "opening"})
  }

  const closeNavbar = () => {
    setState({...state, event: "closing"})
    setTimeout(() => { setState({...state, open: false, event: "closed"}) }, 1000)
  }

  useEffect(() => {
    if(!state.open && open) {
      openNavbar()
    } else if (state.open && !open && !state.licenseModalActive) {
      closeNavbar()
    }
  }, [open])

  useEffect(() => {
    setState({...state, direction})
  }, [direction])

  // Using a custom method to navigate because we
  // need to close the mobile menu if we navigate to
  // another page
  const navigate = (url) => {
    console.log(`navigate to ${url}`)
    history.push(url)
    closeNavbar()
  }

  const toggleLicenseModal = () => {
    if(!open) {
      closeNavbar()
    }
    setState({
      ...state,
      licenseModalActive: !state.licenseModalActive,
    });
  }

  if(!state.open) return null

  return <Main event={state.event}>
    <Menu>
      <MenuItem onClick={() => console.error(`navigation brokenn`)}>
        <Link to={ROUTES.SETTINGS}>
        <img src={settingsIcon} style={{ height: "100%" }}/>
        </Link>
      </MenuItem>

      <MenuItem onClick={() => navigate(ROUTES.HOME)}>
        <Link to={ROUTES.SETTINGS}>
        <img src={homeIcon} style={{ height: "100%" }}/>
        </Link>
      </MenuItem>
    </Menu>
  </Main>
}

const mapStateToProps = state => ({
  direction: state.config.present.general.direction,
})

export default (connect(mapStateToProps)(Navbar): any)
