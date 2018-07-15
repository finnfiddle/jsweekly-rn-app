const pattern = /(-)?("[^"]*"|[^\s]+)/g;

export function tokenize(query) {
  query = query.toLowerCase().trim();

  var results = [];
  var matched = void 0;

  // eslint-disable-next-line
  while (matched = pattern.exec(query)) {
    var prefix = matched[1];
    var term = matched[2];
    var result = {};

    // Strip quotes
    term = term.replace(/(^"|"$)/g, '');
    result.term = term;

    // Set flags based on prefix
    if (prefix === '-') {
      result.exclude = true;
    }

    results.push(result);
  }

  // Sort the results so the terms with the exclude flag are at the very start
  results.sort(function (a, b) {
    return a.exclude === b.exclude ? 0 : a.exclude ? -1 : 1;
  });

  return results;
}

export function match(tokens, text) {
  text = text.toLowerCase();

  for (var i = 0; i !== tokens.length; i++) {
    var token = tokens[i];
    var _match = text.indexOf(token.term) !== -1;

    if (token.exclude && _match) {
      return false;
    }

    if (!token.exclude && !_match) {
      return false;
    }
  }

  return true;
}