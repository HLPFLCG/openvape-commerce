import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-primary-600">
            OpenVape Commerce
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="btn btn-ghost btn-md">
              Login
            </Link>
            <Link href="/register" className="btn btn-primary btn-md">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Your Store, Your Rules
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Build a fully customizable e-commerce platform without restrictions. 
          No monthly fees, no transaction limits, complete control over your business.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/register" className="btn btn-primary btn-lg">
            Start Building
          </Link>
          <Link href="/docs" className="btn btn-outline btn-lg">
            View Documentation
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose OpenVape Commerce?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card p-6">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold mb-2">No Restrictions</h3>
            <p className="text-gray-600">
              Sell any legal product without platform limitations. Your business, your choice.
            </p>
          </div>
          <div className="card p-6">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-semibold mb-2">Cost Effective</h3>
            <p className="text-gray-600">
              No monthly fees, no transaction fees. Only pay your payment processor.
            </p>
          </div>
          <div className="card p-6">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold mb-2">Fully Customizable</h3>
            <p className="text-gray-600">
              Complete control over design and functionality. Build exactly what you need.
            </p>
          </div>
          <div className="card p-6">
            <div className="text-4xl mb-4">🔌</div>
            <h3 className="text-xl font-semibold mb-2">Unlimited Integrations</h3>
            <p className="text-gray-600">
              Integrate with any service. No restrictions on third-party tools.
            </p>
          </div>
          <div className="card p-6">
            <div className="text-4xl mb-4">💳</div>
            <h3 className="text-xl font-semibold mb-2">Payment Flexibility</h3>
            <p className="text-gray-600">
              Support multiple payment processors including cryptocurrency.
            </p>
          </div>
          <div className="card p-6">
            <div className="text-4xl mb-4">🔓</div>
            <h3 className="text-xl font-semibold mb-2">Open Source</h3>
            <p className="text-gray-600">
              MIT licensed. Modify, extend, and deploy however you want.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Take Control?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join businesses that refuse to be limited by traditional platforms.
          </p>
          <Link href="/register" className="btn bg-white text-primary-600 hover:bg-gray-100 btn-lg">
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">OpenVape Commerce</h3>
              <p className="text-gray-400">
                Open-source e-commerce platform for businesses that need freedom.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/features">Features</Link></li>
                <li><Link href="/pricing">Pricing</Link></li>
                <li><Link href="/docs">Documentation</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy">Privacy</Link></li>
                <li><Link href="/terms">Terms</Link></li>
                <li><Link href="/license">License</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 OpenVape Commerce. MIT Licensed.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}