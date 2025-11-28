import { describe, it, expect } from 'vitest';

describe('Utility Tests', () => {
  describe('Data Loading', () => {
    it('should handle JSON parsing correctly', () => {
      const validJSON = '{"test": "value"}';
      const parsed = JSON.parse(validJSON);
      expect(parsed).toEqual({ test: 'value' });
    });

    it('should handle invalid JSON gracefully', () => {
      const invalidJSON = '{test: value}';
      expect(() => JSON.parse(invalidJSON)).toThrow();
    });
  });

  describe('Array Operations', () => {
    it('should filter empty arrays correctly', () => {
      const arr = [1, 2, 3];
      expect(arr.filter(x => x > 0)).toEqual([1, 2, 3]);
    });

    it('should handle empty arrays', () => {
      const arr = [];
      expect(arr.length).toBe(0);
      expect(arr.filter(x => x > 0)).toEqual([]);
    });

    it('should map arrays correctly', () => {
      const arr = [1, 2, 3];
      const mapped = arr.map(x => x * 2);
      expect(mapped).toEqual([2, 4, 6]);
    });
  });

  describe('Object Operations', () => {
    it('should access object properties safely', () => {
      const obj = { name: 'test', value: 123 };
      expect(obj.name).toBe('test');
      expect(obj.value).toBe(123);
      expect(obj.missing).toBeUndefined();
    });

    it('should handle optional chaining', () => {
      const obj = null;
      expect(obj?.property).toBeUndefined();
    });
  });

  describe('String Operations', () => {
    it('should format strings correctly', () => {
      const str = 'hello-world';
      expect(str.split('-')).toEqual(['hello', 'world']);
      expect(str.replace('-', ' ')).toBe('hello world');
    });

    it('should handle empty strings', () => {
      const str = '';
      expect(str.length).toBe(0);
      expect(str.split('-')).toEqual(['']);
    });
  });
});
