import React, { useState } from 'react';
import { TreePine, Fish, Bird, Flower, Droplets, Sun } from 'lucide-react';

function DigitalTwin() {
  const [completedQuests, setCompletedQuests] = useState(['plant', 'water']);

  const zones = [
    { id: 'forest', name: 'Forest Zone', x: 20, y: 30, icon: TreePine, unlocked: completedQuests.includes('plant') },
    { id: 'river', name: 'River Zone', x: 60, y: 50, icon: Droplets, unlocked: completedQuests.includes('water') },
    { id: 'garden', name: 'Garden Zone', x: 30, y: 70, icon: Flower, unlocked: completedQuests.includes('garden') },
    { id: 'wildlife', name: 'Wildlife Zone', x: 70, y: 20, icon: Bird, unlocked: completedQuests.includes('wildlife') },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-700 mb-2">Your Digital Twin 🌍</h1>
        <p className="text-lg text-gray-600">Watch your eco-patch grow as you complete quests!</p>
      </div>

      {/* Interactive Map */}
      <div className="relative bg-gradient-to-br from-green-200 via-green-100 to-blue-100 rounded-3xl p-8 shadow-lg overflow-hidden min-h-96">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-4 left-4 text-yellow-400 text-2xl animate-pulse">☀️</div>
          <div className="absolute top-8 right-8 text-white text-xl opacity-60">☁️</div>
          <div className="absolute bottom-8 left-8 text-brown-600 text-lg">🏔️</div>
        </div>

        {/* Interactive Zones */}
        <div className="relative h-80">
          {zones.map((zone) => {
            const Icon = zone.icon;
            return (
              <div
                key={zone.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
                  zone.unlocked ? 'animate-bounce' : 'opacity-30'
                }`}
                style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
              >
                <div
                  className={`p-4 rounded-full ${
                    zone.unlocked
                      ? 'bg-white shadow-lg hover:shadow-xl hover:scale-110'
                      : 'bg-gray-200'
                  } transition-all duration-300 cursor-pointer`}
                >
                  <Icon
                    className={`h-8 w-8 ${
                      zone.unlocked ? 'text-green-600' : 'text-gray-400'
                    }`}
                  />
                </div>
                <p className="text-sm font-medium text-center mt-2 text-gray-700">
                  {zone.name}
                </p>
              </div>
            );
          })}

          {/* Growing Elements */}
          {completedQuests.includes('plant') && (
            <div className="absolute bottom-16 left-1/4 animate-pulse">
              <div className="text-4xl">🌳</div>
            </div>
          )}
          {completedQuests.includes('water') && (
            <div className="absolute bottom-20 right-1/3 animate-bounce delay-200">
              <div className="text-3xl">🐟</div>
            </div>
          )}
        </div>

        {/* Progress Stats */}
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-xl p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl mb-1">🌱</div>
              <p className="text-2xl font-bold text-green-600">12</p>
              <p className="text-sm text-gray-600">Trees Planted</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">💧</div>
              <p className="text-2xl font-bold text-blue-600">480L</p>
              <p className="text-sm text-gray-600">Water Saved</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">♻️</div>
              <p className="text-2xl font-bold text-purple-600">28kg</p>
              <p className="text-sm text-gray-600">Plastic Recycled</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">🦋</div>
              <p className="text-2xl font-bold text-orange-600">6</p>
              <p className="text-sm text-gray-600">Animals Helped</p>
            </div>
          </div>
        </div>
      </div>

      {/* Next Goals */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-2xl font-bold text-green-700 mb-4">Unlock New Zones 🔓</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl">
            <Flower className="h-8 w-8 text-green-600" />
            <div>
              <p className="font-semibold text-green-700">Garden Zone</p>
              <p className="text-sm text-gray-600">Complete "Green Thumb" quest</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl">
            <Bird className="h-8 w-8 text-blue-600" />
            <div>
              <p className="font-semibold text-blue-700">Wildlife Zone</p>
              <p className="text-sm text-gray-600">Complete "Animal Friend" quest</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DigitalTwin;