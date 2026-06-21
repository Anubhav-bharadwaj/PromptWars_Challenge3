import { useState, useEffect, useMemo } from 'react';
import { Target, Trophy, Star, Flame, Lock, CheckCircle2, Sparkles } from 'lucide-react';
import { useApp } from '../store/AppContext';
import Layout from '../components/Layout';
import ChallengeCard from '../components/ChallengeCard';
import BadgeCard from '../components/BadgeCard';

export default function Challenges() {
  const { state, dispatch } = useApp();
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const challenges = state.challenges || [];
  const badges = state.badges || [];

  const activeChallenges = useMemo(
    () => challenges.filter((c) => c.joined && !c.completed),
    [challenges]
  );

  const availableChallenges = useMemo(
    () => challenges.filter((c) => !c.joined && !c.completed),
    [challenges]
  );

  const completedChallenges = useMemo(
    () => challenges.filter((c) => c.completed),
    [challenges]
  );

  const earnedBadges = useMemo(
    () => badges.filter((b) => b.earned),
    [badges]
  );

  function handleJoinChallenge(challengeId) {
    dispatch({ type: 'JOIN_CHALLENGE', payload: challengeId });
  }

  function handleCompleteChallenge(challengeId) {
    dispatch({ type: 'COMPLETE_CHALLENGE', payload: challengeId });
  }

  function handleLeaveChallenge(challengeId) {
    dispatch({
      type: 'UPDATE_CHALLENGE_PROGRESS',
      payload: { id: challengeId, progress: 0 },
    });
    // Reset joined state — we need to dispatch a custom action or use JOIN toggle
    // For simplicity, we mark progress to 0 and un-join via a direct dispatch
    dispatch({ type: 'LEAVE_CHALLENGE', payload: challengeId });
  }

  function handleUpdateProgress(challengeId, progress) {
    dispatch({
      type: 'UPDATE_CHALLENGE_PROGRESS',
      payload: { id: challengeId, progress },
    });
  }

  return (
    <Layout>
      <div
        className={`transition-all duration-700 pb-12 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-emerald-400 to-teal-500 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Eco Challenges
            </h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 ml-13">
            Take on challenges, earn badges, and make a real impact
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-4 shadow-lg text-center">
            <div className="bg-emerald-100 dark:bg-emerald-900/30 w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Flame className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {activeChallenges.length}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Active</p>
          </div>
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-4 shadow-lg text-center">
            <div className="bg-blue-100 dark:bg-blue-900/30 w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {completedChallenges.length}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
          </div>
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-4 shadow-lg text-center">
            <div className="bg-purple-100 dark:bg-purple-900/30 w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Trophy className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {earnedBadges.length}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Badges</p>
          </div>
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-4 shadow-lg text-center">
            <div className="bg-amber-100 dark:bg-amber-900/30 w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Star className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {availableChallenges.length}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Available</p>
          </div>
        </div>

        {/* Challenge Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'active', label: 'Active Challenges', icon: Flame },
            { key: 'available', label: 'Available', icon: Target },
            { key: 'completed', label: 'Completed', icon: CheckCircle2 },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Active Challenges */}
        {activeTab === 'active' && (
          <div className="mb-10">
            {activeChallenges.length === 0 ? (
              <div className="text-center py-12 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                <div className="bg-gray-100 dark:bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
                  No active challenges
                </h3>
                <p className="text-sm text-gray-400 dark:text-gray-500 max-w-sm mx-auto mb-4">
                  Browse available challenges and join one to start making an impact! 🌱
                </p>
                <button
                  onClick={() => setActiveTab('available')}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  Browse Challenges
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeChallenges.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onJoin={handleJoinChallenge}
                    onComplete={handleCompleteChallenge}
                    onLeave={handleLeaveChallenge}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Available Challenges */}
        {activeTab === 'available' && (
          <div className="mb-10">
            {availableChallenges.length === 0 ? (
              <div className="text-center py-12 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                <div className="bg-gray-100 dark:bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
                  You&apos;ve joined all challenges!
                </h3>
                <p className="text-sm text-gray-400 dark:text-gray-500 max-w-sm mx-auto">
                  Amazing dedication! Check back soon for new eco challenges. 🏆
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableChallenges.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onJoin={handleJoinChallenge}
                    onComplete={handleCompleteChallenge}
                    onLeave={handleLeaveChallenge}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Completed Challenges */}
        {activeTab === 'completed' && (
          <div className="mb-10">
            {completedChallenges.length === 0 ? (
              <div className="text-center py-12 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                <div className="bg-gray-100 dark:bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
                  No completed challenges yet
                </h3>
                <p className="text-sm text-gray-400 dark:text-gray-500 max-w-sm mx-auto">
                  Keep working on your active challenges to complete them! 💪
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completedChallenges.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onJoin={handleJoinChallenge}
                    onComplete={handleCompleteChallenge}
                    onLeave={handleLeaveChallenge}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Badges Section */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-amber-400 to-orange-500 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/25">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Your Badges
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Collect badges by completing challenges and milestones
                </p>
              </div>
            </div>
            <div className="bg-emerald-100 dark:bg-emerald-900/30 px-4 py-2 rounded-full">
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                {earnedBadges.length}/{badges.length} earned
              </span>
            </div>
          </div>

          {badges.length === 0 ? (
            <div className="text-center py-12 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
              <div className="bg-gray-100 dark:bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-gray-300 dark:text-gray-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
                Badges will appear here
              </h3>
              <p className="text-sm text-gray-400 dark:text-gray-500 max-w-sm mx-auto">
                Complete challenges and reach milestones to earn badges! 🏅
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {badges.map((badge) => (
                <BadgeCard key={badge.id} badge={badge} />
              ))}
            </div>
          )}
        </div>

        {/* Motivational Footer */}
        <div className="mt-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-center text-white shadow-xl shadow-emerald-500/20">
          <h3 className="text-xl font-bold mb-2">Every Action Counts! 🌍</h3>
          <p className="text-sm opacity-90 max-w-lg mx-auto">
            Each challenge you complete helps reduce global carbon emissions. Together, we can make a difference.
            Keep going — the planet thanks you!
          </p>
        </div>
      </div>
    </Layout>
  );
}
