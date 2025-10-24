import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center">
              <h3 className="text-lg font-bold text-gray-900">MV Hemanth</h3>
            </Link>
            <p className="mt-2 text-sm text-gray-600">
              Thoughts on software development, design, and building great
              products.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h4 className="font-medium text-gray-900 mb-4">Quick Links</h4>
            <nav className="space-y-2">
              <Link
                to="/"
                className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                Home
              </Link>
              <Link
                to="/blog"
                className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                Blog
              </Link>
              <Link
                to="/newsletter"
                className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                Newsletter
              </Link>
            </nav>
          </div>

          {/* Categories */}
          <div className="md:col-span-1">
            <h4 className="font-medium text-gray-900 mb-4">Categories</h4>
            <nav className="space-y-2">
              <a
                href="#"
                className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                Programming
              </a>
              <a
                href="#"
                className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                Web Development
              </a>
              <a
                href="#"
                className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                Best Practices
              </a>
            </nav>
          </div>

          {/* Contact */}
          <div className="md:col-span-1">
            <h4 className="font-medium text-gray-900 mb-4">Connect</h4>
            <nav className="space-y-2">
              <a
                href="mailto:hello@mvhemanth.me"
                className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                Email
              </a>
              <a
                href="https://github.com/Hemanth42d"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                Twitter
              </a>
            </nav>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} MV Hemanth. All rights reserved.
            </p>
            <Link
              to="/admin/login"
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors mt-2 sm:mt-0"
              title="Admin Access - For development purposes"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
