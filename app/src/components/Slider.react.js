/*
* @flow
*/
import type { Slide } from "@src/types";

import React, { useEffect } from "react";
import { connect } from "react-redux";
import { animated, Transition, config } from "react-spring";
import styled from "styled-components";

import { addSlides, moveNext, resetSlides } from "@redux/slices/slideSlice";
import SlideBuilder from "@components/SlideBuilder.react";
import { SlideLoaderFactory } from "@src/SlideLoader";
import AdhanSlide from "./AdhanSlide.react";

import SLIDER from "@constants/slider";

const Main = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
`

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
  & > div {
    will-change: transform, opacity;
    position: relative;
    width: 100%;
    height: 100%;
  }
  overflow: unset;
`

const mapStateToProps = state => ({
  language: state.config.present.general.language,
  slides: state.slide.slides,
  position: state.slide.position,
  backendURL: state.user.backendURL,
})

const Slider = (props): React$Node => {
  const { language, slides, position } = props;

  useEffect(() => {
    const wordsCount = slides[position]?.content.split(" ").length
    const durationInSeconds = ((wordsCount / SLIDER.WordsPerMinute) * 60) + 2
    console.log(`[Slider] slide contains ${wordsCount} words, requires ${durationInSeconds}s`)
    const duration = slides.length > 0
      ?
      Math.max(slides[position].durationInSeconds || durationInSeconds, SLIDER.MinimumSlideDurationInSeconds)
      :
      .3  // by default 3ms
    ;
    const timer = setTimeout(
      async () => {
        if(props.slides.length === 0) {
          const slides = await loadSlides()
          props.dispatch(resetSlides(slides));
        } else {
          transition()
        }
    }, duration * 1000)
    return () => clearTimeout(timer)
  }, [position, slides])

  useEffect(() => {
    console.log(`[Slider] language changed: reloading slides`)
    const timer = setTimeout(
      async () => {
        const slides = await loadSlides()
        props.dispatch(resetSlides(slides));
    }, 100)
    return () => clearTimeout(timer)
  }, [language])

  const loadSlides = async (): Promise<Array<Slide>> => {
    console.log(`loadSlides...`)
    const loader = SlideLoaderFactory.getLoader({
      provider: SLIDER.DefaultProvider,
      backendURL: props.backendURL,
    })
    if(!loader) return []
    const lang = language.split("-")[0]
    const slides = await loader.load(SLIDER.PageSize, lang);
    return slides;
  }

  const onReachEnd = async () => {
    console.log(`onReachEnd called`)
    const slides = await loadSlides()
    if(slides.length > SLIDER.MaxSlidesBeforeReset) {
      props.dispatch(resetSlides(slides));
    } else {
      props.dispatch(addSlides(slides));
      transition();
    }
  }

  const transition = () => {
    props.dispatch(moveNext({onReachEnd: onReachEnd}))
  }

  return props.slides.length === 0 ? <></> : (
    <Main>
      <Container onClick={transition}>
        <Transition
          native
          reset
          unique
          items={position}
          from={{ opacity: 0, transform: "translate3d(100%, 0 ,0)" }}
          enter={{ opacity: 1, transform: "translate3d(0%, 0, 0)" }}
          leave={{ opacity: 0, transform: "translate3d(-50%, 0, 0)" }}
          config={config.molasses}
        >
          {(style, index) => {
            const slide = slides[index];
            return (
              <animated.div style={{
                ...style,
              }}>
                <SlideBuilder slide={slide} />
              </animated.div>
            )
          }}
        </Transition>
      </Container>
    </Main>
  )
}

export default (connect(mapStateToProps)(Slider): any)
