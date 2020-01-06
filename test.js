const BloomFilter = require('./index.js');

test('BloomFilter est une classe', () => {
  expect(typeof BloomFilter.prototype.constructor).toEqual('function');
});

test('on peut ajouter des éléments au storage', () => {
  const filter = new BloomFilter();
  expect(() => {
    filter.add("test1");
  }).not.toThrow();
});

test('on peut vérifier si l\'élément est présent dans le storage', () => {
  const filter = new BloomFilter();
  expect(filter.test("test1")).toEqual(false);
  filter.add("test1");
  expect(filter.test("test1")).toEqual(true);
  expect(filter.test("test2")).toEqual(false);
});
