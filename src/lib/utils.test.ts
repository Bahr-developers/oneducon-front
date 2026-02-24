import { describe, expect, it } from "vitest";
import { formatPrice } from "./utils";


describe("format price", () => {
    it("should format number to uzs", () => {
        const expected = new Intl.NumberFormat('uz-UZ', {
            style: 'currency',
            currency: 'UZS'
        }).format(1000)
        expect(formatPrice(1000)).toBe(expected)
    })
})

describe('date formatting', () => {
    it('should format date to uzbek format', () => {
        const date = new Date('2024-01-01T12:00:00Z')
        const expectedDate = date.toLocaleDateString('uz-UZ', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        expect(expectedDate).toBe('1-yanvar, 2024')
    })
})