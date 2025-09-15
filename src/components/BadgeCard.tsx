import React from 'react';
import { Lock, Calendar } from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  dateEarned: string | null;
}

interface BadgeCardProps {
  badge: Badge;
}

function BadgeCard({ badge }: BadgeCardProps) {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'border-green-400 bg-green-50';
      case 'Rare': return 'border-blue-400 bg-blue-50';
      case 'Epic': return 'border-purple-400 bg-purple-50';
      case 'Legendary': return 'border-yellow-400 bg-yellow-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getRarityTextColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'text-green-700';
      case 'Rare': return 'text-blue-700';
      case 'Epic': return 'text-purple-700';
      case 'Legendary': return 'text-yellow-700';
      default: return 'text-gray-700';
    }
  };

  return (
    <div className={`relative bg-white rounded-2xl p-4 border-2 transition-all duration-300 ${
      badge.earned 
        ? `${getRarityColor(badge.rarity)} shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105`
        : 'border-gray-300 bg-gray-100 opacity-75'
    }`}>
      {/* Badge Icon */}
      <div className="text-center mb-3">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${
          badge.earned ? 'bg-white shadow-md' : 'bg-gray-300'
        } transition-all duration-300`}>
          {badge.earned ? (
            <span className="text-3xl animate-bounce">{badge.icon}</span>
          ) : (
            <Lock className="h-6 w-6 text-gray-500" />
          )}
        </div>
      </div>

      {/* Badge Info */}
      <div className="text-center space-y-2">
        <h3 className={`font-bold text-sm ${badge.earned ? 'text-gray-800' : 'text-gray-500'}`}>
          {badge.name}
        </h3>
        <p className={`text-xs leading-relaxed ${badge.earned ? 'text-gray-600' : 'text-gray-400'}`}>
          {badge.description}
        </p>

        {/* Rarity Badge */}
        <div className="flex justify-center">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            badge.earned 
              ? `${getRarityTextColor(badge.rarity)} bg-white`
              : 'text-gray-500 bg-gray-200'
          }`}>
            {badge.rarity}
          </span>
        </div>

        {/* Date Earned */}
        {badge.earned && badge.dateEarned && (
          <div className="flex items-center justify-center text-xs text-gray-500 mt-2">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{new Date(badge.dateEarned).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {/* Earned Indicator */}
      {badge.earned && (
        <div className="absolute -top-2 -right-2">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-xs">✓</span>
          </div>
        </div>
      )}

      {/* Legendary Glow Effect */}
      {badge.earned && badge.rarity === 'Legendary' && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 opacity-20 animate-pulse"></div>
      )}
    </div>
  );
}

export default BadgeCard;