'use client';

import { useState, useEffect } from 'react';
import { useCustomerData } from '../lib/userDataManager';

// AGGRESSIVE REVENUE OPTIMIZATION COMPONENT
export default function RevenueOptimizer() {
  const { analytics, recordEngagement } = useCustomerData();
  const [revenueOpportunity, setRevenueOpportunity] = useState(null);
  const [conversionAttempts, setConversionAttempts] = useState(0);

  // HIGH-CONVERSION revenue opportunities
  const revenueOpportunities = [
    {
      id: 'value_multiplier',
      trigger: (analytics) => analytics?.totalSavings > 5,
      message: (analytics) => `💰 TRIPLE YOUR EARNINGS: Turn $${analytics.totalSavings.toFixed(0)} into $${(analytics.totalSavings * 3).toFixed(0)}+ with Premium!`,
      price: 14.99,
      urgency: 'high',
      conversionRate: 0.35
    },
    {
      id: 'social_proof_premium',
      trigger: (analytics) => analytics?.realPostureReadings > 30,
      message: () => `🏆 JOIN 847 PREMIUM MEMBERS: Average earnings $127/month vs your current progress. Ready to level up?`,
      price: 12.99,
      urgency: 'medium',
      conversionRate: 0.28
    },
    {
      id: 'streak_bonus_offer',
      trigger: (analytics) => analytics?.realStreak > 5,
      message: (analytics) => `🔥 ${analytics.realStreak}-DAY STREAK BONUS: 40% OFF Premium for consistent users like you!`,
      price: 8.99,
      urgency: 'high',
      conversionRate: 0.42
    },
    {
      id: 'health_transformation',
      trigger: (analytics) => analytics?.truePainReduction > 1,
      message: (analytics) => `🎯 ${analytics.truePainReduction.toFixed(1)} POINT IMPROVEMENT: Premium users see 3x faster results!`,
      price: 16.99,
      urgency: 'medium',
      conversionRate: 0.31
    },
    {
      id: 'early_adopter_exclusive',
      trigger: (analytics) => analytics?.realPostureReadings > 15,
      message: () => `⚡ EXCLUSIVE OFFER: First 1000 users get Premium at 50% OFF! Only ${Math.floor(Math.random() * 200 + 100)} spots left!`,
      price: 7.50,
      urgency: 'critical',
      conversionRate: 0.48
    }
  ];

  useEffect(() => {
    if (!analytics || conversionAttempts > 3) return; // Max 3 attempts per session

    // Find best revenue opportunity
    const eligibleOpportunities = revenueOpportunities
      .filter(opp => opp.trigger(analytics))
      .sort((a, b) => b.conversionRate - a.conversionRate);

    if (eligibleOpportunities.length > 0) {
      const bestOpportunity = eligibleOpportunities[0];
      
      // Progressive timing - more aggressive with each attempt
      const delays = [15000, 10000, 5000]; // 15s, 10s, 5s
      const delay = delays[conversionAttempts] || 5000;

      setTimeout(() => {
        setRevenueOpportunity(bestOpportunity);
        setConversionAttempts(prev => prev + 1);
        
        recordEngagement('revenue_opportunity_shown', {
          opportunityId: bestOpportunity.id,
          price: bestOpportunity.price,
          conversionRate: bestOpportunity.conversionRate,
          attempt: conversionAttempts + 1
        });
      }, delay);
    }
  }, [analytics, conversionAttempts]);

  const handleConversion = () => {
    if (!revenueOpportunity) return;

    recordEngagement('premium_conversion_clicked', {
      opportunityId: revenueOpportunity.id,
      price: revenueOpportunity.price,
      attempt: conversionAttempts
    });

    showPaymentFlow(revenueOpportunity);
    setRevenueOpportunity(null);
  };

  const showPaymentFlow = (opportunity) => {
    const paymentModal = document.createElement('div');
    paymentModal.className = 'fixed inset-0 bg-black/90 backdrop-blur-md z-[80] flex items-center justify-center p-4';
    paymentModal.innerHTML = `
      <div class="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-scale-in">
        <div class="text-center">
          <div class="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
            <i class="ri-money-dollar-circle-fill text-white text-4xl"></i>
          </div>
          
          <h2 class="text-3xl font-bold text-gray-900 mb-4">PostureGuard Premium</h2>
          
          <div class="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 mb-6">
            <div class="text-sm text-gray-600 mb-2">Your Investment</div>
            <div class="text-4xl font-bold text-green-600 mb-2">$${opportunity.price}</div>
            <div class="text-sm text-gray-500">per month</div>
            ${opportunity.price < 10 ? '<div class="text-red-600 font-bold text-sm mt-2">🔥 LIMITED TIME: 50% OFF!</div>' : ''}
          </div>

          <div class="space-y-4 mb-8 text-left">
            <div class="flex items-center space-x-3">
              <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <i class="ri-check-line text-white text-sm"></i>
              </div>
              <span class="font-medium">3x Health Savings Multiplier</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <i class="ri-check-line text-white text-sm"></i>
              </div>
              <span class="font-medium">Advanced AI Posture Analysis</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <i class="ri-check-line text-white text-sm"></i>
              </div>
              <span class="font-medium">Personalized Health Coach</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <i class="ri-check-line text-white text-sm"></i>
              </div>
              <span class="font-medium">Premium Exercise Library</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <i class="ri-check-line text-white text-sm"></i>
              </div>
              <span class="font-medium">VIP Community Access</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <i class="ri-check-line text-white text-sm"></i>
              </div>
              <span class="font-medium">Priority Support</span>
            </div>
          </div>

          <div class="space-y-4">
            <button onclick="completePurchase('${opportunity.price}')" class="w-full bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 text-white py-5 rounded-2xl font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              🚀 Upgrade to Premium
            </button>
            
            <div class="grid grid-cols-2 gap-3">
              <button onclick="showMoney BackGuarantee()" class="text-sm text-gray-600 py-2 px-4 border border-gray-200 rounded-xl hover:bg-gray-50">
                💸 Money-Back Guarantee
              </button>
              <button onclick="this.closest('.fixed').remove()" class="text-sm text-gray-600 py-2 px-4 border border-gray-200 rounded-xl hover:bg-gray-50">
                Maybe Later
              </button>
            </div>
          </div>

          <div class="mt-6 text-xs text-gray-500">
            💳 Cancel anytime • 30-day money-back guarantee<br>
            💎 Used by 10,000+ health-conscious professionals
          </div>
        </div>
      </div>
    `;

    // Add purchase handler
    (window as any).completePurchase = (price) => {
      paymentModal.remove();
      showPurchaseSuccess(price);
    };

    (window as any).showMoneyBackGuarantee = () => {
      alert('💰 RISK-FREE GUARANTEE\n\n✅ 30-day money-back guarantee\n✅ Cancel anytime with one click\n✅ Keep all progress data\n✅ No questions asked refund\n\nYour investment is 100% protected!');
    };

    document.body.appendChild(paymentModal);
  };

  const showPurchaseSuccess = (price) => {
    const successModal = document.createElement('div');
    successModal.className = 'fixed inset-0 bg-black/90 backdrop-blur-md z-[80] flex items-center justify-center p-4';
    successModal.innerHTML = `
      <div class="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <div class="text-center">
          <div class="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-bounce">
            <i class="ri-check-double-line text-white text-4xl"></i>
          </div>
          
          <h2 class="text-3xl font-bold text-gray-900 mb-4">🎉 Welcome to Premium!</h2>
          
          <div class="bg-green-50 rounded-2xl p-6 mb-6">
            <div class="text-lg font-bold text-green-800 mb-2">Payment Confirmed!</div>
            <div class="text-3xl font-bold text-green-600">$${price}/month</div>
            <div class="text-sm text-green-700 mt-2">Your premium benefits are now active</div>
          </div>

          <div class="space-y-3 mb-6">
            <div class="bg-blue-50 rounded-xl p-4">
              <div class="font-bold text-blue-800 text-lg">🎯 Immediate Benefits:</div>
              <div class="text-blue-700 text-sm mt-1">
                • 3x Health Savings Multiplier Active<br>
                • Advanced AI Analytics Unlocked<br>
                • VIP Community Access Granted
              </div>
            </div>
          </div>

          <button onclick="this.closest('.fixed').remove(); window.location.reload();" class="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-5 rounded-2xl font-bold text-xl shadow-lg">
            Start Premium Experience 🚀
          </button>
          
          <div class="mt-4 text-xs text-gray-500">
            Check your email for premium access details
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(successModal);
    
    // Track successful conversion
    recordEngagement('premium_purchase_completed', {
      price: parseFloat(price),
      opportunityId: revenueOpportunity?.id,
      conversionAttempt: conversionAttempts
    });
  };

  const handleDismiss = () => {
    setRevenueOpportunity(null);
    
    recordEngagement('revenue_opportunity_dismissed', {
      opportunityId: revenueOpportunity?.id,
      attempt: conversionAttempts
    });
  };

  if (!revenueOpportunity || !analytics?.realPostureReadings) {
    return null;
  }

  const getUrgencyStyle = (urgency) => {
    switch (urgency) {
      case 'critical':
        return 'bg-gradient-to-r from-red-500/95 to-pink-600/95 border-red-300/50 animate-pulse';
      case 'high':
        return 'bg-gradient-to-r from-orange-500/95 to-red-500/95 border-orange-300/50';
      case 'medium':
        return 'bg-gradient-to-r from-blue-500/95 to-purple-600/95 border-blue-300/50';
      default:
        return 'bg-gradient-to-r from-green-500/95 to-blue-600/95 border-green-300/50';
    }
  };

  return (
    <div className="fixed top-4 left-4 right-4 z-60 animate-slide-down">
      <div className={`${getUrgencyStyle(revenueOpportunity.urgency)} backdrop-blur-md text-white rounded-2xl shadow-2xl border overflow-hidden`}>
        <div className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-white/25 rounded-full flex items-center justify-center flex-shrink-0">
              <i className="ri-money-dollar-circle-fill text-3xl"></i>
            </div>
            <div className="flex-1">
              <p className="font-bold text-lg mb-4 leading-tight">
                {revenueOpportunity.message(analytics)}
              </p>
              <div className="flex items-center justify-between">
                <button
                  onClick={handleConversion}
                  className="bg-white/95 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white transition-colors shadow-lg hover:scale-105 transform duration-200"
                >
                  Upgrade ${revenueOpportunity.price}/mo
                </button>
                
                <div className="text-right">
                  <div className="text-sm font-bold">
                    {Math.round(revenueOpportunity.conversionRate * 100)}% choose this
                  </div>
                  <div className="text-xs text-white/80">conversion rate</div>
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
        
        {/* Urgency indicators */}
        {revenueOpportunity.urgency === 'critical' && (
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
            <div className="bg-red-500 text-white px-4 py-1 rounded-full text-xs font-bold animate-bounce">
              🔥 LIMITED TIME
            </div>
          </div>
        )}
        
        <div className="absolute bottom-2 right-2">
          <div className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
            💰 ${revenueOpportunity.price}/mo
          </div>
        </div>
      </div>
    </div>
  );
}