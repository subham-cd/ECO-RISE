import React from 'react';
import QuestCard from '../components/QuestCard';

function EcoQuests() {
  const quests = [
    {
      id: 'plant-sapling',
      title: 'Planting Quest',
      description: 'Plant a sapling and upload a photo to track its growth',
      icon: '🌱',
      difficulty: 'Easy',
      points: 100,
      completed: true,
      category: 'Nature'
    },
    {
      id: 'plastic-patrol',
      title: 'Plastic Patrol',
      description: 'Collect 10 pieces of plastic waste from your neighborhood',
      icon: '🗑️',
      difficulty: 'Medium',
      points: 150,
      completed: false,
      category: 'Cleanup'
    },
    {
      id: 'water-champion',
      title: 'Water Champion',
      description: 'Save water for a full day and log your conservation efforts',
      icon: '💧',
      difficulty: 'Easy',
      points: 80,
      completed: true,
      category: 'Conservation'
    },
    {
      id: 'energy-saver',
      title: 'Energy Saver',
      description: 'Reduce electricity usage by 20% this week',
      icon: '⚡',
      difficulty: 'Hard',
      points: 200,
      completed: false,
      category: 'Energy'
    },
    {
      id: 'recycle-master',
      title: 'Recycle Master',
      description: 'Sort and recycle 5kg of different materials correctly',
      icon: '♻️',
      difficulty: 'Medium',
      points: 120,
      completed: false,
      category: 'Recycling'
    },
    {
      id: 'green-transport',
      title: 'Green Transport',
      description: 'Use eco-friendly transport for 3 days straight',
      icon: '🚲',
      difficulty: 'Medium',
      points: 110,
      completed: false,
      category: 'Transport'
    },
    {
      id: 'wildlife-friend',
      title: 'Wildlife Friend',
      description: 'Create a small habitat for local birds or insects',
      icon: '🦋',
      difficulty: 'Hard',
      points: 180,
      completed: false,
      category: 'Wildlife'
    },
    {
      id: 'zero-waste',
      title: 'Zero Waste Day',
      description: 'Complete a full day without generating any waste',
      icon: '🌿',
      difficulty: 'Hard',
      points: 250,
      completed: false,
      category: 'Lifestyle'
    }
  ];

  const categories = ['All', 'Nature', 'Cleanup', 'Conservation', 'Energy', 'Recycling', 'Transport', 'Wildlife', 'Lifestyle'];
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredQuests = selectedCategory === 'All' 
    ? quests 
    : quests.filter(quest => quest.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-700 mb-2">Eco-Quests 🎯</h1>
        <p className="text-lg text-gray-600">Complete challenges to grow your Digital Twin and earn Eco-Karma!</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedCategory === category
                ? 'bg-green-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-green-100 hover:text-green-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
          <div className="text-3xl mb-2">✅</div>
          <p className="text-3xl font-bold text-green-600">2</p>
          <p className="text-gray-600">Completed Quests</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
          <div className="text-3xl mb-2">🎯</div>
          <p className="text-3xl font-bold text-blue-600">6</p>
          <p className="text-gray-600">Active Quests</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
          <div className="text-3xl mb-2">⭐</div>
          <p className="text-3xl font-bold text-purple-600">180</p>
          <p className="text-gray-600">Points Earned</p>
        </div>
      </div>

      {/* Quest Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuests.map((quest) => (
          <QuestCard key={quest.id} quest={quest} />
        ))}
      </div>
    </div>
  );
}

export default EcoQuests;