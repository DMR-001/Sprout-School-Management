import Footer from '../components/Footer';

const Gallery = () => {
  const galleryItems = [
    { id: 1, title: "Classroom Learning", description: "Students engaged in interactive learning sessions" },
    { id: 2, title: "Art & Craft", description: "Creative expression through arts and crafts" },
    { id: 3, title: "Sports Day", description: "Annual sports day celebrations and activities" },
    { id: 4, title: "Cultural Programs", description: "Students showcasing their talents" },
    { id: 5, title: "Science Exhibition", description: "Young scientists presenting their projects" },
    { id: 6, title: "Library Time", description: "Quiet reading and learning sessions" },
    { id: 7, title: "Music Class", description: "Learning rhythm and melody" },
    { id: 8, title: "Outdoor Activities", description: "Fun learning in the garden" },
  ];

  return (
    <>
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              School Gallery
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover the vibrant life at Sprout School through these moments of learning, creativity, and growth.
            </p>
          </div>
          
          {/* Gallery Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center relative">
                  <div className="text-center">
                    <div className="text-4xl mb-2">
                      {item.id === 1 && "📚"}
                      {item.id === 2 && "🎨"}
                      {item.id === 3 && "🏃"}
                      {item.id === 4 && "🎭"}
                      {item.id === 5 && "🔬"}
                      {item.id === 6 && "📖"}
                      {item.id === 7 && "🎵"}
                      {item.id === 8 && "🌳"}
                    </div>
                    <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded">Photo Coming Soon</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Call to Action */}
          <div className="text-center mt-16 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Want to See More?
            </h2>
            <p className="text-gray-600 mb-6">
              Visit our school to experience the vibrant learning environment firsthand.
            </p>
            <button className="bg-green-600 hover:bg-green-700 transition-colors text-white font-semibold py-3 px-8 rounded-lg">
              Schedule a Visit
            </button>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default Gallery;
