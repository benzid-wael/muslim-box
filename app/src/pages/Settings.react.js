/*
* @flow
*/
import type { SettingConfig } from "@src/Setting";

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";

import "./Settings.css"

const Settings = (props): React$Node => {
  return <div id="tabs-section" class="tabs">
    <ul>
      <li>
        <a href="#tab-1" class="tab-link active"> <span class="material-icons tab-icon">face</span> <span class="tab-label">Face Primer</span></a>
      </li>
      <li>
        <a href="#tab-2" class="tab-link"> <span class="material-icons tab-icon">visibility</span> <span class="tab-label">Foundation</span></a>
      </li>
      <li>
        <a href="#tab-3" class="tab-link"> <span class="material-icons tab-icon">settings_input_hdmi</span> <span class="tab-label">BB Cream</span></a>
      </li>
      <li>
        <a href="#tab-4" class="tab-link"> <span class="material-icons tab-icon">build</span> <span class="tab-label">Concealer</span></a>
      </li>
      <li>
        <a href="#tab-5" class="tab-link"> <span class="material-icons tab-icon">toll</span> <span class="tab-label">Blush</span></a>
      </li>
    </ul>

    <section id="tab-1" class="tab-body entry-content active active-content">
      <h2>Face Primer</h2>
      <p>While some people don’t think that <a href="#">face primer</a> is necessary, I personally view it as a vital step in my makeup routine.</p>
      <p>Face primers’ exact effects on your skin and makeup can vary, but overall, their main purpose is to keep your skin looking smooth and your makeup looking fresh all day long.</p>
    </section>

    <section id="tab-2" class="tab-body entry-content">
      <h2>Foundation</h2>
      <p>Foundation is probably the hardest part of your makeup routine to get right, as you not only have to consider the type of coverage you want (i.e. sheer/natural, medium, or full), but also your skin type and undertones.</p>
      <p>If you are new to wearing foundation or aren’t sure what type/shade is right for you, I’d highly recommend going to your nearest Sephora, MAC, or department store and have a makeup artist help you pick out one that matches your complexion and fits your coverage needs. It’s also a good idea to request a sample if you want to see how a formula feels on your skin before buying.</p>
    </section>

    <section id="tab-3" class="tab-body entry-content">
      <h2>BB Cream</h2>
      <p>Personally, I prefer BB cream to regular foundation, as I find it to be much more natural-looking. It is a great option if you’re looking for something that has skincare benefits such as moisturizing or priming (some BB creams have primer built in).</p>
      <p>In addition, if you are new to the makeup world, a good BB cream is an even better place to start than foundation, as it feels lighter on the skin, is hard to overdo, and can be applied with your fingers.</p>
    </section>

    <section id="tab-4" class="tab-body entry-content">
      <h2>Concealer</h2>
      <p>If you have acne, dark circles, or any kind of discoloration, concealer is a must-have.</p>
      <p>Concealers come in full-coverage and sheerer-coverage formulations, and which one you should choose depends on how much you’re trying to cover up.</p>
      <p>When choosing a concealer for acne and/or discoloration, find a shade that is as close as possible to your foundation/BB cream shade for the most natural look.</p>
    </section>

    <section id="tab-5" class="tab-body entry-content">
      <h2>Blush</h2>
      <p>Putting on blush can have a huge effect on your overall look, and I personally never leave it out of my makeup routine. Blush is especially necessary if you’re wearing a foundation with more opaque coverage, which can sometimes leave your complexion looking a little bit flat.</p>
      <p>Blush comes in powder, gel, and cream formulations, with powder being the most popular. Recently, though, cream and gel blush have become very popular as well.</p>
    </section>
  </div>
}

export default Settings;
