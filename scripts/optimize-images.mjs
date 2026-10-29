#!/usr/bin/env node
/**
 * Statik raster görselleri WebP (opsiyonel AVIF) formatına optimize eder.
 *
 * Temel kurallar:
 * - Kaynak görseller asla silinmez, yeniden adlandırılmaz.
 * - WebP çıktısı, kaynağın yanına aynı temel adla yazılır (logo.png -> logo.webp).
 * - Üretilen çıktı diskteki eski çıktıdan büyükse eski dosya korunur (regresyon olmaz).
 * - Alfa (alpha) kanalı korunur; küçük/logo/grafik görseller lossless WebP olarak üretilir.
 * - Script idempotent çalışır: ikinci çalıştırmada dosyalar "kept" olarak korunur.
 *
 * Kullanım:
 *   node scripts/optimize-images.mjs [--dir <yol>] [--avif] [--report <json yolu>]
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import sharp from 'sharp';
// Görsel işleme kuralları TEK kaynaktan (image-config.mjs) alınır; API indirme
// akışı (src/lib/articles/image-handler.ts) aynı modülü kullanır.
import { IMAGE_LIMITS, shouldUseLossless, buildWebpOptions } from './image-config.mjs';

// Kaynak olarak işlenecek raster uzantıları
const SOURCE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);
// Vektör/animasyon gibi optimize edilmeyecek uzantılar
const IGNORED_EXTENSIONS = new Set(['.svg', '.gif', '.ico']);
// Çalışma zamanında yazılan, sürüm kontrolüne girmeyen klasörler
const IGNORED_DIRECTORIES = new Set(['uploads']);

const SPACER_MAX_EDGE = 2;
const AVIF_QUALITY = 50;
const AVIF_EFFORT = 4;
// Yerinde yeniden kodlamada (kaynak zaten .webp/.avif ise) uygulanacak asgari iyileşme oranı.
// Lossy WebP yeniden kodlaması her seferinde birkaç yüzde küçülebildiği için bu eşik,
// scriptin idempotent kalmasını (ikinci çalıştırmada "kept") sağlar.
const MIN_INPLACE_IMPROVEMENT = 0.1;

const STATUS = {
  CREATED: 'created',
  KEPT: 'kept',
  SKIPPED: 'skipped',
  FAILED: 'failed',
};

/**
 * Komut satırı argümanlarını ayrıştırır.
 * @param {string[]} argv
 */
function parseArgs(argv) {
  const options = {
    dir: 'public/img',
    avif: false,
    report: null,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--dir') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) {
        throw new Error('--dir bayrağı için geçerli bir yol gerekli.');
      }
      options.dir = value;
      index += 1;
      continue;
    }

    if (arg === '--report') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) {
        throw new Error('--report bayrağı için geçerli bir JSON yolu gerekli.');
      }
      options.report = value;
      index += 1;
      continue;
    }

    if (arg === '--avif') {
      options.avif = true;
      continue;
    }

    if (arg === '--help' || arg === '-h') {
      options.help = true;
      continue;
    }

    throw new Error(`Bilinmeyen argüman: ${arg}`);
  }

  return options;
}

function printHelp() {
  console.log(`Kullanım: node scripts/optimize-images.mjs [seçenekler]

Seçenekler:
  --dir <yol>      Kaynak dizin (varsayılan: public/img)
  --avif           AVIF kardeş dosyaları da üretir (varsayılan: KAPALI)
  --report <yol>   JSON raporu yazar
  -h, --help       Yardım bilgisi`);
}

/**
 * Verilen dizini özyinelemeli olarak tarar ve işlenecek kaynak dosyaları döndürür.
 * @param {string} rootDir
 * @returns {Promise<string[]>}
 */
async function collectSourceFiles(rootDir) {
  const files = [];

  async function walk(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    entries.sort((a, b) => a.name.localeCompare(b.name));

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        if (entry.name.startsWith('.') || IGNORED_DIRECTORIES.has(entry.name)) {
          continue;
        }
        await walk(fullPath);
        continue;
      }

      if (!entry.isFile()) {
        continue;
      }

      const extension = path.extname(entry.name).toLowerCase();
      if (IGNORED_EXTENSIONS.has(extension) || !SOURCE_EXTENSIONS.has(extension)) {
        continue;
      }

      files.push(fullPath);
    }
  }

  await walk(rootDir);
  return files;
}

