import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'API Documentation | BigDiscounts',
  robots: 'noindex',
}

export default function ApiDocsPage() {
  return (
    <main className="min-h-screen px-6 py-12" style={{background: '#0a0a0a'}}>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <span className="text-3xl font-black" style={{color: '#fcd968'}}>🇬🇧 BigDiscounts</span>
          <h1 className="text-4xl font-black text-white mt-4 mb-2">API Documentation</h1>
          <p className="text-gray-400">Partner Integration API — v1.0</p>
        </div>

        {/* Base URL */}
        <section className="mb-10 p-6 rounded-2xl" style={{background: '#111111', border: '1px solid #222'}}>
          <h2 className="text-xl font-black text-white mb-3">Base URL</h2>
          <code className="text-sm px-4 py-2 rounded-lg block" style={{background: '#1a1a1a', color: '#fcd968'}}>
            https://www.bigdiscounts.uk/api/external
          </code>
        </section>

        {/* Authentication */}
        <section className="mb-10 p-6 rounded-2xl" style={{background: '#111111', border: '1px solid #222'}}>
          <h2 className="text-xl font-black text-white mb-3">Authentication</h2>
          <p className="text-gray-400 mb-4">All requests must include your API key in the request header:</p>
          <code className="text-sm px-4 py-2 rounded-lg block" style={{background: '#1a1a1a', color: '#fcd968'}}>
            x-api-key: YOUR_API_KEY
          </code>
          <p className="text-gray-600 text-sm mt-3">API keys are provided by BigDiscounts. Contact hello@bigdiscounts.uk to request one.</p>
        </section>

        {/* POST /products */}
        <section className="mb-10 p-6 rounded-2xl" style={{background: '#111111', border: '1px solid #222'}}>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-lg text-sm font-black" style={{background: '#4ade80', color: 'black'}}>POST</span>
            <code className="text-white font-bold">/api/external/products</code>
          </div>
          <p className="text-gray-400 mb-6">Create a new product listing on BigDiscounts.uk on behalf of a registered seller.</p>

          <h3 className="text-white font-black mb-3">Request Body (JSON)</h3>
          <div className="rounded-xl overflow-hidden mb-6" style={{background: '#0a0a0a', border: '1px solid #1a1a1a'}}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{borderBottom: '1px solid #1a1a1a'}}>
                  <th className="text-left px-4 py-3 text-gray-400 font-bold">Field</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-bold">Type</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-bold">Required</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-bold">Description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['seller_email', 'string', 'Yes', 'Email of the registered BigDiscounts seller'],
                  ['title', 'string', 'Yes', 'Product title (max 200 characters)'],
                  ['description', 'string', 'Yes', 'Product description (max 2000 characters)'],
                  ['price', 'number', 'Yes', 'Product price in GBP (e.g. 29.99)'],
                  ['category', 'string', 'No', 'Product category (see valid categories below)'],
                  ['photos', 'array', 'No', 'Array of up to 4 image URLs'],
                  ['delivery_time', 'string', 'No', 'Estimated delivery time (e.g. "3-5 business days")'],
                ].map(([field, type, required, desc]) => (
                  <tr key={field as string} style={{borderBottom: '1px solid #1a1a1a'}}>
                    <td className="px-4 py-3" style={{color: '#fcd968'}}><code>{field}</code></td>
                    <td className="px-4 py-3 text-gray-500">{type}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${required === 'Yes' ? 'text-green-400' : 'text-gray-500'}`}>
                        {required}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-white font-black mb-3">Example Request</h3>
          <pre className="text-xs p-4 rounded-xl overflow-x-auto mb-6" style={{background: '#0a0a0a', color: '#a3e635', border: '1px solid #1a1a1a'}}>
{`POST /api/external/products
x-api-key: YOUR_API_KEY
Content-Type: application/json

{
  "seller_email": "seller@example.com",
  "title": "Handmade Soy Candle - Lavender",
  "description": "A beautiful hand-poured soy wax candle with lavender essential oil.",
  "price": 14.99,
  "category": "Gifts & Seasonal",
  "photos": ["https://example.com/candle1.jpg"],
  "delivery_time": "3-5 business days"
}`}
          </pre>

          <h3 className="text-white font-black mb-3">Example Response (201 Created)</h3>
          <pre className="text-xs p-4 rounded-xl overflow-x-auto" style={{background: '#0a0a0a', color: '#a3e635', border: '1px solid #1a1a1a'}}>
{`{
  "success": true,
  "product_id": "clxyz123abc",
  "title": "Handmade Soy Candle - Lavender",
  "price": 14.99,
  "status": "pending_activation",
  "message": "Product created successfully. The seller must activate it via their BigDiscounts subscription.",
  "product_url": "https://www.bigdiscounts.uk/product/clxyz123abc"
}`}
          </pre>
        </section>

        {/* GET /products */}
        <section className="mb-10 p-6 rounded-2xl" style={{background: '#111111', border: '1px solid #222'}}>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-lg text-sm font-black" style={{background: '#60a5fa', color: 'black'}}>GET</span>
            <code className="text-white font-bold">/api/external/products?seller_email=EMAIL</code>
          </div>
          <p className="text-gray-400 mb-4">Retrieve all products for a registered seller.</p>

          <h3 className="text-white font-black mb-3">Example Response</h3>
          <pre className="text-xs p-4 rounded-xl overflow-x-auto" style={{background: '#0a0a0a', color: '#a3e635', border: '1px solid #1a1a1a'}}>
{`{
  "seller_email": "seller@example.com",
  "company": "Example Shop Ltd",
  "products": [
    {
      "product_id": "clxyz123abc",
      "title": "Handmade Soy Candle - Lavender",
      "price": 14.99,
      "category": "Gifts & Seasonal",
      "active": true,
      "product_url": "https://www.bigdiscounts.uk/product/clxyz123abc"
    }
  ]
}`}
          </pre>
        </section>

        {/* Error Codes */}
        <section className="mb-10 p-6 rounded-2xl" style={{background: '#111111', border: '1px solid #222'}}>
          <h2 className="text-xl font-black text-white mb-4">Error Codes</h2>
          <div className="rounded-xl overflow-hidden" style={{background: '#0a0a0a', border: '1px solid #1a1a1a'}}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{borderBottom: '1px solid #1a1a1a'}}>
                  <th className="text-left px-4 py-3 text-gray-400 font-bold">Code</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-bold">Meaning</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['401', 'Unauthorized — invalid or missing API key'],
                  ['400', 'Bad Request — missing or invalid field'],
                  ['404', 'Not Found — seller email not registered on BigDiscounts'],
                  ['500', 'Internal Server Error — contact hello@bigdiscounts.uk'],
                ].map(([code, meaning]) => (
                  <tr key={code as string} style={{borderBottom: '1px solid #1a1a1a'}}>
                    <td className="px-4 py-3 font-black" style={{color: '#f87171'}}>{code}</td>
                    <td className="px-4 py-3 text-gray-400">{meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Valid Categories */}
        <section className="mb-10 p-6 rounded-2xl" style={{background: '#111111', border: '1px solid #222'}}>
          <h2 className="text-xl font-black text-white mb-4">Valid Categories</h2>
          <div className="flex flex-wrap gap-2">
            {[
              'Electronics & Tech', 'Phone & Accessories', 'Clothing & Fashion',
              'Home & Living', 'Garden & Outdoor', 'Pets', 'Baby & Kids',
              'Health & Beauty', 'Toys & Games', 'Sports & Fitness', 'Food & Drink',
              'Books & Stationery', 'Tools & DIY', 'Automotive', 'Arts & Crafts',
              'Office & Business', 'Gifts & Seasonal', 'Cleaning & Household', 'Other'
            ].map(cat => (
              <span key={cat} className="px-3 py-1 rounded-lg text-xs font-medium"
                style={{background: '#1a1a1a', color: '#fcd968', border: '1px solid #333'}}>
                {cat}
              </span>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="p-6 rounded-2xl" style={{background: '#111111', border: '1px solid #fcd968'}}>
          <h2 className="text-xl font-black text-white mb-2">Need Help?</h2>
          <p className="text-gray-400">Contact us at <span style={{color: '#fcd968'}}>hello@bigdiscounts.uk</span> for API keys, integration support, or any questions.</p>
        </section>

      </div>
    </main>
  )
}
