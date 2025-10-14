/**
 * Function to capitalize the first letter of each word in a string
 * This function handles both normal and accented characters
 * It also handles spaces, hyphens, and periods as word separators
 * 
 * @param {string} str - The input string to capitalize
 * @returns {string} - The capitalized string
 */
const capitalizeWords = (str) => {
  if (!str) return "";
  let result = "";
  let capitalizeNext = true;
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const lowerChar = char.toLowerCase();
    const upperChar = char.toUpperCase();
    const isLetter = lowerChar !== upperChar;
    if (capitalizeNext && isLetter) {
      result += upperChar;
      capitalizeNext = false;
    } else if (isLetter) {
      result += lowerChar;
      capitalizeNext = false;
    } else {
      result += char;
      if (char === ' ' || char === '-' || char === '.') {
        capitalizeNext = true;
      } else {
        capitalizeNext = false;
      }
    }
  }
  return result;
};

export default capitalizeWords;