/**
 * Küçük/logo/grafik görseller için lossless çıktı gerekip gerekmediğini belirler.
 * Kural `scripts/image-config.mjs` içinde tanımlıdır; burada yalnızca dosya adı
 *normalize edilerek çağrılır.
 * @param {string} sourcePath
 * @param {boolean} hasAlpha
 * @param {number} maxEdge
 */
function isLosslessCandidate(sourcePath, hasAlpha, maxEdge) {
  return shouldUseLossless(path.basename(sourcePath), hasAlpha, maxEdge);
}

/**
 * Kaynak dosyadan WebP çıktısı üreten pipeline.
 * @param {string} inputPath
 * @param {{ hasAlpha: boolean, lossless: boolean }} options
 */
function buildWebpPipeline(inputPath, options) {
  let pipeline = sharp(inputPath, { failOn: 'error' })
    .rotate()
    .resize({
      width: IMAGE_LIMITS.MAX_DIMENSION,
      height: IMAGE_LIMITS.MAX_DIMENSION,
      fit: 'inside',
      withoutEnlargement: true,
    });

  return pipeline.webp(buildWebpOptions(options.hasAlpha, options.lossless));
}

/**
 * Kaynak dosyadan AVIF çıktısı üreten pipeline.
 * @param {string} inputPath
 * @param {{ hasAlpha: boolean, lossless: boolean }} options
 */
function buildAvifPipeline(inputPath, options) {
  let pipeline = sharp(inputPath, { failOn: 'error' })
    .rotate()
    .resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: 'inside',
      withoutEnlargement: true,
    });

  if (options.lossless) {
    pipeline = pipeline.avif({ lossless: true, effort: AVIF_EFFORT });
  } else {
    pipeline = pipeline.avif({ quality: AVIF_QUALITY, effort: AVIF_EFFORT });
  }

  return pipeline;
}

/**
 * Geçici dosya yolu üretir (uzantı korunur, sharp biçimi uzantıdan tanır).
 * @param {string} targetPath
 */
