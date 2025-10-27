import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from './firebase';

// ============================================
// 🔐 AUTHENTICATION SERVICE
// ============================================
// This file handles all Firebase authentication operations
// ============================================

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// ============================================
// PASSWORD VALIDATION
// ============================================
export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// ============================================
// SIGN UP WITH EMAIL & PASSWORD
// ============================================
export const signUpWithEmail = async (email, password, username) => {
  try {
    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors.join(', '));
    }

    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update display name
    await updateProfile(user, {
      displayName: username
    });

    // Send email verification
    await sendEmailVerification(user);

    // Create user profile in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: email,
      username: username,
      createdAt: serverTimestamp(),
      emailVerified: false,
      authProvider: 'email'
    });

    return {
      success: true,
      user: user,
      message: 'Account created! Please check your email to verify your account.'
    };
  } catch (error) {
    console.error('Sign up error:', error);
    return {
      success: false,
      error: getAuthErrorMessage(error)
    };
  }
};

// ============================================
// LOGIN WITH EMAIL & PASSWORD
// ============================================
export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Check if email is verified
    if (!user.emailVerified) {
      return {
        success: false,
        error: 'Please verify your email before logging in. Check your inbox for the verification link.',
        needsVerification: true,
        user: user
      };
    }

    return {
      success: true,
      user: user,
      message: 'Login successful!'
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: getAuthErrorMessage(error)
    };
  }
};

// ============================================
// SIGN IN WITH GOOGLE
// ============================================
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if user profile exists in Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));

    if (!userDoc.exists()) {
      // Create new user profile for Google sign-in
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        username: user.displayName || user.email.split('@')[0],
        createdAt: serverTimestamp(),
        emailVerified: true,
        authProvider: 'google',
        photoURL: user.photoURL
      });
    }

    return {
      success: true,
      user: user,
      message: 'Signed in with Google successfully!'
    };
  } catch (error) {
    console.error('Google sign-in error:', error);
    
    // Handle specific popup closed error
    if (error.code === 'auth/popup-closed-by-user') {
      return {
        success: false,
        error: 'Sign-in cancelled. Please try again.'
      };
    }
    
    return {
      success: false,
      error: getAuthErrorMessage(error)
    };
  }
};

// ============================================
// LOGOUT
// ============================================
export const logout = async () => {
  try {
    await signOut(auth);
    return {
      success: true,
      message: 'Logged out successfully'
    };
  } catch (error) {
    console.error('Logout error:', error);
    return {
      success: false,
      error: getAuthErrorMessage(error)
    };
  }
};

// ============================================
// SEND PASSWORD RESET EMAIL
// ============================================
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return {
      success: true,
      message: 'Password reset email sent! Check your inbox.'
    };
  } catch (error) {
    console.error('Password reset error:', error);
    return {
      success: false,
      error: getAuthErrorMessage(error)
    };
  }
};

// ============================================
// RESEND EMAIL VERIFICATION
// ============================================
export const resendVerificationEmail = async (user) => {
  try {
    await sendEmailVerification(user);
    return {
      success: true,
      message: 'Verification email sent! Check your inbox.'
    };
  } catch (error) {
    console.error('Resend verification error:', error);
    return {
      success: false,
      error: getAuthErrorMessage(error)
    };
  }
};

// ============================================
// GET USER PROFILE FROM FIRESTORE
// ============================================
export const getUserProfile = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return {
        success: true,
        profile: userDoc.data()
      };
    } else {
      return {
        success: false,
        error: 'User profile not found'
      };
    }
  } catch (error) {
    console.error('Get profile error:', error);
    return {
      success: false,
      error: getAuthErrorMessage(error)
    };
  }
};

// ============================================
// UPDATE USER PROFILE
// ============================================
export const updateUserProfile = async (uid, updates) => {
  try {
    const user = auth.currentUser;
    
    // Update display name in Firebase Auth if username changed
    if (updates.username && user) {
      await updateProfile(user, {
        displayName: updates.username
      });
    }

    // Update email in Firebase Auth if email changed
    if (updates.email && user && updates.email !== user.email) {
      await updateEmail(user, updates.email);
      await sendEmailVerification(user);
    }

    // Update Firestore profile
    await updateDoc(doc(db, 'users', uid), {
      ...updates,
      updatedAt: serverTimestamp()
    });

    return {
      success: true,
      message: 'Profile updated successfully!'
    };
  } catch (error) {
    console.error('Update profile error:', error);
    return {
      success: false,
      error: getAuthErrorMessage(error)
    };
  }
};

// ============================================
// AUTH STATE OBSERVER
// ============================================
export const observeAuthState = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// ============================================
// ERROR MESSAGE HELPER
// ============================================
const getAuthErrorMessage = (error) => {
  const errorMessages = {
    'auth/email-already-in-use': 'This email is already registered. Please login instead.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/weak-password': 'Password is too weak. Please use a stronger password.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/operation-not-allowed': 'This sign-in method is not enabled. Please contact support.',
    'auth/popup-blocked': 'Sign-in popup was blocked. Please allow popups for this site.',
    'auth/requires-recent-login': 'Please log out and log back in to perform this action.'
  };

  return errorMessages[error.code] || error.message || 'An error occurred. Please try again.';
};

export default {
  validatePassword,
  signUpWithEmail,
  loginWithEmail,
  signInWithGoogle,
  logout,
  resetPassword,
  resendVerificationEmail,
  getUserProfile,
  updateUserProfile,
  observeAuthState
};
