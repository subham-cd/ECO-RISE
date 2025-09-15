import React from 'react';
import { Trees, Target, Trophy, Award, Map, TreePine } from 'lucide-react';
import { PageType } from '../App';

interface SidebarProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const menuItems = [
    { id: 'digital-twin', label: 'Digital Twin', icon: Trees, emoji: '🌳' },
    { id: 'quests', label: 'Quests', icon: Target, emoji: '🎯' },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, emoji: '🏆' },
    { id: 'badges', label: 'Badges', icon: Award, emoji: '🎖️' },
    { id: 'ripple-map', label: 'Ripple Map', icon: Map, emoji: '🗺️' },
  ];

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white/90 backdrop-blur-sm border-r border-green-100 shadow-sm">
      <div className="p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id as PageType)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-green-400 to-green-500 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:bg-green-50 hover:text-green-700 hover:scale-102'
                }`}
              >
                <span className="text-xl">{item.emoji}</span>
                <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Decoration */}
        <div className="mt-8 p-4 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg">
          <div className="text-center">
            <TreePine className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-green-700 font-medium">Keep Growing!</p>
            <p className="text-xs text-green-600">Every action counts 🌱</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;