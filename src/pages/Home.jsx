import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import sproutLogo from '../assets/images/sprout-logo.png';

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-green-50 min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
        {/* Background Children Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top left */}
          <div className="absolute top-20 left-10 text-4xl opacity-20 animate-bounce">👶</div>
          <div className="absolute top-32 left-32 text-3xl opacity-15 float">🧒</div>
          {/* Top right */}
          <div className="absolute top-16 right-16 text-4xl opacity-20 wiggle">👧</div>
          <div className="absolute top-40 right-40 text-3xl opacity-15 animate-pulse">🎨</div>
          {/* Bottom left */}
          <div className="absolute bottom-32 left-20 text-3xl opacity-20 float">🏃‍♂️</div>
          <div className="absolute bottom-16 left-48 text-4xl opacity-15 animate-bounce">📚</div>
          {/* Bottom right */}
          <div className="absolute bottom-24 right-24 text-3xl opacity-20 wiggle">🎵</div>
          <div className="absolute bottom-40 right-8 text-4xl opacity-15 animate-pulse">🤸‍♀️</div>
          {/* Center scattered */}
          <div className="absolute top-1/3 left-1/4 text-2xl opacity-10 float">⚽</div>
          <div className="absolute top-2/3 right-1/3 text-2xl opacity-10 wiggle">🖍️</div>
          <div className="absolute top-1/2 left-1/6 text-2xl opacity-10 animate-bounce">🎪</div>
          <div className="absolute top-1/4 right-1/4 text-2xl opacity-10 animate-pulse">🌟</div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Logo and School Name */}
          <div className="flex flex-col items-center mb-8">
            <img src={sproutLogo} alt="Sprout School Logo" className="w-24 h-24 mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
              Sprout School
            </h1>
            <h2 className="text-xl md:text-2xl text-green-600 font-medium mb-6">
              Little Leaders Learning Hub
            </h2>
          </div>
          
          {/* Main Content */}
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Nurturing young minds with quality education and holistic development. 
            We provide a safe, caring environment where children learn, grow, and discover their potential.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              to="/about"
              className="bg-green-600 hover:bg-green-700 transition-colors text-white font-semibold py-3 px-8 rounded-lg shadow-md text-center"
            >
              Learn More About Us
            </Link>
            <Link 
              to="/login"
              className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors font-semibold py-3 px-8 rounded-lg text-center"
            >
              Parent Portal
            </Link>
          </div>
          
          {/* Classes Banner */}
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-red-600 mb-4">
              Classes Offered
            </h3>
            <p className="text-lg text-gray-700">
              Nursery, LKG, UKG, Classes I to V
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Ages 3-11 years
            </p>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Choose Sprout School?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-green-600">📚</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Quality Education</h3>
              <p className="text-gray-600">Comprehensive curriculum designed to build strong foundations in all subjects.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-blue-600">👥</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Caring Environment</h3>
              <p className="text-gray-600">Safe and nurturing environment where every child feels valued and supported.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-purple-600">🎨</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Holistic Development</h3>
              <p className="text-gray-600">Focus on academics, creativity, sports, and character building for well-rounded growth.</p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default Home;
