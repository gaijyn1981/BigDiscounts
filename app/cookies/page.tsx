import Link from 'next/link'

export default function Cookies() {
  return (
    <main className="min-h-screen" style={{background: '#0a0a0a'}}>
      <nav style={{background: '#111111', borderBottom: '1px solid #2a2a2a'}} className="px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <span className="text-2xl font-black" style={{color: '#fcd968'}}>🇬🇧 BigDiscounts</span>
        <Link href="/" className="text-gray-400 hover:text-white transition-colors">← Back to Home</Link>
      </nav>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="rounded-2xl p-8" style={{background: '#111111', border: '1px solid #222'}}>
          <h1 className="text-3xl font-black text-white mb-2">Cookie Policy</h1>
          <p className="text-gray-600 text-sm mb-8">Last updated: February 2026</p>
          <div className="space-y-6 text-gray-400 leading-relaxed">
            <section>
              <h2 className="text-xl font-black text-white mb-2">What Are Cookies?</h2>
              <p>Cookies are small text files stored on your device when you visit a website. We only use essential cookies required for the site to function.</p>
            </section>
            <section>
              <h2 className="text-xl font-black text-white mb-3">Cookies We Use</h2>
              <div className="rounded-xl overflow-hidden" style={{border: '1px solid #2a2a2a'}}>
                <table className="w-full text-sm">
                  <thead style={{background: '#1a1a1a'}}>
                    <tr>
                      <th className="text-left px-4 py-3 text-white font-bold">Cookie</th>
                      <th className="text-left px-4 py-3 text-white font-bold">Purpose</th>
                      <th className="text-left px-4 py-3 text-white font-bold">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{borderTop: '1px solid #1a1a1a'}}>
                      <td className="px-4 py-3 text-gray-400">next-auth.session-token</td>
                      <td className="px-4 py-3 text-gray-400">Keeps you logged in</td>
                      <td className="px-4 py-3" style={{color: '#fcd968'}}>Essential</td>
                    </tr>
                    <tr style={{borderTop: '1px solid #1a1a1a', background: '#111111'}}>
                      <td className="px-4 py-3 text-gray-400">next-auth.csrf-token</td>
                      <td className="px-4 py-3 text-gray-400">Security protection</td>
                      <td className="px-4 py-3" style={{color: '#fcd968'}}>Essential</td>
                    </tr>
                    <tr style={{borderTop: '1px solid #1a1a1a'}}>
                      <td className="px-4 py-3 text-gray-400">cookiesAccepted</td>
                      <td className="px-4 py-3 text-gray-400">Remembers cookie consent</td>
                      <td className="px-4 py-3" style={{color: '#fcd968'}}>Essential</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
            <section>
              <h2 className="text-xl font-black text-white mb-2">No Tracking Cookies</h2>
              <p>We do not use advertising, analytics, or tracking cookies. We do not share cookie data with third parties for marketing purposes.</p>
            </section>
            <section>
              <h2 className="text-xl font-black text-white mb-2">Managing Cookies</h2>
              <p>You can disable cookies in your browser settings, but this may affect your ability to log in and use the site.</p>
            </section>
            <section>
              <h2 className="text-xl font-black text-white mb-2">Contact</h2>
              <p>Email: <a href="mailto:privacy@bigdiscounts.uk" style={{color: '#fcd968'}} className="hover:opacity-80">privacy@bigdiscounts.uk</a></p>
            </section>
          </div>
        </div>
      </div>
      <footer style={{background: '#111111', borderTop: '1px solid #1a1a1a'}} className="px-6 py-8 text-center">
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <Link href="/privacy" className="text-gray-500 hover:text-white">Privacy Policy</Link>
          <Link href="/terms" className="text-gray-500 hover:text-white">Terms & Conditions</Link>
          <Link href="/cookies" className="text-gray-500 hover:text-white">Cookie Policy</Link>
          <Link href="/data-request" className="text-gray-500 hover:text-white">Data Request</Link>
        </div>
      </footer>
    </main>
  )
}
