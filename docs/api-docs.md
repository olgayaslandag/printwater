# Bilgi Merkezi API — Entegrasyon Kılavuzu (v1.2)

Harici platformların (CMS, ERP, yönetim paneli) PrintWater **Bilgi Merkezi**
makalelerini yönetmesi için REST API. Next.js App Router Route Handlers üzerine
kuruludur; veri kalıcılığı JSON dosya deposu ile sağlanır.

- Temel adres: `https://printwater.com/api/v1/articles`
  (yerel geliştirme: `http://localhost:3000/api/v1/articles`)
- İçerik tipi: `application/json; charset=utf-8`
- Alan sözdizimi: `src/lib/articles/types.ts` içindeki `Article` arayüzü
- Bu kılavuzun hedef kitlesi: **içerik yöneticileri, editörler ve harici
  sistem entegrasyonlarını kuran geliştiriciler.** Kod yazmadan içerik girmek
  isteyenler için [Hızlı Başlangıç](#hızlı-başlangıç-10-dakika) ve
  [Postman](#postman-koleksiyonu) bölümleri yeterlidir.

## Hızlı Başlangıç (10 Dakika)

İçerik yöneticisi için komut satırından uçtan uca ilk kurulum. Her adım
kopyala-yapıştır çalışır; terminalde sırayla uygulayın.

**Adım 1 — Token'ı üretin ve `.env.local` dosyasına ekleyin.**

```bash
# Proje kökünde çalıştırın
echo "ARTICLES_API_TOKEN=$(openssl rand -hex 32)" >> .env.local
```

**Adım 2 — Sunucuyu başlatın.**

```bash
npm run build && npm run start
# → ✓ Ready on http://localhost:3000
```

**Adım 3 — Health check (token gerekmez).**

```bash
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/api/v1/articles
# Beklenen çıktı: 200
```

**Adım 4 — İlk makaleyi oluşturun.**

```bash
source .env.local 2>/dev/null || true
BASE=http://localhost:3000/api/v1/articles

curl -s -X POST "$BASE" \
  -H "Authorization: Bearer $ARTICLES_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tag": "MAKALE",
    "title": "İlk Test Makalem",
    "description": "Entegrasyonun ilk kurulumunda oluşturulan kontrol makalesi.",
    "image": "/img/logo.webp",
    "imageAlt": "PrintWater logosu",
    "content": "<h2>Kurulum tamam</h2><p>Bu makale API bağlantısını doğrulamak için oluşturuldu.</p>"
  }' | python3 -m json.tool
```

Beklenen yanıt: `"slug": "ilk-test-makalem"` içeren `201` gövdesi. Aynı makale
`https://localhost:3000/blog/ilk-test-makalem` adresinde ve `/sitemap.xml`
içinde anında görünür.

**Adım 5 — Temizlik (test makalesini silin).**

```bash
curl -s -X DELETE "$BASE/ilk-test-makalem" \
  -H "Authorization: Bearer $ARTICLES_API_TOKEN" | python3 -m json.tool
# Beklenen: 200 ve silinen makale gövdesi
```

Beş adımın tamamı beklendiği gibiyse entegrasyon hazırdır. Üretim için
[Go-Live Kontrol Listesi](#go-live-kontrol-listesi) bölümüne geçin.

## İçindekiler

1. [Hızlı Başlangıç (10 Dakika)](#hızlı-başlangıç-10-dakika)
2. [Makale Yaşam Döngüsü](#makale-yaşam-döngüsü)
3. [Hata Senaryoları — "Nasıl Düzeltirm?"](#hata-senaryoları---nasıl-düzeltirm)
4. [Mimari Özet (Plan: Seçenek 1)](#mimari-özet-plan-seçenek-1)
5. [Kimlik Doğrulama](#kimlik-doğrulama)
6. [Hız Sınırlama](#hız-sınırlama)
7. [Uçlar](#uçlar)
8. [Alan Kuralları ve Sınırlar](#alan-kuralları-ve-sınırlar)
9. [İçerik Güvenliği (HTML Etiketleri ve Örnek Gövde)](#ıçerik-guvenliği-html-etiketleri-ve-örnek-gövde)
10. [Görsel Kuralları ve Otomatik İndirme](#görsel-kuralları-ve-otomatik-indirme-image-handling)
11. [Hata Biçimi](#hata-biçimi)
12. [Hata Ayıklama Rehberi](#hata-ayıklama-rehberi)
13. [Postman Koleksiyonu](#postman-koleksiyonu)
14. [cURL Referansı](#curl-referansı)
15. [Headless CMS / Özel Entegrasyon](#headless-cms--özel-entegrasyon)
16. [Webhook / Otomasyon](#webhook--otomasyon)
17. [Test Makalesi Şablonu](#test-makalesi-şablonu)
18. [Gerçek Makale Örneği](#gerçek-makale-örneği)
19. [Go-Live Kontrol Listesi](#go-live-kontrol-listesi)
20. [Dağıtım Notları](#dağıtım-notları)

## Mimari Özet (Plan: Seçenek 1)

```
Dış Platform --(Bearer token)--> /api/v1/articles (Route Handlers)
                                     │  auth + rate limit + validation + sanitize
                                     ▼
                   harici görsel URL → fetch → WebP dönüşümü → public/img/uploads/ (otomatik indirme)
                                     ▼
                         data/articles.json (atomik yazma, yazma kilidi)
                                      │  okuma: dosya yoksa seed.ts'e fallback
                                      ▼
         /blog, /blog/[slug], /sitemap.xml  (on-demand revalidatePath + dinamik sitemap)
```

- **Kalıcılık:** `ARTICLES_DATA_FILE` ile yolu yapılandırılabilir; varsayılan
  `data/articles.json`. Dosya yokken site statik tohum içeriğiyle
  (`src/lib/articles/seed.ts`) çalışmaya devam eder.
- **Sitede görünürlük:** Her başarılı yazımda `revalidatePath` ile `/blog`,
  ilgili `/blog/{slug}` ve ana sayfa anında tazelenir; ek emniyet olarak
  sayfalar ISR (`revalidate: 300`) kullanır.
- **Sitemap:** `/sitemap.xml` dinamik üretilir ve her istekte kalıcı depodan
  yeniden kurulur; API ile eklenen makale sitemap'e **anında** yansır.
  (Not: Next.js 14, `app/sitemap.ts` metadata rotasında `revalidatePath`
  işlemediği için sitemap `force-dynamic` olarak üretilir; eklenen/güncellenen/
  silinen her makale bir sonraki istekte listede görünür.)

## Kimlik Doğrulama

Yazma uçları (`POST`, `PUT`, `DELETE`) şu başlığı ister:

```
Authorization: Bearer <ARTICLES_API_TOKEN>
```

- Token yalnızca ortam değişkeninden okunur; koda gömülmez.
- Karşılaştırma SHA-256 + `timingSafeEqual` ile zaman-sabiti yapılır.
- `ARTICLES_API_TOKEN` tanımlı değilse yazma uçları **503** döner (fail-closed).
- Token üretimi: `openssl rand -hex 32`
- Okuma ucu `GET` herkese açıktır (içerik zaten sitede yayında).
- `.env.local` (geliştirme) veya sunucu ortamına `.env.example` şablonundan
  kopyalanarak eklenir; dosya `.gitignore` kapsamındadır ve depoya gönderilmez.

```bash
# Token üretimi ve .env.local'a yazma (bir kez yapılır)
echo "ARTICLES_API_TOKEN=$(openssl rand -hex 32)" >> .env.local
```

## Hız Sınırlama

Yazma uçları için süreç içi sabit pencere: **IP başına dakika 30 istek**.
Aşımında `429` + `Retry-After` başlığı döner. Birden fazla Next.js süreciyle
(cluster/PM2) çalışıyorsanız limit süreç başına geçerlidir; üretimde reverse
proxy (nginx `limit_req`) ile katmanlayın — hazır şablon:
[`docs/nginx-printwater.conf.example`](./nginx-printwater.conf.example)
(`api_write` bölgesi, `/api/v1/articles` location'ı ve uygulamanın
`clientIp()` kovasıyla uyumlu `X-Forwarded-For` ayarı içerir).

> **Otomasyon ipucu:** Toplu içe aktarma yaparken (ör. 100 makale) istemciniz
> `429` yanıtındaki `Retry-After` değerine uymalı ve bekledikten sonra
> kaldığı yerden devam etmelidir. Hız sınırına takılan istek **kaybolmaz**;
> yalnızca gecikir. Örnek döngü: [cURL Referansı](#curl-referansı).

## Uçlar

### 1) Listeleme — `GET /api/v1/articles`

Yayın tarihine göre **yeni → eski** sıralı tam liste.

```
curl https://printwater.com/api/v1/articles
```

```json
{ "count": 3, "data": [ { "tag": "...", "slug": "...", "...": "..." } ] }
```

### 2) Tek makale — `GET /api/v1/articles/{slug}`

`200 { "data": Article }` veya `404`.

### 3) Ekleme — `POST /api/v1/articles` 🔒

Zorunlu alanlar: `tag`, `title`, `description`, `image`, `imageAlt`, `content`.
İsteğe bağlı: `slug` (yoksa `title`'dan Türkçe uyumlu türetilir),
`publishedAt` (ISO-8601; yoksa şu an).

`image` alanı ya site içi bir yol (`/img/...`) ya da harici bir tam adres
(`https://...`) olabilir. Harici adres gönderilirse sunucu görseli indirip
`public/img/` altına kaydeder ve yanıtta yerel yolu döner (bkz.
[Görsel Kuralları](#görsel-kuralları-ve-otomatik-indirme-image-handling)).

```
curl -X POST https://printwater.com/api/v1/articles \
  -H "Authorization: Bearer $ARTICLES_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tag": "MAKALE",
    "title": "Örnek Makale",
    "description": "Kısa özet en fazla 500 karakter.",
    "image": "/img/ornek-makale.webp",
    "imageAlt": "Örnek makale görseli",
    "content": "<h2>Bölüm</h2><p>Gövde HTML.</p>",
    "publishedAt": "2026-10-26T09:00:00.000Z",
    "updatedAt": "2026-10-26T09:00:00.000Z"
  }'
```

Başarı: `201 { "data": Article }`. Slug doluysa: `409`.

### 4) Güncelleme — `PUT /api/v1/articles/{slug}` 🔒

Kısmi yama (merge) semantiği: yalnızca gönderilen alanlar değişir.
`slug` alanı gönderilirse `400` döner (kimlik değiştirilemez).

```
curl -X PUT https://printwater.com/api/v1/articles/ornek-makale \
  -H "Authorization: Bearer $ARTICLES_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "title": "Yeni Başlık", "description": "Yeni özet." }'
```

Başarı: `200 { "data": Article }`. Yoksa: `404`.

**Not — Slug değiştirilemez** (`validation.ts:162-164`): `slug` alanı PUT ile gönderilirse `400` döner (kimlik değiştirilemez). Slug'ı düzeltmek için doğru akış: `DELETE /api/v1/articles/{eski-slug}` + yeni slug ile `POST`. Yanlış slug'a PUT = 404 (`[slug]/route.ts:113-114`).

### 5) Silme — `DELETE /api/v1/articles/{slug}` 🔒

```
curl -X DELETE https://printwater.com/api/v1/articles/ornek-makale \
  -H "Authorization: Bearer $ARTICLES_API_TOKEN"
```

Başarı: `200 { "data": <silinen makale> }`. Yoksa: `404`.

> **Silinen makalenin görseli:** DELETE işlemi makale kaydını kaldırır; silinen
> makalenin `public/img/uploads/` altındaki indirilen görseli, **başka hiçbir
> makale aynı dosyayı kullanmıyorsa otomatik olarak diskten silinir**
> (orphan temizliği). Ayrıntı:
> [Silinen makalenin görselleri](#silinen-makalenin-görselleri-orphan-dosya).

## Alan Kuralları ve Sınırlar

| Alan          | Zorunlu (POST) | Kural                                                    | Ne Yazmalı? / Örnek                                                                                      | Dikkat                                                                                                                                 |
|---------------|----------------|----------------------------------------------------------|----------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| `slug`        | otomatik       | `^[a-z0-9]+(?:-[a-z0-9]+)*$`, ≤ 200 kr                   | Başlıktan otomatik türetilir; küçük harf, rakam ve tire kullanın.                                      | **Slug değiştirilemez** (`validation.ts:162-164`). Slug'ı düzeltmek için: `DELETE /api/v1/articles/{eski}` + yeni slug ile `POST`. PUT ile slug güncellenemez (404). |
| `tag`         | evet           | ≤ 60 kr                                                  | **Serbest metin**: `MAKALE`, `TEKNİK BİLGİ`, `PROJE`, `Makale` gibi herhangi bir metin.                                              | Sabit enum yok; `validation.ts:17,105` ≤ 60 karakter kuralını uygular. Önerilen değerler: `MAKALE`, `TEKNİK BİLGİ`, `PROJE`.                                      |
| `title`       | evet           | ≤ 200 kr                                                 | Makale başlığı; ana sayfa ve SEO için kullanılır.                                                        |                                                                                                                                        |
| `description` | evet           | ≤ 500 kr                                                 | Kart ve Open Graph (OG) özeti; kısa açıklama. `content` (gövde HTML) ile farklı, daha kısadır.                                      | Kart/ÖG préview'de görüntülenir; `content` tam gövdedir.                                                                               |
| `image`       | evet           | `/img/` ile başlayan site içi yol **veya** `https://` / `http://` adresi, ≤ 500 kr | **Site kartları 4:3 oranını kullanır** (`ArticleCard.tsx:22`). Site içi: `/img/filename.webp`. Harici: `https://cdn.example.com/kapak.jpg` | Harici URL gönderildiğinde sunucu görseli indirir, WebP'e dönüştürür ve `/img/uploads/`'a kaydeder. Kurum-içi/localhost adresleri reddedilir.                                   |
| `imageAlt`    | evet (a11y)    | ≤ 250 kr                                                 | Görselin erişilebilir açıklaması (`alt` özelliği).                                                         | XSS güvenliği için sunucu tarafı (`sanitize.ts`) temizler. Tüm görseller için zorunludur.                                                                           |
| `content`     | evet           | ≤ 200.000 kr, sunucuda sanitize edilir                   | Gövde HTML: başlık (h2-h6), paragraflar (p), listeler (ul/ol/li), tablolar (table).                                                   | DOMPurify allowlist ile temizilir; `<h1>` allowlist'te **değil** → sunucu sessizce kaldırır (bkz. çelişki #1).                                                   |
| `publishedAt` | hayır          | ISO-8601 tarih metni                                     | İsteğe bağlı; gönderilmezse makale anında yayınlanır (`POST` = anında yayın).                                                       |                                                                                                                                        |
| `updatedAt`   | hayır (otomatik)| ISO-8601 tarih metni; `POST`'ta yayın tarihiyle eşlenir, `PUT`'ta değişiklikte otomatik güncellenir | Sistem tarafından yönetilir; görüntülenmez.                                                             | `POST` = anında yayın; `PUT` kısmi yama (merge) olarak tüm makaleyi yeniden göndermek gerekmeden belirli alanları güncelleyebilirsiniz.                              |

#### İçerik Güvenliği (XSS)

`content` alanı sitede ham HTML olarak render edilir; bu yüzden sunucu
tarafında temizlenir (`src/lib/articles/sanitize.ts`). Temizlik **DOMPurify**
(`isomorphic-dompurify`; Node'da jsdom parser'ıyla) üzerinden **allowlist**
approach'ıyla yapılır — regex kara listesi, gerçek parser'ın atlayabildiği
vektörleri (`<img src="x"/onerror=...>` ayracı, `javascript&colon;` gibi
entity kodlamalı şemalar) kapatamaz:

- Korunur: yalnızca allowlist'teki etiketler ve öznitelikler — `h2`–`h6`, `p`,
  `ul/ol/li`, `table...`, `strong/em`, `div/span`, `a`, `img` + inline `style`
  (mevcut içerik buna bağımlıdır).
- Kaldırılır: allowlist dışındaki her etiket (`script`, `style`, `iframe`,
  `form`, `svg`, `math`, `object`, `embed`, `link`, `meta`, `base` vb.)
  içerikleriyle; tüm `on*` olay nitelikleri; `javascript:`/`vbscript:` ve
  medya dışı `data:` URL şemaları (entity kodlamalı türevleri dahil —
  ayrıştırma öncesi çözüldüğü için atlanamaz).
- **`<h1>` allowlist'te **değildir**; gönderirseniz sunucu **sessizce kaldırır** (hata dönmez). Sayfa başlığı otomatik H1'dir.**

> Güvenli/güvensiz alanların davranışını gösteren kopyalanabilir bir istek için
> bkz. [Test Makalesi Şablonu](#test-makalesi-şablonu).

## İçerik Güvenliği (HTML Etiketleri ve Örnek Gövde)

Sunucu taraflı temizlik (`sanitize.ts:25-34`) izinli etiketleri belirler.
Aşağıdaki etiketler makale gövdesine kopyalanabilir örnekler olarak eklenebilir:

| Etiket | Açıklama | Örnek |
|--------|----------|-------|
| `<h2>` | Bölüm başlığı | `<h2>Bölüm Başlığı</h2>` |
| `<h3>` | Alt bölüm | `<h3>Alt Bölüm</h3>` |
| `<p>` | Paragraf | `<p>Bu bir paragraftır.</p>` |
| `<ul>` | Sırasız liste | `<ul><li>İtemsiz</li></ul>` |
| `<ol>` | Sıralı liste | `<ol><li>1. İtem</li></ol>` |
| `<li>` | Liste öğesi | `<li>İtem</li>` |
| `<blockquote>` | Alıntılı bölüm | `<blockquote>Alıntı metni</blockquote>` |
| `<pre>` | Kod bloğu | `<pre>kod\nkodu</pre>` |
| `<code>` | Inline kod | `<code>kod</code>` |
| `<figure>` | Figur/eş | `<figure><img src="..." alt=""/><figcaption>Legenda</figcaption></figure>` |
| `<figcaption>` | Figure açıklaması | `<figcaption>Resim açıklaması</figcaption>` |
| `<br>` | Satır sonu | `<br>` |
| `<hr>` | Yatay çizgi | `<hr>` |
| `<strong>`, `<em>` | Vurgulama | `<strong>Kafa</strong>`, `<em>vurgulama</em>` |
| `<div>` | Kapsayıcı | `<div>İçerik</div>` |
| `<a>` | Bağlantı | `<a href="https://example.com">Link</a>` |
| `<img>` | Görsel (inline style) | `<img src="/img/resim.webp" alt="Açıklama" style="max-width:100%;">` |
| `<table>` | Tablo | `<table><tr><td>Veri</td></tr></table>` |

**Örnek gövde kopyalanabilir payload:**

```html
<h2>Bölüm 1: Giriş</h2>
<p>Makalenin giriş paragrafı buraya gelir.</p>
<ul>
<li>İlk özellik</li>
<li>İkinci özellik</li>
</ul>
<p>Daha fazla içerik burada...</p>
<table>
<tr>
<th>Başlık</th>
<td>Veri</td>
</tr>
</table>
<a href="https://example.com">Daha fazla bilgi</a>
```

Kaldırılan etiketler (`script`, `style`, `iframe` vb.) sunucu tarafından otomatik olarak
silinir; bunları gövdeye eklemek XSS riski oluşturur.

## Görsel Kuralları ve Otomatik İndirme (Image Handling)

Makale kapak görselleri (`image`) iki biçimde gönderilebilir:

1. **Site içi göreceli yol** — `/img/ornek-makale.webp`  
   Doğrudan kabul edilir, hiçbir işlem yapılmadan kayda yazılır.
2. **Harici tam adres** — `https://cdn.ornek.com/kapak.jpg` (veya `http://`)  
   Sunucu tarafında otomatik olarak **indirilir**, **WebP formatına dönüştürülür**,
   `public/img/uploads/` dizinine kaydedilir ve makale kaydına **yerel yol**
   (`/img/uploads/...`) olarak yazılır.

Harici URL gönderildiğinde API, `image` alanını şu şekilde dönüştürür:

```
Gönderilen : "image": "https://cdn.ornek.com/kapak.jpg"
Kaydedilen : "image": "/img/uploads/ornek-makale-cover-1761512345678.webp"
```

İndirilen görsel, `sharp` ile işlenerek **WebP** formatına dönüştürülür:

- En uzun kenar **1920x1920px** ile sınırlanır (büyütme yapılmaz).
- Kaynak JPEG/PNG/WebP olabilir; çıktı formatı her zaman **WebP**'dir.
- Alfa (şeffaflık) kanalı **korunur**; küçük grafik/logo görselleri kayıpsız
  (lossless) WebP olarak üretilir.
- `sharp` paketi **production bağımlılığıdır** (`dependencies`); görsel işleme
  runtime'da (Node) gerçekleştiği için `next start` / standalone deploy'da
  kurulu olmalıdır.

### İndirme sırasında uygulanan kontroller

| Kontrol | Kural | Başarısızlık |
|---------|-------|--------------|
| Erişilebilirlik | `fetch` ile `200` yanıtı alınmalı | `400 image_processing_failed` |
| Şema | Yalnızca `http` / `https` | `400 image_processing_failed` |
| SSRF koruması | `localhost`, `.local`, `.internal` ve özel IP aralıkları (10/8, 172.16/12, 192.168/16, 127/8, 169.254/16 vb.) reddedilir; DNS çözümlemesi sonrası kontrol edilir | `400 image_processing_failed` |
| Yönlendirme | En fazla 3 yönlendirme; her adımda hedef yeniden doğrulanır | `400 image_processing_failed` |
| MIME tipi | Yalnızca `image/jpeg`, `image/png`, `image/webp` | `400 image_processing_failed` |
| İçerik doğrulama | Magic byte imzası MIME tipiyle eşleşmeli (sahte `image/png` başlıklı HTML reddedilir) | `400 image_processing_failed` |
| Boyut | Maksimum **5 MB** (`Content-Length` ve akış üzerinden kontrol edilir) | `400 image_processing_failed` |
| Zaman aşımı | İstek 15 saniye içinde yanıt vermezse iptal edilir | `400 image_processing_failed` |
| Format dönüşümü | `sharp` ile **WebP**'ye dönüştürülür; en uzun kenar **1920x1920px** ile sınırlanır, alfa kanalı korunur | `400 image_processing_failed` |
| Dosya adı | Slug + zaman damgası ile benzersiz (`<slug>-cover-<timestamp>.webp`) | — |
| Kayıt yeri | `public/img/uploads/` (dizin yoksa oluşturulur, `.webp` uzantısıyla) | `400 image_processing_failed` |

**Görselim neden reddedilir?** (Yönetici özeti)

Eğer görselinizin reddedildiyse (400 image_processing_failed), en sık gerekler şunlardır:

- **Boyut:** Maksimum **5 MB**'dır (dosya boyutundan emin olun).
- **TIPS:** Sadece `image/jpeg`, `image/png`, `image/webp` kabul edilir; BMP, GIF, TIFF gibi diğer formatlar reddedilir.
- **SSRF koruması:** `localhost`, `.local`, `.internal` adresleri ve özel IP aralıkları (10/8, 172.16/12, 192.168/16, 127/8, 169.254/16 vb.) güvenlik nedeniyle reddedilir — hem evdeki test IP'leri de kapsar.
- **Yönlendirme:** Maksimum 3 yönlendirme izni; daha fazla yönlendirme başarısız olur.
- **MIME uyuşmazlığı:** URL'nin magic byte'sı (dosya başındaki imza) ile MIME tipinin uyuşmadığı durumlarda (sahte `image/png` başlıklı HTML gibi) reddedilir.
- **Zaman aşımı:** 15 saniye içinde yanıt vermezse işlem iptal edilir.

Görseli tekrar göndermeden önce URL'yi `curl -I <url>` ile kontrol edin ve adres barında erişilebilir bir https/http adres olduğundan emin olun.

### Örnek — harici URL ile gönderim

```
curl -X POST https://printwater.com/api/v1/articles \
  -H "Authorization: Bearer $ARTICLES_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tag": "MAKALE",
    "title": "Harici Görselli Makale",
    "description": "Kapak görseli harici URL olarak gönderildi.",
    "image": "https://cdn.ornek.com/kapak.webp",
    "imageAlt": "Makale kapak görseli",
    "content": "<h2>Bölüm</h2><p>Gövde HTML.</p>"
  }'
```

Sunucu görseli indirip `public/img/uploads/` altına kaydeder ve yanıtta `image`
alanı **yerel yol** olarak döner.

### Silinen makalenin görselleri (orphan dosya)

- **Otomatik temizlik (varsayılan davranış):** `DELETE` isteği makaleyi
  kaldırdıktan ve `PUT` isteği makalenin görselini değiştirdikten sonra,
  eskimiş (`/img/uploads/`) dosya **başka hiçbir makale tarafından
  kullanılmıyorsa otomatik silinir.**
  - Yalnızca API'nin indirdiği `public/img/uploads/*.webp` dosyaları
    etkilenir; elle eklenen `/img/*.webp` statik görsellerine asla
    dokunulmaz (allowlist + path traversal koruması:
    `src/lib/articles/image-handler.ts` → `deleteManagedUploadFile`).
  - İki makale aynı upload dosyasını paylaşıyorsa dosya, onu kullanan son
    makale de silinene/değiştirene kadar kalır.
  - Silme adımı hata verirse API yanıtı bozulmaz; hata yalnızca sunucu
    günlüğüne yazılır ve dosya bir sonraki mutasyona kadar kalabilir.
- **Yedek araç (manuel denetim):** Disk alanını izlemek veya otomatik
  temizlikten kaçan dosyaları görmek için aşağıdaki betik, aktif makalelerde
  geçmeyen upload dosyalarını listeler (silmeden önce çıktıyı gözden
  geçirin):

```bash
# Aktif makalelerde kullanılmayan upload görsellerini listele (yazma yok)
python3 - <<'PY'
import json, os, urllib.request
data = json.load(open("data/articles.json"))
used = {a["image"].rsplit("/", 1)[-1] for a in data}
for f in sorted(os.listdir("public/img/uploads")):
    if f not in used:
        print("orphan:", f)
PY
```

- Görseli manuel yönetmek isteyen platformlar görseli kendi CDN'lerinde
  barındırıp `image` alanına her zaman `/img/...` yerel yolu gönderebilir;
  bu durumda upload dizinine hiç dosya yazılmaz.

### Notlar

- **Sunucu gereksinimi:** Görsel indirme, WebP dönüşümü ve `public/img/uploads/`
  yazma işlemi Node.js runtime üzerinde çalışır ve diske yazma yetkisi gerektirir.
  `sharp` paketi `dependencies` içinde olduğu için production kurulumunda
  platform uyumlu native binding ile birlikte gelir; `next start`
  (Node.js VPS / PM2) ile sorunsuz çalışır. Vercel gibi salt-okunur /
  geçici dosya sistemine sahip serverless ortamlarda yazım kalıcı olmaz; bu
  ortamlarda görseller harici bir CDN'de barındırılmalı ve yerel yol
  (`/img/...`) olarak gönderilmelidir.
- **Statik dosya servisi:** Next.js `public/` dizinini sunucu başlangıcında bir
  kez tarar; runtime'da eklenen dosyalar doğrudan `/img/...` adresinden
  servis edilemez. Bu nedenle `next.config.js` içinde `afterFiles` rewrite'i
  tanımlıdır: `/img/:path*` → `/api/img/:path*`. Build anında kayıtlı görseller
  Next.js'in statik hattından (hızlı) servis edilir, yalnızca runtime'da
  eklenenler `src/app/api/img/[...path]/route.ts` route handler'ı tarafından
  diskten okunur. Bu sayede sunucu yeniden başlatmadan da görseller görünür.
- **Hotlinking koruması:** Görsel yerel olarak saklandığı için yayınlanan
  sayfalarda dış sunucuya istek atılmaz; performans ve kesintilere karşı
  korunur.
- **Next.js `<Image>` uyumu:** Kaydedilen görseller site içi yol olduğu için
  `next.config.js` `images.remotePatterns` whitelist'ine gerek kalmaz.
- Görsel alanı gönderilmediğinde işlem yapılmaz; `PUT` isteklerinde yalnızca
  `image` alanı gönderiliyorsa indirme akışı tetiklenir.
- `PUT` ile görsel değiştirildiğinde, eski görsel `public/img/uploads/`
  altındaysa ve başka hiçbir makale onu kullanmıyorsa eski dosya otomatik
  silinir (bkz. [Silinen makalenin görselleri](#silinen-makalenin-görselleri-orphan-dosya)).

## Hata Biçimi

```json
{ "error": { "code": "validation_failed", "message": "...", "errors": ["title zorunludur"] } }
```

| Durum | `code`               | Anlam                                  |
|-------|----------------------|----------------------------------------|
| 400   | `invalid_json`       | Gövde JSON değil                       |
| 400   | `validation_failed`  | Alan doğrulaması hatası (`errors` listesi) |
| 400   | `invalid_slug`       | URL slug biçimi geçersiz               |
| 400   | `image_processing_failed` | Görsel indirilemedi / tip veya boyut kontrolü başarısız |
| 401   | `unauthorized`       | Token eksik/geçersiz                   |
| 404   | `not_found`          | Slug bulunamadı                        |
| 409   | `slug_conflict`      | POST'ta slug zaten var                 |
| 429   | `rate_limited`       | Yazma limiti aşıldı (`Retry-After`)    |
| 503   | `api_not_configured` | `ARTICLES_API_TOKEN` tanımlı değil     |

---

## Go-Live Kontrol Listesi

curl -s -X POST "$BASE" \
  -H "Authorization: Bearer $ARTICLES_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tag": "MAKALE",
    "title": "İlk Test Makalem",
    "description": "Entegrasyonun ilk kurulumunda oluşturulan kontrol makalesi.",
    "image": "/img/logo.webp",
    "imageAlt": "PrintWater logosu",
    "content": "<h2>Kurulum tamam</h2><p>Bu makale API bağlantısını doğrulamak için oluşturuldu.</p>"
  }' | python3 -m json.tool
```

Beklenen yanıt: `"slug": "ilk-test-makalem"` içeren `201` gövdesi. Aynı makale
`https://localhost:3000/blog/ilk-test-makalem` adresinde ve `/sitemap.xml`
içinde anında görünür.

**Adım 5 — Temizlik (test makalesini silin).**

```bash
curl -s -X DELETE "$BASE/ilk-test-makalem" \
  -H "Authorization: Bearer $ARTICLES_API_TOKEN" | python3 -m json.tool
# Beklenen: 200 ve silinen makale gövdesi
```

Beş adımın tamamı beklendiği gibiyse entegrasyon hazırdır. Üretim için
[Go-Live Kontrol Listesi](#go-live-kontrol-listesi) bölümüne geçin.

## Postman Koleksiyonu

Postman'da **Import → Raw text** ile aşağıdaki JSON'u içe aktarın. Koleksiyon;
`baseUrl` ve `token` değişkenlerini kullanır ve beş uç için hazır istekler
içerir. **Environments → token** alanına `ARTICLES_API_TOKEN` değerini
girin (Postman ortam değişkenleri gizli saklanabilir; `secret` tipini seçin).

```json
{
  "info": {
    "name": "PrintWater — Bilgi Merkezi API",
    "description": "Bilgi Merkezi makale CRUD uçları. 'token' ortam değişkenini Bearer değeri olarak kullanır.",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    { "key": "baseUrl", "value": "http://localhost:3000/api/v1/articles" },
    { "key": "slug", "value": "ilk-test-makalem" }
  ],
  "auth": {
    "type": "bearer",
    "bearer": [ { "key": "token", "value": "{{token}}", "type": "string" } ]
  },
  "item": [
    {
      "name": "01 — Listele (herkese açık)",
      "request": {
        "auth": { "type": "noauth" },
        "method": "GET",
        "url": { "raw": "{{baseUrl}}", "host": ["{{baseUrl}}"] }
      }
    },
    {
      "name": "02 — Tek makale (herkese açık)",
      "request": {
        "auth": { "type": "noauth" },
        "method": "GET",
        "url": { "raw": "{{baseUrl}}/{{slug}}", "host": ["{{baseUrl}}"], "path": ["{{slug}}"] }
      }
    },
    {
      "name": "03 — Ekle (POST)",
      "request": {
        "method": "POST",
        "header": [ { "key": "Content-Type", "value": "application/json" } ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"tag\": \"MAKALE\",\n  \"title\": \"İlk Test Makalem\",\n  \"description\": \"Postman ile oluşturulan kontrol makalesi.\",\n  \"image\": \"/img/logo.webp\",\n  \"imageAlt\": \"PrintWater logosu\",\n  \"content\": \"<h2>Postman</h2><p>Koleksiyon doğrulama makalesi.</p>\"\n}"
        },
        "url": { "raw": "{{baseUrl}}", "host": ["{{baseUrl}}"] },
        "description": "Yanıttaki data.slug değerini kopyalayıp koleksiyon değişkeni 'slug' olarak kaydedin; sonraki istekler onu kullanır."
      }
    },
    {
      "name": "04 — Güncelle (PUT, kısmi yama)",
      "request": {
        "method": "PUT",
        "header": [ { "key": "Content-Type", "value": "application/json" } ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"title\": \"Güncellenmiş Başlık\",\n  \"description\": \"Yalnızca gönderilen alanlar değişir.\"\n}"
        },
        "url": { "raw": "{{baseUrl}}/{{slug}}", "host": ["{{baseUrl}}"], "path": ["{{slug}}"] }
      }
    },
    {
      "name": "05 — Sil (DELETE)",
      "request": {
        "method": "DELETE",
        "url": { "raw": "{{baseUrl}}/{{slug}}", "host": ["{{baseUrl}}"], "path": ["{{slug}}"] }
      }
    }
  ]
}
```

İpuçları:

- `03 — Ekle` isteğinin **Tests** sekmesine
  `const d = pm.response.json(); pm.collectionVariables.set("slug", d.data.slug);`
  ekleyerek slug'ı otomatik yakalayabilirsiniz; sonraki istekler `{{slug}}`
  ile çalışır.
- Yanlış token senaryosunu denemek için environment'taki `token` değerini
  boşaltın: `401 unauthorized` almanız gerekir. `ARTICLES_API_TOKEN`
  tanımsız bir sunucuda ise `503 api_not_configured` döner.

## cURL Referansı

Tüm uçlar için kopyala-yapıştır komutlar. `BASE` ve `TOKEN` değişkenlerini
kendinize göre düzenleyin.

```bash
# Ortak değişkenler
BASE="https://printwater.com/api/v1/articles"   # yerel: http://localhost:3000/api/v1/articles
TOKEN="$ARTICLES_API_TOKEN"
```

```bash
# 1) Listeleme (herkese açık) — makale sayısını göster
curl -s "$BASE" | jq '.count, .data[].slug'

# 2) Tek makale
curl -s "$BASE/ilk-test-makalem" | jq '.data.title'

# 3) Ekleme — durum kodu ve gövde birlikte
curl -s -o /tmp/resp.json -w 'HTTP %{http_code}\n' -X POST "$BASE" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data @payload.json \
  && jq '.data.slug, .data.image' /tmp/resp.json

# 4) Güncelleme (kısmi yama)
curl -s -X PUT "$BASE/ilk-test-makalem" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Yeni Başlık"}' | jq '.data.title'

# 5) Silme
curl -s -X DELETE "$BASE/ilk-test-makalem" \
  -H "Authorization: Bearer $TOKEN" | jq '.data.slug'
```

**Toplu içe aktarma (rate limit'li döngü).** `429` yanıtındaki
`Retry-After` değerine uyar ve kaldığı yerden devam eder:

```bash
#!/usr/bin/env bash
# bulk-import.sh — payload.jsonl: her satırı bir makale JSON'u
BASE="https://printwater.com/api/v1/articles"
TOKEN="$ARTICLES_API_TOKEN"

while IFS= read -r line; do
  code=$(curl -s -o /tmp/bulk.json -w '%{http_code}' -X POST "$BASE" \
    -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
    -d "$line")
  if [ "$code" = "429" ]; then
    retry=$(curl -s -D - -o /dev/null -X POST "$BASE" \
      -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
      -d "$line" | awk 'BEGIN{IGNORECASE=1}/^retry-after:/{print $2}' | tr -d '\r')
    sleep "${retry:-60}"; continue
  fi
  if [ "$code" = "201" ]; then
    echo "OK: $(jq -r '.data.slug' /tmp/bulk.json)"
  else
    echo "FAIL ($code): $(cat /tmp/bulk.json)"
  fi
done < payload.jsonl
```

**Doğrulama hatalarını okuma.** `validation_failed` yanıtlarındaki `errors`
listesi, hangi alanların düzeltilmesi gerektiğini satır satır söyler:

```bash
curl -s -X POST "$BASE" -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" -d '{}' | jq -r '.error.errors[]'
```

## Headless CMS / Özel Entegrasyon

Bu API, herhangi bir headless CMS'in "publish" olayına bağlanarak içerik
kaynağı olarak kullanılabilir. Aşağıda en yaygın üç platform için alan
eşlemesi ve akış önerisi verilir.

### Ortak ilkeler (tüm platformlar)

- **Token CMS'in gizli ayarında tutulur** (environment variable / secret
  manager). Şablonlarda, webhook payload'larında veya istemci kodunda asla
  görünmez.
- **Alan eşlemesi** birebir değildir; CMS'in zengin metin (rich text)
  çıktısı düz HTML'e çevrilir ve `content` alanına yazılır.
- **Kanıtlanmış eşleme tablosu:**

| API alanı | Strapi field | WordPress | Contentful / Sanity |
|-----------|--------------|-----------|---------------------|
| `tag`     | `kategoria` (short text) | kategori adı | taxonomy / category |
| `title`   | `baslik`     | `post_title` | `title` |
| `description` | `ozet` (short text ≤500) | `post_excerpt` | `shortDescription` |
| `image`   | `kapak.url`  | featured image `source_url` | asset URL |
| `imageAlt`| `kapakAlt`   | `alt` meta | asset `alt` |
| `content` | zengin metin → HTML | `post_content` | rich text renderer çıktısı |
| `slug`    | `slug`       | `post_name` | `slug` |
| `publishedAt` | `publishedAt` | `post_date_gmt` | `sys.firstPublishedAt` |

### Strapi

1. Strapi'de `webhook` oluşturun (`Settings → Webhooks`): entry **create /
   update / delete** olaylarında bir köprü servisinize POST edilir.
2. Köprü servis (ör. küçük bir Node/Express fonksiyonu, Cloudflare Worker,
   n8n/Make akışı) webhook gövdesini API alanlarına çevirir ve aşağıdaki
   eşlemeye göre çağrı yapar:
   - `entry.created` → `POST /api/v1/articles`
   - `entry.updated` → `PUT /api/v1/articles/{slug}`
   - `entry.deleted` → `DELETE /api/v1/articles/{slug}`
3. Strapi `slug` alanı bu API'nin `^[a-z0-9]+(?:-[a-z0-9]+)*$` desenine
   uymuyorsa köprü serviste normalizasyon yapın; aksi halde `400 invalid_slug`
   (URL'de) veya `400 validation_failed` (gövdede) alırsınız.

```js
// Strapi webhook → PrintWater API köprüsü (örnek, Node/Express)
app.post('/strapi-webhook', async (req, res) => {
  const { event, entry } = req.body
  const article = {
    tag: entry.kategoria ?? 'MAKALE',
    title: entry.baslik,
    description: entry.ozet,
    image: entry.kapak?.url,           // https://... ise sunucu indirir
    imageAlt: entry.kapakAlt ?? entry.baslik,
    content: entry.govde,              // zengin metin HTML çıktısı
    slug: entry.slug,
  }
  const headers = {
    'Authorization': `Bearer ${process.env.ARTICLES_API_TOKEN}`,
    'Content-Type': 'application/json',
  }
  if (event === 'entry.created') {
    await fetch(`${process.env.PW_API}/articles`, { method: 'POST', headers, body: JSON.stringify(article) })
  } else if (event === 'entry.updated') {
    const { slug, ...patch } = article
    await fetch(`${process.env.PW_API}/articles/${slug}`, { method: 'PUT', headers, body: JSON.stringify(patch) })
  } else if (event === 'entry.deleted') {
    await fetch(`${process.env.PW_API}/articles/${entry.slug}`, { method: 'DELETE', headers })
  }
  res.sendStatus(200)
})
```

### WordPress

WordPress içerikleri `wp-json/wp/v2/posts` üzerinden okunabilir; iki pratik
yaklaşım vardır:

- **Çekme modeli (önerilen, token WP tarafında gerekmez):** Zamanlanmış bir
  görev (WP-Cron veya sunucu cron) `GET /wp-json/wp/v2/posts?after=<son senkron>`
  ile yeni/güncellenmiş yazıları çeker ve PrintWater API'sine gönderir.
- **Gönderme modeli:** `save_post`/`before_delete_post` kancalarında PHP
  `wp_remote_post()`/`wp_remote_request()` ile API çağrılır. Token
  `wp-config.php` içinde sabit olarak tanımlanır
  (`define('ARTICLES_API_TOKEN', '...')`) ve kod havuzuna eklenmez.

```php
// functions.php veya mu-plugin — yayınlandığında PrintWater'a gönder
add_action('transition_post_status', function ($new, $old, $post) {
    if ($post->post_type !== 'post' || $new !== 'publish') return;

    $img_id  = get_post_thumbnail_id($post);
    $payload = [
        'tag'         => 'MAKALE',
        'title'       => get_the_title($post),
        'description' => wp_trim_words(wp_strip_all_tags($post->post_excerpt ?: $post->post_content), 40),
        'image'       => $img_id ? wp_get_attachment_image_url($img_id, 'full') : '',
        'imageAlt'    => $img_id ? get_post_meta($img_id, '_wp_attachment_image_alt', true) ?: get_the_title($post) : get_the_title($post),
        'content'     => wpautop($post->post_content),
        'slug'        => $post->post_name,
        'publishedAt' => get_post_time('c', true, $post),
    ];

    wp_remote_post('https://printwater.com/api/v1/articles', [
        'headers' => [
            'Authorization' => 'Bearer ' . ARTICLES_API_TOKEN,
            'Content-Type'  => 'application/json',
        ],
        'body'    => wp_json_encode($payload),
        'timeout' => 20,
    ]);
}, 10, 3);
```

Silme ve güncelleme için benzer kancalarla `PUT`/`DELETE` çağrılır
(`wp_remote_request($url, ['method' => 'PUT', ...])`).

### Contentful / Sanity

- **Contentful:** `Publish` event'i Contentful Web App'te webhook olarak
  tanımlanır; köprü servis payload'ındaki `fields` değerlerini API alanlarına
  çevirir. `image` alanına asset'in `https://...` URL'si verilir; sunucu
  görseli otomatik indirip WebP'ye dönüştürür.
- **Sanity:** GROQ-powered `sanity` webhook (veya `@sanity/webhook` listener)
  `create/update/delete` olaylarında çağrılır. Portable Text çıktısı
  `@portabletext/to-html` ile HTML'e dönüştürülür.

Her iki platformda da **slug kalıcılığı** kritiktir: CMS tarafındaki slug
değişirse eski slug'a `PUT` yerine yeni slug ile `POST` yapmak sitede çift
makale üretir. Doğru akış: eski slug'ı `DELETE`, yenisini `POST`.

## Webhook / Otomasyon

Zapier, Make (Integromat) veya n8n ile kod yazmadan içerik akışı kurulabilir.

**Zapier / Make akışı (örnek):**

1. **Trigger:** CMS'te yeni yayın (ör. RSS, webhook, veritabanı kaydı).
2. **Mapper:** alanları API alanlarına eşle (yukarıdaki tablo).
3. **Action:** `POST` → `https://printwater.com/api/v1/articles`,
   Headers: `Authorization: Bearer {{token}}`, Content-Type: `application/json`,
   Body: aşağıdaki şablon.

```json
{
  "tag": "{{kategori}}",
  "title": "{{baslik}}",
  "description": "{{ozet}}",
  "image": "{{kapakUrl}}",
  "imageAlt": "{{kapakAlt}}",
  "content": "{{govdeHtml}}",
  "slug": "{{slug}}",
  "publishedAt": "{{yayinTarihi}}"
}
```

**n8n örnek akış:** `Webhook (CMS) → Set (alan eşleme) → HTTP Request (POST) → IF (status ≠ 201) → HTTP Request (retry)`. `429` durumunda düğümün
`Retry On Fail` ayarı `Retry-After` başlığına uyar.

**Güvenilirlik kuralları:**

- Otomasyon tarafında **idempotency** sağlayın: her tetikleme için aynı
  `slug` kullanın; `409 slug_conflict` alırsanız `PUT` ile güncelleyin.
- `429` yanıtlarında `Retry-After` süresi kadar bekleyin; yoksa hız sınırı
  kalıcı olarak tetiklenir.
- Hata durumunda (4xx) payload'ı loglayın; `validation_failed.errors`
  listesi hangi alanın bozuk olduğunu söyler.
- Webhook'lar tekrar edebilir (at-least-once teslim); yinelenen `POST`
  istekleri `409` ile güvenle reddedilir ve veri bozulmaz.

## Hata Ayıklama Rehberi

Aşağıdaki tablo, entegrasyon sırasında en sık karşılaşılan durumları ve
çözümlerini özetler.

| Belirti | Olası neden | Çözüm |
|---------|-------------|-------|
| `401 unauthorized` | Token yok, boş, hatalı biçim veya `Bearer ` öneki eksik | Başlık tam olarak `Authorization: Bearer <token>` olmalı; önekten sonra tek boşluk bırakın. Token'ı `.env.local`'dan değil, ortam değişkeninden okuyun. |
| `401 unauthorized` (token doğru) | Sunucu farklı bir token ile başlatılmış (değişken değişikliği sonrası yeniden başlatılmamış) | Ortam değişkeni değişince `npm run start`'ı yeniden başlatın; eski süreç eski token'ı tutar. |
| `503 api_not_configured` | `ARTICLES_API_TOKEN` sunucu ortamında tanımsız (deploy'da env'i girmeyi unutmak çok yaygındır) | Ortam değişkenini sunucuya ekleyin ve süreci yeniden başlatın. `.env.local` dosyası deploy ortamına otomatik kopyalanmaz. |
| `400 validation_failed` + `errors` listesi | Zorunlu alan eksik, boş veya sınır aşılmış | `errors` dizisini satır satır okuyun; her satır `<alan> <kural>` biçimindedir. |
| `400 image_processing_failed` | URL erişilemez, MIME uygun değil, boyut >5 MB, yönlendirme >3 veya SSRF (özel IP) | Tarayıcıda URL'yi açıp görselin göründüğünden emin olun; `curl -I <url>` ile `content-type: image/jpeg|png|webp` doğrulayın. Kurum içi / localhost adresleri kasıtlı olarak reddedilir. |
| `409 slug_conflict` | Aynı slug zaten var (çoğu zaman Türkçe başlıktan slug türetmesi farklıdır) | Yanıttaki önerilen slug'ı okuyun; mevcut makaleyi güncellemek için `slug`ı URL'de kullanıp `PUT` gönderin. |
| `404 not_found` (PUT/DELETE) | Slug yazımı veya Türkçe karakter dönüşümü | `GET /api/v1/articles` listesindeki gerçek slug'ı kullanın; `ö→o`, `ı→i`, `ş→s`, `ü→u`, `ğ→g`, `ç→c` dönüşümü uygulanır. |
| `400 invalid_slug` (URL'de) | Slug biçimi `^[a-z0-9]+(?:-[a-z0-9]+)*$` desenine uymuyor | Yalnızca küçük harf, rakam ve tire kullanın; boşluk ve alt çizgi yasaktır. |
| `429 rate_limited` | Dakikada 30 yazma isteği aşıldı | `Retry-After` başlığına uyun; toplu içe aktarmada bekleme + devam döngüsü kurun (bkz. cURL Referansı). |
| Makale sitede görünmüyor | Cache yenilenmemiş | `/blog` ve makale sayfası yazma işleminde anında tazelenir; tarayıcı önbelleğini yoksayarak (`Ctrl+Shift+R`) deneyin. `/sitemap.xml` her istekte depodan üretilir. |

## Hata Senaryoları — "Nasıl Düzeltirim?"

Aşağıdaki 3 senaryo, entegrasyon sırasında en sık karşılaşılan yönetici hataları ve düzeltme yollarıdır:

| Senaryo | Neden | Düzeltme Adımı |
|---------|-------|----------------|
| (a) "Yanlış bilgi girdim" | Başlık, description veya başka bir alan hatalı girildi | **Yalnızca hatalı alanı** göndererek `PUT` gönderin. Tüm makaleyi yeniden göndermeye gerek yok — `PUT` kısmi yama (merge) semantiktir, sadece gönderilen alanlar değişir (`validation.ts:151-220`). |
| (b) "Slug'ı yanlış yazdım" | Slug Türkçe karakter dönüşümü ile oluşturuldu veya hatalı yazıldı | **DELETE** ile eski slug'ı silin, ardından yeni slug ile `POST` gönderin (`validation.ts:162-164`). Slug'ı PUT ile güncellemeye çalışırsanız `404` alınır (`[slug]/route.ts:113-114`). |
| (c) "Aynı makaleyi iki kez ekledim" | Aynı slug ile iki `POST` gönderildi | İkinci `POST` `409 slug_conflict` döndürür (`route.ts:54-64`). Hata yanıtındaki slug'ı okuyup, mevcut makaleyi `PUT` ile güncelleyin. Böylece veri bozulmaz ve makale tek başına kalır. |

## Makale Yaşam Döngüsü

**Taslak kavramı yok** — `POST` = anında yayın. Makaleyi kaydedikten sonra değişiklere gerek yok; site anında güncellenir.

Akış şeması:

```
POST /api/v1/articles  →  makale anında yayınlanır
                       │
                       ▼
                /blog listesi güncellenir
                       │
                       ▼
              /blog/{slug} ve ana sayfa güncellenir
                       │
                       ▼
              /sitemap.xml anında yansılanır (force-dynamic)
                       │
                       ▼
                Tarayıcı önbelleği: Ctrl+Shift+R ile yenile

PUT /api/v1/articles/{slug}  →  kısmi yama (merge): sadece gönderilen alanlar değişir
                               │
                               ▼
                        Makale güncellenir, sayfalar tazelenir
                               │
                               ▼
                        /sitemap.xml güncellenir

DELETE /api/v1/articles/{slug}  →  makale kaldırılır
                                │
                                ▼
                         /blog listesi güncellenir
                                │
                                ▼
                        /blog/{slug} ve ana sayfa güncellenir
                                │
                                ▼
                         /sitemap.xml güncellenir
```

> **Not:** `POST` ile makale oluşturulduğunda `publishedAt` otomatik olarak şu anki tarih Atanır. `PUT` ile güncelleme yapıldığında `updatedAt` otomatik olarak güncellenir. Taslak durumunda makale hiçbir zaman görünmez — doğrudan `POST` ile yayın olur veya taslak uçları (eğer varsa) kullanın.

## Test Makalesi Şablonu

Entegrasyonu doğrulamak için kopyalanabilir minimal payload. `content`
alanında bilinçli olarak XSS vektörleri bulunur; sunucu bu alanları
temizleyerek kaydeder. Bu örneği gönderdikten sonra `GET` ile içerikte ne
kaldığını kontrol ederek sanitization'ı doğrulayabilirsiniz.

```json
{
  "tag": "TEST",
  "title": "API Entegrasyon Testi",
  "description": "Sanitization ve görsel indirme davranışını doğrulayan test makalesi.",
  "image": "https://picsum.photos/1200/800",
  "imageAlt": "Entegrasyon testi kapak görseli",
  "content": "<h2>Güvenlik doğrulaması</h2><p>Bu paragraf korunmalıdır.</p><script>alert('xss')</script><a href=\"javascript:alert(1)\" onclick=\"alert(2)\">kötü bağlantı</a>",
  "slug": "api-entegrasyon-testi"
}
```

Gönderim ve doğrulama:

```bash
curl -s -X POST "$BASE" -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" --data @test-payload.json \
  | jq '.data.slug, .data.image, .data.content'
```

Beklenen sonuç:

- `image` → `/img/uploads/api-entegrasyon-testi-cover-<zaman>.webp`
  (harici görsel indirilip WebP'ye dönüştürüldü).
- `content` → `<script>`, `onclick` ve `javascript:` **kaldırılmış**;
  `<h2>` ve `<p>` korunmuş:
  `<h2>Güvenlik doğrulaması</h2><p>Bu paragraf korunmalıdır.</p><a href="alert(1)">kötü bağlantı</a>`
- `201` sonrası makale `/blog/api-entegrasyon-testi` ve `/sitemap.xml`
  içinde anında görünür.

Test bittikten sonra makaleyi silin:

```bash
curl -s -X DELETE "$BASE/api-entegrasyon-testi" -H "Authorization: Bearer $TOKEN" -o /dev/null -w '%{http_code}\n'
# Beklenen: 200
```

## Gerçek Makale Örneği

Entegrasyonu doğrulamak ve yöneticiler için gerçekçi bir örnek sunmak üzere
kopyalanabilir payload. `content` alanında çok bölümlü HTML (h2 + paragraf +
liste + tablo) bulunur. Sunucu bu alanları DOMPurify ile temizleyerek kaydeder.

```json
{
  "tag": "TEKNİK BİLGİ",
  "title": "PrintWater Sistemi Kurulum Rehberi",
  "description": "Sistemin temel özellikleri ve kurulum adımları hakkında kısaca özet.",
  "image": "/img/kurulum-webp.webp",
  "imageAlt": "PrintWater sistemi kurulum diyagramı",
  "content": "<h2>Giriş</h2>\n<p>PrintWater sistemi, makale yönetimi için tasarlanmış REST API'sidir.</p>\n<h2>Kurulum</h2>\n<ul>\n<li>Depoyu klonlayın</li>\n<li>Ortam değişkenlerini ayarlayın</li>\n<li>Sunucuyu başlatın</li>\n</ul>\n<h2>Kullanım</h2>\n<p>API uçları üzerinden makale oluşturun ve yönetin.</p>\n<table>\n<tr>\n<th>Alan</th>\n<td>Açıklama</td>\n</tr>\n<tr>\n<td>tag</td>\n<td>Makalenin kategorisi</td>\n</tr>\n<tr>\n<td>title</td>\n<td>Makale başlığı</td>\n</tr>\n</table>\n<a href=\"https://printwater.com\">PrintWater web sitesi</a>",
  "slug": "printwater-kurulum-rehberi"
}
```

Gönderim ve doğrulama:

```bash
curl -s -X POST "$BASE" -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" --data @real-article-payload.json \
  | jq '.data.slug, .data.image, .data.content'
```

Beklenen sonuç:

- `image` → `/img/kurulum-webp.webp`
  (site içi yol gönderildiği için doğrudan kaydedilir, WebP'e dönüştürülmez).
- `content` → DOMPurify ile temizlenmiş hali:
  `<h2>Giriş</h2><p>PrintWater sistemi, makale yönetimi için tasarlanmış REST API'sidir.</p>
  <h2>Kurulum</h2><ul><li>Depoyu klonlayın</li><li>Ortam değişkenlerini ayarlayın</li><li>Sunucuyu başlatın</li></ul>
  <h2>Kullanım</h2><p>API uçları üzerinden makale oluşturun ve yönetin.</p>
  <table><tr><th>Alan</th><td>Açıklama</td></tr>
  <tr><td>tag</td><td>Makalenin kategorisi</td></tr>
  <tr><td>title</td><td>Makale başlığı</td></tr></table>
  <a href="https://printwater.com">PrintWater web sitesi</a>`
- `201` sonrası makale `/blog/printwater-kurulum-rehberi` ve `/sitemap.xml`
  içinde anında görünür.

Test bittikten sonra makaleyi silin:

```bash
curl -s -X DELETE "$BASE/printwater-kurulum-rehberi" -H "Authorization: Bearer $TOKEN" -o /dev/null -w '%{http_code}\n'
# Beklenen: 200
```

## Go-Live Kontrol Listesi

Production'a çıkmadan önce sırayla doğrulayın:

- [ ] `ARTICLES_API_TOKEN` sunucu ortamında tanımlı ve ≥32 karakter
      (`openssl rand -hex 32` ile üretilmiş).
- [ ] Token **geliştirme token'ı değil**, production için ayrı üretilmiş bir
      değer; kodda, depoda veya e-postada geçmiyor.
- [ ] `.env.local` (veya sunucu ortam dosyası) versiyon kontrolünde değil
      (`.gitignore` kapsamında `.env*.local`).
- [ ] Token yalnızca sunucu tarafında / harici platformun gizli ayarında
      tutuluyor; istemci koduna, webhook şablonlarına gömülmemiş.
- [ ] `data/articles.json` için **kalıcı disk yolu** tanımlı
      (`ARTICLES_DATA_FILE=/var/lib/printwater/articles.json` gibi);
      dizin yazılabilir ve deploy'lar arasında korunuyor.
- [ ] `public/img/uploads/` dizini yazılabilir ve kalıcı; birden fazla
      instance varsa paylaşılan disk/obje storage değerlendirildi.
- [ ] Dosya deposu yedeği alınıyor (`data/articles.json` periyodik yedek;
      kaybolursa site seed içeriğine düşer, harici içerik kaybolur).
- [ ] Reverse proxy'de (nginx vb.) rate limit katmanı eklendi
      (`limit_req`) — uygulama içi limit süreç başına çalışır.
- [ ] Sunucu saati doğru (NTP); `publishedAt` ve sitemap `lastModified`
      bu saate göre üretilir.
- [ ] `GET /api/v1/articles` → `200`; token'sız `POST` → `401`;
      yanlış token `POST` → `401` kontrol edildi.
- [ ] `/blog` listesi, test makalesi ve `/sitemap.xml` görünürlüğü
      uçtan uca doğrulandı (bkz. Hızlı Başlangıç).
- [ ] Token rotasyon planı belirlendi (ör. 6 ayda bir yeni token üret,
      eskiyi devre dışı bırak — rotasyon tek env değişkeni değişikliği ve
      yeniden başlatma ile yapılır).
- [ ] Otomatik orphan görsel temizliği doğrulandı (DELETE/PUT sonrası
      kullanılmayan upload dosyası siliniyor); manuel denetim betiği yedek
      araç olarak tanınıyor (bkz. Silinen makalenin görselleri).
- [ ] Kritik olmayan istemciler için hız limiti toleransı tanımlı
      (Retry-After uyumu, idempotent slug kullanımı).

## Dağıtım Notları

### Deploy'da token

Yazma uçları `ARTICLES_API_TOKEN` tanımlı değilken fail-closed davranır
(`503 service_unavailable`); bu yüzden token **deploy'un bir parçası** olmalı.

- **Docker Compose:** `docker-compose.yml` `env_file` ile `.env`'i okur
  (`required: false` — dosya yoksa compose düşmez, token tanımsız kalır ve
  yazma uçları fail-closed 503 döner). Repodaki `.env` dosyasına
  (`.gitignore` kapsamında, depoya gönderilmez) token'ı yazın:

  ```bash
  # Production token üretimi ve .env'e yazma (deploy öncesi, sunucuda bir kez)
  cp .env.example .env            # bootstrap: şablonu kopyala
  echo "ARTICLES_API_TOKEN=$(openssl rand -hex 32)" >> .env
  docker compose up -d
  ```

  Geliştirme token'ı `.env.local`'da ayrı tutulur; compose bunu okumaz
  (`env_file` yalnızca `.env`'i yükler).

- **systemd / VPS (Next.js doğrudan):** Token'ı ayrı bir env dosyasında
  tutup servise bağlayın:

  ```ini
  # /etc/printwater/articles.env  (root:root, chmod 600)
  ARTICLES_API_TOKEN=<openssl rand -hex 32 çıktısı>
  ```

  ```ini
  # printwater.service içinde
  [Service]
  EnvironmentFile=/etc/printwater/articles.env
  ```

- **Rotasyon:** Yeni token üretip env değerini değiştirmek ve servisi yeniden
  başlatmak yeterlidir (`docker compose up -d` veya
  `systemctl restart printwater`). Kod veya build değişikliği gerekmez.
  Rotasyon sonrası eski token'ın `401` döndürdüğünü doğrulayın.
- Bu token yalnızca içerik editörü/dış platform tarafından **sunucu
  tarafında** kullanılır; istemci koduna asla konulmaz.

- **Node sunucusu (mevcut üretim modeli):** Üretimde **Docker standalone**
  kullanılır: `Dockerfile` `node server.js` (standalone sunucu) ile çalışır.
  `next.config.js` `output: 'standalone'` ayarlı olduğu için `npm start`
  (`next start`) Next 14'te yalnızca uyarıyla çalışır — **yerel doğrulama
  içindir**; Node host'ta üretime çıkılacaksa `node .next/standalone/server.js`
  + `public/` ve `.next/static` kopyası gerekir. `data/` dizininin yazılabilir
  ve deploy'lar arasında korunan bir yolda olduğundan emin olun (`.gitignore`'da;
  öneri: `ARTICLES_DATA_FILE=/var/lib/printwater/articles.json`). Harici görsel
  indirme özelliğinin çalışması için `public/img/uploads/` dizininin de
  **yazılabilir** olması gerekir; dosyaların kalıcı diskte tutulması isteniyorsa
  dizin deploy'lar arasında korunmalıdır.
- **Ağ topolojisi ve hız limiti:** `docker-compose.yml` portu yalnızca
  `127.0.0.1`'e bağlar; üretimde nginx ön katmandır (`X-Forwarded-For`'ı
  `$remote_addr` ile ezer). Uygulamanın IP tabanlı hız limiti bu başlığa
  güvenir — portu doğrudan dışarı açarsanız istemciler sahte `X-Forwarded-For`
  ile limit kovasını atlayabilir.
- **Vercel/serverless:** Dosya sistemi istekler arasında kalıcı **değildir**;
  bu API'nin çalışması için kalıcı depolama (Vercel KV/Postgres, Supabase vb.)
  ya da planın Seçenek 2'si (Headless CMS) gerekir. Store arayüzü
  (`listArticles`/`createArticle`/`updateArticle`/`deleteArticle`) soyut olduğu
  için yalnızca `store.ts` değişir.
- **Yedekleme:** `data/articles.json` (veya `ARTICLES_DATA_FILE`) günlük
  olarak `scripts/backup-articles.mjs` ile yedeklenir; betik bağımlılıksız
  Node.js'dir, zaman damgalı kopya + `latest.json` işaretçisi üretir ve en
  yeni 14 kopyayı saklar (rotasyon). Docker Compose dağıtımında
  `ARTICLES_BACKUP_DIR=/backups` ve `backups_volume` hazır gelir; cron
  örnekleri:

  ```bash
  # Kaba cron (host üzerinde, konteyner dışı Node kuruluysa):
  0 3 * * * cd /app && /usr/local/bin/node scripts/backup-articles.mjs

  # Konteyner içinden çalıştırma (host cron + docker exec):
  0 3 * * * docker exec printwater-web node scripts/backup-articles.mjs
  ```

  Yedekler `backups/articles/` altında `articles-<ISO>.json` adlarıyla birikir;
  geri yükleme, istenen kopyayı `ARTICLES_DATA_FILE` yoluna kopyalayıp servisi
  yeniden başlatmaktır.

- Erişim anahtarları asla istemci koduna konulmaz; API sunucu tarafında veya
  dış platformun gizli ayarlarında çağrılır.

### Çoklu Süreç / Cluster Kısıtlaması

`store.ts`'teki yazma kilidi (`withWriteLock`) **yalnızca tek Node süreci**
içindir. Üretimde birden fazla Next.js örneği (cluster/PM2) veya birden fazla
konteyner çalıştırılıyorsa, `data/articles.json`'a aynı anda yazan süreçler
read-modify-write yarışı yaşıyabilir ve kayıt kaybına yol açabilir.

- **Tek konteyner (mevcut üretim modeli):** Kısıtlama etkisiz; güvenli.
- **Çoklu süreç:** Dosya kilidi (ör. `flock`) ekleyin veya store'u veritabanına
  geçirin. Store arayüzü (`listArticles`/`createArticle`/`updateArticle`/
  `deleteArticle`) soyut olduğu için yalnızca `src/lib/articles/store.ts`
  değişir.
- Hız sınırı da süreç başına uygulanır; nginx `limit_req` ile ek katmanlama
  önerilir (bkz. [Hız Sınırlama](#hız-sınırlama)).

- **Karar (Görev 4):** Üretim modeli tek `printwater-web` konteyneridir
  (`docker-compose.yml` tek örneği çalıştırır). `withWriteLock` tek-süreç kilidi
  bu modelde yeterlidir ve şimdilik **kod değişikliği gerekmez**. Bu kısıtlama
  kabul edilmiştir; çok konteyner/cluster ölçeklenmesi gerekirse `flock` dosya
  kilidi veya veritabanı tabanlı bir store ile ayrı bir plan açılacaktır.

## Test Hızı (curl)

```
TOKEN=$ARTICLES_API_TOKEN
BASE=https://printwater.com/api/v1/articles

curl -s $BASE | jq '.count'                      # listeleme
curl -s -o /dev/null -w '%{http_code}\n' -X POST $BASE -d '{}'        # 401 bekle
curl -s -X POST $BASE -H "Authorization: Bearer $TOKEN" \
     -H 'Content-Type: application/json' -d '{"title":"Deneme"}' | jq # 400 (eksik alanlar)
```
