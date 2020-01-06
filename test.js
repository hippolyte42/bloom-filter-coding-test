const BloomFilter = require('./index.js');

test('BloomFilter est une classe', () => {
  expect(typeof BloomFilter.prototype.constructor).toEqual('function');
});

test('on peut ajouter des éléments au storage', () => {
  const filter = new BloomFilter();
  expect(() => {
    filter.add("word1");
  }).not.toThrow();
});

test('hashIt retourne bel et bien un nombre entre 0 et 217 depuis une chaine hex crée par sha1, sha256 et sha512', () => {
  const filter = new BloomFilter();
  expect(filter.hashIt("word1", "sha1")).toEqual(5);
  expect(filter.hashIt("word1", "sha256")).toEqual(102);
  expect(filter.hashIt("word1", "sha512")).toEqual(24);
});

test('on peut vérifier si l\'élément est présent dans le storage', () => {
  const filter = new BloomFilter();
  expect(filter.test("word1")).toEqual(false);
  filter.add("word1");
  expect(filter.test("word1")).toEqual(true);
  expect(filter.test("word2")).toEqual(false);
});
