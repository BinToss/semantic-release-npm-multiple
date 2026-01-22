// @ts-check
import { mkdtemp, rm, copyFile, stat, mkdir } from 'node:fs/promises';
import plugin from './index.js';
import * as underlyingPlugin from '@semantic-release/npm';
import { describe, it, before, after } from 'node:test';
import { deepStrictEqual } from 'node:assert';

/** @type {string} */
let workingDirectory;

describe('.', async () => {
  before(async () => {
    /** @type {false | import('node:fs').Stats} */
    const stats = await stat('.tmp').catch(_ => false);
    let exists = !!stats;
    const isDirectory = !!stats && stats.isDirectory();
    if (exists && !isDirectory) {
      await rm('.tmp');
      exists = false;
    }
    if (!exists) mkdir('.tmp');
    workingDirectory = await mkdtemp('.tmp/.');
    await copyFile('./package.json', workingDirectory + '/package.json');
  });

  after(async () => {
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
      await plugin.addChannel(createPluginConfig(), createContext());
    });
  });

  describe('underlying plugin endpoints', () => {
    it('has the expected set of keys', () => {
      deepStrictEqual(
        new Set(Object.keys(underlyingPlugin)),
        new Set(['addChannel', 'prepare', 'publish', 'verifyConditions']),
      );
    });
  });

  describe('prepare', () => {
    it('does not crash', async () => {
      await plugin.prepare(createPluginConfig(), createContext());
    });
  });

  describe('publish', () => {
    it('does not crash', async () => {
      await plugin.publish(createPluginConfig(), createContext());
    });
  });

  describe('verifyConditions', () => {
    it('does not crash', async () => {
      await plugin.verifyConditions(createPluginConfig(), createContext());
    });
  });
});
