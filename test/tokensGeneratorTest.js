var assert = require('assert'),

    tokensGenerator = require('../short').tokensGenerator;

describe('tokensGenerator', function() {
  describe('only one letter', function() {
    it('should return a, aa, aaa, ...', function() {
      var gen = tokensGenerator(['a']);

      var expected = '';

      for (var i = 0; i < 10; i++) {
        expected += 'a';

        var g = gen.next();

        assert.strictEqual(g.done, false);
        assert.strictEqual(g.value, expected);
      }
    });
  });

  describe('two letters', function() {
    it('should return a, b, aa, ab, ba, bb, aaa, aab, ...', function() {
      var gen = tokensGenerator(['a', 'b']);

      var expectedList = ['a', 'b', 'aa', 'ab', 'ba', 'bb',
                          'aaa', 'aab', 'aba', 'abb', 'baa',
                          'bab', 'bba', 'bbb', 'aaaa', 'aaab'];

      expectedList.forEach(function(x) {
        var g = gen.next();

        assert.strictEqual(g.done, false);
        assert.strictEqual(g.value, x);
      });
    });
  });

  describe('first letter', function() {
    it('should return a, b, ac, ad, bc, bd, acc, acd, adc, add, bcc, bcd, ...', function() {
      var gen = tokensGenerator({
        firstLetters: ['a', 'b'],
        letters: ['c', 'd']
      });

      var expectedList = ['a', 'b', 'ac', 'ad', 'bc', 'bd',
                          'acc', 'acd', 'adc', 'add', 'bcc',
                          'bcd', 'bdc', 'bdd', 'accc', 'accd'];

      expectedList.forEach(function(x) {
        var g = gen.next();

        assert.strictEqual(g.done, false);
        assert.strictEqual(g.value, x);
      });
    });
  });
});
