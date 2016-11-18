exports.shortTokensGenerator = function*(options) {
  if (Array.isArray(options)) options = {symbols: options};

  let symbols = options.symbols,
      firstSymbols = options.firstSymbols || symbols;

  let counters = [], firstCounter = 0;

  while (true) {
    yield firstSymbols[firstCounter] + counters.map(x => symbols[x]).join('');

    if (counters.length > 0) {
      let i;

      for (i = counters.length - 1; i >= 0; i--) {
        counters[i]++;

        if (counters[i] < symbols.length) break;

        counters[i] = 0;
      }

      if (i === -1) {
        incrementFirstCounter();
      }
    } else {
      incrementFirstCounter();
    }
  }

  function incrementFirstCounter() {
    firstCounter++;

    if (firstCounter === firstSymbols.length) {
      firstCounter = 0;

      counters.unshift(0);
    }
  }
};
