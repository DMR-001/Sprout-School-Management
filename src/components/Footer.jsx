import sproutLogo from '../assets/images/sprout-logo.png';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-12 px-6 mt-16">
      <div className="max-w-6xl mx-auto">
        {/* School Classes Banner */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-red-600">
            Nursery, LKG, UKG, Classes I to V.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Logo and School Info */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center mb-4">
              <img src={sproutLogo} alt="Sprout School Logo" className="w-12 h-12 mr-3" />
              <div>
                <h3 className="text-xl font-bold text-gray-800">Sprout School</h3>
                <p className="text-sm text-gray-600">Little Leaders Learning Hub</p>
              </div>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed text-center md:text-left">
              Nurturing young minds with quality education and holistic development for a brighter future.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Links</h3>
            <div className="space-y-2">
              <a href="/about" className="block text-gray-600 hover:text-blue-600 transition-colors text-sm">
                About Us
              </a>
              <a href="/academics" className="block text-gray-600 hover:text-blue-600 transition-colors text-sm">
                Academics
              </a>
              <a href="/gallery" className="block text-gray-600 hover:text-blue-600 transition-colors text-sm">
                Gallery
              </a>
              <a href="/contact" className="block text-gray-600 hover:text-blue-600 transition-colors text-sm">
                Contact Us
              </a>
              <a href="/login" className="block text-gray-600 hover:text-blue-600 transition-colors text-sm">
                Parent Portal
              </a>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-gray-700 mb-1">Address:</p>
                <p className="text-gray-600 leading-relaxed">
                  #14-218/5, Raghava Nagar Colony,<br />
                  TKR College Back Gate,<br />
                  Meerpet, Hyderabad, Telangana 500097
                </p>
              </div>
              
              <div>
                <p className="font-semibold text-gray-700 mb-1">Phone:</p>
                <p className="text-gray-600">+91 97047 17264, +91 70322 52030</p>
              </div>
              
              <div>
                <p className="font-semibold text-gray-700 mb-1">Email:</p>
                <p>
                  <a href="mailto:info@sprouthyd.in" className="text-blue-600 hover:text-blue-800 transition-colors">
                    info@sprouthyd.in
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-8 pt-8 border-t border-gray-300">
          <p className="text-gray-600">
            Copyright © 2025 Sprout School Meerpet
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
