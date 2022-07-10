/*
* @flow
*/
import React from "react"
import styled from "styled-components"

const Main = styled.div`
  disply: inline;
`;

const VerseNumber = styled.span`
  padding: 0 2.5rem;
  display: inline-block;
  position: relative;
  font-size: 1.2rem;

  &::after {
    content: "\u06dd";
    display: block;
    position: absolute;
    font-size: 4rem;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`

type Props = $ReadOnly<{
    verse: string,
    surah?: string,
    verseNumber?: number,
    isSajda: boolean,
}>

const Ayah = (props: Props): React$MixedElement => {
    return <Main className="Quran">
      {props.verse}
      {props.verseNumber ? <VerseNumber>{props.verseNumber}</VerseNumber> : null}
    </Main>
}

export default Ayah
