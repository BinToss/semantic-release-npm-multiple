import { mkdtemp, rm } from 'node:fs/promises';
import plugin from './index.js';
import * as underlyingPlugin from '@semantic-release/npm';

let workingDirectory;

beforeAll(async () => {
  workingDirectory = await mkdtemp('.');
});

afterAll(async () => {
  await rm(workingDirectory, { recursive: true });
});

const createPluginConfig = () => ({
  registries: { github: {}, public: {} },
  npmPublish: false,
});

/**
 * @returns {{
 *   logger: typeof console,
 *   stdout: NodeJS.WritableStream
 *   stderr: NodeJS.WritableStream
 *   env: Record<string, string>,
 *   nextRelease: { version: string },
 *   cwd: string,
 *   options: {}
 * } & import('semantic-release').VerifyConditionsContext}
 */
const createContext = () => ({
  logger: console,
  stdout: process.stdout,
  stderr: process.stderr,
  env: {},
  nextRelease: { version: '1.0.0' },
  cwd: workingDirectory,
  options: {},
  branch: { name: 'main' },
  branches: [{ name: 'main' }],
  envCi: { branch: 'main', commit: '0', isCi: false },
});

describe('addChannel', () => {
  it('does not crash', async () => {
    await plugin.addChannel(createPluginConfig, createContext);
  });
});

describe('underlying plugin endpoints', () => {
  it('has the expected set of keys', () => {
    expect(new Set(Object.keys(underlyingPlugin))).toEqual(
      new Set(['addChannel', 'prepare', 'publish', 'verifyConditions']),
    );
  });
});

describe('prepare', () => {
  it('does not crash', async () => {
    await plugin.prepare(createPluginConfig, createContext);
  });
});

describe('publish', () => {
  it('does not crash', async () => {
    await plugin.publish(createPluginConfig, createContext);
  });
});

describe('verifyConditions', () => {
  it('does not crash', async () => {
    await plugin.verifyConditions(createPluginConfig, createContext);
  });
});
