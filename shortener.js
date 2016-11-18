var fs = require('fs'),

    CssTagExtractor = require('./cssTagExtractor').CssTagExtractor,
    TokensShortener = require('./tokensShortener').TokensShortener,
    shortTokensGenerator = require('./shortTokensGenerator').shortTokensGenerator,

    SYMBOLS = require('./symbols');

var argv = process.argv.slice(2);

var inputFile = getFlag('-i'),
    outputFile = getFlag('-o');

function getFlag(flag) {
  return argv[argv.indexOf(flag) + 1] || null;
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

let cssTagExtractor = new CssTagExtractor(),
    tokensShortener = new TokensShortener(),

    tokensGenerator = shortTokensGenerator({
      firstSymbols: SYMBOLS.ALPHA_LETTERS,
      symbols: SYMBOLS.ALPHA_LETTERS_PLUS_DIGITS
    });

let drainTags = () => { for (let tag of cssTagExtractor.consume()) tokensShortener.feed(tag) };

// FIXME
let stopWrite = false;
process.stdout.on('error', function(err) {
  stopWrite = true; // it can be EPIPE, for example: cat some.html | node shortener.js | head -n 1
});

readStream(inputStream, chunk => {
  cssTagExtractor.feed(chunk);
  drainTags();
}, () => {
  cssTagExtractor.end();
  drainTags();

  let result = tokensShortener.short(tokensGenerator),
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

function readStream(stream, dataHandler, endHandler) {
  inputStream.setEncoding('utf8');
  inputStream.on('readable', function() {
    let chunk = inputStream.read();
    if (chunk != null) dataHandler(chunk);
  });
  inputStream.on('end', endHandler);
}
