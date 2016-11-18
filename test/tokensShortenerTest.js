var assert = require('assert'),

    shortTokensGenerator = require('../shortTokensGenerator').shortTokensGenerator,
    TokensShortener = require('../tokensShortener').TokensShortener;

describe('TokensShortener', function() {
  describe('a, a, a, b, b, c', function() {
    it('should do a -> a, b -> b, c -> aa', function() {
      var shortItGen = new TokensShortener();

      var oldTokens = ['b', 'a', 'a', 'c', 'a', 'b', 'a'];

      oldTokens.forEach(function(x) {
        shortItGen.feed(x);
      });

      var result = shortItGen.short(shortTokensGenerator(['a', 'b']));
      
      assert.equal(result.map.get('a').toToken, 'a');
      assert.equal(result.map.get('b').toToken, 'b');
      assert.equal(result.map.get('c').toToken, 'aa');
    });
  });

  describe('aaaa, b, b, b', function() {
    it('should do aaaa -> a, b -> b', function() {
      var shortItGen = new TokensShortener();

      var oldTokens = ['b', 'aaaa', 'b', 'b'];

      oldTokens.forEach(function(x) {
        shortItGen.feed(x);
      });

      var result = shortItGen.short(shortTokensGenerator(['a', 'b']));
      
      assert.equal(result.map.get('aaaa').toToken, 'a');
      assert.equal(result.map.get('b').toToken, 'b');
    });
  });
});
