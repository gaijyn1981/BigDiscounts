import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/seller/dashboard', '/api/'],
    },
    sitemap: 'https://www.bigdiscounts.uk/sitemap.xml',
  }
}
