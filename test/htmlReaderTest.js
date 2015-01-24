var assert = require('assert'),

    Parser = require('../htmlReader').Parser;

describe('htmlReader', function() {
  describe('basic test', function() {
    it('should pass', function() {
      var html = '<div><div class="some classes here">' +
                 '<span class="span-class classed"></span></div> ' +
                 '<p class="classed"></p></div> ' +
                 '<span class="span-class"><span class="span-class some"></span></span>';

      var parser = new Parser();

      parser.feed(html);
      parser.end();

      var expectedClasses = {some: 2, classes: 1, here: 1,
                             'span-class': 3, classed: 2},
          actualClasses = {};

      var classesIt = parser.consumer();
      
      var v;
      while (v = classesIt.next(), !v.done) {
        assert(typeof v.value === 'string');

        if (v.value in actualClasses) actualClasses[v.value]++;
        else actualClasses[v.value] = 1;
      }

      var name;
      for (name in expectedClasses) if (expectedClasses.hasOwnProperty(name)) {
        assert.strictEqual(expectedClasses[name], actualClasses[name]);
      }
      for (name in actualClasses) if (actualClasses.hasOwnProperty(name)) {
        assert.strictEqual(expectedClasses[name], actualClasses[name]);
      }
    });
  });
});
