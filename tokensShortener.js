exports.TokensShortener = function() {
  let map = new Map(),
      list = [];

  this.feed = function(token) {
    let item = map.get(token);
    
    if (item) {
      item.count++;
    } else {
      map.set(token, item = {
        token: token,
        count: 1
      });
      list.push(item);
    }
  };
  
  let tokens = [];

  this.short = function(tokensGenerator) {
    list.forEach(x => x.weight = x.token.length * x.count);
    list.sort((a, b) => b.weight - a.weight);

    list.forEach(function(x, i) {
      if (i < tokens.length) {
        x.toToken = tokens[i];
      } else {
        tokens.push(x.toToken = tokensGenerator.next().value);
      }
    });

    return {map, list};
  };
};
