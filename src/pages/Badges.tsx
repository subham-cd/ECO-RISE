import React from 'react';
import BadgeCard from '../components/BadgeCard';

function Badges() {
  const badges = [
    {
      id: 'recycle-ranger',
      name: 'Recycle Ranger',
      description: 'Recycled 50+ items correctly',
      icon: '♻️',
      earned: true,
      rarity: 'Common',
      dateEarned: '2024-01-15'
    },
    {
      id: 'water-whisperer',
      name: 'Water Whisperer',
      description: 'Saved 500L of water in conservation efforts',
      icon: '💧',
      earned: true,
      rarity: 'Rare',
      dateEarned: '2024-01-20'
    },
    {
      id: 'tree-guardian',
      name: 'Tree Guardian',
      description: 'Planted 10 trees and tracked their growth',
      icon: '🌳',
      earned: false,
      rarity: 'Epic',
      dateEarned: null
    },
    {
      id: 'eco-pioneer',
      name: 'Eco Pioneer',
      description: 'First student to complete 5 quests',
      icon: '🏕️',
      earned: true,
      rarity: 'Legendary',
      dateEarned: '2024-01-10'
    },
    {
      id: 'energy-efficient',
      name: 'Energy Efficient',
      description: 'Reduced energy consumption by 30%',
      icon: '⚡',
      earned: false,
      rarity: 'Rare',
      dateEarned: null
    },
    {
      id: 'clean-sweep',
      name: 'Clean Sweep',
      description: 'Organized 3 community cleanup events',
      icon: '🧹',
      earned: false,
      rarity: 'Epic',
      dateEarned: null
    },
    {
      id: 'wildlife-protector',
      name: 'Wildlife Protector',
      description: 'Created habitats for 5 different species',
      icon: '🦋',
      earned: false,
      rarity: 'Epic',
      dateEarned: null
    },
    {
      id: 'green-transport',
      name: 'Green Transport Hero',
      description: 'Used eco-friendly transport for 30 days',
      icon: '🚲',
      earned: true,
      rarity: 'Common',
      dateEarned: '2024-01-25'
    },
    {
      id: 'zero-waste-warrior',
      name: 'Zero Waste Warrior',
      description: 'Achieved zero waste for 7 consecutive days',
      icon: '🌿',
      earned: false,
      rarity: 'Legendary',
      dateEarned: null
    },
    {
      id: 'solar-supporter',
      name: 'Solar Supporter',
      description: 'Promoted renewable energy in community',
      icon: '☀️',
      earned: false,
      rarity: 'Rare',
      dateEarned: null
    },
    {
      id: 'ocean-defender',
      name: 'Ocean Defender',
      description: 'Prevented 100+ plastic items from reaching ocean',
      icon: '🌊',
      earned: false,
      rarity: 'Epic',
      dateEarned: null
    },
    {
      id: 'eco-educator',
      name: 'Eco Educator',
      description: 'Taught 20+ people about environmental issues',
      icon: '📚',
      earned: false,
      rarity: 'Legendary',
      dateEarned: null
    }
  ];

  const earnedBadges = badges.filter(badge => badge.earned);
  const lockedBadges = badges.filter(badge => !badge.earned);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-700 mb-2">Achievement Badges 🎖️</h1>
        <p className="text-lg text-gray-600">Collect badges by completing eco-quests and making a difference!</p>
      </div>

      {/* Progress Stats */}
      <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl p-6 text-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold">{earnedBadges.length}</p>
            <p className="text-green-100">Badges Earned</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">{badges.length}</p>
            <p className="text-green-100">Total Badges</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">{Math.round((earnedBadges.length / badges.length) * 100)}%</p>
            <p className="text-green-100">Completion</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">{earnedBadges.filter(b => b.rarity === 'Legendary').length}</p>
            <p className="text-green-100">Legendary</p>
          </div>
        </div>
      </div>

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🏆</span>
            Your Achievements ({earnedBadges.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {earnedBadges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </div>
      )}

      {/* Locked Badges */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">🔒</span>
          Badges to Unlock ({lockedBadges.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {lockedBadges.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Badges;