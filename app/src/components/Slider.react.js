/*
* @flow
*/
import type { Slide } from "@src/types";
import type { SliderSettings } from "@src/SliderSettings";

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";

import AdhanSlide from "@components/AdhanSlide.react";
import SlideBuilder from "@components/SlideBuilder.react";
import { addSlides, moveNext, setPosition, resetSlides } from "@redux/slices/slideSlice";
import { SlideLoaderFactory } from "@src/SlideLoader";

const Main = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
`

/* NOTE: will-change forces the browser to place the element
*   in a new layer. Placing elements in a new layer ensure that
*   they will be repainted without requiring the rest of the page
*   to be repainted as well.
*
* Layer creation can result in other performance issues. Thus,
*   this property should not be used as a premature optimization.
*   Instead, you should only use it when you are seeing jank
*   and think that promoting the element to a new layer may help.
*/
const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;

  & > div {
    // will-change: transform, opacity;

    @keyframes SlideIn {
      from {
        -webkit-transform: translateY(-100%);
        -ms-transform: translateY(-100%);
        transform: translateY(-100%);
        opacity: 0;
      }

      to {
        -webkit-transform: translateY(0);
        -ms-transform: translateY(0);
        transform: translateY(0);
        opacity: 1;
      }
    }

    @keyframes SlideOut {
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

    -webkit-animation: ${props => props.animation} 3s ease;
    animation: ${props => props.animation} 3s ease;
    -webkit-animation-iteration-count: 1;
    animation-iteration-count: 1;
  }
`

const mapStateToProps = state => ({
  language: state.config.general.language,
  slides: state.slide.slides,
  position: state.slide.position,
  backendURL: state.user.backendURL,
  timestamp: state.prayerTimes.timestamp,
})

const Slider = (props): React$Node => {
  const { language, position, slides, timestamp, settings } = props;
  const [timer, setTimer] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [animation, setAnimation] = useState("enter")

  const slide = position >= 0 && position < slides.length ? slides[position] : null;

  useEffect(() => {
    console.log(`[Slider] language changed: reloading slides`)
    const t = setTimeout(
      async () => {
        const slides = await loadSlides()
        props.dispatch(resetSlides(slides));
    }, 100)
    return () => clearTimeout(t)
  }, [language])

  useEffect(() => {
    console.debug(`[Slider] timer: ${timer}`)
    setTimer(timer => timer - 1);
    if(timer > 0) {
      if(timer < 2) {
        // enable onExit animation
        setAnimation("onExit");
      }
    } else if (!loading) {
      // Lock further calls to transitions until
      // Once the slide hass been loaded, we will update the timer and
      //  unlock transitions

      setLoading(true);
      const t = setTimeout(() => {
        transition();
      }, 100)
      return () => clearTimeout(t)
    }

    // NOTE: we don't want to fall into a blackhole
    if (timer < -5) {
      setLoading(false);
      setTimer(0);
    }
  }, [timestamp])

  /* Compute current slide duration and update the timer */
  useEffect(() => {
    const duration = slides.length > 0
      ?
      settings.slideDurationInSeconds(slides[position])
      :
      .3  // by default 3ms
    ;

    console.log(`[Slider] sliding after ${duration}s`)
    setTimer(duration);
    setLoading(false);
    // activate onEnter animation
    setAnimation("onEnter");
  }, [position])

  const transition = async () => {
    console.log(`[Slider] transition: ${position}/${slides.length - 1}`)
    if (position < slides.length - 1) {
      props.dispatch(moveNext())
    } else if (settings.onReachEndStrategy === "load") {
      console.warn(`[Slider] loading more slides...`)
      // load more slides
      const slides = await loadSlides()
      if(slides.length > settings.maxSlidesBeforeReset) {
        props.dispatch(resetSlides(slides));
      } else {
        props.dispatch(addSlides(slides));
        // When adding new slides, we need to explicitly
        //  call transition to resume sliding
        props.dispatch(moveNext());
      }
    } else {
      // by default
      props.dispatch(moveNext())
    }
  }

  const loadSlides = async (): Promise<Array<Slide>> => {
    console.log(`[Slider] loadSlides...`)
    if(!props.backendURL || !settings) return []

    const loader = SlideLoaderFactory.getLoader({
      settings,
      backendURL: props.backendURL,
    })
    const lang = language.split("-")[0]
    const slides = await loader.random(settings.pageSize, lang);
    return slides;
  }

  const cssKeyframe = animation === "onEnter" ? "SlideIn" : (
    animation === "onExit" ? "SlideOut" : ""
  )

  return props.slides.length === 0 ? <></> : (
    <Main>
      <Container
        animation={settings.animation ? cssKeyframe : ""}
        onClick={transition}
      >
        <SlideBuilder slide={slide} />
      </Container>
    </Main>
  )
}

export default (connect(mapStateToProps)(Slider): any)
