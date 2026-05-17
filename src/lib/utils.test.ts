import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getAmountFromURL } from './utils';

describe('getAmountFromURL', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { ...originalLocation },
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });
  });

  function setSearch(search: string) {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { ...window.location, search },
    });
  }

  it('returns parsed amount for valid input', () => {
    setSearch('?amount=150');
    expect(getAmountFromURL()).toBe(150);
  });

  it('returns default 1000 when amount is missing', () => {
    setSearch('');
    expect(getAmountFromURL()).toBe(1000);
  });

  it('returns default 1000 for zero', () => {
    setSearch('?amount=0');
    expect(getAmountFromURL()).toBe(1000);
  });

  it('returns default 1000 for negative', () => {
    setSearch('?amount=-50');
    expect(getAmountFromURL()).toBe(1000);
  });

  it('returns default 1000 for non-numeric', () => {
    setSearch('?amount=abc');
    expect(getAmountFromURL()).toBe(1000);
  });

  it('returns default 1000 for exceeding max limit', () => {
    setSearch('?amount=100000000');
    expect(getAmountFromURL()).toBe(1000);
  });

  it('returns max valid amount at boundary', () => {
    setSearch('?amount=99999999');
    expect(getAmountFromURL()).toBe(99999999);
  });
});
