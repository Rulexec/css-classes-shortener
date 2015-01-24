var assert = require('assert'),

    _short = require('../short'),
    tokensGenerator = _short.tokensGenerator,
    shortIt = _short.shortIt;

describe('shortIt', function() {
  describe('a, a, a, b, b, c', function() {
    it('should do a -> a, b -> b, c -> aa', function() {
      var shortItGen = shortIt({
        tokensGenerator: tokensGenerator(['a', 'b'])
      });

      var oldTokens = ['b', 'a', 'a', 'c', 'a', 'b', 'a'];

      oldTokens.forEach(function(x) {
        var g = shortItGen.next(x);
        assert(!g.done);
      });

      var result = shortItGen.next(null);
      
      assert(result.done);
      
      assert.equal(result.value.map.a.toToken, 'a');
      assert.equal(result.value.map.b.toToken, 'b');
      assert.equal(result.value.map.c.toToken, 'aa');
    });
  });

  describe('aaaa, b, b, b', function() {
    it('should do aaaa -> a, b -> b', function() {
      var shortItGen = shortIt({
        tokensGenerator: tokensGenerator(['a', 'b'])
      });

      var oldTokens = ['b', 'aaaa', 'b', 'b'];

      oldTokens.forEach(function(x) {
        var g = shortItGen.next(x);
        assert(!g.done);
      });

      var result = shortItGen.next(null);
      
      assert(result.done);
      
      assert.equal(result.value.map.aaaa.toToken, 'a');
      assert.equal(result.value.map.b.toToken, 'b');
    });
  });
});
