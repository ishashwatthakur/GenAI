"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { updateUserProfile, logout } from '@/lib/authService';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const { currentUser, userProfile, loading } = useAuth();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/auth');
    }
  }, [currentUser, loading, router]);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        username: userProfile.username || currentUser?.displayName || '',
        email: userProfile.email || currentUser?.email || ''
      });
    }
  }, [userProfile, currentUser]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    const result = await updateUserProfile(currentUser.uid, {
      username: formData.username,
      email: formData.email
    });

    setIsLoading(false);

    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      setEditing(false);
      // Reload page to show updated data
      setTimeout(() => window.location.reload(), 1500);
    } else {
      setMessage({ type: 'error', text: result.error });
    }
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      router.push('/auth');
    }
  };

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const accountAge = userProfile?.createdAt ? 
    new Date(userProfile.createdAt.seconds * 1000).toLocaleDateString() : 
    'N/A';

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-20 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Your Profile
          </h1>
          <p className="text-gray-400">Manage your account information</p>
        </motion.div>

        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10"
        >
          {/* Profile Photo */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/10">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl font-bold">
              {formData.username?.charAt(0).toUpperCase() || currentUser.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{formData.username || 'User'}</h2>
              <p className="text-gray-400">{currentUser.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                Member since {accountAge}
              </p>
            </div>
          </div>

          {/* Message Display */}
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}
            >
              {message.text}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleUpdate}>
            {/* Username */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                disabled={!editing}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                required
              />
            </div>

            {/* Email */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!editing}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                required
              />
              {editing && (
                <p className="text-xs text-gray-400 mt-1">
                  Changing email will require re-verification
                </p>
              )}
            </div>

            {/* Email Verification Status */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Email Verification
              </label>
              <div className={`px-4 py-3 rounded-lg ${
                currentUser.emailVerified 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {currentUser.emailVerified ? '✅ Verified' : '⚠️ Not Verified'}
              </div>
            </div>

            {/* Auth Provider */}
            <div className="mb-8">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Sign-in Method
              </label>
              <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg">
                {userProfile?.authProvider === 'google' ? '🔐 Google' : '📧 Email/Password'}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              {!editing ? (
                <>
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                  >
                    Edit Profile
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg font-semibold hover:bg-white/10 transition-all"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setMessage({ type: '', text: '' });
                      // Reset form data
                      setFormData({
                        username: userProfile?.username || currentUser?.displayName || '',
                        email: userProfile?.email || currentUser?.email || ''
                      });
                    }}
                    className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg font-semibold hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </form>

          {/* Back to Home */}
          <button
            onClick={() => router.push('/')}
            className="w-full mt-6 px-6 py-3 text-gray-400 hover:text-white transition-all"
          >
            ← Back to Home
          </button>
        </motion.div>
      </div>
    </div>
  );
}
