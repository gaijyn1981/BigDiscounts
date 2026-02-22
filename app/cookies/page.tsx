import Link from 'next/link'

export default function CookiePolicy() {
  return (
    <main className="min-h-screen" style={{background: '#f0f4ff'}}>
      <nav style={{background: '#1e3a8a'}} className="px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-white">🇬🇧 BigDiscounts</Link>
        <Link href="/" className="text-blue-200 hover:text-white">← Back to Home</Link>
      </nav>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">Cookie Policy</h1>
          <p className="text-gray-400 text-sm mb-8">Last updated: February 2026</p>
          <div className="space-y-6 text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">What Are Cookies?</h2>
              <p>Cookies are small text files stored on your device when you visit a website. They help the site remember information about your visit.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Cookies We Use</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse mt-2">
                  <thead>
                    <tr style={{background: '#f0f4ff'}}>
                      <th className="text-left p-3 font-bold text-gray-900 border border-gray-200">Cookie</th>
                      <th className="text-left p-3 font-bold text-gray-900 border border-gray-200">Purpose</th>
                      <th className="text-left p-3 font-bold text-gray-900 border border-gray-200">Duration</th>
                      <th className="text-left p-3 font-bold text-gray-900 border border-gray-200">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-3 border border-gray-200">next-auth.session-token</td>
                      <td className="p-3 border border-gray-200">Keeps you logged in</td>
                      <td className="p-3 border border-gray-200">30 days</td>
                      <td className="p-3 border border-gray-200">Essential</td>
                    </tr>
                    <tr style={{background: '#f9fafb'}}>
                      <td className="p-3 border border-gray-200">next-auth.csrf-token</td>
                      <td className="p-3 border border-gray-200">Security protection</td>
                      <td className="p-3 border border-gray-200">Session</td>
                      <td className="p-3 border border-gray-200">Essential</td>
                    </tr>
                    <tr>
                      <td className="p-3 border border-gray-200">cookiesAccepted</td>
                      <td className="p-3 border border-gray-200">Remembers cookie consent</td>
                      <td className="p-3 border border-gray-200">1 year</td>
                      <td className="p-3 border border-gray-200">Essential</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">We Do Not Use</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Advertising or tracking cookies</li>
                <li>Social media cookies</li>
                <li>Analytics cookies</li>
                <li>Third party marketing cookies</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Managing Cookies</h2>
              <p>You can control cookies through your browser settings. Disabling essential cookies may affect your ability to log in and use the site. To reset your cookie consent, clear your browser's local storage.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Contact</h2>
              <p>For cookie-related queries: <a href="mailto:petricamarin1981@icloud.com" className="text-blue-600 hover:underline">petricamarin1981@icloud.com</a></p>
            </section>
          </div>
        </div>
      </div>
      <footer style={{background: '#1e3a8a'}} className="py-6 text-center text-blue-200 text-sm">
        <Link href="/privacy" className="hover:text-white mx-3">Privacy Policy</Link>
        <Link href="/terms" className="hover:text-white mx-3">Terms & Conditions</Link>
        <Link href="/cookies" className="hover:text-white mx-3">Cookie Policy</Link>
      </footer>
    </main>
  )
}
