'use client'

export default function ShareButtons({ title, id }: { title: string, id: string }) {
  const url = `https://www.bigdiscounts.uk/product/${id}`
  const text = `Check out this deal on BigDiscounts: ${title}`

  return (
    <div className="mt-4">
      <p className="text-sm font-semibold text-gray-500 mb-2">Share this deal:</p>
      <div className="flex gap-2 flex-wrap">
        <a href={`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-600">
          📱 WhatsApp
        </a>
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700">
          📘 Facebook
        </a>
        <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 bg-sky-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-sky-600">
          🐦 Twitter
        </a>
        <button onClick={() => { navigator.clipboard.writeText(url) }}
          className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-300">
          🔗 Copy Link
        </button>
      </div>
    </div>
  )
}
