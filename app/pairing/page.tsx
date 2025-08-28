
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function DeviceSetup() {
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const setupSteps = [
    {
      title: "Position Your PostureGuard™",
      description: "Strap the device across both shoulders to straighten your back naturally",
      icon: "ri-user-location-line",
      image: "https://static.readdy.ai/image/1936470527160f5ce9afb67a90cae575/7516f9ef7f4f9ab92b37da0a132d0215.jfif"
    },
    {
      title: "Adjust for Comfort",
      description: "Ensure the straps are snug but comfortable, allowing natural movement while maintaining proper alignment",
      icon: "ri-settings-line",
      image: "https://static.readdy.ai/image/1936470527160f5ce9afb67a90cae575/4efbf2395e7a11c3d5edb2211012156c.jfif"
    },
    {
      title: "Experience Better Posture",
      description: "Feel the gentle support as your shoulders align and your back straightens naturally",
      icon: "ri-heart-line",
      image: "https://static.readdy.ai/image/1936470527160f5ce9afb67a90cae575/adc6ba0d012dafbbc9efc23c56087688.jfif"
    }
  ];

  const nextStep = () => {
    if (currentStep < setupSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsSetupComplete(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Interactive Image Component
  const InteractiveImage = ({ src, alt, className }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
    const imageRef = useRef(null);
    const containerRef = useRef(null);

    const handleMouseDown = (e) => {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setStartPosition(position);
      e.preventDefault();
    };

    const handleTouchStart = (e) => {
      setIsDragging(true);
      const touch = e.touches[0];
      setDragStart({ x: touch.clientX, y: touch.clientY });
      setStartPosition(position);
      e.preventDefault();
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      updatePosition(deltaX, deltaY);
    };

    const handleTouchMove = (e) => {
      if (!isDragging) return;
      
      const touch = e.touches[0];
      const deltaX = touch.clientX - dragStart.x;
      const deltaY = touch.clientY - dragStart.y;
      
      updatePosition(deltaX, deltaY);
      e.preventDefault();
    };

    const updatePosition = (deltaX, deltaY) => {
      if (!imageRef.current || !containerRef.current) return;

      const container = containerRef.current.getBoundingClientRect();
      const image = imageRef.current.getBoundingClientRect();
      
      let newX = startPosition.x + deltaX;
      let newY = startPosition.y + deltaY;
      
      // Constrain movement within container bounds
      const maxX = Math.max(0, image.width - container.width);
      const maxY = Math.max(0, image.height - container.height);
      
      newX = Math.max(-maxX, Math.min(0, newX));
      newY = Math.max(-maxY, Math.min(0, newY));
      
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    useEffect(() => {
      if (isDragging) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd);
        
        return () => {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
          document.removeEventListener('touchmove', handleTouchMove);
          document.removeEventListener('touchend', handleTouchEnd);
        };
      }
    }, [isDragging, dragStart, startPosition]);

    return (
      <div 
        ref={containerRef}
        className={`${className} relative overflow-hidden cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
      >
        <img 
          ref={imageRef}
          src={src}
          alt={alt}
          className="w-full h-full object-cover select-none"
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
            transition: isDragging ? 'none' : 'transform 0.2s ease-out'
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          draggable={false}
        />
        {!isDragging && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
            <i className="ri-drag-move-line mr-1"></i>Drag to explore
          </div>
        )}
      </div>
    );
  };

  if (isSetupComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
          <div className="text-center max-w-sm mb-12">
            <div className="w-32 h-32 mx-auto mb-8 relative">
              <div className="w-full h-full rounded-full border-4 border-green-500 bg-green-50 flex items-center justify-center">
                <i className="ri-check-line text-4xl text-green-600"></i>
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-green-500 animate-ping opacity-25"></div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">Setup Complete!</h1>
            <p className="text-lg text-gray-600 mb-8">
              Your PostureGuard™ is ready to help straighten your posture naturally
            </p>

            <Link href="/profile-setup">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-full font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl w-full mb-4">
                Continue Setup
              </button>
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg max-w-sm w-full">
            <h3 className="font-semibold text-gray-900 mb-4">Device Benefits:</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <i className="ri-arrow-up-line text-blue-600 mt-1"></i>
                <p className="text-sm text-gray-600">Instantly straightens your back</p>
              </div>
              <div className="flex items-start space-x-3">
                <i className="ri-heart-line text-blue-600 mt-1"></i>
                <p className="text-sm text-gray-600">Gentle, comfortable support</p>
              </div>
              <div className="flex items-start space-x-3">
                <i className="ri-time-line text-blue-600 mt-1"></i>
                <p className="text-sm text-gray-600">Wear throughout the day</p>
              </div>
              <div className="flex items-start space-x-3">
                <i className="ri-smartphone-line text-blue-600 mt-1"></i>
                <p className="text-sm text-gray-600">Track progress with this app</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center px-6 pb-8">
          <Link href="/">
            <button className="text-gray-600 hover:text-gray-800 transition-colors">
              <i className="ri-arrow-left-line mr-2"></i>Back
            </button>
          </Link>
          
          <Link href="/profile-setup">
            <button className="text-blue-600 hover:text-blue-800 transition-colors">
              Skip for now
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="text-center max-w-sm mb-12">
          <InteractiveImage
            src={setupSteps[currentStep].image}
            alt={setupSteps[currentStep].title}
            className="w-80 h-64 mx-auto mb-8 bg-white rounded-2xl shadow-lg"
          />

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {setupSteps[currentStep].title}
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            {setupSteps[currentStep].description}
          </p>

          <div className="flex justify-center space-x-2 mb-8">
            {setupSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentStep ? 'bg-blue-600 w-8' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <div className="flex justify-between items-center w-full">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                currentStep === 0 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
            >
              Back
            </button>

            <button
              onClick={nextStep}
              className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {currentStep === setupSteps.length - 1 ? 'Complete Setup' : 'Next'}
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 pb-8">
        <div className="bg-blue-50 rounded-xl p-4">
          <h3 className="font-medium text-blue-800 mb-2">Fitting Tips</h3>
          <p className="text-sm text-blue-600">
            The device should feel supportive but not restrictive. Adjust straps for a snug, comfortable fit that allows natural movement.
          </p>
        </div>
      </div>
    </div>
  );
}
