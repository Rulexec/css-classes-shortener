var htmlparser = require('htmlparser2');

exports.Parser = function Parser(options) {
  if (!(this instanceof Parser)) return new Parser(options);

  var classes = [],
      isEnd = false;

  var parser = new htmlparser.Parser({
    onopentag: function(name, attrs) {
      var classText = attrs.class;

      if (!classText) return;

      var classList = classText.trim().split(' '
      ).map(function(x) { return x.trim(); }
      ).filter(function(x) { return x !== ''; });

      classes = classes.concat(classList);
    }
  });

  this.consumer = function() {
    var g = {next: function() {
      if (classes.length > 0) {
        return {value: classes.shift(), done: false};
      } else {
        return {value: null, done: isEnd};
      }

      if (isEnd) return (g.next = function() { return {value: undefined, done: true} })();
    }};
    return g;
  };

  this.feed = function(chunk) {
    parser.write(chunk);
  };
  this.end = function() {
    parser.end();
    isEnd = true;
  };
};
