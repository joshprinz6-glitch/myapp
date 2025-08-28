
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ProfileSetup() {
  const [formData, setFormData] = useState({
    age: '',
    height: '',
    goals: []
  });

  const goals = [
    { id: 'better-posture', label: 'Improve Posture', icon: 'ri-user-line' },
    { id: 'reduce-pain', label: 'Reduce Back Pain', icon: 'ri-heart-pulse-line' },
    { id: 'build-habits', label: 'Build Healthy Habits', icon: 'ri-trophy-line' },
    { id: 'increase-energy', label: 'Increase Energy', icon: 'ri-flashlight-line' },
    { id: 'work-wellness', label: 'Work Wellness', icon: 'ri-briefcase-line' },
    { id: 'general-health', label: 'General Health', icon: 'ri-heart-line' }
  ];

  const handleGoalToggle = (goalId) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter(id => id !== goalId)
        : [...prev.goals, goalId]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link href="/pairing">
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md">
              <i className="ri-arrow-left-line text-gray-600"></i>
            </button>
          </Link>
          <h1 className="text-xl font-semibold text-gray-900">Profile Setup</h1>
          <Link href="/dashboard">
            <button className="text-blue-600 font-medium">Skip</button>
          </Link>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none text-sm"
                  placeholder="Enter your age"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none text-sm"
                    placeholder="5"
                  />
                  <span className="flex items-center text-gray-500">ft</span>
                  <input
                    type="number"
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none text-sm"
                    placeholder="10"
                  />
                  <span className="flex items-center text-gray-500">in</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Goals</h2>
            <p className="text-sm text-gray-600 mb-6">Select what you'd like to achieve (choose multiple)</p>
            
            <div className="grid grid-cols-2 gap-3">
              {goals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => handleGoalToggle(goal.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    formData.goals.includes(goal.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
                      formData.goals.includes(goal.id) ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <i className={`${goal.icon} text-sm`}></i>
                    </div>
                    <span className={`text-xs font-medium ${
                      formData.goals.includes(goal.id) ? 'text-blue-700' : 'text-gray-700'
                    }`}>
                      {goal.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6">
        <Link href="/dashboard">
          <button className="w-full bg-blue-600 text-white py-4 rounded-full font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg">
            Complete Setup
          </button>
        </Link>
      </div>
    </div>
  );
}
