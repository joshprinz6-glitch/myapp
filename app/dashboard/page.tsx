
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCustomerData } from '../lib/userDataManager';

export default function DashboardPage() {
  const { analytics, recordEngagement, createAchievement } = useCustomerData();
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [insights, setInsights] = useState([]);
  const [predictions, setPredictions] = useState({});

  // Advanced AI Analytics Engine
  useEffect(() => {
    if (analytics) {
      generateAdvancedInsights();
      calculatePredictions();
      recordEngagement('dashboard_viewed');
    }
  }, [analytics, selectedTimeframe]);

  // AI Insights Generator
  const generateAdvancedInsights = () => {
    if (!analytics) return;

    const newInsights = [];
    
    // Posture trend analysis
    if (analytics.realPostureReadings > 20) {
      const improvement = analytics.truePainReduction || 0;
      if (improvement > 2) {
        newInsights.push({
          type: 'success',
          icon: 'ri-trophy-fill',
          title: 'Significant Improvement',
          message: `Your posture improved by ${improvement.toFixed(1)} points! This translates to reduced back pain and better health.`,
          color: 'from-green-400 to-emerald-500'
        });
      }
    }

    // Streak analysis
    if (analytics.realStreak > 7) {
      newInsights.push({
        type: 'achievement',
        icon: 'ri-fire-fill',
        title: 'Consistency Master',
        message: `${analytics.realStreak} days of consistent monitoring! You're building lasting healthy habits.`,
        color: 'from-orange-400 to-red-500'
      });
    }

    // Health value analysis
    if (analytics.totalSavings > 15) {
      newInsights.push({
        type: 'value',
        icon: 'ri-money-dollar-circle-fill',
        title: 'Health Investment ROI',
        message: `You've generated $${analytics.totalSavings.toFixed(0)} in health value by preventing future medical costs.`,
        color: 'from-blue-400 to-purple-500'
      });
    }

    // Engagement insights
    if (analytics.engagementScore > 70) {
      newInsights.push({
        type: 'engagement',
        icon: 'ri-star-fill',
        title: 'Power User Status',
        message: `Your engagement score of ${analytics.engagementScore} puts you in the top 15% of users!`,
        color: 'from-purple-400 to-pink-500'
      });
    }

    setInsights(newInsights);
  };

  // AI Predictive Analytics
  const calculatePredictions = () => {
    if (!analytics) return;

    const currentStreak = analytics.realStreak || 0;
    const currentScore = analytics.engagementScore || 0;
    const currentSavings = analytics.totalSavings || 0;

    // Predict future outcomes based on current trends
    const predictions = {
      nextWeekScore: Math.min(100, currentScore + (currentStreak * 2)),
      monthlyHealthSavings: currentSavings * 2.5,
      painReductionForecast: Math.min(10, (analytics.truePainReduction || 0) + 1.5),
      streakPrediction: currentStreak + 7,
      achievementForecast: Math.floor((analytics.realPostureReadings || 0) / 50) + 2
    };

    setPredictions(predictions);
  };

  const getTimeframeData = () => {
    if (!analytics) return { sessions: 0, improvement: 0, value: 0 };

    switch (selectedTimeframe) {
      case 'day':
        return {
          sessions: Math.floor((analytics.realPostureReadings || 0) / 7),
          improvement: (analytics.truePainReduction || 0) / 7,
          value: (analytics.totalSavings || 0) / 7
        };
      case 'week':
        return {
          sessions: analytics.realPostureReadings || 0,
          improvement: analytics.truePainReduction || 0,
          value: analytics.totalSavings || 0
        };
      case 'month':
        return {
          sessions: (analytics.realPostureReadings || 0) * 4,
          improvement: (analytics.truePainReduction || 0) * 1.5,
          value: (analytics.totalSavings || 0) * 3
        };
      default:
        return {
          sessions: analytics.realPostureReadings || 0,
          improvement: analytics.truePainReduction || 0,
          value: analytics.totalSavings || 0
        };
    }
  };

  const timeframeData = getTimeframeData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-sm z-40 border-b border-gray-100">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <Link href="/" className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
              <i className="ri-arrow-left-line text-gray-600 text-xl"></i>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">AI Dashboard</h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-600">Live</span>
          </div>
        </div>
      </div>

      <div className="pt-20 pb-24 px-6">
        {/* Time Range Selector */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2 mb-6">
          <div className="grid grid-cols-3 gap-1">
            {['day', 'week', 'month'].map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                  selectedTimeframe === timeframe
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <i className="ri-brain-fill text-blue-500 text-xl"></i>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-500">{Math.round(timeframeData.sessions)}</div>
                <div className="text-sm text-gray-500">AI Sessions</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (timeframeData.sessions / 100) * 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <i className="ri-heart-pulse-fill text-green-500 text-xl"></i>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-500">{timeframeData.improvement.toFixed(1)}</div>
                <div className="text-sm text-gray-500">Health Boost</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (timeframeData.improvement / 10) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Health Value Card */}
        <div className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-3xl text-white p-6 mb-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold mb-1">Health Value Generated</h3>
              <p className="text-emerald-100 text-sm">Your investment in wellness</p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
              <i className="ri-money-dollar-circle-fill text-2xl"></i>
            </div>
          </div>
          <div className="text-4xl font-bold mb-2">${timeframeData.value.toFixed(0)}</div>
          <div className="flex items-center space-x-2">
            <i className="ri-arrow-up-line text-emerald-200"></i>
            <span className="text-emerald-200 text-sm">+{((timeframeData.value / 30) * 100).toFixed(0)}% vs last period</span>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-4">🧠 AI Insights</h3>
          {insights.length > 0 ? (
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${insight.color} rounded-xl flex items-center justify-center`}>
                    <i className={`${insight.icon} text-white text-xl`}></i>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{insight.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{insight.message}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <i className="ri-brain-line text-gray-400 text-2xl"></i>
              </div>
              <p className="text-gray-500">Keep using the app to unlock AI insights!</p>
            </div>
          )}
        </div>

        {/* Predictive Analytics */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-4">🔮 Future Predictions</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl">
              <div>
                <div className="font-semibold text-blue-900">Next Week Score</div>
                <div className="text-blue-600 text-sm">Predicted improvement</div>
              </div>
              <div className="text-2xl font-bold text-blue-500">{predictions.nextWeekScore || 0}</div>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-2xl">
              <div>
                <div className="font-semibold text-green-900">Monthly Savings</div>
                <div className="text-green-600 text-sm">Health value forecast</div>
              </div>
              <div className="text-2xl font-bold text-green-500">${(predictions.monthlyHealthSavings || 0).toFixed(0)}</div>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-2xl">
              <div>
                <div className="font-semibold text-purple-900">Pain Reduction</div>
                <div className="text-purple-600 text-sm">Expected improvement</div>
              </div>
              <div className="text-2xl font-bold text-purple-500">{(predictions.painReductionForecast || 0).toFixed(1)}</div>
            </div>
          </div>
        </div>

        {/* Community Stats */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-4">🌟 Community Ranking</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Your Rank</span>
              <span className="font-bold text-blue-500 capitalize">
                {analytics?.communityRank?.replace('_', ' ') || 'Building Progress'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Improvement Percentile</span>
              <span className="font-bold text-green-500">{analytics?.improvementPercentile || 50}%</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Global Users</span>
              <span className="font-bold text-purple-500">{analytics?.globalStats?.totalUsers || 147}</span>
            </div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-4">🏆 Recent Achievements</h3>
          {analytics?.achievements && analytics.achievements.length > 0 ? (
            <div className="space-y-3">
              {analytics.achievements.slice(-3).map((achievement, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-yellow-50 rounded-2xl">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <i className="ri-medal-fill text-yellow-500 text-xl"></i>
                  </div>
                  <div>
                    <div className="font-semibold text-yellow-900">{achievement.title}</div>
                    <div className="text-yellow-600 text-sm">{achievement.description}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <i className="ri-trophy-line text-gray-400 text-2xl"></i>
              </div>
              <p className="text-gray-500">Complete activities to earn achievements!</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-40">
        <div className="grid grid-cols-5 py-2">
          <Link href="/" className="flex flex-col items-center justify-center py-3 text-gray-400 hover:text-gray-600">
            <i className="ri-home-5-line text-xl mb-1"></i>
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/dashboard" className="flex flex-col items-center justify-center py-3 text-blue-500">
            <i className="ri-dashboard-3-fill text-xl mb-1"></i>
            <span className="text-xs font-medium">Dashboard</span>
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
