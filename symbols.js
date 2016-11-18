const ALPHA_LETTERS = (function() {
  var result = [], i;

  for (i = 97; i <= 122; i++) { // ord(a) = 97, ord(z) = 122
    result.push(String.fromCharCode(i));
  }
  for (i = 65; i <= 90; i++) { // ord(A) = 65, ord(Z) = 90
    result.push(String.fromCharCode(i));
  }

  return result;
})();

const ALPHA_LETTERS_PLUS_DIGITS = ALPHA_LETTERS.concat([
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
]);

exports.ALPHA_LETTERS = ALPHA_LETTERS;
exports.ALPHA_LETTERS_PLUS_DIGITS = ALPHA_LETTERS_PLUS_DIGITS;
