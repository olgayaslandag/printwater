/**
 * Bilgi Merkezi statik tohum (seed) içeriği.
 *
 * Eski Laravel API kaldırıldığında makaleler bu statik kaynakta tutuluyordu;
 * API katmanı eklendikten sonra bu dosya yalnızca İLK İÇERİK (fallback) rolündedir.
 * Çalışma zamanındaki asıl veri kaynağı `src/lib/articles/store.ts` içindeki
 * JSON dosya deposudur (data/articles.json). Bu dosya salt-okunur referanstır.
 */

import type { Article } from './types'

/** Yayındaki tüm makaleler (statik tohum kaynağı). */
const SEED_ARTICLES: Article[] = [
  {
    tag: 'MAKALE',
    title: 'Endüstriyel Nemlendirme Sistemleri Nedir?',
    description:
      'Endüstriyel nemlendirme sistemleri, endüstriyel alanlarda ortamın nem seviyesini kontrol altına almak ve hava kalitesini artırmak...',
    image: '/img/endustriyel-nemlendirme-sistemleri.webp',
    imageAlt: 'Endüstriyel Nemlendirme Sistemleri',
    slug: 'endustriyel-nemlendirme-sistemleri',
    publishedAt: '2024-01-15T00:00:00.000Z',
    content: `<h2>Tanım ve Temel Prensip</h2>
<p>Endüstriyel nemlendirme sistemleri; üretim, depolama ve işlem alanlarında ortamın bağıl nem (%RH) değerini istenen seviyede tutmak, hava kalitesini optimize etmek ve üretim süreçlerinin istikrarlı devam etmesini sağlamak amacıyla tasarlanmış mühendislik sistemlerdir.</p>
<p>Bu sistemler; suyu yüksek basınç (70-100 bar) altında 5-10 mikron boyutunda mikro zerreçiklere ayıran <strong>atomize (buharlama)</strong> teknolojisi, buharlaşma soğutma etkisi, UV sterilizasyon, PLC otomasyon ve bölgesel nem kontrolü bileşenlerinden oluşur. Temel prensip; suyu buharlaştırarak ortama enerji vermeden (izotermik süreçle) nem kazandırmasıdır.</p>
<h2>Neden Endüstriyel Nemlendirme Gerekli?</h2>
<p>Modern endüstriyel üretimde nem kontrolü; kalite, verimlilik, güvenlik ve maliyet açısından kritik öneme sahiptir:</p>
<ul>
<li><strong>Malzeme Boyutsal İstikrarı:</strong> Ahşap, kağıt, kumaş, hibrit kompozitler nem dengesizliğinde şişer/küçülür, çatlaklar oluşur.</li>
<li><strong>Statik Elektrik Kontrolü:</strong> %40 RH altında statik yükleme başlar; elektronik montaj, plastik enjeksiyon, tekstilde arıza ve güvenlik riski yaratır.</li>
<li><strong>Toz Emici Etki:</strong> Nemli hava, havadaki toz parçacıklarını yüke yüklenip yere düşürür; temiz oda standartları ve personel sağlığı için kritiktir.</li>
<li><strong>Mikrobiyolojik Kontrol:</strong> %40-60 RH aralığında bakteri, virüs ve küf büyümesi minimize edilir; gıda, ilaç, tıp cihazı üretiminde zorunludur.</li>
<li><strong>İşlem Hassasiyeti:</strong> Boya, kaplama, yapıştırma, lazer işleme, präzisyen makinelerde nem hassasiyeti mikronluk toleransları etkiler.</li>
<li><strong>Personel Konforu ve Verimliliği:</strong> ASHRAE 55 standardına göre %30-60 RH, 20-24°C en ideal konfor ve verimlilik bölgesidir.</li>
</ul>
<h2>Atomize (Yüksek Basınç) vs Diğer Yöntemler</h2>
<table style="width:100%;border-collapse:collapse;margin-top:16px;font-size:15px">
<thead>
<tr style="background:#f5f8fb">
<th style="padding:12px;text-align:left;border-bottom:2px solid #dfe8f0">Özellik</th>
<th style="padding:12px;text-align:left;border-bottom:2px solid #dfe8f0">Atomize (Yüksek Basınç)</th>
<th style="padding:12px;text-align:left;border-bottom:2px solid #dfe8f0">Buharlı (İzotermik)</th>
<th style="padding:12px;text-align:left;border-bottom:2px solid #dfe8f0">Ultrasonik / Buhar</th>
</tr>
</thead>
<tbody>
<tr style="border-bottom:1px solid #f0f0f0"><td style="padding:12px;font-weight:600">Enerji Verimliliği</td><td style="padding:12px">★★★★★ (Düşük)</td><td style="padding:12px">★★☆☆☆ (Yüksek ısı)</td><td style="padding:12px">★★★☆☆</td></tr>
<tr style="border-bottom:1px solid #f0f0f0"><td style="padding:12px;font-weight:600">Isı Yükü</td><td style="padding:12px">Soğutma etkisi</td><td style="padding:12px">Isı kaynağı gerekir</td><td style="padding:12px">Orta</td></tr>
<tr style="border-bottom:1px solid #f0f0f0"><td style="padding:12px;font-weight:600">Hijyen (Bakteri)</td><td style="padding:12px">UV + RO ile %99.9+</td><td style="padding:12px">Kaynakta ölüp bulaşabilir</td><td style="padding:12px">Riskli</td></tr>
<tr style="border-bottom:1px solid #f0f0f0"><td style="padding:12px;font-weight:600">Kapasite Ölçeklenebilirliği</td><td style="padding:12px">Modüler, sınırsız</td><td style="padding:12px">Merkezi kazan sınırlı</td><td style="padding:12px">Sınırlı</td></tr>
<tr style="border-bottom:1px solid #f0f0f0"><td style="padding:12px;font-weight:600">Bakım Kolaylığı</td><td style="padding:12px">Az hareketli parça</td><td style="padding:12px">Kazan, boru bakımı</td><td style="padding:12px">Transdütör değişimi</td></tr>
<tr style="border-bottom:1px solid #f0f0f0"><td style="padding:12px;font-weight:600">Hassasiyet (±%RH)</td><td style="padding:12px">±2-3%</td><td style="padding:12px">±3-5%</td><td style="padding:12px">±5%+</td></tr>
<tr><td style="padding:12px;font-weight:600">Kurulum Maliyeti</td><td style="padding:12px">Orta</td><td style="padding:12px">Yüksek (boru ağı)</td><td style="padding:12px">Düşük-Orta</td></tr>
</tbody>
</table>
<h2>Sektörel Uygulama Alanları ve İdeal Nem Değerleri</h2>
<div style="overflow-x:auto;margin-top:16px">
<table style="width:100%;min-width:600px;border-collapse:collapse;font-size:14px">
<thead>
<tr style="background:#061625;color:white">
<th style="padding:12px;text-align:left">Sektör / Uygulama</th>
<th style="padding:12px;text-align:center">İdeal %RH</th>
<th style="padding:12px;text-align:center">Sıcaklık (°C)</th>
<th style="padding:12px;text-align:left">Kritik Neden</th>
</tr>
</thead>
<tbody>
<tr style="background:#fafafa;border-bottom:1px solid #f0f0f0"><td style="padding:12px;font-weight:600">Matbaa / Ofset Baskı</td><td style="padding:12px;text-align:center">50-55</td><td style="padding:12px;text-align:center">20-21</td><td style="padding:12px">Kağıt boyut stabilitesi, kayıt hassasiyeti, statik kontrol</td></tr>
<tr style="background:white;border-bottom:1px solid #f0f0f0"><td style="padding:12px;font-weight:600">Tekstil Dijital Baskı</td><td style="padding:12px;text-align:center">50-55</td><td style="padding:12px;text-align:center">21-23</td><td style="padding:12px">Mürekkep tıkanması, kumaş boyutu, renk doğruluğu</td></tr>
<tr style="background:#fafafa;border-bottom:1px solid #f0f0f0"><td style="padding:12px;font-weight:600">Tekstil Dokuma / İplik</td><td style="padding:12px;text-align:center">55-65</td><td style="padding:12px;text-align:center">22-26</td><td style="padding:12px">İplik mukavemeti, kopma, statik, toz kontrolü</td></tr>
<tr style="background:white;border-bottom:1px solid #f0f0f0"><td style="padding:12px;font-weight:600">Ahşap İşleme / Mobilya</td><td style="padding:12px;text-align:center">45-55</td><td style="padding:12px;text-align:center">18-22</td><td style="padding:12px">Şişme/çatlak önleme, yapıştırma kalitesi</td></tr>
<tr style="background:#fafafa;border-bottom:1px solid #f0f0f0"><td style="padding:12px;font-weight:600">Elektronik Montaj / SMT</td><td style="padding:12px;text-align:center">40-55</td><td style="padding:12px;text-align:center">22-24</td><td style="padding:12px">ESD (statik) koruma, lehimleme kalitesi</td></tr>
<tr style="background:white;border-bottom:1px solid #f0f0f0"><td style="padding:12px;font-weight:600">Otomotiv / Boya Kaplama</td><td style="padding:12px;text-align:center">50-60</td><td style="padding:12px;text-align:center">20-25</td><td style="padding:12px">Toz kontrolü, boyama kalitesi, kuruma hızı</td></tr>
<tr style="background:#fafafa;border-bottom:1px solid #f0f0f0"><td style="padding:12px;font-weight:600">İlaç / Tıp Cihazı</td><td style="padding:12px;text-align:center">40-50</td><td style="padding:12px;text-align:center">20-22</td><td style="padding:12px">GMP, mikrobiyolojik kontrol, madde istikrarı</td></tr>
<tr style="background:white;border-bottom:1px solid #f0f0f0"><td style="padding:12px;font-weight:600">Gıda İşleme / Depolama</td><td style="padding:12px;text-align:center">55-75</td><td style="padding:12px;text-align:center">2-10 / 20-25</td><td style="padding:12px">Ürün nemi, mikrobiyolojik, kalite</td></tr>
<tr style="background:#fafafa;border-bottom:1px solid #f0f0f0"><td style="padding:12px;font-weight:600">Veri Merkezi / Sunucu</td><td style="padding:12px;text-align:center">40-55</td><td style="padding:12px;text-align:center">18-27</td><td style="padding:12px">Statik, korozyon, soğutma verimliliği</td></tr>
<tr><td style="padding:12px;font-weight:600">Müze / Arşiv / Kütüphane</td><td style="padding:12px;text-align:center">45-55</td><td style="padding:12px;text-align:center">18-20</td><td style="padding:12px">Kağıt/ahşap koruma, küf önleme</td></tr>
</tbody>
</table>
</div>
<h2>Sistem Seçiminde Dikkat Edilmesi Gerekenler</h2>
<ol>
<li><strong>Yük Analizi:</strong> Alan hacmi, hava değişim sayısı, kapı/penetrasyon sızıntıları, iç ısı/yangın yükleri, malzeme nem emisyonu.</li>
<li><strong>Su Kalitesi:</strong> RO (ters ozmoz) + UV sterilizasyon zorunludur. Şebeke suyu doğrudan kullanılamaz; kireç, bakteri, partikül nozulları tıkar ve hijyen riski yaratır.</li>
<li><strong>Bölgesel Kontrol:</strong> Farklı üretim hücrelerinde farklı nem gereksinimleri varsa (örn. baskı vs paketleme), bölgesel valfli/dağıtımlı sistem şarttır.</li>
<li><strong>Otomasyon ve Entegrasyon:</strong> BMS/SCADA entegrasyonu, Modbus/BACnet, veri loglama, uzaktan erişim, alarm/uyarı yönetimi.</li>
<li><strong>Enerji Verimliliği:</strong> İnvertörlü pompa, serbest soğutma kazancı, ısı geri kazanımı, talep tabanlı kontrol.</li>
<li><strong>Servis ve Destek:</strong> 7/24 teknik destek, yedek parça garantisi, periyodik bakım sözleşmesi, performans garantisi.</li>
</ol>
<h2>PrintWater Farkı</h2>
<p>PrintWater olarak 1993'ten beri baskı ve tekstil endüstrisine odaklanarak, patenti sistemlerimizle endüstriyel nemlendirmede önde gelen çözümleri sunuyoruz:</p>
<ul>
<li>Patenti <strong>Maldiv Nemlendirme Ünitesi</strong> ile 5-10 mikron hassas atomizasyon</li>
<li>Tam entegre <strong>RO + UV + PLC + IoT</strong> paket sistemler</li>
<li>Bölgesel bağımsız nem kontrolü (multi-zone)</li>
<li>Proje bazlı <strong>CFD simülasyon</strong> ile akış optimizasyonu</li>
<li><strong>2 yıl garanti</strong>, 7/24 destek, Türkiye geneli servis ağı</li>
<li><strong>ROI analizi</strong> ve enerji tasarrufu hesaplaması ile proje sunumu</li>
</ul>`,
  },
  {
    tag: 'TEKNİK BİLGİ',
    title: 'Nemlendirme Sistemlerinde Su Kalitesi',
    description:
      'Nemlendirme sistemlerinde su kalitesi, sistem performansı, uzun ömürlülük ve bakım gereksinimleri açısından kritik bir faktördür...',
    image: '/img/nemlendirme-sistemlerinde-su-kalitesi.webp',
    imageAlt: 'Nemlendirme Sistemlerinde Su Kalitesi',
    slug: 'nemlendirme-sistemlerinde-su-kalitesi',
    publishedAt: '2024-02-15T00:00:00.000Z',
    content: `<h2>Giriş: Su Kalitesi Neden Bu Kadar Kritik?</h2>
<p>Nemlendirme sistemlerinde kullanılan su; sadece bir "işletme gideri" değil, sistemin kalbi, beyni ve sindirim sistemidir. Yanlış su kalitesi; nozul tıkanmalarına, bakteriyel büyümeye, kireçlenmeye, pompa arızalarına, hatta üretim alanında hijyenik sorunlara (bakteri, endotoksin, küf sporu yayılımına) yol açar.</p>
<p>PrintWater mühendislik ekibi olarak 30 yıldır gördüğümüz en yaygın hata: "Şebeke suyu temizdir, doğrudan kullanabiliriz" varsayımı. Gerçekte şebeke suyu; kalsiyum/magnezyum (sertlik), klor, çelik borulardan demir/manganez, partikül, mikrobiyolojik yük ve çözünmüş gazlar içerir. Bunların her biri sistem bileşenlerini farklı yollarla etkiler.</p>
<h2>1. Sertlik (Kireç) - Nozul Ömrünün Düşmanı</h2>
<p>Atomize nozuller 5-10 mikron delik boyutuna sahiptir. Su buharlaştığında kalsiyum karbonat (CaCO₃) ve magnezyum karbonat katı halde geri kalır. Bu kireç tabakası; nozul deliklerini daraltır, spray açısını bozar, damla boyutunu büyütür (ıslatma riski) ve sonunda nozulu tamamen tıkar.</p>
<div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:16px;margin:16px 0;border-radius:0 8px 8px 0"><strong>Kritik Eşik:</strong> Toplam sertlik &gt; 50 ppm (mg/L CaCO₃) olduğunda yumuşatma/RO zorunludur. Atomize sistemlerde hedef <strong>&lt; 5 ppm</strong> sertliktir.</div>
<p><strong>Çözüm:</strong> İyon değişimli yumuşatma (softener) veya Ters Ozmoz (RO). RO tercih edilir çünkü hem sertliği hem de TDS'yi (Toplam Çözünmüş Katılar) giderir.</p>
<h2>2. TDS (Toplam Çözünmüş Katılar) ve İletkenlik</h2>
<p>Yüksek TDS'li su buharlaştığında; katı kalıntılar (beyaz toz/pudra) ortama, makinelere, ürünlere ve hava filtrelerine yağmur gibi düşer. Bu "beyaz toz" gerçekte kalsiyum, magnezyum, sodyum, potasyum, klorür, sülfat, bikarbonat tuzlarının kristalleridir.</p>
<p>Özellikle elektronik, optik, ilaç, gıda ve baskı endüstrisinde bu partiküller ürün kalitesini bozar. Hedef: <strong>TDS &lt; 10 ppm, İletkenlik &lt; 15 µS/cm</strong> (RO permeat suyu standardı).</p>
<h2>3. Mikrobiyolojik Yük ve Biyofilm Riski</h2>
<p>Nemlendirme sistemleri; ılık, nemli, karanlık boru ve tank ortamları sunar - bakteriler, küfler, algler ve biyofilm için ideal üreme zeminidir. <em>Legionella, Pseudomonas, Acinetobacter</em> gibi su kaynaklı patojenler; UV sterilizasyonsuz sistemlerde aerosol (su buharı) ile üretim alanına yayılabilir.</p>
<p>Biyofilm; boru iç yüzeylerine yapışan, slime (mukoza) tabakası oluşturan mikroorganizma kolonileridir. Bu tabaka; debiyi azaltır, korozyona yol açar (MIC - Mikrobiyolojik Etkili Korozyon), ve sürekli bakteri kaynağı olur.</p>
<div style="background:#fef2f2;border-left:4px solid #dc2626;padding:16px;margin:16px 0;border-radius:0 8px 8px 0"><strong>Zorunlu Standart:</strong> UV-C sterilizasyon (254 nm, &gt; 30 mJ/cm² doz) + RO membran bariyeri (%99.99+ bakteri/virüs retansiyonu). Paslanmaz (316L) boru ve tank malzemesi biyofilm direncini artırır.</div>
<h2>4. Klor ve Kloramin - Membran ve Malzeme Hasarı</h2>
<p>Şebeke suyundaki serbest klor (Cl₂) ve kloramin (NH₂Cl); poliamid RO membranlarını okside ederek performans kaybına (flux drop, salt passage artışı) ve kalıcı hasara yol açar. Aynı zamanda paslanmaz çelikte pik korozyon riskini artırır.</p>
<p><strong>Çözüm:</strong> RO önünde aktif karbon filtrasyon (GAC) veya sodyum metabisülfit (SMBS) dozajı ile klor giderimi.</p>
<h2>5. Demir (Fe) ve Manganez (Mn) - Estetik ve Fonksiyonel Sorunlar</h2>
<p>Kuyu suyunda veya eski çelik boru hatlarında yaygındır. Demir &gt; 0.2 ppm, Manganez &gt; 0.05 ppm olduğunda; kahverengi/siyah lekelenmeler, boru içi kirlilik, pompa girinti korozyonu, bakteriyel büyüme (demir bakterileri) oluşur.</p>
<p><strong>Çözüm:</strong> Aerasyon + filtrasyon (yeşil kum / Birm / katalitik medya) veya RO öncesi demir giderim filtresi.</p>
<h2>PrintWater Su İşletme Paketi: Standart Bileşenler</h2>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px">
<div class="card" style="padding:20px"><h4>1. Ön Filtrasyon (5 mikron)</h4><p style="margin:0;color:#647386;font-size:14px;line-height:1.6">Partikül, çamur, çelik koruma</p></div>
<div class="card" style="padding:20px"><h4>2. Aktif Karbon (GAC)</h4><p style="margin:0;color:#647386;font-size:14px;line-height:1.6">Klor, kloramin, VOC, tat/koku giderimi</p></div>
<div class="card" style="padding:20px"><h4>3. Yumuşatma (Opsiyonel)</h4><p style="margin:0;color:#647386;font-size:14px;line-height:1.6">Yüksek sertlikte RO ömrünü uzatır</p></div>
<div class="card" style="padding:20px"><h4>4. Antiscalan Dozajı</h4><p style="margin:0;color:#647386;font-size:14px;line-height:1.6">RO membranında kireç/çamur ölümesini engeller</p></div>
<div class="card" style="padding:20px"><h4>5. RO Membran Ünitesi</h4><p style="margin:0;color:#647386;font-size:14px;line-height:1.6">TDS %95-99, bakteri/virüs %99.99+ giderim</p></div>
<div class="card" style="padding:20px"><h4>6. UV-C Sterilizasyon</h4><p style="margin:0;color:#647386;font-size:14px;line-height:1.6">Son bariyer: log-4+ patojen inaktivasyonu</p></div>
<div class="card" style="padding:20px"><h4>7. Paslanmaz Tank (316L)</h4><p style="margin:0;color:#647386;font-size:14px;line-height:1.6">Biyofilm direnci, hijyenik depolama</p></div>
<div class="card" style="padding:20px"><h4>8. Paslanmaz Hidrofor</h4><p style="margin:0;color:#647386;font-size:14px;line-height:1.6">Basınç stabilizasyonu, malzeme uyumu</p></div>
</div>
<h2>Bakım ve İzleme Protokolü</h2>
<table style="width:100%;border-collapse:collapse;margin-top:16px;font-size:14px">
<thead>
<tr style="background:#061625;color:white">
<th style="padding:12px;text-align:left">Parametre</th>
<th style="padding:12px;text-align:center">Ölçüm Sıklığı</th>
<th style="padding:12px;text-align:center">Hedef Değer</th>
<th style="padding:12px;text-align:left">Aksiyon Limiti</th>
</tr>
</thead>
<tbody>
<tr style="background:#fafafa;border-bottom:1px solid #f0f0f0"><td style="padding:12px">RO Giriş/Çıkış İletkenlik</td><td style="padding:12px;text-align:center">Günlük (Online)</td><td style="padding:12px;text-align:center">&lt; 15 µS/cm</td><td style="padding:12px">&gt; 30 µS/cm → Membran kontrol</td></tr>
<tr style="background:white;border-bottom:1px solid #f0f0f0"><td style="padding:12px">UV İntensite</td><td style="padding:12px;text-align:center">Sürekli (Online)</td><td style="padding:12px;text-align:center">&gt; 30 mJ/cm²</td><td style="padding:12px">&lt; 25 mJ/cm² → Lambayı değiştir</td></tr>
<tr style="background:#fafafa;border-bottom:1px solid #f0f0f0"><td style="padding:12px">Besleme Su Sertliği</td><td style="padding:12px;text-align:center">Haftalık</td><td style="padding:12px;text-align:center">&lt; 5 ppm</td><td style="padding:12px">&gt; 10 ppm → Yumuşatma rejenerasyonu / RO kontrol</td></tr>
<tr style="background:white;border-bottom:1px solid #f0f0f0"><td style="padding:12px">Besleme pH</td><td style="padding:12px;text-align:center">Haftalık</td><td style="padding:12px;text-align:center">7.0 - 8.0</td><td style="padding:12px">&lt; 6.5 veya &gt; 8.5 → Dozaj ayarı</td></tr>
<tr style="background:#fafafa;border-bottom:1px solid #f0f0f0"><td style="padding:12px">Hidrofor Basıncı</td><td style="padding:12px;text-align:center">Günlük</td><td style="padding:12px;text-align:center">Projeye göre</td><td style="padding:12px">±10% sapma → Pompa/valf kontrol</td></tr>
<tr style="background:white;border-bottom:1px solid #f0f0f0"><td style="padding:12px">Filtre Basınç Kaybı (ΔP)</td><td style="padding:12px;text-align:center">Haftalık</td><td style="padding:12px;text-align:center">&lt; 0.5 bar</td><td style="padding:12px">&gt; 1.0 bar → Filtre değişimi</td></tr>
<tr style="background:#fafafa;border-bottom:1px solid #f0f0f0"><td style="padding:12px">Mikrobiyolojik Analiz</td><td style="padding:12px;text-align:center">Aylık (Lab)</td><td style="padding:12px;text-align:center">0 CFU/100ml</td><td style="padding:12px">&gt; 0 → Şok klorlama + sistem temizliği</td></tr>
<tr><td style="padding:12px">RO Membran Temizliği (CIP)</td><td style="padding:12px;text-align:center">6-12 ayda 1</td><td style="padding:12px;text-align:center">Flux &gt; %90 başlangıç</td><td style="padding:12px">Flux &lt; %80 → Kimyasal temizlik</td></tr>
</tbody>
</table>
<h2>Maliyet Etkisi: Kaliteli Su = Düşük TCO</h2>
<p>Su arıtma sistemleri (RO+UV) ilk yatırım maliyetini artırır ancak nozul değiştirme maliyeti (yıllık %80-90 azalır), pompa/bakım maliyeti, üretim duruş maliyeti, ürün hurda oranı ve hijyen risk maliyeti dramatik düşer. Tipik ROI: <strong>12-18 ay</strong>.</p>`,
  },
  {
    tag: 'BİLGİ',
    title: 'Dijital Baskı Makinesi Nedir?',
    description:
      'Dijital baskı makinesi, dijital teknoloji kullanarak baskı işlemlerini gerçekleştiren cihazlardır...',
    image: '/img/dijital-baski-makinesi.webp',
    imageAlt: 'Dijital Baskı Makinesi',
    slug: 'dijital-baski-makinesi-nedir',
    publishedAt: '2024-03-15T00:00:00.000Z',
    content: `<h2>Tanım: Dijital Baskı Nedir?</h2>
<p>Dijital baskı makinesi; dijital dosyadan (PDF, TIFF, JPEG vb.) doğrudan basım yüzeyine (medyaya) fiziksel bir cliché/plaka/kalıp olmadan, mürekkep püskürtme (inkjet), toner (elektrofotografik) veya diğer dijital transfer yöntemleriyle baskı yapan endüstriyel makinelerdir.</p>
<p><strong>Klavye farkı:</strong> Ofset baskıda her renk için ayrı plaka (cliché) hazırlanır, makine kurulumu (make-ready) 30-60 dakika sürer, minimum tiraj maliyeti yüksektir. Dijital baskıda "plaka yok", "kurulum dakikalar", "birim maliyet tirajdan bağımsız" (kısa tirajlarda avantajlı), "veri değişebilir" (variable data printing) avantajları vardır.</p>
<h2>Ana Dijital Baskı Teknolojileri</h2>
<div style="overflow-x:auto;margin-top:16px">
<table style="width:100%;min-width:700px;border-collapse:collapse;font-size:14px">
<thead>
<tr style="background:#061625;color:white">
<th style="padding:12px;text-align:left">Teknoloji</th>
<th style="padding:12px;text-align:left">Mürekkep Türü</th>
<th style="padding:12px;text-align:left">Kuruma Mekanizması</th>
<th style="padding:12px;text-align:left">Uygulama Alanları</th>
<th style="padding:12px;text-align:left">Öne Çıkan Markalar</th>
</tr>
</thead>
<tbody>
<tr style="background:#fafafa;border-bottom:1px solid #f0f0f0"><td style="padding:12px;font-weight:600">Inkjet (Su Bazlı)</td><td style="padding:12px">Pigment / Dye (Boyalı)</td><td style="padding:12px">Buharlaşma / Emme</td><td style="padding:12px">Ofis, fotoğraf, kadife, sanat</td><td style="padding:12px">Epson, Canon, HP DesignJet</td></tr>
<tr style="background:white;border-bottom:1px solid #f0f0f0"><td style="padding:12px;font-weight:600">Inkjet UV</td><td style="padding:12px">UV Polimer (Akrilat)</td><td style="padding:12px">UV LED/AMBA ışığıyla anlık polimerizasyon</td><td style="padding:12px">Rigid (forex, cam, metal, ahşap), ambalaj</td><td style="padding:12px">Mimaki, Roland, Durst, EFI, HP Scitex</td></tr>
<tr style="background:#fafafa;border-bottom:1px solid #f0f0f0"><td style="padding:12px;font-weight:600">Inkjet Latex</td><td style="padding:12px">Latex (Su + Polimer)</td><td style="padding:12px">Isı ile su buharlaştırma + polimer coalescence</td><td style="padding:12px">İç/duvar kağıdı, vinil, banner, tekstil</td><td style="padding:12px">HP Latex (R serisi)</td></tr>
<tr style="background:white;border-bottom:1px solid #f0f0f0"><td style="padding:12px;font-weight:600">Inkjet Eco-Solvent</td><td style="padding:12px">Eco-Solvent (Hafif çözücü)</td><td style="padding:12px">Isı ile çözücü buharlaştırma</td><td style="padding:12px">Outdoor vinil, banner, araç kaplama</td><td style="padding:12px">Roland, Mimaki, Mutoh</td></tr>
<tr style="background:#fafafa;border-bottom:1px solid #f0f0f0"><td style="padding:12px;font-weight:600">Inkjet Sublimasyon</td><td style="padding:12px">Disperse (Sublimatik)</td><td style="padding:12px">Isı presle (180-200°C) gazla polimere difüzyon</td><td style="padding:12px">Polyester tekstil, seramik, metal, promosyon</td><td style="padding:12px">Epson (F serisi), Mimaki, Roland</td></tr>
<tr style="background:white;border-bottom:1px solid #f0f0f0"><td style="padding:12px;font-weight:600">Inkjet Reaktif/Asidik (Tekstil)</td><td style="padding:12px">Reaktif / Asidik Boya</td><td style="padding:12px">Buhar + Yıkama + Fiksaj</td><td style="padding:12px">Pamuk, viscose, yün, ipek (yüksek kalite)</td><td style="padding:12px">Kornit, MS Printing, Reggiani, Epson Monna Lisa</td></tr>
<tr style="background:#fafafa;border-bottom:1px solid #f0f0f0"><td style="padding:12px;font-weight:600">Elektrofotografik (Toner)</td><td style="padding:12px">Toner (Toz)</td><td style="padding:12px">Isı + Basınç (Fusing)</td><td style="padding:12px">Ofset kalitesi kağıt, kitap, transpromo</td><td style="padding:12px">Canon (varioPRINT), Kodak (Nexpress), Xerox (iGen)</td></tr>
<tr><td style="padding:12px;font-weight:600">LED Toner (Yeni Nesil)</td><td style="padding:12px">Toner</td><td style="padding:12px">LED dizisi + Isı</td><td style="padding:12px">Hızlı ofset alternatifi, B2/B1 format</td><td style="padding:12px">Landa (Nanographic), HP Indigo (ElektroInk)</td></tr>
</tbody>
</table>
</div>
<h2>Ofset vs Dijital Baskı: Karşılaştırma</h2>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px">
<div class="card" style="padding:24px;border-left:4px solid #1684f5">
<h3 style="margin-bottom:16px;color:#1684f5">Ofset Baskı Avantajları</h3>
<ul style="list-style:none;padding:0;margin:0;line-height:2">
<li><span style="color:#1684f5">✓</span> En düşük birim maliyet (yüksek tiraj)</li>
<li><span style="color:#1684f5">✓</span> En geniş renk gamı (Pantone spot renkler)</li>
<li><span style="color:#1684f5">✓</span> Mükemmel renk tutarlılığı</li>
<li><span style="color:#1684f5">✓</span> Çok geniş medya yelpazesi</li>
<li><span style="color:#1684f5">✓</span> Vernik, folyo, kraft özel efektler</li>
</ul>
</div>
<div class="card" style="padding:24px;border-left:4px solid #62c51d">
<h3 style="margin-bottom:16px;color:#62c51d">Dijital Baskı Avantajları</h3>
<ul style="list-style:none;padding:0;margin:0;line-height:2">
<li><span style="color:#62c51d">✓</span> Plaka maliyeti yok (kısa tiraj avantajı)</li>
<li><span style="color:#62c51d">✓</span> Anında baskı - aynı gün teslimat</li>
<li><span style="color:#62c51d">✓</span> Variable Data (Kişiselleştirme)</li>
<li><span style="color:#62c51d">✓</span> Daha az kimyasal/atık (çevre dostu)</li>
<li><span style="color:#62c51d">✓</span> Prova basımı = Gerçek baskı</li>
</ul>
</div>
</div>
<h2>Tekstil Dijital Baskı: Özel Kategori</h2>
<p>Tekstil dijital baskı (DTG - Direct to Garment, Roll-to-Roll, Sublimasyon, Pigment, Reaktif/Asidik) endüstrisinde en hızlı büyüyen segmandır. 2023-2028 CAGR %15+ bekleniyor. Kritik başarı faktörleri:</p>
<ol>
<li><strong>Mürekkep-Kumaş Uyumu:</strong> Fiber tipi (pamuk, polyester, karışım) mürekkep kimyasalını belirler. Yanlış seçim = yıkamada renk kaybı, çatlak, yüzey sertliği.</li>
<li><strong>Ön İşlem (Pre-treatment):</strong> Koyu kumaşlara beyaz baz (white ink) + pre-treatment spreyi zorunludur. Uygulama homojenliği doğrudan baskı kalitesini belirler.</li>
<li><strong>Son İşlem (Post-treatment):</strong> Isı presi / tünel fırın / buhar fırını ile mürekkep fiksasyonu. Sıcaklık/süre hassasiyeti kritiktir.</li>
<li><strong>Ortam Koşulları:</strong> <strong>21-23°C, %50-55 RH</strong> - Bu makalenin en kritik kısmıdır (aşağıda detaylı).</li>
</ol>
<h2>İdeal Ortam Koşulları: Neden %50-55 RH ve 21-23°C?</h2>
<p>Tüm büyük dijital baskı makinesi üreticileri (Epson, Canon, HP, Mimaki, Roland, Kornit, MS, Reggiani, Durst, EFI) ve mürekkep kimyasal üreticileri (Sun Chemical, Sensient, Dupont, Huntsman, DyStar) teknik veri sayfalarında aynı aralığı belirtirler. Bunun bilimsel ve pratik nedenleri:</p>
<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-top:16px">
<div class="card" style="padding:20px"><h4>Mürekkep Viskozitesi ve Akışkanlığı</h4><p style="margin:0;color:#344254;line-height:1.7;font-size:15px">Su bazlı mürekkeplerde su buharlaşır, viskozite artar. %40 RH altında viskozite %20-30 artabilir → kafa tıkanıklığı, uçuş hatası (misfire), çizgi kaybı. %55 RH üstünde ise mürekkep çok incelir, kağıtta/yüzeyde yayılma (dot gain) kontrolsüzleşir.</p></div>
<div class="card" style="padding:20px"><h4>Kafa Soğutması ve Isı Dengesi</h4><p style="margin:0;color:#344254;line-height:1.7;font-size:15px">Piezo elektrikli kafalar çalışma sıcaklığında ısı üretir. Düşük nemde buharlaşmalı soğutma artar, kafa soğur, viskozite dalgalanır. Yüksek nemde kondensasyon riski (kafa yüzeyinde su birikimi) → elektrik arızası, korozyon.</p></div>
<div class="card" style="padding:20px"><h4>Medya (Kağıt/Kumaş) Boyutsal İstikrarı</h4><p style="margin:0;color:#344254;line-height:1.7;font-size:15px">Higroskopik malzemeler nemle şişer/küçülür. Kağıtta metre başına 1-3 mm boyut değişimi = renk kayıt (registration) hatası, çift renk baskıda uyumsuzluk. Kumaşta çekilme, pattern distorsiyonu.</p></div>
<div class="card" style="padding:20px"><h4>Statik Elektrik Kontrolü</h4><p style="margin:0;color:#344254;line-height:1.7;font-size:15px">%40 RH altında medya (özellikle sentetik kumaş, vinil, polyester film) yüklenir. Statik alan; mürekkep damlacıklarını yoldan saptırır (satellite droplets), kağıt besleme kopuklarına, toz çekimine yol açar.</p></div>
<div class="card" style="padding:20px"><h4>Kuruma Hızı ve Katman Birlikteliği</h4><p style="margin:0;color:#344254;line-height:1.7;font-size:15px">İlk katman (beyaz baz veya renk) ikinci katman gelmeden kurumalıdır. Çok hızlı kuruma = kırılgan film, yetersiz yapışma. Çok yavaş = karışma, bulanıklık. İdeal nem = kontrollü, tahmin edilebilir kuruma.</p></div>
<div class="card" style="padding:20px"><h4>Personel Sağlığı ve Verimliliği</h4><p style="margin:0;color:#344254;line-height:1.7;font-size:15px">ASHRAE 55: %30-60 RH, 20-24°C "Konfor Bölgesi". Düşük nem = kuru göz, boğaz, solunum yolu enfeksiyonları, alerji/astım tetiklenmesi. Personel verimliliği %10-15 artar.</p></div>
</div>
<h2>Düşük Nemde Yaşanan Somut Problemler ve Maliyetleri</h2>
<table style="width:100%;border-collapse:collapse;margin-top:16px;font-size:14px">
<thead>
<tr style="background:#fef2f2;color:#dc2626">
<th style="padding:12px;text-align:left">Problem</th>
<th style="padding:12px;text-align:left">Neden</th>
<th style="padding:12px;text-align:left">Maliyet Etkisi</th>
</tr>
</thead>
<tbody>
<tr style="background:#fef2f2;border-bottom:1px solid #fecaca"><td style="padding:12px">Kafa Tıkanıklığı (Nozzle Clogging)</td><td style="padding:12px">Mürekkep kafa yüzünde kuruma</td><td style="padding:12px">Temizleme döngüleri (mürekkep israfı), kafa değişimi ($500-5000), makine duruşu</td></tr>
<tr><td style="padding:12px">Uçuş Hatası / Satellite Damlacık</td><td style="padding:12px">Viskozite artışı + statik alan</td><td style="padding:12px">Baskı kalitesi düşüşü, hurda, müşteri şikâyeti, yeniden baskı</td></tr>
<tr style="background:#fef2f2;border-bottom:1px solid #fecaca"><td style="padding:12px">Nokta Kazanımı (Dot Gain) Kontrolsüz</td><td style="padding:12px">Medya şişmesi + mürekkep yayılma</td><td style="padding:12px">Renk yoğunluğu sapması, ΔE tolerans dışı, kalite kontrol reddi</td></tr>
<tr><td style="padding:12px">Kayıt Hatası (Misregistration)</td><td style="padding:12px">Medya boyut değişimi</td><td style="padding:12px">Çok renkli işlerde renkler uyuşmaz, hurda oranı %5-15 artar</td></tr>
<tr style="background:#fef2f2;border-bottom:1px solid #fecaca"><td style="padding:12px">Statik Kağıt/Kumaş Besleme Arızası</td><td style="padding:12px">Yüksek statik yük</td><td style="padding:12px">Çift kağıt alma, yama, makine duruşu, operatör müdahale süresi</td></tr>
<tr><td style="padding:12px">Personel Hastalık / İzin</td><td style="padding:12px">Kuru hava + statik + toz</td><td style="padding:12px">İşgücü kaybı, sigorta maliyeti, moral düşüklüğü</td></tr>
</tbody>
</table>
<h2>PrintWater Çözümü: Dijital Baskı İçin Atomize Nemlendirme</h2>
<p>PrintWater; dijital baskı tesislerinin (ofset, tekstil, wide-format, ambalaj, etiket) tam bu sorunları çözmek için patenti <strong>Maldiv Nemlendirme Ünitesi</strong> ve <strong>Yüksek Basınçlı Atomize Sistemleri</strong> ile tasarlanmış, PLC kontrollü, UV sterilizeli, bölgesel nem yönetimli çözümler sunar.</p>
<ul>
<li><strong>Hassas Nem Kontrolü:</strong> ±2% RH toleransında, her bölge için bağımsız PID kontrol</li>
<li><strong>Hijyenik Su:</strong> RO + UV-C ile bakteri/virüs/endotoksin sıfır su</li>
<li><strong>Damlatma Yok:</strong> 5-10 mikron zerreçikler anında buharlaşır, makine/medya ıslanmaz</li>
<li><strong>Serinletme Etkisi:</strong> Buharlaşma endotermik = ortam ısısını 2-4°C düşürür, klima yükünü azaltır</li>
<li><strong>IoT İzleme:</strong> Nem, sıcaklık, su tüketimi, bakım alarmları mobil/web paneli</li>
<li><strong>Mürekkep Tasarrufu:</strong> Kontrollü nemde %15-25 daha az mürekkep tüketimi (kağıt/kumaş emilimi optimize)</li>
</ul>`,
  },
]

export default SEED_ARTICLES
