
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePostureMonitor } from './lib/usePostureMonitor';
import { useCustomerData } from './lib/userDataManager';

export default function HomePage() {
  const { 
    postureStatus, 
    isMonitoring, 
    startMonitoring, 
    stopMonitoring, 
    postureScore, 
    vibrationCount,
    sensorSupported 
  } = usePostureMonitor();
  
  const { 
    analytics, 
    recordPosture, 
    recordEngagement, 
    createAchievement 
  } = useCustomerData();

  const [isLoading, setIsLoading] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [aiInsights, setAiInsights] = useState('');
  const [healthScore, setHealthScore] = useState(87);
  const [dailyGoal, setDailyGoal] = useState(8);
  const [todayProgress, setTodayProgress] = useState(5.2);

  // AI Logic for real-time posture analysis
  useEffect(() => {
    if (isMonitoring && postureScore) {
      // Record real posture data
      recordPosture(postureScore, postureStatus);
      
      // AI-powered health score calculation
      const newHealthScore = Math.min(100, (postureScore * 0.7) + (analytics?.engagementScore * 0.3));
      setHealthScore(Math.round(newHealthScore));
      
      // AI Insights Generation
      generateAIInsights(postureStatus, postureScore, analytics);
      
      // Achievement detection
      checkForAchievements();
    }
  }, [postureStatus, postureScore, isMonitoring]);

  // Advanced AI Insights Generator
  const generateAIInsights = (status, score, analytics) => {
    const insights = [];
    
    if (score > 90) {
      insights.push("🌟 Exceptional posture! Your spine alignment is optimal.");
    } else if (score > 80) {
      insights.push("✅ Good posture maintained. Keep up the excellent work!");
    } else if (score > 70) {
      insights.push("⚠️ Slight slouching detected. Adjust your position.");
    } else {
      insights.push("🚨 Poor posture alert! Immediate correction needed.");
    }
    
    // Add personalized recommendations
    if (analytics?.realStreak > 7) {
      insights.push(`🔥 Amazing ${analytics.realStreak}-day streak! You're building lasting habits.`);
    }
    
    if (analytics?.totalSavings > 10) {
      insights.push(`💰 You've earned $${analytics.totalSavings.toFixed(0)} in health value!`);
    }
    
    setAiInsights(insights[Math.floor(Math.random() * insights.length)]);
  };

  // Achievement Detection System
  const checkForAchievements = () => {
    if (!analytics) return;
    
    // First monitoring session
    if (analytics.realPostureReadings === 1) {
      createAchievement('first_session', 'milestone', 'First Session!', 'Welcome to your posture improvement journey!');
    }
    
    // Perfect posture achievement
    if (postureScore > 95) {
      createAchievement('perfect_posture', 'perfect_posture_day', 'Perfect Posture!', 'Maintained excellent posture alignment!');
    }
    
    // Streak achievements
    if (analytics.realStreak === 7) {
      createAchievement('week_streak', 'streak_7_days', 'Week Warrior!', 'Completed 7 days of consistent monitoring!');
    }
  };

  // Enhanced start monitoring with AI calibration
  const handleStartMonitoring = async () => {
    if (!sensorSupported) {
      setShowPermissionModal(true);
      return;
    }
    
    setIsLoading(true);
    recordEngagement('monitoring_start_attempt');
    
    try {
      await startMonitoring();
      recordEngagement('monitoring_started');
      createAchievement('monitoring_start', 'engagement', 'Monitoring Started!', 'AI posture tracking is now active!');
    } catch (error) {
      console.error('Failed to start monitoring:', error);
      setShowPermissionModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopMonitoring = () => {
    stopMonitoring();
    recordEngagement('monitoring_stopped');
  };

  // AI-powered health recommendations
  const getPersonalizedTip = () => {
    if (!analytics) return "Stay consistent with your posture monitoring!";
    
    const tips = [
      "🧘‍♀️ Try the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds.",
      "💪 Strengthen your core muscles to naturally improve posture.",
      "🪑 Adjust your chair height so your feet are flat on the floor.",
      "📱 Position your screen at eye level to reduce neck strain.",
      "🚶‍♂️ Take regular walking breaks to reset your posture.",
      "🧘 Practice mindful posture awareness throughout the day."
    ];
    
    return tips[Math.floor(Math.random() * tips.length)];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return 'text-green-500';
      case 'slouching': return 'text-red-500';
      case 'moving': return 'text-blue-500';
      case 'vibration': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'good': return 'ri-checkbox-circle-fill';
      case 'slouching': return 'ri-error-warning-fill';
      case 'moving': return 'ri-walk-fill';
      case 'vibration': return 'ri-notification-3-fill';
      default: return 'ri-question-fill';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-sm z-40 border-b border-gray-100">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center">
              <i className="ri-shield-check-fill text-white text-xl"></i>
            </div>
            <h1 className="text-xl font-bold font-['Pacifico'] text-gray-900">PostureGuard</h1>
          </div>
          <Link href="/settings" className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
            <i className="ri-settings-3-line text-gray-600 text-xl"></i>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 pb-24 px-6">
        {/* Real-time Status Card */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Real-time AI Monitoring</h2>
            <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
          </div>
          
          {isMonitoring ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <i className={`${getStatusIcon(postureStatus)} ${getStatusColor(postureStatus)} text-2xl`}></i>
                  <div>
                    <div className="font-semibold text-gray-900 capitalize">{postureStatus}</div>
                    <div className="text-sm text-gray-500">Posture Status</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${postureScore > 80 ? 'text-green-500' : postureScore > 60 ? 'text-yellow-500' : 'text-red-500'}`}>
                    {postureScore}
                  </div>
                  <div className="text-sm text-gray-500">Score</div>
                </div>
              </div>
              
              {/* AI Insights */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4">
                <div className="flex items-start space-x-3">
                  <i className="ri-brain-fill text-purple-500 text-xl mt-0.5"></i>
                  <div>
                    <div className="font-semibold text-purple-900 mb-1">AI Analysis</div>
                    <div className="text-sm text-purple-700">{aiInsights}</div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleStopMonitoring}
                className="w-full bg-red-500 text-white py-4 rounded-2xl font-semibold hover:bg-red-600 transition-colors"
              >
                <i className="ri-stop-circle-line mr-2"></i>
                Stop Monitoring
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <i className="ri-play-circle-line text-gray-400 text-3xl"></i>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Start AI Monitoring</h3>
              <p className="text-gray-500 text-sm mb-6">Activate real-time posture tracking with advanced AI analysis</p>
              <button
                onClick={handleStartMonitoring}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-4 rounded-2xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <i className="ri-loader-4-line animate-spin mr-2"></i>
                    Initializing AI...
                  </>
                ) : (
                  <>
                    <i className="ri-play-circle-fill mr-2"></i>
                    Start Smart Monitoring
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Health Dashboard */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <i className="ri-heart-pulse-fill text-green-500 text-xl"></i>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{healthScore}</div>
                <div className="text-sm text-gray-500">Health Score</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${healthScore}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <i className="ri-time-fill text-blue-500 text-xl"></i>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{todayProgress.toFixed(1)}h</div>
                <div className="text-sm text-gray-500">Today</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (todayProgress / dailyGoal) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Live Statistics */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-4">Live Analytics</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-500">{analytics?.realPostureReadings || 0}</div>
              <div className="text-sm text-gray-500">Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{analytics?.realStreak || 0}</div>
              <div className="text-sm text-gray-500">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">{vibrationCount}</div>
              <div className="text-sm text-gray-500">Corrections</div>
            </div>
          </div>
        </div>

        {/* AI Tip Card */}
        <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-3xl border border-orange-100 p-6 mb-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <i className="ri-lightbulb-fill text-orange-500 text-xl"></i>
            </div>
            <div>
              <h3 className="font-bold text-orange-900 mb-2">Personalized Tip</h3>
              <p className="text-orange-700 text-sm leading-relaxed">{getPersonalizedTip()}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/exercises" className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3">
              <i className="ri-run-fill text-purple-500 text-xl"></i>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Smart Exercises</h3>
            <p className="text-gray-500 text-sm">AI-recommended workouts</p>
          </Link>

          <Link href="/progress" className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3">
              <i className="ri-line-chart-fill text-green-500 text-xl"></i>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Progress</h3>
            <p className="text-gray-500 text-sm">Track improvements</p>
          </Link>
        </div>
      </div>

      {/* Permission Modal */}
      {showPermissionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
                <i className="ri-shield-cross-fill text-red-500 text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Sensors Required</h3>
              <p className="text-gray-600 mb-6">PostureGuard needs access to your device's motion sensors for AI posture monitoring.</p>
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowPermissionModal(false);
                    handleStartMonitoring();
                  }}
                  className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-semibold hover:bg-emerald-600 transition-colors"
                >
                  Grant Permission
                </button>
                <button
                  onClick={() => setShowPermissionModal(false)}
                  className="w-full text-gray-500 py-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-40">
        <div className="grid grid-cols-5 py-2">
          <Link href="/" className="flex flex-col items-center justify-center py-3 text-emerald-500">
            <i className="ri-home-5-fill text-xl mb-1"></i>
            <span className="text-xs font-medium">Home</span>
          </Link>
          <Link href="/dashboard" className="flex flex-col items-center justify-center py-3 text-gray-400 hover:text-gray-600">
            <i className="ri-dashboard-3-line text-xl mb-1"></i>
            <span className="text-xs">Dashboard</span>
          </Link>
          <Link href="/exercises" className="flex flex-col items-center justify-center py-3 text-gray-400 hover:text-gray-600">
            <i className="ri-run-line text-xl mb-1"></i>
            <span className="text-xs">Exercises</span>
          </Link>
          <Link href="/progress" className="flex flex-col items-center justify-center py-3 text-gray-400 hover:text-gray-600">
            <i className="ri-line-chart-line text-xl mb-1"></i>
            <span className="text-xs">Progress</span>
          </Link>
          <Link href="/settings" className="flex flex-col items-center justify-center py-3 text-gray-400 hover:text-gray-600">
            <i className="ri-settings-3-line text-xl mb-1"></i>
            <span className="text-xs">Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
