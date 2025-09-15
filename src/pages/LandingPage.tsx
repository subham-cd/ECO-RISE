import React from 'react';
import { Trees, Leaf, Bird, Fish } from 'lucide-react';

interface LandingPageProps {
  onStartJourney: () => void;
}

function LandingPage({ onStartJourney }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-600 relative overflow-hidden">
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 animate-bounce delay-100">
          <Leaf className="h-8 w-8 text-green-200 opacity-60" />
        </div>
        <div className="absolute top-32 right-20 animate-bounce delay-300">
          <Bird className="h-6 w-6 text-green-100 opacity-50" />
        </div>
        <div className="absolute bottom-40 left-1/4 animate-bounce delay-500">
          <Fish className="h-7 w-7 text-blue-200 opacity-40" />
        </div>
        <div className="absolute top-1/3 right-1/3 animate-pulse">
          <div className="w-4 h-4 bg-yellow-300 rounded-full opacity-60"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center">
          {/* Logo Section */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-full backdrop-blur-sm mb-4">
              <Trees className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
              EcoRise
            </h1>
            <div className="text-2xl">🌱</div>
          </div>

          {/* Main Title */}
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Heal Your Patch,<br />
            Heal the Planet 🌍
          </h2>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-green-100 mb-12 max-w-2xl mx-auto">
            Join thousands of students making a real difference through fun eco-challenges and see your impact grow!
          </p>

          {/* CTA Button */}
          <button
            onClick={onStartJourney}
            className="inline-flex items-center px-8 py-4 bg-white text-green-600 font-semibold text-lg rounded-full hover:bg-green-50 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Start Your Eco Journey
            <span className="ml-2">🚀</span>
          </button>

          {/* Bottom Illustration */}
          <div className="mt-16 flex justify-center space-x-8">
            <div className="text-4xl animate-pulse">🌳</div>
            <div className="text-4xl animate-pulse delay-200">🦋</div>
            <div className="text-4xl animate-pulse delay-400">🌊</div>
            <div className="text-4xl animate-pulse delay-600">🐛</div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20">
          <path
            d="M0,60 C150,100 350,0 600,60 C850,120 1050,20 1200,60 L1200,120 L0,120 Z"
            className="fill-white"
          />
        </svg>
      </div>
    </div>
  );
}

export default LandingPage;