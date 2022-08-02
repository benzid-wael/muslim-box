/*
 * @flow
 */

export const capitalize = (word: string, lowerRest: boolean = false) => {
  if (!word) {
    return "";
  }

  const [first, ...rest]: [string, string] = word;
  return first.toUpperCase() + (lowerRest ? rest.join("").toLowerCase() : rest.join(""));
};
