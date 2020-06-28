process.env.TZ = 'UTC';

module.exports = {
  testPathIgnorePatterns: ['/packages/dumi/lib/', '/packages/preset-dumi/lib/'],
  snapshotSerializers: [require.resolve('enzyme-to-json/serializer')],
};
