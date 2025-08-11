import Footer from '../components/Footer';
import sproutLogo from '../assets/images/sprout-logo.png';

const About = () => {
  return (
    <>
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              About Sprout School
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Dedicated to nurturing young minds and building strong foundations for lifelong learning and success.
            </p>
          </div>
          
          {/* School Info Grid */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <img src={sproutLogo} alt="Sprout School" className="w-32 h-32 mx-auto md:mx-0 mb-6" />
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                At Sprout School, we are committed to providing quality education in a safe, nurturing environment. 
                We believe every child is unique and deserves personalized attention to reach their full potential.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our experienced faculty focuses on academic excellence while fostering creativity, critical thinking, 
                and strong moral values that will serve students throughout their lives.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">School Information</h3>
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold text-gray-700">Founded:</span>
                  <span className="text-gray-600">2014</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold text-gray-700">Classes:</span>
                  <span className="text-gray-600">Nursery to Class V</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold text-gray-700">Age Group:</span>
                  <span className="text-gray-600">3-11 years</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold text-gray-700">Medium:</span>
                  <span className="text-gray-600">English</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">Location:</span>
                  <span className="text-gray-600">Meerpet, Hyderabad</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Vision & Values */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h3>
                <p className="text-gray-600 leading-relaxed">
                  To be a leading educational institution that empowers children to become confident, 
                  compassionate, and capable individuals who contribute positively to society.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Values</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Excellence in education and character building</li>
                  <li>• Respect for diversity and individual differences</li>
                  <li>• Innovation in teaching and learning methods</li>
                  <li>• Collaboration between students, parents, and teachers</li>
                  <li>• Integrity in all our interactions and decisions</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Features */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Why Choose Sprout School?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-green-600">📚</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Academic Excellence</h3>
                <p className="text-gray-600">Comprehensive curriculum following national standards with focus on conceptual learning and practical application.</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-blue-600">👨‍🏫</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Experienced Faculty</h3>
                <p className="text-gray-600">Qualified and dedicated teachers who are passionate about education and committed to student success.</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-purple-600">🌱</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Holistic Development</h3>
                <p className="text-gray-600">Focus on academics, creativity, sports, and character building for well-rounded personality development.</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-yellow-600">🏫</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Safe Environment</h3>
                <p className="text-gray-600">Secure campus with modern facilities ensuring the safety and well-being of all students.</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-red-600">👪</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Parent Partnership</h3>
                <p className="text-gray-600">Strong collaboration with parents to ensure consistent support for each child's educational journey.</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-indigo-600">💡</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Innovation</h3>
                <p className="text-gray-600">Modern teaching methods and technology integration to prepare students for the future.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default About;
