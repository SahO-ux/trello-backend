export const convertSearchTermtoRegex = (inputString) => {
  if (
    !inputString ||
    inputString === "" ||
    typeof inputString === "undefined"
  ) {
    return inputString;
  }

  // Escape special regex characters
  inputString = inputString.replace(
    /([~!@#$%^&*()_|+\-=?;:'"<>\{\}\[\]\\])/g,
    "\\$1"
  );

  // Replace periods, commas, newlines, and spaces with a pattern
  // that matches these characters followed by any number of whitespace characters
  inputString = inputString.replace(/[\.,\s\n]+/g, "[.,\\s\\n]*");

  // Create a RegExp object with the modified string
  inputString = new RegExp(inputString, "im");
  return inputString;
};
