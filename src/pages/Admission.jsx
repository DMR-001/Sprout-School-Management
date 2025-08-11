import React from "react";

const Admission = () => {
  return (
    <section className="bg-gradient-to-br from-yellow-50 to-blue-50 min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-yellow-600 mb-6">
            Admission 🎓
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Join our growing family! We're excited to welcome new students who are ready to learn and grow.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-green-600 mb-3">Step 1: Apply</h3>
            <p className="text-gray-600">Fill out our simple online application form</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-4xl mb-4">🏫</div>
            <h3 className="text-xl font-bold text-blue-600 mb-3">Step 2: Visit</h3>
            <p className="text-gray-600">Schedule a tour to see our campus</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-4xl mb-4">�</div>
            <h3 className="text-xl font-bold text-yellow-600 mb-3">Step 3: Enroll</h3>
            <p className="text-gray-600">Complete enrollment and start learning!</p>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-green-600 mb-4">Ready to Start?</h3>
          <p className="text-gray-700 mb-6">
            Our admissions team is here to help you through every step of the process.
          </p>
          <div className="space-y-3">
            <button className="w-full bg-green-500 text-white py-3 rounded-full hover:bg-green-600 transition shadow-lg">
              Start Application
            </button>
            <button className="w-full bg-yellow-400 text-gray-800 py-3 rounded-full hover:bg-yellow-500 transition shadow-lg">
              Schedule Tour
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Admission;
