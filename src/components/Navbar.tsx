import React from 'react';
import { Trees, User, Trophy } from 'lucide-react';

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-green-100 shadow-sm">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full">
              <Trees className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-green-700">DHARA 🦢</h1>
              <span className="text-sm">🌱</span>
            </div>
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-6">
            {/* Eco-Karma Score */}
            <div className="flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full">
              <Trophy className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-700">2,450</span>
              <span className="text-sm text-green-600">Eco-Karma</span>
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-700">Sarah Green</p>
                <p className="text-xs text-gray-500">Level 7 Eco-Warrior</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
