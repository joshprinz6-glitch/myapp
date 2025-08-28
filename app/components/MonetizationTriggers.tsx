
'use client';

import { useState, useEffect } from 'react';
import { useCustomerData } from '../lib/userDataManager';

interface TriggerConfig {
  id: string;
  type: 'value' | 'community' | 'achievement' | 'progress' | 'support' | 'premium' | 'urgency';
  message: string;
  cta: string;
  duration: number;
  conditions: (analytics: any) => boolean;
  priority: number;
  minRealActivity: number;
  conversionValue: number; // Expected revenue impact
}
type Analytics = {
  totalSavings: number; // add other properties here if needed
};

export default function MonetizationTriggers() {
  const { analytics, recordEngagement, triggerUpgrade } = useCustomerData() as { analytics: Analytics | null, recordEngagement: any, triggerUpgrade: any };

  const [activeTrigger, setActiveTrigger] = useState<any>(null);
  const [dismissedTriggers, setDismissedTriggers] = useState<string[]>([]);

  // HIGH-CONVERSION triggers designed for maximum revenue
  const triggers: TriggerConfig[] = [
    {
      id: 'premium_limited_time',
      type: 'urgency',
      message: `🚀 EXCLUSIVE: Premium features just $9.99/month! Limited spots available - ${147 + Math.floor(Math.random() * 50)} users already upgraded!`,
      cta: 'Secure Premium Access',
      duration: 15000,
      minRealActivity: 25,
      conversionValue: 9.99,
      conditions: (analytics) => 
        analytics?.realPostureReadings >= 25 && 
        analytics?.totalSavings > 5,
      priority: 10
    },
    {
      id: 'value_demonstration_upgrade',
      type: 'value',
      message: `💰 You've earned $${analytics?.totalSavings?.toFixed(0) || '0'} in health value! Unlock UNLIMITED earning potential with Premium!`,
      cta: 'Upgrade & Earn More',
      duration: 12000,
      minRealActivity: 50,
      conversionValue: 19.99,
      conditions: (analytics) => 
        analytics?.totalSavings > 15 &&
        analytics?.realStreak >= 7,
      priority: 9
    },
    {
      id: 'social_proof_premium',
      type: 'community',
      message: `🏆 Join 847 premium members earning avg $127/month in health savings! Your streak qualifies you for VIP access.`,
      cta: 'Join Premium Community',
      duration: 18000,
      minRealActivity: 75,
      conversionValue: 14.99,
      conditions: (analytics) => 
        analytics?.realStreak >= 14 &&
        (analytics?.communityRank === 'top_25_percent' || analytics?.communityRank === 'top_10_percent'),
      priority: 9
    },
    {
      id: 'achievement_milestone_upgrade',
      type: 'achievement',
      message: `🎯 MILESTONE REACHED! ${analytics?.realPostureReadings || 0} sessions completed! Premium users earn 3x more rewards!`,
      cta: 'Triple My Rewards',
      duration: 10000,
      minRealActivity: 100,
      conversionValue: 12.99,
      conditions: (analytics) => 
        analytics?.realPostureReadings >= 100 &&
        analytics?.truePainReduction > 3,
      priority: 8
    },
    {
      id: 'early_adopter_special',
      type: 'premium',
      message: `⚡ FLASH OFFER: Premium at 50% OFF! Only for top performers like you. Expires in 24 hours!`,
      cta: 'Claim 50% Discount',
      duration: 20000,
      minRealActivity: 40,
      conversionValue: 7.50,
      conditions: (analytics) => 
        analytics?.engagementScore > 60 &&
        analytics?.realPostureReadings >= 40,
      priority: 10
    },
    {
      id: 'health_transformation_premium',
      type: 'value',
      message: `🌟 Your ${analytics?.truePainReduction?.toFixed(1) || '0'} point improvement is INCREDIBLE! Premium unlocks advanced health tracking!`,
      cta: 'Supercharge Results',
      duration: 14000,
      minRealActivity: 60,
      conversionValue: 16.99,
      conditions: (analytics) => 
        analytics?.truePainReduction > 2 &&
        analytics?.realStreak >= 10,
      priority: 8
    },
    {
      id: 'competitive_upgrade',
      type: 'community',
      message: `⚡ You're beating 89% of users! Premium members earn exclusive badges and compete for $500 monthly prizes!`,
      cta: 'Enter Competition',
      duration: 16000,
      minRealActivity: 80,
      conversionValue: 11.99,
      conditions: (analytics) => 
        analytics?.improvementPercentile > 75 &&
        analytics?.realStreak >= 5,
      priority: 7
    },
    {
      id: 'revenue_multiplier',
      type: 'value',
      message: `💎 PREMIUM BOOST: Turn your $${analytics?.totalSavings?.toFixed(0) || '0'} into $${(analytics?.totalSavings * 3)?.toFixed(0) || '0'}+ with advanced features!`,
      cta: 'Multiply My Value',
      duration: 13000,
      minRealActivity: 90,
      conversionValue: 24.99,
      conditions: (analytics) => 
        analytics?.totalSavings > 20 &&
        analytics?.communityRank === 'top_10_percent',
      priority: 9
    }
  ];

  useEffect(() => {
    if (!analytics || activeTrigger) return;

    const realActivity = analytics.realPostureReadings || 0;
    if (realActivity < 5) return; // Still need some baseline activity

    // Find HIGHEST VALUE triggers first
    const eligibleTriggers = triggers
      .filter(trigger => 
        !dismissedTriggers.includes(trigger.id) &&
        realActivity >= trigger.minRealActivity &&
        trigger.conditions(analytics)
      )
      .sort((a, b) => {
        // Sort by conversion value first, then priority
        if (b.conversionValue !== a.conversionValue) {
          return b.conversionValue - a.conversionValue;
        }
        return b.priority - a.priority;
      });

    if (eligibleTriggers.length > 0) {
      const selectedTrigger = eligibleTriggers[0];
      
      // Show high-value triggers faster
      const delay = selectedTrigger.conversionValue > 15 ? 
        Math.random() * 10000 + 5000 : // 5-15 seconds for high value
        Math.random() * 20000 + 10000; // 10-30 seconds for others
      
      setTimeout(() => {
        setActiveTrigger({
          ...selectedTrigger,
          triggeredAt: Date.now(),
          expiresAt: Date.now() + selectedTrigger.duration
        });
        
        if (recordEngagement) {
          recordEngagement('high_value_trigger_shown', {
            triggerId: selectedTrigger.id,
            type: selectedTrigger.type,
            conversionValue: selectedTrigger.conversionValue,
            realActivity: realActivity,
            engagementScore: analytics.engagementScore
          });
        }
      }, delay);
    }
  }, [analytics, activeTrigger, dismissedTriggers, recordEngagement]);

  // Auto-dismiss expired triggers
  useEffect(() => {
    if (!activeTrigger) return;

    const timeRemaining = activeTrigger.expiresAt - Date.now();
    if (timeRemaining <= 0) {
      handleDismiss();
      return;
    }

    const timeout = setTimeout(() => {
      handleDismiss();
    }, timeRemaining);

    return () => clearTimeout(timeout);
  }, [activeTrigger]);

  const handleAction = () => {
    if (!activeTrigger) return;
    
    if (recordEngagement) {
      recordEngagement('premium_trigger_clicked', {
        triggerId: activeTrigger.id,
        type: activeTrigger.type,
        conversionValue: activeTrigger.conversionValue,
        timeToClick: Date.now() - activeTrigger.triggeredAt,
        realActivity: analytics?.realPostureReadings || 0
      });
    }
    
    showPremiumUpgrade(activeTrigger);
    setActiveTrigger(null);
  };

  const showPremiumUpgrade = (trigger: any) => {
    const premiumModal = document.createElement('div');
    premiumModal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] flex items-center justify-center p-4';
    premiumModal.innerHTML = `
      <div class="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-scale-in">
        <div class="text-center">
          <div class="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
            <i class="ri-vip-crown-fill text-white text-3xl"></i>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">PostureGuard Premium</h3>
          <div class="text-green-600 font-bold mb-4">
            💰 ROI GUARANTEED: Earn back your investment in health savings!
          </div>
          
          <div class="space-y-3 mb-6 text-left">
            <div class="flex items-center space-x-3">
              <i class="ri-check-line text-green-500 text-lg"></i>
              <span class="text-sm font-medium">Advanced AI posture analysis</span>
            </div>
            <div class="flex items-center space-x-3">
              <i class="ri-check-line text-green-500 text-lg"></i>
              <span class="text-sm font-medium">Personalized health coach</span>
            </div>
            <div class="flex items-center space-x-3">
              <i class="ri-check-line text-green-500 text-lg"></i>
              <span class="text-sm font-medium">Premium exercise library</span>
            </div>
            <div class="flex items-center space-x-3">
              <i class="ri-check-line text-green-500 text-lg"></i>
              <span class="text-sm font-medium">Health savings multiplier (3x)</span>
            </div>
            <div class="flex items-center space-x-3">
              <i class="ri-check-line text-green-500 text-lg"></i>
              <span class="text-sm font-medium">Priority customer support</span>
            </div>
            <div class="flex items-center space-x-3">
              <i class="ri-check-line text-green-500 text-lg"></i>
              <span class="text-sm font-medium">Exclusive community access</span>
            </div>
          </div>
          
          <div class="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 mb-6">
            <div class="text-sm text-gray-600 mb-1">Your personalized price</div>
            <div class="flex items-center justify-center space-x-2">
              ${trigger.id.includes('discount') ? `
                <span class="text-lg text-gray-400 line-through">$${(trigger.conversionValue * 2).toFixed(2)}</span>
                <span class="text-3xl font-bold text-green-600">$${trigger.conversionValue.toFixed(2)}</span>
              ` : `
                <span class="text-3xl font-bold text-purple-600">$${trigger.conversionValue.toFixed(2)}</span>
              `}
              <span class="text-lg text-gray-500">/month</span>
            </div>
            ${trigger.id.includes('discount') ? '<div class="text-xs text-red-600 font-bold">⏰ Limited time: 50% OFF!</div>' : ''}
          </div>
          
          <div class="space-y-3">
            <button onclick="handlePremiumUpgrade('${trigger.conversionValue}')" class="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              🚀 Upgrade to Premium
            </button>
            <button onclick="this.closest('.fixed').remove();" class="w-full text-gray-500 py-2 text-sm">
              Maybe later
            </button>
          </div>
          
          <div class="mt-4 text-xs text-gray-500">
            💳 Cancel anytime • 7-day money-back guarantee
          </div>
        </div>
      </div>
    `;
    
    // Add upgrade handler
    (window as any).handlePremiumUpgrade = (price: string) => {
      premiumModal.remove();
      showPaymentSuccess(price);
    };
    
    document.body.appendChild(premiumModal);
  };

  const showPaymentSuccess = (price: string) => {
    const successModal = document.createElement('div');
    successModal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] flex items-center justify-center p-4';
    successModal.innerHTML = `
      <div class="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
        <div class="text-center">
          <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
            <i class="ri-check-line text-white text-4xl"></i>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">Welcome to Premium! 🎉</h3>
          <p class="text-gray-600 mb-6">Your $${price}/month subscription is now active. Get ready for incredible results!</p>
          <div class="bg-green-50 rounded-xl p-4 mb-6">
            <div class="text-sm font-bold text-green-800">🎯 Premium Benefits Unlocked:</div>
            <div class="text-sm text-green-700 mt-1">• 3x Health Savings Multiplier</div>
            <div class="text-sm text-green-700">• Advanced AI Analytics</div>
            <div class="text-sm text-green-700">• VIP Community Access</div>
          </div>
          <button onclick="this.closest('.fixed').remove(); window.location.reload();" class="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-bold text-lg">
            Start Premium Experience
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(successModal);
    
    // Track conversion
    if (recordEngagement) {
      recordEngagement('premium_conversion', {
        price: parseFloat(price),
        triggerId: activeTrigger?.id,
        conversionTime: Date.now() - (activeTrigger?.triggeredAt || Date.now())
      });
    }
  };

  const handleDismiss = () => {
    if (!activeTrigger) return;
    
    if (recordEngagement) {
      recordEngagement('premium_trigger_dismissed', {
        triggerId: activeTrigger.id,
        conversionValue: activeTrigger.conversionValue,
        timeToReact: Date.now() - activeTrigger.triggeredAt
      });
    }
    
    setDismissedTriggers(prev => [...prev, activeTrigger.id]);
    setActiveTrigger(null);
    
    // Re-enable triggers after 24 hours for high-value users
    setTimeout(() => {
      setDismissedTriggers(prev => prev.filter(id => id !== activeTrigger.id));
    }, 24 * 60 * 60 * 1000);
  };

  // Only show to users with some activity
  if (!activeTrigger || !analytics?.realPostureReadings || analytics.realPostureReadings < 5) {
    return null;
  }

  const timeRemaining = Math.max(0, activeTrigger.expiresAt - Date.now());
  const secondsRemaining = Math.floor(timeRemaining / 1000);

  const getTriggerStyle = (type: string) => {
    switch (type) {
      case 'premium':
      case 'urgency':
        return 'bg-gradient-to-r from-purple-500/95 via-pink-500/95 to-red-500/95 border-purple-300/30';
      case 'value':
        return 'bg-gradient-to-r from-green-500/95 to-emerald-600/95 border-green-300/30';
      case 'community':
        return 'bg-gradient-to-r from-blue-500/95 to-indigo-600/95 border-blue-300/30';
      case 'achievement':
        return 'bg-gradient-to-r from-yellow-500/95 to-orange-600/95 border-yellow-300/30';
      default:
        return 'bg-gradient-to-r from-purple-500/95 to-pink-600/95 border-purple-300/30';
    }
  };

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'premium':
      case 'urgency':
        return 'ri-vip-crown-fill';
      case 'value':
        return 'ri-money-dollar-circle-fill';
      case 'community':
        return 'ri-trophy-fill';
      case 'achievement':
        return 'ri-medal-fill';
      default:
        return 'ri-star-fill';
    }
  };

  return (
    <div className="fixed bottom-32 left-4 right-4 z-50 animate-slide-up">
      <div className={`${getTriggerStyle(activeTrigger.type)} backdrop-blur-md text-white rounded-2xl shadow-2xl border overflow-hidden`}>
        <div className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 bg-white/25 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
              <i className={`${getTriggerIcon(activeTrigger.type)} text-2xl`}></i>
            </div>
            <div className="flex-1">
              <p className="font-bold text-lg mb-4 leading-tight">
                {activeTrigger.message}
              </p>
              <div className="flex items-center justify-between">
                <button
                  onClick={handleAction}
                  className="bg-white/95 text-gray-900 px-8 py-4 rounded-xl font-bold text-base hover:bg-white transition-colors shadow-lg hover:scale-105 transform duration-200"
                >
                  {activeTrigger.cta}
                </button>
                
                <div className="text-right">
                  <div className="text-xs text-white/90 mb-1">Expires in</div>
                  <div className="font-bold text-xl">
                    {secondsRemaining}s
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleDismiss}
              className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <i className="ri-close-line text-lg"></i>
            </button>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="h-1 bg-white/20">
          <div 
            className="h-full bg-white/70 transition-all duration-1000 ease-linear"
            style={{ 
              width: `${(timeRemaining / activeTrigger.duration) * 100}%`
            }}
          ></div>
        </div>
        
        {/* High-value indicator */}
        <div className="absolute top-3 right-3">
          <div className="flex items-center space-x-1 bg-white/25 rounded-full px-3 py-1">
            <i className="ri-fire-fill text-yellow-300 text-sm"></i>
            <span className="text-xs font-bold">HOT DEAL</span>
          </div>
        </div>
        
        {/* Conversion value indicator */}
        <div className="absolute bottom-3 right-3">
          <div className="bg-green-500/90 rounded-full px-3 py-1">
            <span className="text-xs font-bold">${activeTrigger.conversionValue}/mo</span>
          </div>
        </div>
      </div>
    </div>
  );
}
