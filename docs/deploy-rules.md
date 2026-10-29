# Deploy Notları — PrintWater

## Content-Security-Policy

CSP şu an **Report-Only** modda (`Content-Security-Policy-Report-Only`, `next.config.js`).
Sebep: GA (`gtag`) ve `next/font` inline script/style kullandığı için `'unsafe-inline'`
gerekiyor; enforce moda geçmeden önce nonce tabanlı script-src'e geçilmelidir.

- Enforce etmeden önce: inline scriptleri nonce'la, `style-src` için de nonce/hash uygula.
- Enforce'a geçiş ayrı bir kapsamdır; bu görevde **yapılmadı**.

## Responsive görseller

- `src/lib/images/responsive-manifest.json` **commit edilir** (statik import; `tsc`/`next dev` için gerekli).
- `public/img/responsive/**/*.webp` binary varyantları **gitignore** edilir.
- Üretim build'i mutlaka `npm run build` (veya `npm run images:responsive` + `next build`) olmalı;
  düz `next build` varyantları üretmez. `npm run dev` öncesi `predev` script'i manifest'i üretir.
