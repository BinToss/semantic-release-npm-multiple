import npmMultiple from '@bintoss/semantic-release-npm-multiple';

export default {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      npmMultiple.default ?? npmMultiple,
      { registries: { github: {}, public: {} } },
    ],
    '@semantic-release/github',
  ],
};
