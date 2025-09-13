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
  const [loading, setLoading] = useState(true);  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      try {        if (user) {
          setCurrentUser(user);
          
          // Add a small delay to ensure registration data is saved
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Get user data from Firestore - check both farmer and buyer collections
          let data = null;
          let type = null;
          
          // First check localStorage for recently registered users
          const currentUserData = JSON.parse(localStorage.getItem('krishisettu-current-user') || 'null');
          if (currentUserData && currentUserData.uid === user.uid) {
            console.log("🔍 AuthContext: Found current user in localStorage", currentUserData);
            data = currentUserData;
            type = currentUserData.userType;
          } else {
            // Check if user is a farmer
            const farmerData = await getUserByUID(user.uid, "farmer");
            if (farmerData) {
              data = farmerData;
              type = "farmer";
              console.log("🔍 AuthContext: User identified as farmer", { uid: user.uid, farmerData });
            } else {
              // Check if user is a buyer
              const buyerData = await getUserByUID(user.uid, "buyer");
              if (buyerData) {
                data = buyerData;
                type = "buyer";
                console.log("🔍 AuthContext: User identified as buyer", { uid: user.uid, buyerData });
              } else {
                console.log("⚠️ AuthContext: No user data found for", user.uid);
                
                // Emergency fallback: check localStorage collections
                const allBuyers = JSON.parse(localStorage.getItem('krishisettu-buyers') || '[]');
                const allFarmers = JSON.parse(localStorage.getItem('krishisettu-farmers') || '[]');
                
                const buyerByUID = allBuyers.find(b => b.uid === user.uid);
                const farmerByUID = allFarmers.find(f => f.uid === user.uid);
                
                if (buyerByUID) {
                  data = buyerByUID;
                  type = "buyer";
                  console.log("🚨 AuthContext: Emergency fallback - found buyer in localStorage", data);
                } else if (farmerByUID) {
                  data = farmerByUID;
                  type = "farmer";
                  console.log("🚨 AuthContext: Emergency fallback - found farmer in localStorage", data);
                }
              }
            }
          }
          
          setUserData(data);
          setUserType(type);
        } else {
          setCurrentUser(null);
          setUserData(null);
          setUserType(null);
        }
      } catch (error) {
        console.error("❌ AuthContext error:", error);
        setCurrentUser(null);
        setUserData(null);
        setUserType(null);
      } finally {
        setLoading(false);
      }
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
