var assert = require('assert'),

    _short = require('../short'),
    tokensGenerator = _short.tokensGenerator,
    TokensShortener = _short.TokensShortener;

describe('TokensShortener', function() {
  describe('a, a, a, b, b, c', function() {
    it('should do a -> a, b -> b, c -> aa', function() {
      var shortItGen = new TokensShortener({
        tokensGenerator: tokensGenerator(['a', 'b'])
      });

      var oldTokens = ['b', 'a', 'a', 'c', 'a', 'b', 'a'];

      oldTokens.forEach(function(x) {
        shortItGen.feed(x);
      });

      var result = shortItGen.shorten();
      
      assert.equal(result.map.a.toToken, 'a');
      assert.equal(result.map.b.toToken, 'b');
      assert.equal(result.map.c.toToken, 'aa');
    });
  });

  describe('aaaa, b, b, b', function() {
    it('should do aaaa -> a, b -> b', function() {
      var shortItGen = new TokensShortener({
        tokensGenerator: tokensGenerator(['a', 'b'])
      });

      var oldTokens = ['b', 'aaaa', 'b', 'b'];

      oldTokens.forEach(function(x) {
        shortItGen.feed(x);
      });

      var result = shortItGen.shorten();
      
      assert.equal(result.map.aaaa.toToken, 'a');
      assert.equal(result.map.b.toToken, 'b');
    });
  });
});
