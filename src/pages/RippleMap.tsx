import React, { useState } from 'react';
import { MapPin, TrendingUp, Users, TreePine, Droplets } from 'lucide-react';

function RippleMap() {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const zones = [
    {
      id: 'mumbai',
      name: 'Mumbai',
      x: 25,
      y: 45,
      impact: 'High',
      treesPlanted: 1250,
      plasticCollected: 340,
      waterSaved: 8900,
      schools: 12,
      students: 2340
    },
    {
      id: 'delhi',
      name: 'Delhi',
      x: 30,
      y: 25,
      impact: 'Very High',
      treesPlanted: 2100,
      plasticCollected: 560,
      waterSaved: 12500,
      schools: 18,
      students: 3600
    },
    {
      id: 'bangalore',
      name: 'Bangalore',
      x: 28,
      y: 60,
      impact: 'High',
      treesPlanted: 890,
      plasticCollected: 230,
      waterSaved: 6700,
      schools: 9,
      students: 1800
    },
    {
      id: 'chennai',
      name: 'Chennai',
      x: 32,
      y: 70,
      impact: 'Medium',
      treesPlanted: 670,
      plasticCollected: 180,
      waterSaved: 4500,
      schools: 7,
      students: 1400
    },
    {
      id: 'kolkata',
      name: 'Kolkata',
      x: 45,
      y: 35,
      impact: 'Medium',
      treesPlanted: 540,
      plasticCollected: 150,
      waterSaved: 3800,
      schools: 6,
      students: 1200
    },
    {
      id: 'hyderabad',
      name: 'Hyderabad',
      x: 35,
      y: 55,
      impact: 'High',
      treesPlanted: 980,
      plasticCollected: 270,
      waterSaved: 7200,
      schools: 11,
      students: 2100
    }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Very High': return 'bg-green-500 shadow-green-300';
      case 'High': return 'bg-green-400 shadow-green-200';
      case 'Medium': return 'bg-yellow-400 shadow-yellow-200';
      case 'Low': return 'bg-red-400 shadow-red-200';
      default: return 'bg-gray-400';
    }
  };

  const getImpactSize = (impact: string) => {
    switch (impact) {
      case 'Very High': return 'w-8 h-8';
      case 'High': return 'w-6 h-6';
      case 'Medium': return 'w-5 h-5';
      case 'Low': return 'w-4 h-4';
      default: return 'w-4 h-4';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-700 mb-2">Ripple Map 🗺️</h1>
        <p className="text-lg text-gray-600">See the environmental impact spreading across India!</p>
      </div>

      {/* Map Container */}
      <div className="bg-gradient-to-br from-blue-100 via-green-50 to-blue-100 rounded-3xl p-8 shadow-lg">
        <div className="relative bg-white/40 backdrop-blur-sm rounded-2xl p-8 min-h-96">
          {/* India Map Outline (Simplified) */}
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-4 w-auto h-full opacity-20"
            style={{ filter: 'drop-shadow(0 0 10px rgba(34, 197, 94, 0.3))' }}
          >
            <path
              d="M20,20 Q25,15 35,20 L45,15 Q50,20 55,25 L60,20 Q65,25 70,30 L75,25 Q80,30 75,40 L80,45 Q75,55 70,60 L65,70 Q60,75 50,80 L40,85 Q30,80 25,70 L20,60 Q15,50 20,40 Z"
              className="fill-green-200 stroke-green-300 stroke-2"
            />
          </svg>

          {/* Interactive Zones */}
          {zones.map((zone) => (
            <div
              key={zone.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
              onClick={() => setSelectedZone(selectedZone === zone.id ? null : zone.id)}
            >
              {/* Zone Glow Effect */}
              <div
                className={`absolute inset-0 ${getImpactColor(zone.impact)} rounded-full opacity-30 animate-ping ${getImpactSize(zone.impact)} -translate-x-1/2 -translate-y-1/2`}
                style={{ animationDuration: '3s' }}
              />
              
              {/* Zone Marker */}
              <div
                className={`relative ${getImpactColor(zone.impact)} ${getImpactSize(zone.impact)} rounded-full shadow-lg animate-pulse hover:scale-125 transition-all duration-300`}
              >
                <MapPin className="h-full w-full text-white p-1" />
              </div>

              {/* Zone Label */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2">
                <span className="bg-white px-2 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-md">
                  {zone.name}
                </span>
              </div>

              {/* Hover Info */}
              {selectedZone === zone.id && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 z-10">
                  <div className="bg-white rounded-xl p-4 shadow-xl border min-w-64">
                    <h3 className="font-bold text-lg text-gray-800 mb-3">{zone.name}</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <TreePine className="h-4 w-4 text-green-600" />
                        <span>{zone.treesPlanted} trees 🌱</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Droplets className="h-4 w-4 text-blue-600" />
                        <span>{zone.waterSaved}L saved 💧</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-purple-600">♻️</span>
                        <span>{zone.plasticCollected}kg recycled</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-orange-600" />
                        <span>{zone.students} students</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{zone.schools} schools</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          zone.impact === 'Very High' ? 'bg-green-100 text-green-700' :
                          zone.impact === 'High' ? 'bg-green-50 text-green-600' :
                          zone.impact === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {zone.impact} Impact
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Impact Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-green-500 rounded-full shadow-lg"></div>
            <span className="text-sm font-medium">Very High Impact</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-green-400 rounded-full shadow-lg"></div>
            <span className="text-sm font-medium">High Impact</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-yellow-400 rounded-full shadow-lg"></div>
            <span className="text-sm font-medium">Medium Impact</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-red-400 rounded-full shadow-lg"></div>
            <span className="text-sm font-medium">Low Impact</span>
          </div>
        </div>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
          <div className="text-3xl mb-2">🌍</div>
          <p className="text-3xl font-bold text-green-600">{zones.length}</p>
          <p className="text-gray-600">Active Cities</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
          <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <p className="text-3xl font-bold text-blue-600">
            {zones.reduce((sum, zone) => sum + zone.students, 0).toLocaleString()}
          </p>
          <p className="text-gray-600">Total Students</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
          <div className="text-3xl mb-2">🏫</div>
          <p className="text-3xl font-bold text-purple-600">
            {zones.reduce((sum, zone) => sum + zone.schools, 0)}
          </p>
          <p className="text-gray-600">Participating Schools</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
          <div className="text-3xl mb-2">🌱</div>
          <p className="text-3xl font-bold text-green-600">
            {zones.reduce((sum, zone) => sum + zone.treesPlanted, 0).toLocaleString()}
          </p>
          <p className="text-gray-600">Trees Planted</p>
        </div>
      </div>
    </div>
  );
}

export default RippleMap;