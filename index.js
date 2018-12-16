const incstr = require("incstr");

const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
// If these strings are found in the resulting generator, block it
// as they might trigger ad blockers
const banned_words = [
  "ad",
  "banner",
];

function valid(string, allowLeadingNumbers) {
  if (!allowLeadingNumbers && /^[0-9]/.test(string)) {
    return false;
  }
  return !banned_words.some(word => string.includes(word));
}

function generator(allowLeadingNumbers = false) {
  const map = {};
  const next = incstr.idGenerator({ alphabet });

  return function(string) {
    if (map[string]) {
      return map[string];
    }

    let id;
    while (!valid(id = next(), allowLeadingNumbers)) {
      // empty
    }
    return map[string] = id;
  };
}

const generators = {};
function namedGenerator(name, ...args) {
  return generators[name] || (generators[name] = generator(...args));
}

const prefix = generator();
module.exports = function tinyIdentNames({ resourcePath }, _, localName) {
  // Use a named generator so we can reset back to 'a' for the suffix
  // for each new module/file
  const suffix = namedGenerator(resourcePath, true);
  return `${prefix(resourcePath)}_${suffix(localName)}`;
};
