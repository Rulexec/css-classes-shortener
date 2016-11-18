let htmlparser = require('htmlparser2');

exports.CssTagExtractor = function CssTagExtractor(options) {
  let classes = [];

  let parser = new htmlparser.Parser({
    onopentag: function(name, attrs) {
      let classText = attrs['class'];

      if (!classText) return;

      let classList = classText.trim().split(' ').forEach(x => {
        x = x.trim();

        if (x === '') return;

        classes.push(x);
      });
    }
  });

  this.consume = function*() {
    while (classes.length > 0) {
      yield classes[0];
      classes.shift();
    }
  }

  this.feed = chunk => parser.write(chunk);
  this.end = () => parser.end();
};
