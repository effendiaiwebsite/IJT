import { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { Loader } from '../components/common';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create user profile in Firestore
  const createUserProfile = async (user, additionalData = {}) => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      const { email, displayName, photoURL } = user;
      const createdAt = serverTimestamp();

      try {
        await setDoc(userRef, {
          email,
          displayName: displayName || additionalData.displayName || 'Student',
          photoURL: photoURL || null,
          createdAt,
          lastActive: createdAt,
          ...additionalData,
        });

        return { email, displayName, photoURL, ...additionalData };
      } catch (error) {
        console.error('Error creating user profile:', error);
        throw error;
      }
    } else {
      // Update last active time
      await updateDoc(userRef, {
        lastActive: serverTimestamp(),
      });
      return snapshot.data();
    }
  };

  // Fetch user profile from Firestore
  const fetchUserProfile = async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      const snapshot = await getDoc(userRef);

      if (snapshot.exists()) {
        return snapshot.data();
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Sign up with email and password
  const signup = async (email, password, displayName) => {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);

      // Update display name
      if (displayName) {
        await updateProfile(result.user, { displayName });
      }

      // Create user profile in Firestore
      await createUserProfile(result.user, { displayName });

      return result.user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Login with email and password
  const login = async (email, password) => {
    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);

      // Update last active time
      await updateDoc(doc(db, 'users', result.user.uid), {
        lastActive: serverTimestamp(),
      });

      return result.user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Create or update user profile
      await createUserProfile(result.user);

      return result.user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      setError(null);

      // Update last active before logout
      if (currentUser) {
        await updateDoc(doc(db, 'users', currentUser.uid), {
          lastActive: serverTimestamp(),
        });
      }

      await signOut(auth);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (updates) => {
    try {
      setError(null);

      if (!currentUser) throw new Error('No user logged in');

      // Update Firebase Auth profile
      if (updates.displayName || updates.photoURL) {
        await updateProfile(currentUser, {
          displayName: updates.displayName,
          photoURL: updates.photoURL,
        });
      }

      // Update Firestore profile
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        ...updates,
        lastActive: serverTimestamp(),
      });

      // Refresh user profile
      const updatedProfile = await fetchUserProfile(currentUser.uid);
      setUserProfile(updatedProfile);

      return updatedProfile;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        // Fetch user profile from Firestore
        const profile = await fetchUserProfile(user.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    error,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
  };

  // Show loading screen while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
