
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCustomerData } from '../lib/userDataManager';

export default function Goals() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [showCreateGoal, setShowCreateGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    target: 100,
    category: 'posture',
    deadline: ''
  });

  const {
    customerId,
    profile,
    analytics,
    isLoading,
    updateGoal,
    createAchievement,
    recordHealth
  } = useCustomerData();

  // Personal goals based on customer data
  const [personalGoals, setPersonalGoals] = useState([]);
  const [communityGoals, setCommunityGoals] = useState([]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Generate personalized goals based on customer data
  useEffect(() => {
    if (analytics && !isLoading) {
      const goals = [];

      // Personal improvement goals
      if (analytics.currentScore < 80) {
        goals.push({
          id: 'improve-posture',
          title: 'Perfect Posture Master',
          description: `Reach 85+ posture score consistently. You're at ${analytics.currentScore} now!`,
          target: 85,
          current: analytics.currentScore,
          category: 'posture',
          type: 'personal',
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          difficulty: 'medium',
          points: 200,
          icon: 'ri-trophy-line',
          color: 'from-yellow-500 to-orange-500'
        });
      }

      // Streak goals
      const currentStreak = analytics.streaks?.currentPostureStreak || 0;
      if (currentStreak < 30) {
        goals.push({
          id: 'streak-30',
          title: '30-Day Champion',
          description: `Build a 30-day streak! Currently at ${currentStreak} days.`,
          target: 30,
          current: currentStreak,
          category: 'consistency',
          type: 'personal',
          deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
          difficulty: 'hard',
          points: 500,
          icon: 'ri-fire-line',
          color: 'from-red-500 to-pink-500'
        });
      }

      // Exercise goals
      goals.push({
        id: 'exercise-week',
        title: 'Weekly Warrior',
        description: 'Complete 5 posture exercises this week for better mobility.',
        target: 5,
        current: Math.floor(Math.random() * 3),
        category: 'exercise',
        type: 'personal',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        difficulty: 'easy',
        points: 100,
        icon: 'ri-heart-pulse-line',
        color: 'from-green-500 to-emerald-500'
      });

      // Data collection goals
      if (analytics.totalDataPoints < 1000) {
        goals.push({
          id: 'data-collector',
          title: 'Data Pioneer',
          description: `Collect 1000 posture readings. You're at ${analytics.totalDataPoints}!`,
          target: 1000,
          current: analytics.totalDataPoints,
          category: 'engagement',
          type: 'personal',
          deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
          difficulty: 'medium',
          points: 300,
          icon: 'ri-database-line',
          color: 'from-blue-500 to-cyan-500'
        });
      }

      setPersonalGoals(goals);

      // Community goals that connect users
      const community = [
        {
          id: 'family-challenge',
          title: 'PostureGuard Family Challenge',
          description: 'Join 500+ members in improving posture together this month!',
          target: 500,
          current: Math.floor(Math.random() * 300 + 200),
          category: 'community',
          type: 'community',
          deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
          difficulty: 'community',
          points: 1000,
          icon: 'ri-group-line',
          color: 'from-purple-500 to-indigo-500',
          participants: Math.floor(Math.random() * 200 + 300)
        },
        {
          id: 'mentor-program',
          title: 'Posture Mentor',
          description: 'Help 3 new family members improve their posture scores.',
          target: 3,
          current: 0,
          category: 'mentorship',
          type: 'community',
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          difficulty: 'medium',
          points: 750,
          icon: 'ri-hand-heart-line',
          color: 'from-pink-500 to-rose-500',
          participants: Math.floor(Math.random() * 50 + 25)
        },
        {
          id: 'global-movement',
          title: 'Global Posture Movement',
          description: 'Be part of the worldwide posture improvement initiative!',
          target: 10000,
          current: Math.floor(Math.random() * 5000 + 7500),
          category: 'global',
          type: 'community',
          deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          difficulty: 'epic',
          points: 2000,
          icon: 'ri-earth-line',
          color: 'from-teal-500 to-green-500',
          participants: Math.floor(Math.random() * 1000 + 8500)
        }
      ];

      setCommunityGoals(community);
    }
  }, [analytics, isLoading]);

  const handleJoinGoal = (goal) => {
    try {
      if (goal.type === 'community') {
        if (createAchievement) {
          createAchievement(goal.id, 'goal_joined', `Joined ${goal.title}`, `Became part of the ${goal.title} community challenge`);
        }
        
        // Create success notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-20 left-6 right-6 z-50 bg-green-500 text-white p-4 rounded-xl shadow-lg animate-slide-down';
        notification.innerHTML = `
          <div class="flex items-center space-x-3">
            <i class="ri-check-circle-line text-xl"></i>
            <div>
              <div class="font-bold">Welcome to ${goal.title}!</div>
              <div class="text-sm">You're now part of ${goal.participants} amazing family members!</div>
            </div>
          </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 4000);
        
      } else {
        if (updateGoal) {
          updateGoal(goal.id, goal.current, false);
        }
        
        // Create goal activation notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-20 left-6 right-6 z-50 bg-blue-500 text-white p-4 rounded-xl shadow-lg animate-slide-down';
        notification.innerHTML = `
          <div class="flex items-center space-x-3">
            <i class="ri-target-line text-xl"></i>
            <div>
              <div class="font-bold">Personal Goal Activated!</div>
              <div class="text-sm">"${goal.title}" - Let's achieve this together!</div>
            </div>
          </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 4000);
      }
    } catch (error) {
      console.error('Error joining goal:', error);
      // Fallback notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-20 left-6 right-6 z-50 bg-green-500 text-white p-4 rounded-xl shadow-lg';
      notification.innerHTML = `<div class="text-center font-bold">Goal joined successfully! 🎯</div>`;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    }
  };

  const handleCreateGoal = () => {
    if (!newGoal.title.trim()) {
      // Show validation error
      const errorNotif = document.createElement('div');
      errorNotif.className = 'fixed top-20 left-6 right-6 z-50 bg-red-500 text-white p-4 rounded-xl shadow-lg';
      errorNotif.innerHTML = '<div class="text-center font-bold">Please enter a goal title</div>';
      document.body.appendChild(errorNotif);
      setTimeout(() => errorNotif.remove(), 3000);
      return;
    }

    try {
      const goal = {
        id: `custom-${Date.now()}`,
        ...newGoal,
        current: 0,
        type: 'personal',
        difficulty: 'custom',
        points: Math.floor(newGoal.target / 10) + 50,
        icon: 'ri-star-line',
        color: 'from-indigo-500 to-purple-500'
      };

      setPersonalGoals(prev => [...prev, goal]);
      setShowCreateGoal(false);
      setNewGoal({
        title: '',
        description: '',
        target: 100,
        category: 'posture',
        deadline: ''
      });

      if (createAchievement) {
        createAchievement(goal.id, 'goal_created', 'Goal Creator', `Created custom goal: ${goal.title}`);
      }
      
      // Success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-20 left-6 right-6 z-50 bg-purple-500 text-white p-4 rounded-xl shadow-lg';
      notification.innerHTML = `
        <div class="flex items-center space-x-3">
          <i class="ri-star-line text-xl"></i>
          <div>
            <div class="font-bold">Custom Goal Created!</div>
            <div class="text-sm">You're taking charge of your posture journey!</div>
          </div>
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 4000);
      
    } catch (error) {
      console.error('Error creating goal:', error);
      const errorNotif = document.createElement('div');
      errorNotif.className = 'fixed top-20 left-6 right-6 z-50 bg-red-500 text-white p-4 rounded-xl shadow-lg';
      errorNotif.innerHTML = '<div class="text-center font-bold">Error creating goal. Please try again.</div>';
      document.body.appendChild(errorNotif);
      setTimeout(() => errorNotif.remove(), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center pb-20">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full animate-pulse"></div>
          <p className="text-gray-600 font-medium">Loading your personal goals...</p>
        </div>
      </div>
    );
  }

  const GoalCard = ({ goal, isSelected, onClick }) => {
    const progress = (goal.current / goal.target) * 100;
    const isCompleted = progress >= 100;

    return (
      <div 
        onClick={() => onClick(goal)}
        className={`bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border transition-all duration-500 cursor-pointer hover:scale-[1.02] ${
          isSelected ? 'border-blue-500/50 shadow-2xl ring-4 ring-blue-100' : 'border-white/60 hover:shadow-2xl'
        } ${isCompleted ? 'bg-gradient-to-br from-green-50 to-emerald-50' : ''}`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${goal.color} shadow-lg`}>
            <i className={`${goal.icon} text-white text-xl`}></i>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Difficulty</div>
            <div className={`text-xs px-2 py-1 rounded-full font-bold ${
              goal.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
              goal.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
              goal.difficulty === 'hard' ? 'bg-red-100 text-red-700' :
              goal.difficulty === 'epic' ? 'bg-purple-100 text-purple-700' :
              goal.difficulty === 'community' ? 'bg-blue-100 text-blue-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {goal.difficulty.toUpperCase()}
            </div>
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2">{goal.title}</h3>
        <p className="text-sm text-gray-600 mb-4">{goal.description}</p>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-bold text-gray-900">{goal.current}/{goal.target}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${goal.color}`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">
              {Math.round(progress)}% complete
            </span>
            <span className="text-xs font-bold text-amber-600">
              +{goal.points} points
            </span>
          </div>
        </div>

        {goal.type === 'community' && (
          <div className="mb-4 p-3 bg-blue-50 rounded-xl">
            <div className="flex items-center space-x-2 mb-1">
              <i className="ri-group-line text-blue-600 text-sm"></i>
              <span className="text-sm font-medium text-blue-800">{goal.participants} family members joined</span>
            </div>
            <div className="text-xs text-blue-600">Be part of something bigger! 🌟</div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Deadline: {new Date(goal.deadline).toLocaleDateString()}
          </div>
          {isCompleted ? (
            <div className="flex items-center space-x-1 text-green-600">
              <i className="ri-check-line text-sm"></i>
              <span className="text-xs font-bold">COMPLETED!</span>
            </div>
          ) : (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleJoinGoal(goal);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg bg-gradient-to-r ${goal.color} text-white`}
            >
              {goal.type === 'community' ? 'Join Challenge' : 'Start Goal'}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 pb-24 transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="px-6 py-10">
        <div className={`flex items-center justify-between mb-10 transition-all duration-800 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent mb-2">
              Your Goals
            </h1>
            <p className="text-gray-600 text-base font-medium">
              Personal & community challenges for {profile?.name || 'you'}
            </p>
          </div>
          <button
            onClick={() => setShowCreateGoal(true)}
            className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 to-blue-600 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-white"
          >
            <i className="ri-add-line text-xl"></i>
          </button>
        </div>

        {/* Personal Stats */}
        <div className={`bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl mb-8 border border-white/60 transition-all duration-1000 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '200ms' }}>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Your Achievement Profile</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                <i className="ri-trophy-line text-white text-xl"></i>
              </div>
              <div className="text-2xl font-bold text-gray-900">{analytics?.totalPoints || 0}</div>
              <div className="text-sm text-gray-600">Total Points</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <i className="ri-medal-line text-white text-xl"></i>
              </div>
              <div className="text-2xl font-bold text-gray-900">{analytics?.achievements || 0}</div>
              <div className="text-sm text-gray-600">Achievements</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <i className="ri-team-line text-white text-xl"></i>
              </div>
              <div className="text-2xl font-bold text-gray-900">#{Math.floor(Math.random() * 100 + 1)}</div>
              <div className="text-sm text-gray-600">Family Rank</div>
            </div>
          </div>
        </div>

        {/* Personal Goals */}
        <div className={`mb-8 transition-all duration-1000 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '400ms' }}>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Goals</h2>
          <div className="space-y-4">
            {personalGoals.map((goal) => (
              <GoalCard 
                key={goal.id} 
                goal={goal} 
                isSelected={selectedGoal?.id === goal.id}
                onClick={setSelectedGoal}
              />
            ))}
          </div>
        </div>

        {/* Community Goals */}
        <div className={`mb-8 transition-all duration-1000 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '600ms' }}>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            <i className="ri-group-line mr-3 text-purple-600"></i>
            Community Challenges
          </h2>
          <div className="space-y-4">
            {communityGoals.map((goal) => (
              <GoalCard 
                key={goal.id} 
                goal={goal} 
                isSelected={selectedGoal?.id === goal.id}
                onClick={setSelectedGoal}
              />
            ))}
          </div>
        </div>

        {/* PostureGuard Family Connection */}
        <div className={`bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl transition-all duration-1000 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '800ms' }}>
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md shadow-lg mb-4">
              <i className="ri-heart-3-line text-3xl"></i>
            </div>
            <h3 className="font-bold text-2xl mb-2">PostureGuard Family</h3>
            <p className="text-purple-100 text-base">You're part of something amazing!</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-md">
              <div className="text-2xl font-bold">{Math.floor(Math.random() * 500 + 1200)}</div>
              <div className="text-xs text-purple-200">Active Members</div>
            </div>
            <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-md">
              <div className="text-2xl font-bold">{Math.floor(Math.random() * 50 + 150)}</div>
              <div className="text-xs text-purple-200">Goals Achieved Today</div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-purple-100 mb-4 text-sm">
              Member ID: {customerId?.slice(-8) || 'Loading...'}
            </p>
            <Link href="/progress">
              <button className="bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-xl text-base font-bold hover:bg-white/30 transition-all duration-300 hover:scale-105 shadow-lg">
                View Family Progress
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Create Goal Modal */}
      {showCreateGoal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Create Personal Goal</h3>
              <button
                onClick={() => setShowCreateGoal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <i className="ri-close-line"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Goal Title</label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Perfect Posture Week"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newGoal.description}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent h-20 resize-none"
                  placeholder="Describe your goal..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target</label>
                  <input
                    type="number"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, target: parseInt(e.target.value) || 100 }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newGoal.category}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="posture">Posture</option>
                    <option value="exercise">Exercise</option>
                    <option value="consistency">Consistency</option>
                    <option value="health">Health</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCreateGoal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGoal}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg font-bold hover:shadow-lg transition-all duration-300"
              >
                Create Goal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-2xl">
        <div className="grid grid-cols-5 py-3">
          <Link href="/dashboard" className="flex flex-col items-center py-3 px-2 transition-all duration-300 hover:scale-110">
            <div className="w-7 h-7 flex items-center justify-center mb-1">
              <i className="ri-dashboard-3-line text-gray-400 text-xl"></i>
            </div>
            <span className="text-xs text-gray-400 font-medium">Dashboard</span>
          </Link>
          
          <Link href="/progress" className="flex flex-col items-center py-3 px-2 transition-all duration-300 hover:scale-110">
            <div className="w-7 h-7 flex items-center justify-center mb-1">
              <i className="ri-bar-chart-line text-gray-400 text-xl"></i>
            </div>
            <span className="text-xs text-gray-400 font-medium">Progress</span>
          </Link>
          
          <Link href="/goals" className="flex flex-col items-center py-3 px-2 transition-all duration-300 hover:scale-110">
            <div className="w-7 h-7 flex items-center justify-center mb-1">
              <i className="ri-trophy-fill text-purple-600 text-xl"></i>
            </div>
            <span className="text-xs text-purple-600 font-bold">Goals</span>
          </Link>
          
          <Link href="/exercises" className="flex flex-col items-center py-3 px-2 transition-all duration-300 hover:scale-110">
            <div className="w-7 h-7 flex items-center justify-center mb-1">
              <i className="ri-heart-pulse-line text-gray-400 text-xl"></i>
            </div>
            <span className="text-xs text-gray-400 font-medium">Exercises</span>
          </Link>
          
          <Link href="/settings" className="flex flex-col items-center py-3 px-2 transition-all duration-300 hover:scale-110">
            <div className="w-7 h-7 flex items-center justify-center mb-1">
              <i className="ri-settings-3-line text-gray-400 text-xl"></i>
            </div>
            <span className="text-xs text-gray-400 font-medium">Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
