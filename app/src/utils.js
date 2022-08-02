/*
 * @flow
 */

export const capitalize = (word, lowerRest = false) => {
  if (!word) {
    return "";
  }

  const [first, ...rest] = word;
  return first.toUpperCase() + (lowerRest ? rest.join("").toLowerCase() : rest.join(""));
};
