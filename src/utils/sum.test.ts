import { sum } from './sum.js';
import { describe, expect, test } from '@jest/globals';

describe('sum', () => {
  test('adds two numbers', () => {
    expect(sum(1, 2)).toBe(5);
  });
});
