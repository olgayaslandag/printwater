/**
 * Özel ESM yükleyicisi (yalnızca test ortamı).
 *
 * Next.js 14 paketinde "exports" alanı yok, bu yüzden `next/server` salt
 * Node ESM ile çözümlenemez; `.js` uzantılı hali (`next/server.js`) çalışır.
 * Bu yükleyici `next/server` → `next/server.js` yönlendirmesi yapar; kaynak
 * kodda hiçbir değişiklik yoktur.
 */
export async function resolve(specifier, context, defaultResolve) {
  if (specifier === 'next/server') {
    return defaultResolve('next/server.js', context, defaultResolve);
  }
  return defaultResolve(specifier, context, defaultResolve);
}
