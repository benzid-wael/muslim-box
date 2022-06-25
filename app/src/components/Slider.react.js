/*
* @flow
*/
import type { Slide } from "@src/types";

import React, { useEffect } from "react"
import { connect } from "react-redux"
import { animated, Transition, config } from "react-spring"
import styled from "styled-components"

import { addSlides, moveNext, resetSlides } from "@redux/slices/slideSlice"
import SlideBuilder from "@components/SlideBuilder.react"
import { SlideLoaderFactory } from "@src/SlideLoader";


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
    // let"s have static duration for all slides right now
    // TODO we need to find out the minimum duration for each slide on a per slide basis
    const duration = slides.length > 0
      ?
      slides[position].durationInSeconds || 10
      :
      .3  // by default 3ms
    ;
    const timer = setTimeout(
      async () => {
        if(props.slides.length === 0) {
          console.log(`[Slider] loading slides after ${duration} seconds`)
          const slides = await loadSlides()
          props.dispatch(resetSlides(slides));
        } else {
          console.log(`[Slider] sliding after ${duration} seconds`)
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
    }, 200)
    return () => clearTimeout(timer)
  }, [language])

  const loadSlides = async (): Promise<Array<Slide>> => {
    console.log(`loadSlides...`)
    const loader = SlideLoaderFactory.getLoader({
      provider: "database",
      backendURL: props.backendURL,
    })
    if(!loader) return []
    const lang = language.split("-")[0]
    const slides = await loader.load(10, lang);
    return slides;
  }

  const onReachEnd = async () => {
    console.log(`onReachEnd called`)
    const slides = await loadSlides()
    if(slides.length > 1000) {
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
