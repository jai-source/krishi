// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChange } from "../Firebase/authService";
import { getUserByUID } from "../Firebase/DBService";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      if (user) {
        setCurrentUser(user);
        
        // Get user data from Firestore
        let data = await getUserByUID(user.uid, "farmer");
        let type = "farmer";
        
        if (!data) {
          data = await getUserByUID(user.uid, "buyer");
          type = "buyer";
        }
        
        setUserData(data);
        setUserType(type);
      } else {
        setCurrentUser(null);
        setUserData(null);
        setUserType(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    userType,
    loading,
    setUserData,
    setUserType
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
