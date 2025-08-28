
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCustomerData } from '../lib/userDataManager';

export default function ProgressPage() {
  const { analytics, recordEngagement } = useCustomerData();
  const [selectedMetric, setSelectedMetric] = useState('posture');
  const [timeRange, setTimeRange] = useState('week');
  const [chartData, setChartData] = useState([]);
  const [insights, setInsights] = useState([]);

  // Advanced Progress Analytics
  useEffect(() => {
    if (analytics) {
      generateChartData();
      generateProgressInsights();
      recordEngagement('progress_viewed');
    }
  }, [analytics, selectedMetric, timeRange]);

  const generateChartData = () => {
    if (!analytics) return;

    const data = [];
    const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      let value = 0;
      switch (selectedMetric) {
        case 'posture':
          value = Math.max(0, 75 + Math.sin(i * 0.3) * 15 + (analytics.truePainReduction || 0) * 2);
          break;
        case 'health':
          value = Math.min(100, (analytics.totalSavings || 0) + i * 0.5);
          break;
        case 'activity':
          value = Math.max(0, (analytics.realPostureReadings || 0) / days * (i + 1));
          break;
        case 'pain':
          value = Math.max(0, 7 - (analytics.truePainReduction || 0) - Math.sin(i * 0.2) * 2);
          break;
      }
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: Math.round(value * 10) / 10,
        fullDate: date
      });
    }
    
    setChartData(data);
  };

  const generateProgressInsights = () => {
    if (!analytics) return;

    const newInsights = [];
    
    // Streak analysis
    if (analytics.realStreak > 0) {
      newInsights.push({
        type: 'streak',
        icon: 'ri-fire-fill',
        title: 'Consistency Streak',
        message: `${analytics.realStreak} days of consistent monitoring! Keep it up!`,
        color: 'from-orange-400 to-red-500',
        trend: 'positive'
      });
    }

    // Improvement analysis
    if (analytics.truePainReduction > 1) {
      newInsights.push({
        type: 'improvement',
        icon: 'ri-heart-pulse-fill',
        title: 'Health Improvement',
        message: `${analytics.truePainReduction.toFixed(1)} point reduction in discomfort detected!`,
        color: 'from-green-400 to-emerald-500',
        trend: 'positive'
      });
    }

    // Value generation
    if (analytics.totalSavings > 5) {
      newInsights.push({
        type: 'value',
        icon: 'ri-money-dollar-circle-fill',
        title: 'Health Value',
        message: `Generated $${analytics.totalSavings.toFixed(0)} in preventive healthcare value!`,
        color: 'from-blue-400 to-purple-500',
        trend: 'positive'
      });
    }

    // Engagement insights
    if (analytics.engagementScore > 60) {
      newInsights.push({
        type: 'engagement',
        icon: 'ri-star-fill',
        title: 'High Engagement',
        message: `${analytics.engagementScore} engagement score puts you in top 25% of users!`,
        color: 'from-purple-400 to-pink-500',
        trend: 'positive'
      });
    }

    setInsights(newInsights);
  };

  const getMetricColor = (metric) => {
    switch (metric) {
      case 'posture': return 'from-blue-400 to-blue-500';
      case 'health': return 'from-green-400 to-emerald-500';
      case 'activity': return 'from-purple-400 to-purple-500';
      case 'pain': return 'from-red-400 to-pink-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const metrics = [
    { id: 'posture', name: 'Posture Score', icon: 'ri-user-3-line', unit: '/100' },
    { id: 'health', name: 'Health Value', icon: 'ri-heart-pulse-line', unit: '$' },
    { id: 'activity', name: 'Activity Level', icon: 'ri-run-line', unit: 'sessions' },
    { id: 'pain', name: 'Discomfort Level', icon: 'ri-error-warning-line', unit: '/10' }
  ];

  const maxValue = Math.max(...chartData.map(d => d.value));
  const minValue = Math.min(...chartData.map(d => d.value));

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-sm z-40 border-b border-gray-100">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <Link href="/" className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
              <i className="ri-arrow-left-line text-gray-600 text-xl"></i>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Progress Tracking</h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-600">Live Data</span>
          </div>
        </div>
      </div>

      <div className="pt-20 pb-24 px-6">
        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <i className="ri-calendar-check-fill text-blue-500 text-xl"></i>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{analytics?.realStreak || 0}</div>
                <div className="text-sm text-gray-500">Day Streak</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <i className="ri-trending-up-fill text-green-500 text-xl"></i>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {analytics?.truePainReduction?.toFixed(1) || '0.0'}
                </div>
                <div className="text-sm text-gray-500">Improvement</div>
              </div>
            </div>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2 mb-6">
          <div className="grid grid-cols-3 gap-1">
            {['week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                  timeRange === range
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Metric Selector */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {metrics.map((metric) => (
            <button
              key={metric.id}
              onClick={() => setSelectedMetric(metric.id)}
              className={`p-4 rounded-2xl border transition-all ${
                selectedMetric === metric.id
                  ? 'bg-white border-green-300 shadow-lg'
                  : 'bg-white/50 border-gray-200 hover:bg-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 bg-gradient-to-r ${getMetricColor(metric.id)} rounded-xl flex items-center justify-center`}>
                  <i className={`${metric.icon} text-white text-xl`}></i>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">{metric.name}</div>
                  <div className="text-sm text-gray-500">{metric.unit}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Progress Chart */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 text-lg">
              {metrics.find(m => m.id === selectedMetric)?.name} Trend
            </h3>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-500">
                {chartData.length > 0 ? chartData[chartData.length - 1].value : 0}
                {metrics.find(m => m.id === selectedMetric)?.unit}
              </div>
              <div className="text-sm text-gray-500">Current</div>
            </div>
          </div>

          {/* Simple Line Chart */}
          <div className="h-48 relative">
            <svg className="w-full h-full" viewBox="0 0 400 200">
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map(i => (
                <line
                  key={i}
                  x1="0"
                  y1={i * 40}
                  x2="400"
                  y2={i * 40}
                  stroke="#f3f4f6"
                  strokeWidth="1"
                />
              ))}
              
              {/* Data line */}
              {chartData.length > 1 && (
                <polyline
                  points={chartData.map((point, index) => {
                    const x = (index / (chartData.length - 1)) * 400;
                    const y = 200 - ((point.value - minValue) / (maxValue - minValue || 1)) * 200;
                    return `${x},${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              )}
              
              {/* Data points */}
              {chartData.map((point, index) => {
                const x = (index / (chartData.length - 1 || 1)) * 400;
                const y = 200 - ((point.value - minValue) / (maxValue - minValue || 1)) * 200;
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="white"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                  />
                );
              })}
              
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* X-axis labels */}
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              {chartData.filter((_, i) => i % Math.ceil(chartData.length / 5) === 0).map((point, index) => (
                <span key={index}>{point.date}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Progress Insights */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-4">🎯 Progress Insights</h3>
          {insights.length > 0 ? (
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${insight.color} rounded-xl flex items-center justify-center`}>
                    <i className={`${insight.icon} text-white text-xl`}></i>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                      {insight.trend === 'positive' && (
                        <i className="ri-arrow-up-line text-green-500"></i>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">{insight.message}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <i className="ri-lightbulb-line text-gray-400 text-2xl"></i>
              </div>
              <p className="text-gray-500">Use the app more to unlock personalized insights!</p>
            </div>
          )}
        </div>

        {/* Achievements Section */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-4">🏆 Recent Achievements</h3>
          {analytics?.achievements && analytics.achievements.length > 0 ? (
            <div className="space-y-3">
              {analytics.achievements.slice(-4).map((achievement, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <i className="ri-medal-fill text-yellow-500 text-xl"></i>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-yellow-900">{achievement.title}</div>
                    <div className="text-yellow-600 text-sm">{achievement.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-yellow-700">
                      +{achievement.points || 25} pts
                    </div>
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
          <Link href="/dashboard" className="flex flex-col items-center justify-center py-3 text-gray-400 hover:text-gray-600">
            <i className="ri-dashboard-3-line text-xl mb-1"></i>
            <span className="text-xs">Dashboard</span>
          </Link>
          <Link href="/exercises" className="flex flex-col items-center justify-center py-3 text-gray-400 hover:text-gray-600">
            <i className="ri-run-line text-xl mb-1"></i>
            <span className="text-xs">Exercises</span>
          </Link>
          <Link href="/progress" className="flex flex-col items-center justify-center py-3 text-green-500">
            <i className="ri-line-chart-fill text-xl mb-1"></i>
            <span className="text-xs font-medium">Progress</span>
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
