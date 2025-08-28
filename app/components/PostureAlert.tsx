
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface PostureAlertProps {
  isVisible: boolean;
  onClose: () => void;
  type: 'slouching' | 'vibration' | 'reminder';
  message?: string;
}

export default function PostureAlert({ isVisible, onClose, type, message }: PostureAlertProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(onClose, 300);
  };

  const handleExerciseRedirect = () => {
    handleClose();
    router.push('/exercises');
  };

  const getAlertConfig = () => {
    switch (type) {
      case 'slouching':
        return {
          icon: 'ri-alert-line',
          color: 'bg-amber-500',
          bgColor: 'bg-amber-50',
          textColor: 'text-amber-800',
          borderColor: 'border-amber-500',
          title: 'Posture Alert',
          defaultMessage: 'You\'ve been slouching. Time to sit up straight!'
        };
      case 'vibration':
        return {
          icon: 'ri-notification-line',
          color: 'bg-blue-500',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-500',
          title: 'Device Alert',
          defaultMessage: 'PostureGuard device vibration detected!'
        };
      case 'reminder':
        return {
          icon: 'ri-time-line',
          color: 'bg-green-500',
          bgColor: 'bg-green-50',
          textColor: 'text-green-800',
          borderColor: 'border-green-500',
          title: 'Posture Reminder',
          defaultMessage: 'Remember to check your posture!'
        };
      default:
        return {
          icon: 'ri-information-line',
          color: 'bg-gray-500',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-500',
          title: 'Notification',
          defaultMessage: 'Posture notification'
        };
    }
  };

  if (!isVisible) return null;

  const config = getAlertConfig();

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-6 pointer-events-none">
      <div className={`transform transition-all duration-300 pointer-events-auto ${
        isAnimating ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-[-20px] opacity-0 scale-95'
      }`}>
        <div className={`${config.bgColor} rounded-2xl p-6 shadow-2xl border-l-4 ${config.borderColor} max-w-sm w-full`}>
          <div className="flex items-start space-x-4">
            <div className={`w-10 h-10 ${config.color} rounded-full flex items-center justify-center flex-shrink-0`}>
              <i className={`${config.icon} text-white text-lg`}></i>
            </div>
            
            <div className="flex-1">
              <h3 className={`font-semibold ${config.textColor} mb-2`}>
                {config.title}
              </h3>
              <p className={`text-sm ${config.textColor.replace('800', '700')}`}>
                {message || config.defaultMessage}
              </p>
            </div>
            
            <button
              onClick={handleClose}
              className={`w-6 h-6 ${config.textColor.replace('800', '400')} hover:${config.textColor.replace('800', '600')} transition-colors flex items-center justify-center`}
            >
              <i className="ri-close-line"></i>
            </button>
          </div>
          
          <div className="mt-4 flex space-x-3">
            <button
              onClick={handleClose}
              className={`flex-1 ${config.color} text-white py-2 px-4 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity`}
            >
              Got it
            </button>
            
            {type === 'slouching' && (
              <button
                onClick={handleExerciseRedirect}
                className={`flex-1 bg-white border-2 ${config.borderColor} ${config.textColor} py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors`}
              >
                Stretch Now
              </button>
            )}
          </div>
          
          {/* Progress bar for auto-close */}
          <div className="mt-3 h-1 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white/60 rounded-full transition-all ease-linear"
              style={{
                width: isAnimating ? '0%' : '100%',
                transitionDuration: isAnimating ? '5000ms' : '0ms'
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
