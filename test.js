const BloomFilter = require('./index.js');

// Jest JavaScript testing framework
// https://jestjs.io/en/

test('BloomFilter est une classe', () => {
  expect(typeof BloomFilter.prototype.constructor).toEqual('function');
});

test('add(entry) ajoute des éléments au storage', () => {
  const filter = new BloomFilter(3,3);
  expect(() => {
    filter.add("word1");
  }).not.toThrow();
  expect(filter.storage).toEqual([1,0,1]);
});

test('hashToId(str, algo) retourne un nombre entre 0 et n depuis une chaine str hachée par k algo avec [sha1, sha256 et sha512]', () => {
  const filter1 = new BloomFilter(128, 3);
  expect(filter1.hashToId("word1", "sha1")).toEqual(5);
  expect(filter1.hashToId("word1", "sha256")).toEqual(102);
  expect(filter1.hashToId("word1", "sha512")).toEqual(24);
  const filter2 = new BloomFilter(52, 3);
  expect(filter2.hashToId("word1", "sha1")).toEqual(37);
  expect(filter2.hashToId("word1", "sha256")).toEqual(30);
  expect(filter2.hashToId("word1", "sha512")).toEqual(40);
});

test('logPresent(searched) retourne les chaines présentes ou passées à cet indice', () => {
  const filter = new BloomFilter(6, 3);
  filter.add("word1");
  filter.add("word2");
  filter.add("word3");
  expect(filter.logPresent("word1")).toBe("pour l'indice 3 word1 partage l'indice avec word2\npour l\'indice 0 word1 partage l\'indice avec word2 et word3\npour l\'indice 2 word1 est seul");
  expect(filter.logPresent("word2")).toBe("pour l\'indice 3 word2 partage l\'indice avec word1\npour l\'indice 0 word2 partage l\'indice avec word1 et word3\npour l\'indice 4 word2 est seul");
  expect(filter.logPresent("word4")).toBe("pour l\'indice 0 word4 partage l\'indice avec word1, word2 et word3\npour l\'indice 0 word4 partage l\'indice avec word1, word2 et word3\npour l\'indice 3 word4 partage l\'indice avec word1 et word2");
});

test('on peut vérifier si l\'élément est probablement présent dans le storage ou non', () => {
  const filter = new BloomFilter(128, 3);
  expect(filter.test("word1")).toEqual(false);
  filter.add("word1");
  expect(filter.test("word1")).toEqual(true);
  expect(filter.test("word2")).toEqual(false);
  filter.add("word2");
  expect(filter.test("word2")).toEqual(true);
});
