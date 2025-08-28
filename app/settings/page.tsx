
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCustomerData } from '../lib/userDataManager';

export default function SettingsPage() {
  const { analytics, recordEngagement } = useCustomerData();
  const [settings, setSettings] = useState({
    notifications: true,
    vibrationIntensity: 'medium',
    reminderFrequency: 'normal',
    theme: 'auto',
    dataSharing: true,
    premiumFeatures: false,
    autoStart: false,
    soundAlerts: true,
    postureThreshold: 70,
    breakReminders: true
  });
  const [showDataExport, setShowDataExport] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    loadSettings();
    recordEngagement('settings_viewed');
  }, []);

  const loadSettings = () => {
    try {
      const saved = localStorage.getItem('postureGuardSettings');
      if (saved) {
        setSettings({ ...settings, ...JSON.parse(saved) });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const saveSettings = (newSettings) => {
    try {
      localStorage.setItem('postureGuardSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
      recordEngagement('settings_changed', { setting: Object.keys(newSettings).pop() });
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
  };

  const exportData = () => {
    try {
      const exportData = {
        profile: analytics?.profile,
        stats: {
          realPostureReadings: analytics?.realPostureReadings,
          totalSavings: analytics?.totalSavings,
          realStreak: analytics?.realStreak,
          achievements: analytics?.achievements?.length
        },
        exportDate: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `postureguard-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      recordEngagement('data_exported');
      setShowDataExport(false);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const resetData = () => {
    try {
      localStorage.removeItem('postureGuardCustomer');
      localStorage.removeItem('postureGuardSettings');
      recordEngagement('data_reset');
      setShowResetConfirm(false);
      window.location.reload();
    } catch (error) {
      console.error('Reset failed:', error);
    }
  };

  const showPremiumUpgrade = () => {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
      <div class="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
        <div class="text-center">
          <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <i class="ri-vip-crown-fill text-white text-3xl"></i>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">Upgrade to Premium</h3>
          <p class="text-gray-600 mb-6">Unlock advanced features and maximize your health improvements</p>
          
          <div class="space-y-3 mb-6 text-left">
            <div class="flex items-center space-x-3">
              <i class="ri-check-line text-green-500 text-lg"></i>
              <span class="text-sm font-medium">Advanced AI analysis</span>
            </div>
            <div class="flex items-center space-x-3">
              <i class="ri-check-line text-green-500 text-lg"></i>
              <span class="text-sm font-medium">Personalized coaching</span>
            </div>
            <div class="flex items-center space-x-3">
              <i class="ri-check-line text-green-500 text-lg"></i>
              <span class="text-sm font-medium">Premium exercises</span>
            </div>
            <div class="flex items-center space-x-3">
              <i class="ri-check-line text-green-500 text-lg"></i>
              <span class="text-sm font-medium">Priority support</span>
            </div>
          </div>
          
          <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-6">
            <div class="text-3xl font-bold text-purple-600">$14.99</div>
            <div class="text-sm text-purple-700">per month</div>
          </div>
          
          <div class="space-y-3">
            <button onclick="this.closest('.fixed').remove();" class="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-bold">
              Upgrade Now
            </button>
            <button onclick="this.closest('.fixed').remove();" class="w-full text-gray-500 py-2 text-sm">
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-sm z-40 border-b border-gray-100">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <Link href="/" className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
              <i className="ri-arrow-left-line text-gray-600 text-xl"></i>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Settings</h1>
          </div>
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <i className="ri-settings-3-fill text-blue-500 text-xl"></i>
          </div>
        </div>
      </div>

      <div className="pt-20 pb-24 px-6">
        {/* Profile Section */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <i className="ri-user-fill text-white text-2xl"></i>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Health Profile</h3>
              <p className="text-gray-500 text-sm">
                {analytics?.customerId ? `User ID: ${analytics.customerId.slice(-8)}` : 'Guest User'}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-500">{analytics?.realPostureReadings || 0}</div>
              <div className="text-xs text-gray-500">Sessions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-500">{analytics?.realStreak || 0}</div>
              <div className="text-xs text-gray-500">Day Streak</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-500">${(analytics?.totalSavings || 0).toFixed(0)}</div>
              <div className="text-xs text-gray-500">Health Value</div>
            </div>
          </div>
        </div>

        {/* Monitoring Settings */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-4">🔔 Monitoring Settings</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900">Notifications</div>
                <div className="text-gray-500 text-sm">Get posture alerts</div>
              </div>
              <button
                onClick={() => handleSettingChange('notifications', !settings.notifications)}
                className={`w-12 h-6 rounded-full relative transition-colors ${
                  settings.notifications ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                  settings.notifications ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900">Auto-Start Monitoring</div>
                <div className="text-gray-500 text-sm">Start monitoring when app opens</div>
              </div>
              <button
                onClick={() => handleSettingChange('autoStart', !settings.autoStart)}
                className={`w-12 h-6 rounded-full relative transition-colors ${
                  settings.autoStart ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                  settings.autoStart ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-gray-900">Vibration Intensity</div>
                <div className="text-sm text-gray-500 capitalize">{settings.vibrationIntensity}</div>
              </div>
              <div className="flex space-x-2">
                {['low', 'medium', 'high'].map(intensity => (
                  <button
                    key={intensity}
                    onClick={() => handleSettingChange('vibrationIntensity', intensity)}
                    className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-colors ${
                      settings.vibrationIntensity === intensity
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {intensity.charAt(0).toUpperCase() + intensity.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-gray-900">Posture Threshold</div>
                <div className="text-sm text-gray-500">{settings.postureThreshold}/100</div>
              </div>
              <input
                type="range"
                min="50"
                max="90"
                value={settings.postureThreshold}
                onChange={(e) => handleSettingChange('postureThreshold', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Lenient</span>
                <span>Strict</span>
              </div>
            </div>
          </div>
        </div>

        {/* App Settings */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-4">⚙️ App Settings</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900">Sound Alerts</div>
                <div className="text-gray-500 text-sm">Audio notifications</div>
              </div>
              <button
                onClick={() => handleSettingChange('soundAlerts', !settings.soundAlerts)}
                className={`w-12 h-6 rounded-full relative transition-colors ${
                  settings.soundAlerts ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                  settings.soundAlerts ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900">Break Reminders</div>
                <div className="text-gray-500 text-sm">Periodic break notifications</div>
              </div>
              <button
                onClick={() => handleSettingChange('breakReminders', !settings.breakReminders)}
                className={`w-12 h-6 rounded-full relative transition-colors ${
                  settings.breakReminders ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                  settings.breakReminders ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-gray-900">Theme</div>
                <div className="text-sm text-gray-500 capitalize">{settings.theme}</div>
              </div>
              <div className="flex space-x-2">
                {['light', 'dark', 'auto'].map(theme => (
                  <button
                    key={theme}
                    onClick={() => handleSettingChange('theme', theme)}
                    className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-colors ${
                      settings.theme === theme
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Premium Section */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl text-white p-6 mb-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold mb-1">Premium Features</h3>
              <p className="text-purple-100 text-sm">Unlock advanced AI capabilities</p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
              <i className="ri-vip-crown-fill text-2xl"></i>
            </div>
          </div>
          
          <div className="bg-white/15 rounded-2xl p-4 mb-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">3x</div>
                <div className="text-purple-100 text-xs">Health Multiplier</div>
              </div>
              <div>
                <div className="text-2xl font-bold">AI</div>
                <div className="text-purple-100 text-xs">Personal Coach</div>
              </div>
            </div>
          </div>
          
          <button
            onClick={showPremiumUpgrade}
            className="w-full bg-white/20 hover:bg-white/30 text-white py-4 rounded-2xl font-bold transition-colors"
          >
            Upgrade to Premium
          </button>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-4">📊 Data Management</h3>
          
          <div className="space-y-3">
            <button
              onClick={() => setShowDataExport(true)}
              className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-2xl transition-colors"
            >
              <div className="flex items-center space-x-3">
                <i className="ri-download-line text-blue-500 text-xl"></i>
                <div className="text-left">
                  <div className="font-semibold text-blue-900">Export Data</div>
                  <div className="text-blue-600 text-sm">Download your health data</div>
                </div>
              </div>
              <i className="ri-arrow-right-s-line text-blue-500"></i>
            </button>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900">Data Sharing</div>
                <div className="text-gray-500 text-sm">Anonymous analytics</div>
              </div>
              <button
                onClick={() => handleSettingChange('dataSharing', !settings.dataSharing)}
                className={`w-12 h-6 rounded-full relative transition-colors ${
                  settings.dataSharing ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                  settings.dataSharing ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
              </button>
            </div>

            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 rounded-2xl transition-colors"
            >
              <div className="flex items-center space-x-3">
                <i className="ri-refresh-line text-red-500 text-xl"></i>
                <div className="text-left">
                  <div className="font-semibold text-red-900">Reset All Data</div>
                  <div className="text-red-600 text-sm">Clear all stored information</div>
                </div>
              </div>
              <i className="ri-arrow-right-s-line text-red-500"></i>
            </button>
          </div>
        </div>

        {/* App Info */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-4">ℹ️ App Information</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Version</span>
              <span className="font-semibold text-gray-900">3.1.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Build</span>
              <span className="font-semibold text-gray-900">2024.03.15</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">AI Engine</span>
              <span className="font-semibold text-gray-900">GPT-4 Enhanced</span>
            </div>
          </div>
        </div>
      </div>

      {/* Data Export Modal */}
      {showDataExport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <i className="ri-download-cloud-fill text-blue-500 text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Export Your Data</h3>
              <p className="text-gray-600 mb-6">Download your health data and progress in JSON format.</p>
              
              <div className="space-y-3">
                <button
                  onClick={exportData}
                  className="w-full bg-blue-500 text-white py-4 rounded-2xl font-semibold hover:bg-blue-600 transition-colors"
                >
                  Download Data
                </button>
                <button
                  onClick={() => setShowDataExport(false)}
                  className="w-full text-gray-500 py-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
                <i className="ri-alert-fill text-red-500 text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Reset All Data?</h3>
              <p className="text-gray-600 mb-6">This will permanently delete all your progress, achievements, and settings. This action cannot be undone.</p>
              
              <div className="space-y-3">
                <button
                  onClick={resetData}
                  className="w-full bg-red-500 text-white py-4 rounded-2xl font-semibold hover:bg-red-600 transition-colors"
                >
                  Yes, Reset Everything
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="w-full bg-gray-100 text-gray-700 py-4 rounded-2xl font-semibold hover:bg-gray-200 transition-colors"
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
          <Link href="/progress" className="flex flex-col items-center justify-center py-3 text-gray-400 hover:text-gray-600">
            <i className="ri-line-chart-line text-xl mb-1"></i>
            <span className="text-xs">Progress</span>
          </Link>
          <Link href="/settings" className="flex flex-col items-center justify-center py-3 text-gray-500">
            <i className="ri-settings-3-fill text-xl mb-1"></i>
            <span className="text-xs font-medium">Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
