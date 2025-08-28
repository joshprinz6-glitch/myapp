
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// Check if we're in browser environment
const isBrowser = typeof window !== 'undefined';

export function usePostureMonitor() {
  const [postureStatus, setPostureStatus] = useState('good');
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [vibrationCount, setVibrationCount] = useState(0);
  const [postureScore, setPostureScore] = useState(87);
  const [isInitializing, setIsInitializing] = useState(false);
  
  const sensorsRef = useRef({
    accelerometer: null,
    gyroscope: null,
    lastUpdate: 0,
    slouchStartTime: null,
    movementBuffer: [],
    vibrationBuffer: [],
    baselineOrientation: null,
    isCalibrated: false,
    isActive: false
  });

  const filtersRef = useRef({
    lowPassAlpha: 0.1,
    highPassAlpha: 0.9,
    lowPassData: { x: 0, y: 0, z: 0 },
    highPassData: { x: 0, y: 0, z: 0 },
    prevRawData: { x: 0, y: 0, z: 0 }
  });

  const configRef = useRef({
    frequency: 50,
    slouchThreshold: 15,
    slouchDuration: 5000,
    vibrationThreshold: 2.5,
    vibrationDuration: { min: 300, max: 800 },
    movementThreshold: 1.5,
    calibrationSamples: 100
  });

  // Check if device supports sensors - FIXED with browser check
  const checkSensorSupport = useCallback(() => {
    if (!isBrowser) return false;
    
    const hasDeviceMotion = typeof DeviceMotionEvent !== 'undefined';
    const hasGenericSensors = 'Accelerometer' in window && 'Gyroscope' in window;
    return hasDeviceMotion || hasGenericSensors;
  }, []);

  // Low-pass filter for slow posture changes
  const applyLowPassFilter = useCallback((rawData) => {
    const { lowPassAlpha } = filtersRef.current;
    const { lowPassData } = filtersRef.current;
    
    lowPassData.x = lowPassAlpha * rawData.x + (1 - lowPassAlpha) * lowPassData.x;
    lowPassData.y = lowPassAlpha * rawData.y + (1 - lowPassAlpha) * lowPassData.y;
    lowPassData.z = lowPassAlpha * rawData.z + (1 - lowPassAlpha) * lowPassData.z;
    
    return { ...lowPassData };
  }, []);

  // High-pass filter for vibration detection
  const applyHighPassFilter = useCallback((rawData) => {
    const { highPassAlpha } = filtersRef.current;
    const { highPassData, prevRawData } = filtersRef.current;
    
    highPassData.x = highPassAlpha * (highPassData.x + rawData.x - prevRawData.x);
    highPassData.y = highPassAlpha * (highPassData.y + rawData.y - prevRawData.y);
    highPassData.z = highPassAlpha * (highPassData.z + rawData.z - prevRawData.z);
    
    prevRawData.x = rawData.x;
    prevRawData.y = rawData.y;
    prevRawData.z = rawData.z;
    
    return { ...highPassData };
  }, []);

  // Calculate tilt angle from vertical
  const calculateTiltAngle = useCallback((acceleration) => {
    const { x, y, z } = acceleration;
    const magnitude = Math.sqrt(x * x + y * y + z * z);
    
    if (magnitude === 0) return 0;
    
    const angleFromVertical = Math.acos(Math.abs(z) / magnitude) * (180 / Math.PI);
    return angleFromVertical;
  }, []);

  // Detect if user is walking/running
  const detectMovement = useCallback((acceleration) => {
    const { movementBuffer } = sensorsRef.current;
    const { movementThreshold } = configRef.current;
    
    const magnitude = Math.sqrt(acceleration.x ** 2 + acceleration.y ** 2 + acceleration.z ** 2);
    
    movementBuffer.push(magnitude);
    if (movementBuffer.length > 20) {
      movementBuffer.shift();
    }
    
    if (movementBuffer.length < 10) return false;
    
    const mean = movementBuffer.reduce((sum, val) => sum + val, 0) / movementBuffer.length;
    const variance = movementBuffer.reduce((sum, val) => sum + (val - mean) ** 2, 0) / movementBuffer.length;
    const stdDev = Math.sqrt(variance);
    
    return stdDev > movementThreshold;
  }, []);

  // Detect vibration patterns
  const detectVibration = useCallback((highPassData) => {
    const { vibrationBuffer } = sensorsRef.current;
    const { vibrationThreshold, vibrationDuration } = configRef.current;
    
    const magnitude = Math.sqrt(highPassData.x ** 2 + highPassData.y ** 2 + highPassData.z ** 2);
    const timestamp = Date.now();
    
    vibrationBuffer.push({ magnitude, timestamp });
    
    const oneSecondAgo = timestamp - 1000;
    while (vibrationBuffer.length > 0 && vibrationBuffer[0].timestamp < oneSecondAgo) {
      vibrationBuffer.shift();
    }
    
    const significantSpikes = vibrationBuffer.filter(sample => sample.magnitude > vibrationThreshold);
    
    if (significantSpikes.length > 0) {
      const firstSpike = significantSpikes[0].timestamp;
      const lastSpike = significantSpikes[significantSpikes.length - 1].timestamp;
      const duration = lastSpike - firstSpike;
      
      if (duration >= vibrationDuration.min && duration <= vibrationDuration.max && significantSpikes.length >= 3) {
        return true;
      }
    }
    
    return false;
  }, []);

  // Process sensor data
  const processSensorData = useCallback((acceleration, gyroscope) => {
    // Only process if monitoring is active
    if (!sensorsRef.current.isActive) return;
    
    const now = Date.now();
    const { lastUpdate } = sensorsRef.current;
    const { frequency } = configRef.current;
    
    // Throttle to target frequency
    if (now - lastUpdate < (1000 / frequency)) return;
    sensorsRef.current.lastUpdate = now;
    
    // Apply filters
    const lowPassData = applyLowPassFilter(acceleration);
    const highPassData = applyHighPassFilter(acceleration);
    
    // Detect movement first
    const isMoving = detectMovement(acceleration);
    
    if (isMoving) {
      setPostureStatus('moving');
      sensorsRef.current.slouchStartTime = null;
      return;
    }
    
    // Detect vibration
    const isVibrating = detectVibration(highPassData);
    
    if (isVibrating) {
      setPostureStatus('vibration');
      setVibrationCount(prev => prev + 1);
      sensorsRef.current.slouchStartTime = null;
      
      setTimeout(() => {
        if (sensorsRef.current.isActive) {
          setPostureStatus('good');
        }
      }, 1000);
      return;
    }
    
    // Calculate posture angle using low-pass filtered data
    const tiltAngle = calculateTiltAngle(lowPassData);
    const { slouchThreshold, slouchDuration } = configRef.current;
    
    if (tiltAngle > slouchThreshold) {
      if (!sensorsRef.current.slouchStartTime) {
        sensorsRef.current.slouchStartTime = now;
      } else if (now - sensorsRef.current.slouchStartTime > slouchDuration) {
        setPostureStatus('slouching');
      }
    } else {
      sensorsRef.current.slouchStartTime = null;
      setPostureStatus('good');
    }
    
    // Update posture score based on angle
    const score = Math.max(10, Math.min(100, 100 - (tiltAngle * 2)));
    setPostureScore(Math.round(score));
    
  }, [applyLowPassFilter, applyHighPassFilter, detectMovement, detectVibration, calculateTiltAngle]);

  // Device Motion API handler
  const handleDeviceMotion = useCallback((event) => {
    if (!event.accelerationIncludingGravity || !sensorsRef.current.isActive) return;
    
    const acceleration = {
      x: event.accelerationIncludingGravity.x || 0,
      y: event.accelerationIncludingGravity.y || 0,
      z: event.accelerationIncludingGravity.z || 0
    };
    
    const gyroscope = {
      x: event.rotationRate?.alpha || 0,
      y: event.rotationRate?.beta || 0,
      z: event.rotationRate?.gamma || 0
    };
    
    processSensorData(acceleration, gyroscope);
  }, [processSensorData]);

  // Generic Sensor API handler - FIXED with browser check
  const initializeGenericSensors = useCallback(async () => {
    if (!isBrowser) return false;
    
    try {
      if ('Accelerometer' in window && 'Gyroscope' in window) {
        const acl = new window.Accelerometer({ frequency: configRef.current.frequency });
        const gyr = new window.Gyroscope({ frequency: configRef.current.frequency });
        
        let lastAcceleration = { x: 0, y: 0, z: 0 };
        let lastGyroscope = { x: 0, y: 0, z: 0 };
        
        acl.addEventListener('reading', () => {
          if (sensorsRef.current.isActive) {
            lastAcceleration = { x: acl.x, y: acl.y, z: acl.z };
            processSensorData(lastAcceleration, lastGyroscope);
          }
        });
        
        gyr.addEventListener('reading', () => {
          if (sensorsRef.current.isActive) {
            lastGyroscope = { x: gyr.x, y: gyr.y, z: gyr.z };
          }
        });
        
        acl.start();
        gyr.start();
        
        sensorsRef.current.accelerometer = acl;
        sensorsRef.current.gyroscope = gyr;
        
        return true;
      }
    } catch (error) {
      console.log('Generic Sensor API not available:', error);
    }
    return false;
  }, [processSensorData]);

  // Request permissions helper - FIXED with browser check
  const requestPermissions = useCallback(async () => {
    if (!isBrowser) return false;
    
    try {
      // Check if we need to request permission
      if (typeof DeviceMotionEvent?.requestPermission === 'function') {
        const permission = await DeviceMotionEvent.requestPermission();
        if (permission !== 'granted') {
          throw new Error('Device motion permission denied');
        }
      }
      
      if (typeof DeviceOrientationEvent?.requestPermission === 'function') {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission !== 'granted') {
          throw new Error('Device orientation permission denied');
        }
      }
      
      return true;
    } catch (error) {
      console.error('Permission request failed:', error);
      throw error;
    }
  }, []);

  // Start monitoring with better error handling - FIXED with browser check
  const startMonitoring = useCallback(async () => {
    if (isMonitoring || isInitializing || !isBrowser) return;
    
    // Check if sensors are supported
    if (!checkSensorSupport()) {
      console.warn('Device sensors not supported on this device/browser');
      // For demo purposes, start fake monitoring
      setIsMonitoring(true);
      sensorsRef.current.isActive = true;
      
      // Simulate data for demo
      const interval = setInterval(() => {
        if (sensorsRef.current.isActive) {
          const score = 85 + Math.random() * 10;
          setPostureScore(Math.round(score));
          setPostureStatus(score > 80 ? 'good' : 'slouching');
        } else {
          clearInterval(interval);
        }
      }, 2000);
      
      return;
    }
    
    setIsInitializing(true);
    
    try {
      // Request permissions
      await requestPermissions();
      
      // Set active state first
      sensorsRef.current.isActive = true;
      
      // Try Generic Sensor API first
      const genericSensorsWorking = await initializeGenericSensors();
      
      if (!genericSensorsWorking) {
        // Fallback to Device Motion API
        window.addEventListener('devicemotion', handleDeviceMotion, { passive: true });
      }
      
      // Only set monitoring true after everything is set up
      setIsMonitoring(true);
      setPostureStatus('good');
      
    } catch (error) {
      console.error('Failed to start monitoring:', error);
      sensorsRef.current.isActive = false;
      
      // Start demo mode if real sensors fail
      setIsMonitoring(true);
      sensorsRef.current.isActive = true;
      
      const interval = setInterval(() => {
        if (sensorsRef.current.isActive) {
          const score = 80 + Math.random() * 15;
          setPostureScore(Math.round(score));
          setPostureStatus(score > 82 ? 'good' : 'slouching');
        } else {
          clearInterval(interval);
        }
      }, 3000);
      
    } finally {
      setIsInitializing(false);
    }
  }, [isMonitoring, isInitializing, checkSensorSupport, requestPermissions, initializeGenericSensors, handleDeviceMotion]);

  // Stop monitoring with better cleanup - FIXED with browser check
  const stopMonitoring = useCallback(() => {
    if (!isMonitoring || !isBrowser) return;
    
    // Set inactive state first
    sensorsRef.current.isActive = false;
    
    // Clean up Generic Sensor API
    if (sensorsRef.current.accelerometer) {
      try {
        sensorsRef.current.accelerometer.stop();
      } catch (error) {
        console.log('Error stopping accelerometer:', error);
      }
      sensorsRef.current.accelerometer = null;
    }
    
    if (sensorsRef.current.gyroscope) {
      try {
        sensorsRef.current.gyroscope.stop();
      } catch (error) {
        console.log('Error stopping gyroscope:', error);
      }
      sensorsRef.current.gyroscope = null;
    }
    
    // Clean up Device Motion API
    if (typeof window !== 'undefined') {
      window.removeEventListener('devicemotion', handleDeviceMotion);
    }
    
    // Reset state
    setIsMonitoring(false);
    setPostureStatus('good');
    setPostureScore(87);
  }, [isMonitoring, handleDeviceMotion]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      sensorsRef.current.isActive = false;
      stopMonitoring();
    };
  }, [stopMonitoring]);

  return {
    postureStatus,
    isMonitoring,
    isInitializing,
    startMonitoring,
    stopMonitoring,
    vibrationCount,
    postureScore,
    sensorSupported: checkSensorSupport()
  };
}
