/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useState, useEffect, createContext } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateEmail,
  updateProfile,
  updatePassword
} from 'firebase/auth';
import { auth } from '../firebase';

export type AuthContextProps = {
  currentUser: any;
  login: (email: any, password: any) => void;
  signup: (email: any, password: any) => void;
  logout: () => void;
  resetPassword: (email: any) => void;
  updateEmail: (email: any) => void;
  updatePassword: (password: any) => void;
  updateProfile: ({ name, photo }: any) => void;
};

const AuthContext = createContext<AuthContextProps>({
  login: (email, password) => {},
  signup: (email, password) => {},
  logout: () => {},
  resetPassword: (email) => {},
  updateEmail: (email) => {},
  updatePassword: (password) => {},
  currentUser: {},
  updateProfile: ({ name, photo }) => {}
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: any) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  function signup(email: any, password: any) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email: any, password: any) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  function resetPassword(email: any) {
    return sendPasswordResetEmail(auth, email);
  }

  function updateUserEmail(email: any) {
    return updateEmail(currentUser, email);
  }

  function updateUserProfile({ name, photoURL }: { name?: string; photoURL?: string }) {
    return updateProfile(currentUser, {
      displayName: name,
      photoURL
    });
  }

  function updateUserPassword(password: any) {
    return updatePassword(currentUser, password);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: any) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail: updateUserEmail,
    updatePassword: updateUserPassword,
    updateProfile: updateUserProfile
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
