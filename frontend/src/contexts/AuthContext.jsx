import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUser(user);
        // Fetch friends from Firestore
        try {
          const friendsRef = collection(db, 'users');
          const q = query(friendsRef, where('friends', 'array-contains', user.uid));
          const querySnapshot = await getDocs(q);
          const friendsList = querySnapshot.docs.map(doc => ({
            uid: doc.id,
            ...doc.data()
          }));
          setFriends(friendsList);
        } catch (error) {
          console.error('Error fetching friends:', error);
        }
      } else {
        setCurrentUser(null);
        setFriends([]);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    friends,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 