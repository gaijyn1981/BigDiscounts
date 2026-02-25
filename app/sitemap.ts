import { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await prisma.product.findMany({
    where: { active: true },
    select: { id: true, createdAt: true }
  })

  const productUrls = products.map(product => ({
    url: `https://www.bigdiscounts.uk/product/${product.id}`,
    lastModified: product.createdAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8
  }))

  return [
    {
      url: 'https://www.bigdiscounts.uk',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1
    },
    {
      url: 'https://www.bigdiscounts.uk/browse',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9
    },
    {
      url: 'https://www.bigdiscounts.uk/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5
    },
    {
      url: 'https://www.bigdiscounts.uk/contact',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5
    },
    {
      url: 'https://www.bigdiscounts.uk/terms',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3
    },
    {
      url: 'https://www.bigdiscounts.uk/privacy',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3
    },
    ...productUrls
  ]
}
