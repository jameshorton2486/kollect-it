// tests/invariants/sku-api.test.ts
import { describe, it, expect } from 'bun:test';

// SKU validation logic (mirrors API implementation)
const SKU_PATTERN = /^KOL-20[2-9][0-9]-[0-9]{4}$/;

function validateSkuFormat(sku: string): { valid: boolean; error?: string } {
  if (!SKU_PATTERN.test(sku)) {
    return {
      valid: false,
      error: `Invalid SKU format: "${sku}". Expected format: KOL-YYYY-NNNN`
    };
  }
  
  const parts = sku.split('-');
  const year = parseInt(parts[1], 10);
  const currentYear = new Date().getFullYear();
  
  if (year > currentYear + 1) {
    return {
      valid: false,
      error: `SKU year ${year} is too far in the future`
    };
  }
  
  return { valid: true };
}

describe('SKU Format Validation', () => {
  describe('Valid SKUs', () => {
    it('accepts standard format KOL-2026-0001', () => {
      expect(validateSkuFormat('KOL-2026-0001').valid).toBe(true);
    });

    it('accepts KOL-2025-9999', () => {
      expect(validateSkuFormat('KOL-2025-9999').valid).toBe(true);
    });

    it('accepts KOL-2024-0042', () => {
      expect(validateSkuFormat('KOL-2024-0042').valid).toBe(true);
    });
  });

  describe('Invalid SKUs', () => {
    it('rejects wrong prefix', () => {
      const result = validateSkuFormat('SKU-2026-0001');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid SKU format');
    });

    it('rejects 2-digit year', () => {
      const result = validateSkuFormat('KOL-26-0001');
      expect(result.valid).toBe(false);
    });

    it('rejects missing leading zeros', () => {
      const result = validateSkuFormat('KOL-2026-1');
      expect(result.valid).toBe(false);
    });

    it('rejects random string', () => {
      const result = validateSkuFormat('RANDOM123');
      expect(result.valid).toBe(false);
    });

    it('rejects empty string', () => {
      const result = validateSkuFormat('');
      expect(result.valid).toBe(false);
    });

    it('rejects year before 2020', () => {
      const result = validateSkuFormat('KOL-2019-0001');
      expect(result.valid).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('rejects lowercase prefix', () => {
      const result = validateSkuFormat('kol-2026-0001');
      expect(result.valid).toBe(false);
    });

    it('rejects extra segments', () => {
      const result = validateSkuFormat('KOL-2026-0001-EXTRA');
      expect(result.valid).toBe(false);
    });

    it('rejects spaces', () => {
      const result = validateSkuFormat('KOL-2026- 0001');
      expect(result.valid).toBe(false);
    });
  });
});
