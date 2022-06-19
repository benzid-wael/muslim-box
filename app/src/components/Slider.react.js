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
  slides: state.slide.slides,
  position: state.slide.position
})

const Slider = (props): React$Node => {
  const { position, slides } = props;

  useEffect(() => {
    // let"s have static duration for all slides right now
    // TODO we need to find out the minimum duration for each slide on a per slide basis
    const duration = slides.length > 0
      ?
      slides[position].durationInSeconds || 10
      :
      .3  // by default 3ms
    ;
    console.log(`sliding after ${duration} seconds`)
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
  }, [position])

  const loadSlides = async (): Promise<Array<Slide>> => {
    const loader = SlideLoaderFactory.getLoader()
    const slides = await loader.load();
    return slides;
  }

  const onReachEnd = async () => {
    console.log(`onReachEnd called`)
    const loader = SlideLoaderFactory.getLoader()
    const slides = await loader.load()
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
