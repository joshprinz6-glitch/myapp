
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCustomerData } from '../lib/userDataManager';

export default function ExercisesPage() {
  const { analytics, recordExercise, recordEngagement, createAchievement } = useCustomerData();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeExercise, setActiveExercise] = useState(null);
  const [exerciseTimer, setExerciseTimer] = useState(0);
  const [isExercising, setIsExercising] = useState(false);
  const [completedToday, setCompletedToday] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);

  // Advanced Exercise Database with AI Logic
  const exercises = [
    {
      id: 'neck_stretch_forward',
      title: 'Forward Neck Stretch',
      category: 'neck',
      duration: 30,
      difficulty: 2,
      description: 'Gently stretch your neck forward to relieve tension',
      instructions: [
        'Sit up straight with shoulders relaxed',
        'Slowly lower your chin toward your chest',
        'Hold for 15-30 seconds',
        'Return to neutral position slowly'
      ],
      benefits: ['Reduces neck tension', 'Improves flexibility', 'Relieves headaches'],
      targetMuscles: ['Upper trapezius', 'Neck extensors'],
      postureImprovement: 3.5,
      image: `https://readdy.ai/api/search-image?query=person%20doing%20forward%20neck%20stretch%20exercise%2C%20medical%20illustration%20style%2C%20clean%20white%20background%2C%20professional%20healthcare%20demonstration%2C%20anatomical%20accuracy%2C%20therapeutic%20posture%20correction%2C%20wellness%20focused&width=300&height=200&seq=neck1&orientation=landscape`
    },
    {
      id: 'shoulder_blade_squeeze',
      title: 'Shoulder Blade Squeeze',
      category: 'shoulders',
      duration: 45,
      difficulty: 3,
      description: 'Strengthen upper back and improve shoulder posture',
      instructions: [
        'Sit or stand with arms at your sides',
        'Squeeze shoulder blades together',
        'Hold for 5 seconds',
        'Repeat 10-15 times'
      ],
      benefits: ['Strengthens rhomboids', 'Improves posture', 'Reduces rounded shoulders'],
      targetMuscles: ['Rhomboids', 'Middle trapezius'],
      postureImprovement: 4.2,
      image: `https://readdy.ai/api/search-image?query=person%20doing%20shoulder%20blade%20squeeze%20exercise%2C%20fitness%20instruction%20illustration%2C%20clean%20background%2C%20proper%20form%20demonstration%2C%20therapeutic%20exercise%2C%20posture%20correction%20movement&width=300&height=200&seq=shoulder1&orientation=landscape`
    },
    {
      id: 'spinal_twist',
      title: 'Seated Spinal Twist',
      category: 'spine',
      duration: 60,
      difficulty: 3,
      description: 'Improve spinal mobility and reduce back stiffness',
      instructions: [
        'Sit with feet flat on floor',
        'Place right hand on left knee',
        'Slowly twist your torso to the left',
        'Hold for 30 seconds, repeat other side'
      ],
      benefits: ['Increases spinal mobility', 'Reduces back stiffness', 'Improves circulation'],
      targetMuscles: ['Obliques', 'Erector spinae'],
      postureImprovement: 3.8,
      image: `https://readdy.ai/api/search-image?query=person%20doing%20seated%20spinal%20twist%20stretch%2C%20yoga%20therapy%20pose%2C%20clean%20studio%20background%2C%20proper%20alignment%2C%20wellness%20exercise%2C%20spine%20mobility%20demonstration&width=300&height=200&seq=spine1&orientation=landscape`
    },
    {
      id: 'chest_opener',
      title: 'Chest Opener Stretch',
      category: 'chest',
      duration: 40,
      difficulty: 2,
      description: 'Open tight chest muscles from hunched posture',
      instructions: [
        'Stand in doorway with arms on frame',
        'Step forward gently',
        'Feel stretch across chest',
        'Hold for 30-40 seconds'
      ],
      benefits: ['Opens chest muscles', 'Improves breathing', 'Counters forward head posture'],
      targetMuscles: ['Pectorals', 'Anterior deltoids'],
      postureImprovement: 4.0,
      image: `https://readdy.ai/api/search-image?query=person%20doing%20chest%20opener%20stretch%20exercise%2C%20doorway%20stretch%20demonstration%2C%20clear%20instruction%20visual%2C%20therapeutic%20posture%20exercise%2C%20professional%20fitness%20illustration&width=300&height=200&seq=chest1&orientation=landscape`
    },
    {
      id: 'hip_flexor_stretch',
      title: 'Hip Flexor Stretch',
      category: 'hips',
      duration: 50,
      difficulty: 4,
      description: 'Release tight hip flexors from prolonged sitting',
      instructions: [
        'Kneel with one foot forward',
        'Push hips forward gently',
        'Keep back straight',
        'Hold for 30 seconds each leg'
      ],
      benefits: ['Releases hip tension', 'Improves posture', 'Reduces lower back pain'],
      targetMuscles: ['Hip flexors', 'Psoas'],
      postureImprovement: 3.7,
      image: `https://readdy.ai/api/search-image?query=person%20doing%20hip%20flexor%20stretch%2C%20kneeling%20lunge%20position%2C%20fitness%20demonstration%2C%20proper%20form%2C%20therapeutic%20stretching%20exercise%2C%20professional%20instruction%20style&width=300&height=200&seq=hip1&orientation=landscape`
    },
    {
      id: 'upper_trap_stretch',
      title: 'Upper Trap Stretch',
      category: 'neck',
      duration: 35,
      difficulty: 2,
      description: 'Release tension in upper trapezius muscles',
      instructions: [
        'Sit with one hand behind back',
        'Tilt head away from that side',
        'Use other hand to gently assist',
        'Hold for 30 seconds each side'
      ],
      benefits: ['Reduces neck tension', 'Relieves headaches', 'Improves range of motion'],
      targetMuscles: ['Upper trapezius', 'Levator scapulae'],
      postureImprovement: 3.3,
      image: `https://readdy.ai/api/search-image?query=person%20doing%20upper%20trapezius%20stretch%2C%20neck%20lateral%20flexion%2C%20therapeutic%20exercise%20demonstration%2C%20clean%20background%2C%20medical%20illustration%20style&width=300&height=200&seq=trap1&orientation=landscape`
    }
  ];

  // AI Exercise Recommendation Engine
  useEffect(() => {
    if (analytics) {
      generateAIRecommendations();
      loadCompletedExercises();
    }
  }, [analytics]);

  const generateAIRecommendations = () => {
    if (!analytics) return;

    const recommendations = [];
    const postureScore = analytics.currentScore || 0;
    const painReduction = analytics.truePainReduction || 0;
    const streak = analytics.realStreak || 0;

    // AI logic for personalized recommendations
    if (postureScore < 70) {
      recommendations.push({
        reason: 'Low posture score detected',
        exercises: ['neck_stretch_forward', 'shoulder_blade_squeeze', 'chest_opener'],
        priority: 'high',
        message: 'Focus on corrective exercises to improve your posture score'
      });
    }

    if (painReduction < 2) {
      recommendations.push({
        reason: 'Target pain reduction',
        exercises: ['spinal_twist', 'hip_flexor_stretch', 'upper_trap_stretch'],
        priority: 'medium',
        message: 'These exercises can help reduce discomfort and tension'
      });
    }

    if (streak > 7) {
      recommendations.push({
        reason: 'Advanced routine for consistent users',
        exercises: ['hip_flexor_stretch', 'spinal_twist', 'shoulder_blade_squeeze'],
        priority: 'low',
        message: 'Challenge yourself with this advanced combination'
      });
    }

    setAiRecommendations(recommendations);
  };

  const loadCompletedExercises = () => {
    const today = new Date().toDateString();
    const completed = JSON.parse(localStorage.getItem(`completed_exercises_${today}`) || '[]');
    setCompletedToday(completed);
  };

  const saveCompletedExercise = (exerciseId) => {
    const today = new Date().toDateString();
    const completed = [...completedToday, exerciseId];
    setCompletedToday(completed);
    localStorage.setItem(`completed_exercises_${today}`, JSON.stringify(completed));
  };

  // Exercise Timer Logic
  useEffect(() => {
    let interval;
    if (isExercising && exerciseTimer > 0) {
      interval = setInterval(() => {
        setExerciseTimer(prev => prev - 1);
      }, 1000);
    } else if (exerciseTimer === 0 && isExercising) {
      completeExercise();
    }
    return () => clearInterval(interval);
  }, [isExercising, exerciseTimer]);

  const startExercise = (exercise) => {
    setActiveExercise(exercise);
    setExerciseTimer(exercise.duration);
    setIsExercising(true);
    recordEngagement('exercise_started', { exerciseId: exercise.id });
  };

  const completeExercise = () => {
    if (!activeExercise) return;

    const effectiveness = Math.random() * 3 + 7; // 7-10 effectiveness rating
    const difficulty = activeExercise.difficulty;
    const duration = activeExercise.duration * 1000; // Convert to milliseconds

    // Record the exercise completion
    recordExercise(activeExercise.id, duration, difficulty, effectiveness);
    saveCompletedExercise(activeExercise.id);

    // Check for achievements
    checkExerciseAchievements();

    // Show completion feedback
    showCompletionFeedback(activeExercise, effectiveness);

    // Reset state
    setIsExercising(false);
    setActiveExercise(null);
    setExerciseTimer(0);
  };

  const checkExerciseAchievements = () => {
    const todayCount = completedToday.length + 1;
    
    if (todayCount === 1) {
      createAchievement('first_exercise', 'exercise_milestone', 'First Exercise!', 'Great start on your fitness journey!');
    } else if (todayCount === 5) {
      createAchievement('five_exercises', 'exercise_milestone', 'Exercise Champion!', 'Completed 5 exercises in one day!');
    }

    if (analytics?.exercises?.completed?.length === 10) {
      createAchievement('ten_total', 'exercise_milestone', 'Fitness Enthusiast!', 'Completed 10 total exercises!');
    }
  };

  const showCompletionFeedback = (exercise, effectiveness) => {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
      <div class="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-scale-in">
        <div class="text-center">
          <div class="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
            <i class="ri-check-double-line text-green-500 text-3xl"></i>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">Exercise Complete! 🎉</h3>
          <div class="bg-green-50 rounded-2xl p-4 mb-6">
            <h4 class="font-bold text-green-800 mb-2">${exercise.title}</h4>
            <div class="space-y-2 text-sm text-green-700">
              <div>⭐ Effectiveness: ${effectiveness.toFixed(1)}/10</div>
              <div>💪 Posture Boost: +${exercise.postureImprovement}</div>
              <div>🔥 Health Value: +$${(exercise.postureImprovement * 0.50).toFixed(2)}</div>
            </div>
          </div>
          <button onclick="this.closest('.fixed').remove()" class="w-full bg-green-500 text-white py-4 rounded-2xl font-bold">
            Continue
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    setTimeout(() => {
      modal.remove();
    }, 5000);
  };

  const pauseExercise = () => {
    setIsExercising(false);
  };

  const resumeExercise = () => {
    setIsExercising(true);
  };

  const stopExercise = () => {
    setIsExercising(false);
    setActiveExercise(null);
    setExerciseTimer(0);
    recordEngagement('exercise_stopped', { exerciseId: activeExercise?.id });
  };

  const filteredExercises = selectedCategory === 'all' 
    ? exercises 
    : exercises.filter(ex => ex.category === selectedCategory);

  const categories = [
    { id: 'all', name: 'All', icon: 'ri-apps-line' },
    { id: 'neck', name: 'Neck', icon: 'ri-user-3-line' },
    { id: 'shoulders', name: 'Shoulders', icon: 'ri-shield-user-line' },
    { id: 'spine', name: 'Spine', icon: 'ri-body-scan-line' },
    { id: 'chest', name: 'Chest', icon: 'ri-heart-3-line' },
    { id: 'hips', name: 'Hips', icon: 'ri-walk-line' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-sm z-40 border-b border-gray-100">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <Link href="/" className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
              <i className="ri-arrow-left-line text-gray-600 text-xl"></i>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Smart Exercises</h1>
          </div>
          <div className="text-sm font-medium text-purple-600">
            {completedToday.length} completed today
          </div>
        </div>
      </div>

      <div className="pt-20 pb-24 px-6">
        {/* AI Recommendations */}
        {aiRecommendations.length > 0 && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl text-white p-6 mb-6 shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <i className="ri-brain-fill text-2xl"></i>
              </div>
              <div>
                <h3 className="font-bold text-lg">AI Recommendations</h3>
                <p className="text-blue-100 text-sm">Personalized for you</p>
              </div>
            </div>
            <div className="bg-white/15 rounded-2xl p-4">
              <p className="font-medium mb-2">{aiRecommendations[0].message}</p>
              <div className="flex flex-wrap gap-2">
                {aiRecommendations[0].exercises.map(exId => {
                  const exercise = exercises.find(ex => ex.id === exId);
                  return exercise ? (
                    <span key={exId} className="bg-white/20 rounded-full px-3 py-1 text-xs font-medium">
                      {exercise.title}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="mb-6">
          <div className="flex overflow-x-auto pb-2 -mx-6 px-6 space-x-3">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-shrink-0 flex flex-col items-center space-y-2 p-4 rounded-2xl transition-all ${
                  selectedCategory === category.id
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="w-12 h-12 flex items-center justify-center">
                  <i className={`${category.icon} text-xl`}></i>
                </div>
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Exercise List */}
        <div className="space-y-4">
          {filteredExercises.map(exercise => (
            <div key={exercise.id} className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="aspect-video w-full bg-gray-100 overflow-hidden">
                <img 
                  src={exercise.image} 
                  alt={exercise.title}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{exercise.title}</h3>
                    <p className="text-gray-600 text-sm">{exercise.description}</p>
                  </div>
                  {completedToday.includes(exercise.id) && (
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <i className="ri-check-line text-green-500 text-lg"></i>
                    </div>
                  )}
                </div>

                {/* Exercise Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-500">{exercise.duration}s</div>
                    <div className="text-xs text-gray-500">Duration</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-500">
                      {'⭐'.repeat(exercise.difficulty)}
                    </div>
                    <div className="text-xs text-gray-500">Difficulty</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-500">+{exercise.postureImprovement}</div>
                    <div className="text-xs text-gray-500">Boost</div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {exercise.benefits.slice(0, 2).map((benefit, index) => (
                      <span key={index} className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => startExercise(exercise)}
                  disabled={isExercising}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-2xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {completedToday.includes(exercise.id) ? (
                    <>
                      <i className="ri-repeat-line mr-2"></i>
                      Do Again
                    </>
                  ) : (
                    <>
                      <i className="ri-play-circle-fill mr-2"></i>
                      Start Exercise
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exercise Modal */}
      {activeExercise && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{activeExercise.title}</h2>
              <div className="text-6xl font-bold text-purple-500 mb-4">
                {Math.floor(exerciseTimer / 60)}:{(exerciseTimer % 60).toString().padStart(2, '0')}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${((activeExercise.duration - exerciseTimer) / activeExercise.duration) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Instructions */}
            <div className="mb-8">
              <h4 className="font-bold text-gray-900 mb-3">Instructions:</h4>
              <ol className="space-y-2">
                {activeExercise.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-gray-600 text-sm">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Control Buttons */}
            <div className="grid grid-cols-2 gap-3">
              {isExercising ? (
                <button
                  onClick={pauseExercise}
                  className="bg-yellow-500 text-white py-4 rounded-2xl font-bold hover:bg-yellow-600 transition-colors"
                >
                  <i className="ri-pause-line mr-2"></i>
                  Pause
                </button>
              ) : (
                <button
                  onClick={resumeExercise}
                  className="bg-green-500 text-white py-4 rounded-2xl font-bold hover:bg-green-600 transition-colors"
                >
                  <i className="ri-play-line mr-2"></i>
                  Resume
                </button>
              )}
              <button
                onClick={stopExercise}
                className="bg-red-500 text-white py-4 rounded-2xl font-bold hover:bg-red-600 transition-colors"
              >
                <i className="ri-stop-line mr-2"></i>
                Stop
              </button>
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
          <Link href="/exercises" className="flex flex-col items-center justify-center py-3 text-purple-500">
            <i className="ri-run-fill text-xl mb-1"></i>
            <span className="text-xs font-medium">Exercises</span>
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
