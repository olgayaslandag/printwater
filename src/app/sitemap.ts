import { MetadataRoute } from 'next'
import { getArticles } from '@/src/components/Insights/articles'
import { SITE_URL, resolveImageUrl } from '@/src/lib/site'

const changeFreq = (freq: 'weekly' | 'monthly' | 'daily' | 'hourly' | 'yearly' | 'always' | 'never') => freq

// sitemap.xml artık TEK kaynaktan üretilir (bu metadata route). next-sitemap terk
// edildi; public/sitemap.xml silindi.
//
// Sitemap DİNAMİK tutulur: Next.js 14'te metadata rotaları (`app/sitemap.ts`)
// önbelleğe "ROUTE" türünde bir girdi olarak yazılır ve `revalidatePath()` bu
// girdiyi geçersiz kılabilir (yalnızca "PAGE"/"FETCH" girdilerinde tag
// geçerliliği denetlenir). Bu yüzden ISR penceresi boyunca sitemap bayat
// kalır ve API ile eklenen makale sitemap'e ancak saatler sonra yansırdı.
// Dinamik üretimde sitemap her istekte kalıcı depodan yeniden kurulur; maliyet
// ihmal edilebilir (küçük bir JSON dosyası okunur) ve içerik yöneticisi
// makaleyi yayınladığı anda sitemap güncel olur.
export const dynamic = 'force-dynamic'

// Blog slug'ları kalıcı içerik deposundan (articles store) çekilir.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL
  const lastModified = new Date()

  const staticRoutes = [
    { url: baseUrl, changeFrequency: changeFreq('weekly'), priority: 1.0, images: [`${baseUrl}/img/hero-printwater-su-teknolojileri.webp`] },
    { url: `${baseUrl}/hizmetler`, changeFrequency: changeFreq('weekly'), priority: 0.9, images: [`${baseUrl}/img/su-aritma-sistemleri.webp`] },
    { url: `${baseUrl}/teknoloji`, changeFrequency: changeFreq('monthly'), priority: 0.8, images: [`${baseUrl}/img/teknoloji-yaklasim.webp`] },
    { url: `${baseUrl}/blog`, changeFrequency: changeFreq('daily'), priority: 0.8, images: [`${baseUrl}/img/endustriyel-nemlendirme-sistemleri.webp`] },
    { url: `${baseUrl}/hakkimizda`, changeFrequency: changeFreq('monthly'), priority: 0.7 },
    { url: `${baseUrl}/vizyon-misyon`, changeFrequency: changeFreq('monthly'), priority: 0.7 },
    { url: `${baseUrl}/kalite-politikamiz`, changeFrequency: changeFreq('monthly'), priority: 0.7 },
    { url: `${baseUrl}/insan-kaynaklari`, changeFrequency: changeFreq('monthly'), priority: 0.7 },
    { url: `${baseUrl}/gizlilik-politikasi`, changeFrequency: changeFreq('yearly'), priority: 0.4 },
    { url: `${baseUrl}/kvkk`, changeFrequency: changeFreq('yearly'), priority: 0.4 },
    { url: `${baseUrl}/iletisim`, changeFrequency: changeFreq('monthly'), priority: 0.7 },
  ]

  const serviceRoutes = [
    { url: `${baseUrl}/hizmetler/tekstil-dokuma-nemlendirme`, changeFrequency: changeFreq('monthly'), priority: 0.8, images: [`${baseUrl}/img/tekstil-dokuma-nemlendirme.webp`] },
    { url: `${baseUrl}/hizmetler/matbaa-baski-suyu-aritma`, changeFrequency: changeFreq('monthly'), priority: 0.8, images: [`${baseUrl}/img/su-aritma-sistemleri.webp`] },
    { url: `${baseUrl}/hizmetler/matbaa-baski-nemlendirme`, changeFrequency: changeFreq('monthly'), priority: 0.8, images: [`${baseUrl}/img/matbaa-baski-nemlendirme.webp`] },
    { url: `${baseUrl}/hizmetler/tekstil-dijital-baski-nemlendirme`, changeFrequency: changeFreq('monthly'), priority: 0.8, images: [`${baseUrl}/img/tekstil-dijital-baski-nemlendirme.webp`] },
  ]

  const articles = await getArticles()

  // Blog girdileri son değiştirme tarihini içerik kaynağındaki gerçek
  // publishedAt'tan alır; JSON-LD dateModified ile çelişmez.
  const blogRoutes = articles.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    changeFrequency: changeFreq('monthly'),
    priority: 0.7,
    images: [resolveImageUrl(article.image)],
    lastModified: new Date(article.updatedAt ?? article.publishedAt),
  }))

  return [
    ...staticRoutes.map((route) => ({ ...route, lastModified })),
    ...serviceRoutes.map((route) => ({ ...route, lastModified })),
    ...blogRoutes,
  ]
}
