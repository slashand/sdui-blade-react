import assert from 'node:assert/strict';
import { BaseBlade, BladeHost, SduiRenderer } from '../dist/index.js';

assert.equal(typeof BaseBlade, 'function');
assert.equal(typeof BladeHost, 'function');
assert.equal(typeof SduiRenderer, 'function');
console.info('Native Node ESM package entry and public exports verified.');
