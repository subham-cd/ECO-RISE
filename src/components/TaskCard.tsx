import React from 'react';
import { CheckCircle, Clock, XCircle, AlertTriangle, Shield } from 'lucide-react';

interface TaskCardProps {
  task: {
    id: string;
    description: string;
    category: string;
    imageUrl: string;
    aiAnalysisResult: {
      issueType: string;
      severity: string;
      confidence: number;
    };
    status: 'pending' | 'approved' | 'rejected' | 'resolved';
    timestamp: string;
  };
  isAdmin?: boolean;
  onStatusChange?: (taskId: string, newStatus: string) => void;
}

function TaskCard({ task, isAdmin = false, onStatusChange }: TaskCardProps) {
  const getStatusBadge = () => {
    switch (task.status) {
      case 'pending':
        return (
          <span className="flex items-center space-x-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
            <Clock className="h-4 w-4" />
            <span>Pending</span>
          </span>
        );
      case 'approved':
        return (
          <span className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            <CheckCircle className="h-4 w-4" />
            <span>Approved</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
            <XCircle className="h-4 w-4" />
            <span>Rejected</span>
          </span>
        );
      case 'resolved':
        return (
          <span className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            <CheckCircle className="h-4 w-4" />
            <span>Resolved</span>
          </span>
        );
      default:
        return null;
    }
  };

  const getSeverityColor = () => {
    switch (task.aiAnalysisResult.severity) {
      case 'High':
        return 'text-red-600 bg-red-50';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'Low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    // TODO: Admin authentication + role management required
    try {
      const response = await fetch(`/api/tasks/${task.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Status update failed');
      }

      if (onStatusChange) {
        onStatusChange(task.id, newStatus);
      }
    } catch (error) {
      console.error('Status update error:', error);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold text-gray-800">{task.category}</span>
        </div>
        {getStatusBadge()}
      </div>

      <div className="mb-4">
        <img
          src={task.imageUrl}
          alt="Task proof"
          className="w-full h-48 object-cover rounded-xl"
        />
      </div>

      <div className="space-y-3">
        <p className="text-gray-700">{task.description}</p>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="h-5 w-5 text-purple-600" />
            <span className="font-semibold text-purple-700">AI Analysis Result</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Issue Type:</span>
              <span className="font-medium text-gray-800">{task.aiAnalysisResult.issueType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Severity:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityColor()}`}>
                {task.aiAnalysisResult.severity}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Confidence:</span>
              <span className="font-medium text-gray-800">
                {(task.aiAnalysisResult.confidence * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-500">
          {new Date(task.timestamp).toLocaleString()}
        </div>

        {isAdmin && task.status === 'pending' && (
          <div className="flex space-x-2 pt-3 border-t border-gray-200">
            <button
              onClick={() => handleStatusUpdate('approved')}
              className="flex-1 bg-green-500 text-white py-2 rounded-lg font-medium hover:bg-green-600 transition-colors duration-200"
            >
              Approve
            </button>
            <button
              onClick={() => handleStatusUpdate('rejected')}
              className="flex-1 bg-red-500 text-white py-2 rounded-lg font-medium hover:bg-red-600 transition-colors duration-200"
            >
              Reject
            </button>
          </div>
        )}

        {isAdmin && task.status === 'approved' && (
          <button
            onClick={() => handleStatusUpdate('resolved')}
            className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200"
          >
            Mark Resolved
          </button>
        )}
      </div>
    </div>
  );
}

export default TaskCard;
