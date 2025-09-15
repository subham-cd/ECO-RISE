import React from 'react';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';

function Leaderboard() {
  const schools = [
    { rank: 1, name: 'Green Valley High School', ecoKarma: 15420, change: '+245', students: 892 },
    { rank: 2, name: 'Sunrise Academy', ecoKarma: 14680, change: '+180', students: 756 },
    { rank: 3, name: 'Nature\'s Way School', ecoKarma: 13950, change: '+320', students: 634 },
    { rank: 4, name: 'Eco Warriors Institute', ecoKarma: 12740, change: '+156', students: 512 },
    { rank: 5, name: 'Blue Sky Secondary', ecoKarma: 11890, change: '+89', students: 478 },
    { rank: 6, name: 'Forest Glen Academy', ecoKarma: 10560, change: '+67', students: 423 },
    { rank: 7, name: 'River View School', ecoKarma: 9875, change: '+134', students: 389 },
    { rank: 8, name: 'Mountain Peak High', ecoKarma: 9234, change: '+98', students: 345 },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <span className="text-2xl">🥇</span>;
      case 2: return <span className="text-2xl">🥈</span>;
      case 3: return <span className="text-2xl">🥉</span>;
      default: return (
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-sm font-bold text-gray-600">{rank}</span>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-700 mb-2">Leaderboard 🏆</h1>
        <p className="text-lg text-gray-600">See how your school ranks against others in the eco-challenge!</p>
      </div>

      {/* Top 3 Podium */}
      <div className="bg-gradient-to-br from-green-400 via-green-500 to-blue-500 rounded-3xl p-8 text-white">
        <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
          {schools.slice(0, 3).map((school, index) => (
            <div key={school.rank} className={`text-center ${index === 0 ? 'order-2' : index === 1 ? 'order-1' : 'order-3'}`}>
              <div className={`mx-auto mb-4 ${index === 0 ? 'h-32' : 'h-24'} bg-white/20 rounded-lg flex flex-col items-center justify-center backdrop-blur-sm`}>
                <div className="text-4xl mb-2">{getRankIcon(school.rank)}</div>
                <Trophy className={`${index === 0 ? 'h-8 w-8' : 'h-6 w-6'} text-white`} />
              </div>
              <h3 className="font-bold text-lg mb-2">{school.name}</h3>
              <p className="text-xl font-bold">{school.ecoKarma.toLocaleString()}</p>
              <p className="text-sm opacity-80">Eco-Karma</p>
            </div>
          ))}
        </div>
      </div>

      {/* Full Rankings Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-800">School Rankings</h3>
            <div className="flex items-center space-x-2 text-green-600">
              <TrendingUp className="h-5 w-5" />
              <span className="font-medium">Live Updates</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-green-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-700">Rank</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-700">School</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-green-700">Students</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-green-700">Eco-Karma</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-green-700">Weekly Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {schools.map((school, index) => (
                <tr key={school.rank} className={`hover:bg-gray-50 transition-colors duration-150 ${
                  index < 3 ? 'bg-gradient-to-r from-green-50 to-transparent' : ''
                }`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      {getRankIcon(school.rank)}
                      {index < 3 && <Award className="h-5 w-5 text-green-500" />}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-800">{school.name}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-gray-600">{school.students}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-lg font-bold text-green-600">
                      {school.ecoKarma.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {school.change}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Achievement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
          <Medal className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
          <p className="text-3xl font-bold text-gray-800">23,456</p>
          <p className="text-gray-600">Total Trees Planted</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
          <div className="text-4xl mb-3">♻️</div>
          <p className="text-3xl font-bold text-gray-800">1,847kg</p>
          <p className="text-gray-600">Waste Recycled</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
          <div className="text-4xl mb-3">💧</div>
          <p className="text-3xl font-bold text-gray-800">45,890L</p>
          <p className="text-gray-600">Water Saved</p>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;