function createTempPath(targetPath) {
  const extension = path.extname(targetPath);
  const withoutExtension = targetPath.slice(0, -extension.length);
  const unique = `${process.pid}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
  return `${withoutExtension}.tmp-${unique}${extension}`;
}

async function fileExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Aday çıktıyı hedef yola yazar.
 *
 * Regresyon koruması:
 * - Diskte eski çıktı varsa ve yeni aday eski çıktıdan büyükse eski dosya korunur.
 * - Yerinde yeniden kodlama (.webp/.avif kaynak) durumunda yalnızca anlamlı derecede
 *   (%10 ve üzeri) küçülen aday uygulanır; böylece script idempotent kalır.
 *
 * @param {object} params
 * @returns {Promise<{ written: boolean, bytes: number, width: number|null, height: number|null, note: string|null }>}
 */
async function writeCandidate({ candidatePath, targetPath, isSourceOverwrite }) {
  const candidateStat = await fs.stat(candidatePath);
  const candidateMetadata = await sharp(candidatePath).metadata();
  const targetExists = await fileExists(targetPath);

  if (targetExists) {
    const targetStat = await fs.stat(targetPath);
    const improvement = targetStat.size > 0 ? (targetStat.size - candidateStat.size) / targetStat.size : 0;
    const shouldReplace = isSourceOverwrite
      ? improvement >= MIN_INPLACE_IMPROVEMENT
      : candidateStat.size < targetStat.size;

    if (!shouldReplace) {
      await fs.unlink(candidatePath);
      const targetMetadata = await sharp(targetPath).metadata();
      return {
        written: false,
        bytes: targetStat.size,
        width: targetMetadata?.width ?? null,
        height: targetMetadata?.height ?? null,
        note: isSourceOverwrite
          ? `Yeni kodlama mevcut dosyadan anlamlı şekilde küçük değil (%${(improvement * 100).toFixed(1)}); mevcut dosya korundu.`
          : 'Yeni çıktı eski çıktıdan büyük veya eşit olduğu için eski dosya korundu.',
      };
    }
  }

  await fs.rename(candidatePath, targetPath);
  return {
    written: true,
    bytes: candidateStat.size,
    width: candidateMetadata?.width ?? null,
    height: candidateMetadata?.height ?? null,
    note: null,
  };
}

function formatBytes(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatPercent(value) {
  if (!Number.isFinite(value)) {
    return '-';
  }
  return `${value.toFixed(1)}%`;
}

/**
 * Konsol tablosunu yazdırır.
 * @param {Array<object>} results
 */
function printTable(results) {
  const headers = ['Kaynak', 'Kaynak Boyut', 'Kaynak Ölçü', 'Çıktı', 'Çıktı Boyut', 'Çıktı Ölçü', 'Tasarruf', 'Durum'];

  const rows = results.map((result) => [
    result.sourceRelative,
    formatBytes(result.sourceBytes),
    result.sourceWidth && result.sourceHeight ? `${result.sourceWidth}x${result.sourceHeight}` : '-',
    result.outputRelative ?? '-',
    result.outputBytes === null || result.outputBytes === undefined ? '-' : formatBytes(result.outputBytes),
    result.outputWidth && result.outputHeight ? `${result.outputWidth}x${result.outputHeight}` : '-',
    result.savingsPercent === null || result.savingsPercent === undefined ? '-' : formatPercent(result.savingsPercent),
    result.status,
  ]);

  const widths = headers.map((header, columnIndex) =>
    Math.max(header.length, ...rows.map((row) => row[columnIndex].length)),
  );

  const separator = `+${widths.map((width) => '-'.repeat(width + 2)).join('+')}+`;
  const formatRow = (row) => `| ${row.map((cell, index) => cell.padEnd(widths[index])).join(' | ')} |`;

  console.log(separator);
  console.log(formatRow(headers));
  console.log(separator);
  for (const row of rows) {
    console.log(formatRow(row));
  }
  console.log(separator);
}

/**
 * Aynı çıktı yolunu hedefleyen kaynaklar arasında "sahibi" kaynağı seçer.
 * Çakışma durumunda yüksek çözünürlüklü kaynak kazanır (logo.png / logo.avif gibi).
 * @param {Array<object>} members
 * @param {string} derivedExtension
 */
function pickOwner(members, derivedExtension) {
  return [...members].sort((a, b) => {
    if (b.area !== a.area) {
      return b.area - a.area;
    }
    // Aynı çözünürlükte ise türetilmiş (WebP/AVIF) dosya yerine orijinal raster kaynak seçilir.
    const aDerived = path.extname(a.path).toLowerCase() === derivedExtension;
    const bDerived = path.extname(b.path).toLowerCase() === derivedExtension;
    if (aDerived !== bDerived) {
      return aDerived ? 1 : -1;
    }
    if (b.bytes !== a.bytes) {
      return b.bytes - a.bytes;
    }
    return a.path.localeCompare(b.path);
  })[0];
}

/**
 * Ana akış: görselleri tarar, optimize eder ve rapor üretir.
 */
async function main() {
  let options;
  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(`Hata: ${error.message}`);
    printHelp();
    process.exitCode = 2;
    return;
  }

  if (options.help) {
    printHelp();
    return;
  }

  const rootDir = path.resolve(process.cwd(), options.dir);

  let sourceFiles;
  try {
    sourceFiles = await collectSourceFiles(rootDir);
  } catch (error) {
    console.error(`Hata: kaynak dizin okunamadı (${rootDir}): ${error.message}`);
    process.exitCode = 2;
    return;
  }

  console.log(`Kaynak dizin : ${rootDir}`);
  console.log(`Bulunan dosya: ${sourceFiles.length}`);
  console.log(`AVIF üretimi : ${options.avif ? 'AÇIK' : 'KAPALI'}`);
  console.log('');

  const results = [];

  // 1) Kaynakları oku, ölçüleri ve alfa bilgisini çıkar.
  const files = [];
  for (const sourcePath of sourceFiles) {
    const sourceRelative = path.relative(rootDir, sourcePath) || path.basename(sourcePath);
    const sourceBytes = (await fs.stat(sourcePath)).size;

    try {
      const metadata = await sharp(sourcePath, { failOn: 'error' }).metadata();
      const width = metadata.width ?? 0;
      const height = metadata.height ?? 0;

      if (!width || !height) {
        throw new Error('görsel boyutları okunamadı');
      }

      const maxEdge = Math.max(width, height);
      const baseName = path.basename(sourcePath, path.extname(sourcePath));

      files.push({
        path: sourcePath,
        relative: sourceRelative,
        bytes: sourceBytes,
        width,
        height,
        maxEdge,
        area: width * height,
        hasAlpha: Boolean(metadata.hasAlpha),
        lossless: isLosslessCandidate(sourcePath, Boolean(metadata.hasAlpha), maxEdge),
        isSpacer: maxEdge <= SPACER_MAX_EDGE,
        webpTarget: path.join(path.dirname(sourcePath), `${baseName}.webp`),
        avifTarget: path.join(path.dirname(sourcePath), `${baseName}.avif`),
      });
    } catch (error) {
      results.push({
        sourceRelative,
        sourceBytes,
        sourceWidth: null,
        sourceHeight: null,
        outputRelative: null,
        outputBytes: null,
        outputWidth: null,
        outputHeight: null,
        savingsPercent: null,
        status: STATUS.FAILED,
        note: error.message,
        outputs: [],
      });
    }
  }

  // 2) Her format için çıktı yolunun sahibini belirle.
  //    (Örn. logo.png ve logo.avif aynı "logo.webp" hedefini paylaşır; yüksek çözünürlüklü kaynak kazanır.)
  const formats = [
    { name: 'webp', extension: '.webp', enabled: true },
    { name: 'avif', extension: '.avif', enabled: options.avif },
  ];

  const owners = { webp: new Map(), avif: new Map() };
  for (const format of formats) {
    if (!format.enabled) {
      continue;
    }
    const groups = new Map();
    for (const file of files.filter((item) => !item.isSpacer)) {
      const target = format.name === 'webp' ? file.webpTarget : file.avifTarget;
      if (!groups.has(target)) {
        groups.set(target, []);
      }
      groups.get(target).push(file);
    }
    for (const [target, members] of groups) {
      owners[format.name].set(target, pickOwner(members, format.extension));
    }
  }

  // 3) Kaynakları işle.
  for (const file of files) {
    if (file.isSpacer) {
      results.push({
        sourceRelative: file.relative,
        sourceBytes: file.bytes,
        sourceWidth: file.width,
        sourceHeight: file.height,
        outputRelative: null,
        outputBytes: null,
        outputWidth: null,
        outputHeight: null,
        savingsPercent: null,
        status: STATUS.SKIPPED,
        note: `Boşluk görseli (${file.maxEdge}px) - atlandı.`,
        outputs: [],
      });
      continue;
    }

    const webpOwner = owners.webp.get(file.webpTarget);
    const avifOwner = options.avif ? owners.avif.get(file.avifTarget) : null;
    const hasWebpRole = webpOwner && webpOwner.path === file.path;
    const hasAvifRole = avifOwner && avifOwner.path === file.path;

    if (!hasWebpRole && !hasAvifRole) {
      // Dosya, başka bir kaynağın türetilmiş çıktısı (örn. logo.webp -> logo.png).
      const owner = webpOwner || avifOwner;
      results.push({
        sourceRelative: file.relative,
        sourceBytes: file.bytes,
        sourceWidth: file.width,
        sourceHeight: file.height,
        hasAlpha: file.hasAlpha,
        lossless: file.lossless,
        outputRelative: file.relative,
        outputBytes: file.bytes,
        outputWidth: file.width,
        outputHeight: file.height,
        savingsPercent: 0,
        status: STATUS.KEPT,
        note: `Türetilmiş çıktı dosyası; aynı yolu yöneten kaynak: ${owner ? owner.relative : 'bilinmiyor'}.`,
        outputs: [],
      });
      continue;
    }

    try {
      const outputs = [];

      for (const format of formats) {
        if (!format.enabled) {
          continue;
        }

        const targetPath = format.name === 'webp' ? file.webpTarget : file.avifTarget;
        const owner = format.name === 'webp' ? webpOwner : avifOwner;
        const isOwner = owner && owner.path === file.path;

        if (!isOwner) {
          outputs.push({
            format: format.name,
            targetPath,
            bytes: null,
            width: null,
            height: null,
            written: false,
            note: `Çıktı yolunu daha yüksek çözünürlüklü kaynak kullanıyor (${owner ? owner.relative : 'bilinmiyor'}).`,
          });
          continue;
        }

        const isSourceOverwrite = targetPath === file.path;
        const candidatePath = createTempPath(targetPath);
        try {
          const pipeline = format.name === 'webp'
            ? buildWebpPipeline(file.path, { hasAlpha: file.hasAlpha, lossless: file.lossless })
            : buildAvifPipeline(file.path, { hasAlpha: file.hasAlpha, lossless: file.lossless });

          await pipeline.toFile(candidatePath);
          const outcome = await writeCandidate({ candidatePath, targetPath, isSourceOverwrite });
          outputs.push({
            format: format.name,
            targetPath,
            written: outcome.written,
            note: outcome.note,
            bytes: outcome.bytes,
            width: outcome.width,
            height: outcome.height,
          });
        } finally {
          await fs.rm(candidatePath, { force: true });
        }
      }

      const webpOutput = outputs.find((item) => item.format === 'webp');
      const primaryOutput = webpOutput && webpOutput.bytes !== null ? webpOutput : outputs[0];

      results.push({
        sourceRelative: file.relative,
        sourceBytes: file.bytes,
        sourceWidth: file.width,
        sourceHeight: file.height,
        hasAlpha: file.hasAlpha,
        lossless: file.lossless,
        outputRelative: path.relative(rootDir, primaryOutput.targetPath),
        outputBytes: primaryOutput.bytes,
        outputWidth: primaryOutput.width,
        outputHeight: primaryOutput.height,
        savingsPercent: primaryOutput.bytes === null
          ? null
          : ((file.bytes - primaryOutput.bytes) / file.bytes) * 100,
        status: primaryOutput.written ? STATUS.CREATED : STATUS.KEPT,
        note: primaryOutput.note,
        outputs: outputs.map((item) => ({
          format: item.format,
          path: path.relative(rootDir, item.targetPath),
          bytes: item.bytes,
          width: item.width,
          height: item.height,
          written: item.written,
          note: item.note,
        })),
      });
    } catch (error) {
      results.push({
        sourceRelative: file.relative,
        sourceBytes: file.bytes,
        sourceWidth: file.width,
        sourceHeight: file.height,
        outputRelative: null,
        outputBytes: null,
        outputWidth: null,
        outputHeight: null,
        savingsPercent: null,
        status: STATUS.FAILED,
        note: error.message,
        outputs: [],
      });
    }
  }

  // 4) Özet hesapları.
  const orderedResults = results.sort((a, b) => a.sourceRelative.localeCompare(b.sourceRelative));
  printTable(orderedResults);

  const processed = orderedResults.filter((result) => result.outputs.length > 0);
  const created = processed.filter((result) => result.status === STATUS.CREATED);
  const kept = processed.filter((result) => result.status === STATUS.KEPT);
  const derived = orderedResults.filter((result) => result.outputs.length === 0 && result.status === STATUS.KEPT);
  const skipped = orderedResults.filter((result) => result.status === STATUS.SKIPPED);
  const failed = orderedResults.filter((result) => result.status === STATUS.FAILED);

  const totalSourceBytes = processed.reduce((sum, result) => sum + result.sourceBytes, 0);

  // Çıktı toplamı, benzersiz çıktı dosyaları üzerinden hesaplanır.
  const uniqueOutputs = new Map();
  for (const result of processed) {
    for (const output of result.outputs) {
      if (output.bytes !== null && output.bytes !== undefined) {
        uniqueOutputs.set(output.path, output.bytes);
      }
    }
  }
  const totalOutputBytes = [...uniqueOutputs.values()].reduce((sum, bytes) => sum + bytes, 0);
  const totalSavings = totalSourceBytes > 0 ? ((totalSourceBytes - totalOutputBytes) / totalSourceBytes) * 100 : 0;

  let totalAvifBytes = 0;
  let avifFileCount = 0;
  if (options.avif) {
    const avifOutputs = new Map();
    for (const result of processed) {
      const avifEntry = result.outputs.find((item) => item.format === 'avif');
      if (avifEntry && avifEntry.bytes !== null && avifEntry.bytes !== undefined) {
        avifOutputs.set(avifEntry.path, avifEntry.bytes);
      }
    }
    totalAvifBytes = [...avifOutputs.values()].reduce((sum, bytes) => sum + bytes, 0);
    avifFileCount = avifOutputs.size;
  }

  console.log('');
  console.log('Özet');
  console.log('-----');
  console.log(`İşlenen kaynak toplamı : ${formatBytes(totalSourceBytes)} (${totalSourceBytes} bayt)`);
  console.log(`Üretilen WebP toplamı  : ${formatBytes(totalOutputBytes)} (${totalOutputBytes} bayt, ${uniqueOutputs.size} dosya)`);
  console.log(`Tasarruf               : ${formatPercent(totalSavings)} (${formatBytes(totalSourceBytes - totalOutputBytes)})`);
  console.log(`Dosya sayısı           : ${processed.length} işlendi (${created.length} created, ${kept.length} kept), ${derived.length} türetilmiş çıktı, ${skipped.length} skipped, ${failed.length} failed`);
  if (options.avif) {
    console.log(`Üretilen AVIF toplamı  : ${formatBytes(totalAvifBytes)} (${totalAvifBytes} bayt, ${avifFileCount} dosya)`);
  }

  if (options.report) {
    const reportPath = path.resolve(process.cwd(), options.report);
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    const report = {
      generatedAt: new Date().toISOString(),
      rootDir,
      avifEnabled: options.avif,
      summary: {
        totalFiles: orderedResults.length,
        processedFiles: processed.length,
        createdFiles: created.length,
        keptFiles: kept.length,
        derivedFiles: derived.length,
        skippedFiles: skipped.length,
        failedFiles: failed.length,
        uniqueOutputFiles: uniqueOutputs.size,
        totalSourceBytes,
        totalOutputBytes,
        savedBytes: totalSourceBytes - totalOutputBytes,
        savingsPercent: Number(totalSavings.toFixed(2)),
        avifTotalBytes: options.avif ? totalAvifBytes : 0,
        avifFileCount: options.avif ? avifFileCount : 0,
      },
      files: orderedResults.map((result) => ({
        source: result.sourceRelative,
        sourceBytes: result.sourceBytes,
        sourceWidth: result.sourceWidth,
        sourceHeight: result.sourceHeight,
        hasAlpha: result.hasAlpha ?? null,
        lossless: result.lossless ?? null,
        output: result.outputRelative,
        outputBytes: result.outputBytes,
        outputWidth: result.outputWidth,
        outputHeight: result.outputHeight,
        savingsPercent: result.savingsPercent === null ? null : Number(result.savingsPercent.toFixed(2)),
        status: result.status,
        note: result.note ?? null,
        outputs: result.outputs ?? [],
      })),
    };
    await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(`JSON rapor            : ${reportPath}`);
  }

  if (failed.length > 0) {
    console.error('');
    console.error(`Hatalı dosya sayısı: ${failed.length}`);
    for (const item of failed) {
      console.error(`- ${item.sourceRelative}: ${item.note}`);
    }
    process.exitCode = 1;
  }
}

await main();
