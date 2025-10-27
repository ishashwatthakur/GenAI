"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { observeAuthState, getUserProfile } from './authService';

// ============================================
// 🔐 AUTHENTICATION CONTEXT
// ============================================
// This context manages user authentication state across the entire app
// It automatically syncs with Firebase and provides:
// - currentUser: Firebase user object
// - userProfile: User data from Firestore (username, etc.)
// - loading: Whether auth state is still loading
// ============================================

const AuthContext = createContext({
  currentUser: null,
  userProfile: null,
  loading: true
});

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = observeAuthState(async (user) => {
      setCurrentUser(user);

      if (user) {
        // User is signed in, load their profile from Firestore
        const profileResult = await getUserProfile(user.uid);
        if (profileResult.success) {
          setUserProfile(profileResult.profile);
        }
      } else {
        // User is signed out
        setUserProfile(null);
      }

      setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
