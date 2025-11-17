import { Facebook, Twitter, Instagram, Linkedin, ArrowRight } from 'lucide-react';

export default function BanimalFooter() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Banimal Section */}
      <div className="py-16 px-6 md:px-20">
        <div className="max-w-3xl mx-auto text-center">
          {/* Main Title and Slogan */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-white mb-4">
            Banimal™:
            <br />
            <span className="text-blue-400">🐑 Kind Creatures. Global Impact.</span>
          </h2>

          {/* Description */}
          <p className="text-base md:text-lg text-gray-300 leading-relaxed mb-8 max-w-2xl mx-auto">
            Discover Banimal's world of thoughtful baby essentials & innovative lighting.
            For every purchase, we deliver the same item to a child in need, identified by
            the Baobab Security Network's data-driven insights.
          </p>

          {/* CTA Button */}
          <a
            href="https://banimal.co.za"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          >
            Explore Banimal's World
            <ArrowRight className="w-5 h-5" />
          </a>

          {/* Social Media Links */}
          <div className="flex justify-center items-center gap-6 mt-10 mb-6">
            <a
              href="https://facebook.com/banimal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
              aria-label="Facebook"
            >
              <Facebook className="w-6 h-6" />
            </a>
            <a
              href="https://twitter.com/banimal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
              aria-label="Twitter"
            >
              <Twitter className="w-6 h-6" />
            </a>
            <a
              href="https://instagram.com/banimal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
              aria-label="Instagram"
            >
              <Instagram className="w-6 h-6" />
            </a>
            <a
              href="https://linkedin.com/company/banimal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-6 h-6" />
            </a>
          </div>

          {/* Copyright and Attribution */}
          <div className="text-sm text-gray-400 space-y-1">
            <p>© 2025 Banimal™. All rights reserved.</p>
            <p>
              A proud initiative of{' '}
              <a
                href="https://fruitfulglobalplanet.com"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Fruitful™ Treaty System
              </a>
              ™
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Footer Links */}
      <div className="bg-gray-800 py-6 px-6 md:px-20 border-t border-gray-700">
        <div className="max-w-7xl mx-auto">
          {/* Footer Navigation Links */}
          <nav className="flex flex-wrap justify-center items-center gap-4 mb-4 text-sm">
            <a
              href="https://footer.global.repo.seedwave.faa.zone/privacy.html"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Privacy
            </a>
            <span className="text-gray-600">•</span>
            <a
              href="https://footer.global.repo.seedwave.faa.zone/terms.html"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Terms
            </a>
            <span className="text-gray-600">•</span>
            <a
              href="https://footer.global.repo.seedwave.faa.zone/contact.html"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Contact
            </a>
            <span className="text-gray-600">•</span>
            <a
              href="https://footer.global.repo.seedwave.faa.zone/copyright.html"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Copyright
            </a>
            <span className="text-gray-600">•</span>
            <a
              href="https://footer.global.repo.seedwave.faa.zone/developers.html"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Developers
            </a>
            <span className="text-gray-600">•</span>
            <a
              href="https://footer.global.repo.seedwave.faa.zone/vaultmesh.html"
              className="text-gray-400 hover:text-white transition-colors"
            >
              VaultMesh
            </a>
            <span className="text-gray-600">•</span>
            <a
              href="https://footer.global.repo.seedwave.faa.zone/fruitful.html"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Fruitful
            </a>
            <span className="text-gray-600">•</span>
            <a
              href="https://footer.global.repo.seedwave.faa.zone/faa-zone.html"
              className="text-gray-400 hover:text-white transition-colors"
            >
              FAA.Zone
            </a>
            <span className="text-gray-600">•</span>
            <a
              href="https://footer.global.repo.seedwave.faa.zone/about.html"
              className="text-gray-400 hover:text-white transition-colors"
            >
              About
            </a>
            <span className="text-gray-600">•</span>
            <a
              href="https://footer.global.repo.seedwave.faa.zone/accessibility.html"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Accessibility
            </a>
          </nav>

          {/* Bottom Copyright and Tech Stack */}
          <div className="text-center text-xs text-gray-500">
            <p>
              © 2025 FAA™ Treaty System™. All Rights Reserved. Powered by 🦆{' '}
              <a
                href="https://glyphs.faa.zone"
                className="hover:text-gray-400 transition-colors"
              >
                glyphs
              </a>{' '}
              +{' '}
              <a
                href="https://vault-api.faa.zone"
                className="hover:text-gray-400 transition-colors"
              >
                Vault API
              </a>
              . Synced with{' '}
              <a
                href="https://seedwave.faa.zone"
                className="hover:text-gray-400 transition-colors"
              >
                Seedwave™
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
