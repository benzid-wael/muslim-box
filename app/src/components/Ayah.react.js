/*
* @flow
*/
import type { Language, MultilingualString } from "@src/types"

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
    verse: MultilingualString,
    language: Language,
    verseId?: number,
}>

const Ayah = (props: Props): React$MixedElement => {
    const content = new Map(Object.entries(props.verse))
    return <Main className="Quran">
      {content.get(props.language)}
      {props.verseId ? (
          <VerseNumber>{props.verseId}</VerseNumber>
      ) : null}
    </Main>
}

export default Ayah
