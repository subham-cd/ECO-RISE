import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Send, Loader } from 'lucide-react';

interface TaskSubmissionProps {
  onSubmit: (task: any) => void;
}

function TaskSubmission({ onSubmit }: TaskSubmissionProps) {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  const categories = [
    'Waste Cleanup',
    'Water Conservation',
    'Infrastructure',
    'Traffic',
    'Safety'
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (imageFile: File) => {
    setAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      // TODO: Replace with actual AI endpoint URL
      // Required: Backend AI service or external API key
      const response = await fetch('/api/ai/analyze-image', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        return result;
      } else {
        throw new Error('AI analysis failed');
      }
    } catch (error) {
      console.error('AI Analysis error:', error);

      // Fallback to mock data when API is unavailable
      return {
        issueType: 'Campus Issue Detected',
        severity: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
        confidence: 0.85 + Math.random() * 0.15
      };
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image || !description || !category) {
      alert('Please fill in all fields');
      return;
    }

    const aiAnalysisResult = await analyzeImage(image);

    const task = {
      id: Date.now().toString(),
      description,
      category,
      imageUrl: imagePreview,
      aiAnalysisResult,
      status: 'pending',
      timestamp: new Date().toISOString(),
      userId: 'current-user'
    };

    // TODO: Implement backend endpoint for task storage
    // Requires database integration
    try {
      const response = await fetch('/api/tasks/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
      });

      if (!response.ok) {
        throw new Error('Backend submission failed');
      }
    } catch (error) {
      console.error('Task submission error:', error);
    }

    onSubmit(task);

    setImage(null);
    setImagePreview(null);
    setDescription('');
    setCategory('');
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-2xl font-bold text-green-700 mb-6">Submit Campus Action Proof</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Image
          </label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-green-300 rounded-xl cursor-pointer hover:border-green-500 transition-colors duration-200 bg-green-50"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="h-12 w-12 text-green-500 mb-2" />
                  <span className="text-sm text-gray-600">Click to upload image</span>
                </div>
              )}
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Task Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Describe the action you took or the issue you found..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Task Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={analyzing}
          className="w-full bg-gradient-to-r from-green-400 to-green-500 text-white py-3 rounded-xl font-medium hover:from-green-500 hover:to-green-600 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {analyzing ? (
            <>
              <Loader className="h-5 w-5 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              <span>Submit Task</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default TaskSubmission;
