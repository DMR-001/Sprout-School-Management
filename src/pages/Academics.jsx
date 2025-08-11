import Footer from '../components/Footer';

const Academics = () => {
  const subjects = [
    { name: "English Language", icon: "📚", description: "Reading, writing, grammar, and communication skills" },
    { name: "Mathematics", icon: "🔢", description: "Number concepts, basic operations, and problem-solving" },
    { name: "Science", icon: "🔬", description: "Environmental science and basic scientific concepts" },
    { name: "Social Studies", icon: "🌍", description: "Community, culture, and basic geography" },
    { name: "Art & Craft", icon: "🎨", description: "Creative expression and fine motor skills development" },
    { name: "Physical Education", icon: "🏃", description: "Sports, games, and physical fitness activities" },
  ];

  const classLevels = [
    { level: "Nursery", age: "3-4 years", focus: "Play-based learning and social skills development" },
    { level: "LKG", age: "4-5 years", focus: "Pre-reading and pre-math skills through activities" },
    { level: "UKG", age: "5-6 years", focus: "School readiness and foundational literacy" },
    { level: "Class I", age: "6-7 years", focus: "Formal introduction to reading and writing" },
    { level: "Class II", age: "7-8 years", focus: "Building confidence in basic academic skills" },
    { level: "Class III", age: "8-9 years", focus: "Expanding knowledge across all subjects" },
    { level: "Class IV", age: "9-10 years", focus: "Critical thinking and independent learning" },
    { level: "Class V", age: "10-11 years", focus: "Preparation for middle school transition" },
  ];

  return (
    <>
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Academic Program
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our comprehensive curriculum is designed to provide strong foundations while fostering creativity, critical thinking, and a love for learning.
            </p>
          </div>
          
          {/* Subjects Grid */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Subjects We Teach</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {subjects.map((subject, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
                  <div className="text-5xl mb-4">{subject.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{subject.name}</h3>
                  <p className="text-gray-600 leading-relaxed">{subject.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Class Levels */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Class Levels</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {classLevels.map((classLevel, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{classLevel.level}</h3>
                  <p className="text-green-600 font-semibold mb-3">{classLevel.age}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{classLevel.focus}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Teaching Methodology */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Our Teaching Approach</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-green-600">🎯</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Personalized Learning</h3>
                <p className="text-gray-600">Individual attention to cater to each child's unique learning style and pace.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-blue-600">🔄</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Interactive Methods</h3>
                <p className="text-gray-600">Hands-on activities, group work, and technology integration for engaging learning.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-purple-600">📈</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Continuous Assessment</h3>
                <p className="text-gray-600">Regular evaluation and feedback to track progress and identify areas for improvement.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default Academics;
