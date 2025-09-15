import React from 'react';
import { CheckCircle, Clock, Star } from 'lucide-react';

interface Quest {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
  completed: boolean;
  category: string;
}

interface QuestCardProps {
  quest: Quest;
}

function QuestCard({ quest }: QuestCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
      quest.completed ? 'ring-2 ring-green-200 bg-green-50' : ''
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="text-4xl">{quest.icon}</div>
        {quest.completed && (
          <CheckCircle className="h-6 w-6 text-green-600 animate-pulse" />
        )}
      </div>

      {/* Content */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-gray-800">{quest.title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{quest.description}</p>

        {/* Tags */}
        <div className="flex items-center justify-between">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quest.difficulty)}`}>
            {quest.difficulty}
          </span>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-semibold text-gray-700">{quest.points}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          className={`w-full py-3 rounded-xl font-medium transition-all duration-200 ${
            quest.completed
              ? 'bg-green-500 text-white cursor-default'
              : 'bg-gradient-to-r from-green-400 to-green-500 text-white hover:from-green-500 hover:to-green-600 hover:shadow-lg transform hover:scale-105'
          }`}
        >
          {quest.completed ? (
            <span className="flex items-center justify-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Completed!</span>
            </span>
          ) : (
            <span className="flex items-center justify-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Start Quest</span>
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

export default QuestCard;