const isObj = require("is-obj");


/* eslint-disable no-useless-escape */
const regex = {
  dot: /^\./,
  prop: /[^[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
  escape: /\\(\\)?/g
};
/* eslint-enable no-useless-escape */


const each = (obj, iterate) => {
  if (!obj) return;

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      if (iterate(obj[i], i) === false) break;
    }
  } else if (isObj(obj)) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      if (iterate(obj[keys[i]], keys[i]) === false) break;
    }
  }
};


const splitTokens = (input, sep = ".") => {
  const tokens = `${input}`.split(sep);
  const results = [];
  let prev = null;

  tokens.forEach(token => {
    if (/^.*\\$/.test(token)) {
      prev = token;
    } else {
      if (prev == null) {
        return results.push(token);
      }
      results.push(prev.slice(0, prev.length - 1) + sep + token);
      prev = null;
    }
  });

  return results;
};


const matchToken = (key, token) => {
  if (token === "*") {
    return true;

  } else {
    return (token - parseFloat(token, 10) + 1) >= 0
      ? (key == token) // eslint-disable-line eqeqeq
      : key === token;
  }
};


const tokenize = str => {
  const results = [];

  splitTokens(str).forEach(s => {
    s.replace(regex.prop, (match, number, quote, string) => {
      results.push(quote ? string.replace(regex.escape, "$1") : (number || match));
    });
  });

  return results;
};


const dotFinder = (data, path, value = null) => {
  if (!path || typeof path !== "string") {
    return value;
  }

  const key = "__set_item__";
  const tokens = tokenize(path);
  const length = tokens.length;
  let useWildcard = false;
  let index = 0;
  let context = { [key]: [data] };

  tokens.forEach(token => {
    const next = [];

    each(context[key], item => {
      each(item, (v, k) => {
        if (matchToken(k, token)) {
          if (token === "*") {
            useWildcard = true;
          }
          next.push(v);
        }
      });
    });

    if (next.length > 0) {
      context = { [key]: next };
      index++;
    }
  });

  if (index !== length) return value;

  const v = context[key];
  return useWildcard ? v : v.shift();
};


module.exports = dotFinder;
