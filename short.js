exports.TokensShortener = function(options) {
  if (!(this instanceof arguments.callee)) return new arguments.callee(options);

  var tokensGenerator = options.tokensGenerator;

  /* Можно:
   *   1. Отсортировать финальное множество -- O(N + M log M)
   *          N -- кол-во встреч токенов
   *          M -- кол-во уникальных токенов (M <= N)
   *   2. Держать актуальную бинарную кучу -- в худшем случае O(N + N log M)
   *   3. В голову пришёл вариант с массивом и отрезками одинаковых количеств, например, для:
   *      [a-4, b-4, c-4, d-3, e-2, f-2, g-1] => [2:0-2, 4-5].
   *      Тогда при изменении элемента внутри отрезка можно было бы
   *      просто поменять его местами с началом отрезка.
   *      Это дало бы O(N).
   *      Хотя возможно я просто не вижу какой-то проблемы, позже попытаюсь.
   *
   *      UPD: Проблема с текущим расчётом веса, он может увеличиться больше чем на единицу,
   *           из-за чего может перепрыгнуть несколько позиций, из-за чего придётся сдвигать конец массива.
   *           Остановимся на текущей сложности, хотя возможно её таки можно уменьшить,
   *           если сильно захотеть (хотя и непонятно, куда ей тут уменьшиться, от M log M, похоже, не уйти).
   */
  var map = {}, list = [], tokens = [];

  this.feed = function(token) {
    var x = map[token];
    if (x) {
      x.count++;
    } else {
      map[token] = x = {
        token: token,
        count: 1
      };
      list.push(x);
    }
  };

  this.shorten = function() {
    list.forEach(function(x) { x.weight = x.token.length * x.count; });
    list.sort(function(a, b) { return b.weight - a.weight; });

    list.forEach(function(x, i) {
      if (i < tokens.length) {
        x.toToken = tokens[i];
      } else {
        tokens.push(x.toToken = tokensGenerator.next().value);
      }
    });

    return {map: map, list: list};
  };
};

exports.tokensGenerator = function(options) {
  if (Array.isArray(options)) options = {letters: options};

  var letters = options.letters,
      firstLetters = options.firstLetters || letters;

  var n = letters.length, nf = firstLetters.length,
      k = 1,
      counters = [0];

  return {next: function() {
    var arr = new Array(k);
    arr[0] = firstLetters[counters[0]];
    for (var i = 1; i < k; i++) arr[i] = letters[counters[i]];
    var result = arr.join('');

    for (i = k - 1; i > 0; i--) {
      if ((counters[i] = (counters[i] + 1) % n) > 0) break;
    }
    if (i === 0) {
      if ((counters[0] = (counters[0] + 1) % nf) === 0) {
        k++;
        counters.push(0);
      }
    }

    return {value: result, done: false};
  }};
};

exports.ALPHA_LETTERS = (function() {
  var result = [], i;

  for (i = 97; i <= 122; i++) { // ord(a) = 97, ord(z) = 122
    result.push(String.fromCharCode(i));
  }
  for (i = 65; i <= 90; i++) { // ord(A) = 65, ord(Z) = 90
    result.push(String.fromCharCode(i));
  }

  return result;
})();

exports.ALPHA_LETTERS_PLUS_DIGITS_HYPHEN_UNDERSCORE = exports.ALPHA_LETTERS.concat([
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  '-', '_'
]);
