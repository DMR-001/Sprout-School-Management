import React, { useState } from 'react';

const Logo = ({ className = "h-24" }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  if (imageError) {
    // Fallback when logo image is not found
    return (
      <div className="flex items-center space-x-4">
        <div className="h-24 w-24 bg-gradient-to-br from-green-400 via-pink-400 to-red-400 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-lg">
          🌱
        </div>
        <div className="flex flex-col">
          <span className="font-playful text-3xl font-bold text-green-700">Sprout School</span>
          <span className="text-base text-red-500 font-medium">Little Leaders Learning Hub</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <img 
        src="/src/assets/images/sprout-logo.png" 
        alt="Sprout School - Little Leaders Learning Hub" 
        className={`${className} w-auto object-contain`}
        onError={handleImageError}
      />
    </div>
  );
};

export default Logo;
