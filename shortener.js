var fs = require('fs'),

    HtmlClassParser = require('./htmlReader').Parser,
    
    _short = require('./short'),
    TokensShortener = _short.TokensShortener,
    TokensGenerator = _short.tokensGenerator;

var argv = process.argv.slice(2);

var inputFile = getFlag('-i'),
    outputFile = getFlag('-o');

function getFlag(flag) {
  var nextIsOur = false;

  for (var i = 0; i < argv.length; i++) {
    if (nextIsOur) {
      return argv[i];
    }

    if (argv[i] === flag) nextIsOur = true;
  }

  return null;
}

if (outputFile === null) {
  process.stderr.write('Usage: node shortener.js [-i <input.html>] -o <output.json>\n');
  process.stderr.write('If -i flag is not present, then get input from stdin.\n');
  process.exit(1);
}

var inputStream;

if (inputFile === null) {
  inputStream = process.stdin;
} else {
  inputStream = fs.createReadStream(inputFile, {
    flags: 'r'
  });
}

var htmlParser = new HtmlClassParser(),
    htmlClassIt = htmlParser.consumer(),

    tokensGenerator = TokensGenerator({
      firstLetters: _short.ALPHA_LETTERS,
      letters: _short.ALPHA_LETTERS_PLUS_DIGITS_HYPHEN_UNDERSCORE
    }),
    tokensShortener = new TokensShortener({
      tokensGenerator: tokensGenerator
    });

inputStream.setEncoding('utf8');
inputStream.on('readable', function() {
  var chunk = inputStream.read();
  if (chunk !== null) {
    htmlParser.feed(chunk);
    drainClasses();
  }
});

function drainClasses() {
  var v;
  while (v = htmlClassIt.next(), typeof v.value === 'string')
    tokensShortener.feed(v.value);
}

var stopWrite = false;

process.stdout.on('error', function(err) {
  stopWrite = true; // it can be EPIPE, for example: cat some.html | node shortener.js | head -n 1
});

inputStream.on('end', function() {
  // FIXME
  if (typeof inputStream.close === 'function') {
    inputStream.close();
  } else if (typeof inputStream.end === 'function') {
    inputStream.end();
  }

  htmlParser.end();

  drainClasses();

  var result = tokensShortener.shorten(),
      toJsonMap = {};

  result.list.forEach(function(x) {
    if (!stopWrite) {
      process.stdout.write(x.token + ' -> ' + x.toToken + '\t' +
                           x.count + ' occurrences, ' +
                           x.weight + ' symbols total\n');
    }

    toJsonMap[x.token] = x.toToken;
  });

  fs.writeFileSync(outputFile, JSON.stringify(toJsonMap), {
    encoding: 'utf8'
  });
});
