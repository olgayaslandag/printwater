/**
 * scripts/image-config.mjs için TypeScript tip tanımları.
 * (Next.js `moduleResolution: "bundler"` altında `.mjs` yanında `.d.mts` çözümlenir.)
 */

export interface ImageLimits {
  MAX_DIMENSION: number
  SMALL_GRAPHIC_MAX_EDGE: number
  LOSSLESS_QUALITY: number
  PHOTO_QUALITY: number
  WEBP_EFFORT: number
}

export declare const IMAGE_LIMITS: ImageLimits

export declare function shouldUseLossless(
  sourceName: string,
  hasAlpha: boolean,
  maxEdge: number,
): boolean

export declare function buildWebpOptions(
  hasAlpha: boolean,
  lossless: boolean,
): Parameters<import('sharp').Sharp['webp']>[0]
