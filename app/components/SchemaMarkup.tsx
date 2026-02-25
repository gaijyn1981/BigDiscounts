export default function SchemaMarkup() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "BigDiscounts",
    "url": "https://www.bigdiscounts.uk",
    "description": "The UK's premium discount marketplace. List your products for just £1/month. No commission, no middleman.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.bigdiscounts.uk/browse?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  }

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "BigDiscounts",
    "url": "https://www.bigdiscounts.uk",
    "logo": "https://www.bigdiscounts.uk/favicon.ico",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "hello@bigdiscounts.uk",
      "contactType": "customer service",
      "areaServed": "GB"
    },
    "sameAs": []
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
    </>
  )
}
