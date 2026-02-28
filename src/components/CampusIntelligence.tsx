import React, { useEffect, useState } from 'react';
import { Brain, MapPin, Clock, AlertTriangle, TrendingUp, Loader } from 'lucide-react';

interface Insight {
  wasteHotspots: Array<{
    location: string;
    severity: string;
    count: number;
  }>;
  peakCrowdTimes: Array<{
    time: string;
    area: string;
    level: string;
  }>;
  maintenanceAlerts: Array<{
    type: string;
    location: string;
    priority: string;
  }>;
}

function CampusIntelligence() {
  const [insights, setInsights] = useState<Insight | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      // TODO: Connect to predictive analytics service
      const response = await fetch('/api/ai/insights');

      if (response.ok) {
        const data = await response.json();
        setInsights(data);
      } else {
        throw new Error('Failed to fetch insights');
      }
    } catch (error) {
      console.error('Insights fetch error:', error);

      setInsights({
        wasteHotspots: [
          { location: 'Library Entrance', severity: 'High', count: 12 },
          { location: 'Cafeteria', severity: 'Medium', count: 8 },
          { location: 'Sports Complex', severity: 'Low', count: 4 }
        ],
        peakCrowdTimes: [
          { time: '12:00 PM - 1:00 PM', area: 'Cafeteria', level: 'High' },
          { time: '8:00 AM - 9:00 AM', area: 'Main Gate', level: 'High' },
          { time: '4:00 PM - 5:00 PM', area: 'Library', level: 'Medium' }
        ],
        maintenanceAlerts: [
          { type: 'Water Leakage', location: 'Building A - 2nd Floor', priority: 'High' },
          { type: 'Light Malfunction', location: 'Parking Area', priority: 'Medium' },
          { type: 'Garden Maintenance', location: 'Central Park', priority: 'Low' }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg flex items-center justify-center">
        <Loader className="h-8 w-8 text-green-500 animate-spin" />
      </div>
    );
  }

  if (!insights) {
    return null;
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High':
        return 'bg-red-100 text-red-700';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'Low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-purple-500 rounded-xl">
          <Brain className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-purple-700">Campus Intelligence</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-5 shadow">
          <div className="flex items-center space-x-2 mb-4">
            <MapPin className="h-5 w-5 text-red-500" />
            <h4 className="font-semibold text-gray-800">Waste Hotspots</h4>
          </div>
          <div className="space-y-3">
            {insights.wasteHotspots.map((hotspot, index) => (
              <div key={index} className="border-l-4 border-red-400 pl-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800">{hotspot.location}</p>
                    <p className="text-sm text-gray-600">{hotspot.count} reports</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityColor(hotspot.severity)}`}>
                    {hotspot.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow">
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="h-5 w-5 text-blue-500" />
            <h4 className="font-semibold text-gray-800">Peak Crowd Times</h4>
          </div>
          <div className="space-y-3">
            {insights.peakCrowdTimes.map((crowd, index) => (
              <div key={index} className="border-l-4 border-blue-400 pl-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800">{crowd.time}</p>
                    <p className="text-sm text-gray-600">{crowd.area}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityColor(crowd.level)}`}>
                    {crowd.level}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <h4 className="font-semibold text-gray-800">Maintenance Alerts</h4>
          </div>
          <div className="space-y-3">
            {insights.maintenanceAlerts.map((alert, index) => (
              <div key={index} className="border-l-4 border-orange-400 pl-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800">{alert.type}</p>
                    <p className="text-sm text-gray-600">{alert.location}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityColor(alert.priority)}`}>
                    {alert.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          <span className="text-sm font-medium text-gray-700">AI-Powered Predictions</span>
        </div>
        <button
          onClick={fetchInsights}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200 text-sm font-medium"
        >
          Refresh Insights
        </button>
      </div>
    </div>
  );
}

export default CampusIntelligence;
