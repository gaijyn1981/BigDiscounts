import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center" style={{background: '#0a0a0a'}}>
      <div className="text-center px-6">
        <p className="text-8xl font-black mb-4" style={{color: '#fcd968'}}>404</p>
        <h1 className="text-3xl font-black text-white mb-4">Page Not Found</h1>
        <p className="text-gray-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex gap-4 justify-center">
          <Link href="/"
            className="px-6 py-3 rounded-xl font-bold text-black transition-opacity hover:opacity-90"
            style={{background: '#fcd968'}}>
            Back to Home
          </Link>
          <Link href="/browse"
            className="px-6 py-3 rounded-xl font-bold text-white transition-opacity hover:opacity-80"
            style={{background: '#1a1a1a', border: '1px solid #333'}}>
            Browse Deals
          </Link>
        </div>
      </div>
    </main>
  )
}
