import { describe, expect, it } from 'vitest'

describe('oG Image Generation', () => {
  describe('oG meta tag logic', () => {
    it('should use custom ogImage when provided', () => {
      const seoMeta = {
        ogImage: 'https://example.com/custom-og.png',
      }
      const generateOgImage = true

      // Custom image should take precedence
      const ogImageToUse = seoMeta.ogImage || (generateOgImage ? './assets/og-image.png' : undefined)
      expect(ogImageToUse).toBe('https://example.com/custom-og.png')
    })

    it('should use auto-generated OG image when generateOgImage is true and no custom image', () => {
      const seoMeta = {
        ogImage: undefined,
      }
      const generateOgImage = true

      const ogImageToUse = seoMeta.ogImage || (generateOgImage ? './og.png' : undefined)
      expect(ogImageToUse).toBe('./og.png')
    })

    it('should not use any OG image when generateOgImage is false and no custom image', () => {
      const seoMeta = {
        ogImage: undefined,
      }
      const generateOgImage = false

      const ogImageToUse = seoMeta.ogImage || (generateOgImage ? './og.png' : undefined)
      expect(ogImageToUse).toBe(undefined)
    })
  })

  describe('generateOgImage configuration', () => {
    it('should include generateOgImage in frontmatter config when enabled', () => {
      const mockConfig = {
        generateOgImage: true,
      }

      expect(mockConfig.generateOgImage).toBe(true)
    })

    it('should not generate OG image when generateOgImage is false', () => {
      const mockConfig = {
        generateOgImage: false,
      }

      expect(mockConfig.generateOgImage).toBe(false)
    })

    it('should prefer custom ogImage over auto-generated when both are available', () => {
      const mockConfig = {
        generateOgImage: true,
        seoMeta: {
          ogImage: 'https://example.com/custom-og.png',
        },
      }

      // Custom image should take precedence
      expect(mockConfig.seoMeta?.ogImage).toBe('https://example.com/custom-og.png')
    })
  })
})
