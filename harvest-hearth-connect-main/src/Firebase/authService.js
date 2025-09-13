// src/firebase/authService.js
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from "./localFirebase";
import { auth } from "./firebaseConfig";
import { addFarmer, addBuyer, getUserByUID } from "./DBService";
import { DEMO_MODE } from "./demoConfig";

// Register farmer
export async function registerFarmer(email, password, farmerData) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update user profile
    await updateProfile(user, {
      displayName: farmerData.fullName
    });
      // Add farmer data to Firestore
    const farmerDataWithUID = {
      ...farmerData,
      uid: user.uid,
      email: user.email
    };
    const result = await addFarmer(farmerDataWithUID);
    
    if (DEMO_MODE) {
      console.log("🔧 DEMO MODE: Farmer registration simulated successfully");
    }
    
    return { user, farmerId: result.id, userData: farmerDataWithUID };
  } catch (error) {
    if (DEMO_MODE) {
      console.log("🔧 DEMO MODE: Registration error simulated:", error.message);
    }
    throw new Error(error.message);
  }
}

// Register buyer
export async function registerBuyer(email, password, buyerData) {
  try {
    console.log('🔍 Starting buyer registration:', { email, buyerData });
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('✅ User created successfully:', user);
    
    // Update user profile
    await updateProfile(user, {
      displayName: buyerData.businessName || buyerData.contactPerson
    });
    console.log('✅ User profile updated');
    
    // Add buyer data to Firestore
    const buyerDataWithUID = {
      ...buyerData,
      uid: user.uid,
      email: user.email
    };
    console.log('🔍 Adding buyer data:', buyerDataWithUID);
    const result = await addBuyer(buyerDataWithUID);
    console.log('✅ Buyer data added:', result);
    
    if (DEMO_MODE) {
      console.log("🔧 DEMO MODE: Buyer registration simulated successfully");
    }
    
    return { user, buyerId: result.id, userData: buyerDataWithUID };
  } catch (error) {
    console.error('❌ Buyer registration error:', error);
    if (DEMO_MODE) {
      console.log("🔧 DEMO MODE: Registration error simulated:", error.message);
    }
    throw new Error(error.message);
  }
}

// Login user
export async function loginUser(email, password) {
  try {
    console.log('🔍 Login attempt for:', email);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('✅ Firebase auth successful for:', user.email);
    
    // Get user data from Firestore - check both farmer and buyer collections
    let userData = null;
    let userType = null;
    
    // Check if user is a farmer first
    console.log('🔍 Checking farmer data for UID:', user.uid);
    const farmerData = await getUserByUID(user.uid, "farmer");
    if (farmerData) {
      userData = farmerData;
      userType = "farmer";
      console.log('✅ User identified as farmer:', farmerData);
    } else {
      // Check if user is a buyer
      console.log('🔍 Checking buyer data for UID:', user.uid);
      const buyerData = await getUserByUID(user.uid, "buyer");
      if (buyerData) {
        userData = buyerData;
        userType = "buyer";
        console.log('✅ User identified as buyer:', buyerData);
      } else {
        // EMERGENCY FIX: Check localStorage directly for buyer data
        console.log('🚨 EMERGENCY: Checking localStorage for buyer data');
        const allBuyers = JSON.parse(localStorage.getItem('krishisettu-buyers') || '[]');
        const buyerByEmail = allBuyers.find(b => b.email === user.email);
        const buyerByUID = allBuyers.find(b => b.uid === user.uid);
        
        if (buyerByEmail || buyerByUID) {
          userData = buyerByEmail || buyerByUID;
          userType = "buyer";
          console.log('✅ EMERGENCY: Found buyer in localStorage:', userData);
        } else {
          // Check for farmers in localStorage too
          const allFarmers = JSON.parse(localStorage.getItem('krishisettu-farmers') || '[]');
          const farmerByEmail = allFarmers.find(f => f.email === user.email);
          const farmerByUID = allFarmers.find(f => f.uid === user.uid);
          
          if (farmerByEmail || farmerByUID) {
            userData = farmerByEmail || farmerByUID;
            userType = "farmer";
            console.log('✅ EMERGENCY: Found farmer in localStorage:', userData);
          }
        }
      }
    }
    
    // In demo mode, provide mock user data if not found
    if (DEMO_MODE && !userData) {
      userData = {
        fullName: "Demo User",
        email: user.email,
        uid: user.uid
      };
      userType = "farmer"; // Default for demo
      console.log("🔧 DEMO MODE: Using mock user data for login");    }
    
    if (!userData) {
      throw new Error("User data not found. Please register first.");
    }
      // CRITICAL FIX: Store current user data in localStorage for consistent access
    const currentUserData = { ...userData, userType, email: user.email, uid: user.uid };
    localStorage.setItem('krishisettu-current-user', JSON.stringify(currentUserData));
    console.log('✅ Current user stored in localStorage:', currentUserData);
    
    // ADDITIONAL FIX: Set emergency session flags based on user type
    if (userType === "buyer") {
      localStorage.setItem('FORCE_BUYER_SESSION', 'true');
      localStorage.removeItem('FORCE_FARMER_SESSION');
      console.log('✅ Buyer session flag set for routing');
    } else if (userType === "farmer") {
      localStorage.setItem('FORCE_FARMER_SESSION', 'true');
      localStorage.removeItem('FORCE_BUYER_SESSION');
      console.log('✅ Farmer session flag set for routing');
    }
    
    console.log('🎯 Login successful - Final result:', { userType, userData: !!userData });
    return { user, userData, userType };
  } catch (error) {
    if (DEMO_MODE) {
      console.log("🔧 DEMO MODE: Login error simulated:", error.message);
    }
    throw new Error(error.message);
  }
}

// Logout user
export async function logoutUser() {
  try {
    await signOut(auth);
    if (DEMO_MODE) {
      console.log("🔧 DEMO MODE: Logout simulated successfully");
    }
  } catch (error) {
    if (DEMO_MODE) {
      console.log("🔧 DEMO MODE: Logout error simulated:", error.message);
    }
    throw new Error(error.message);
  }
}

// Auth state observer
export function onAuthStateChange(callback) {
  return onAuthStateChanged(auth, callback);
}
