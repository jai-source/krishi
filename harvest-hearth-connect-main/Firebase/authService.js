// src/firebase/authService.js
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { auth } from "./firebaseConfig";
import { addFarmer, addBuyer, getUserByUID } from "./DBService";

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
    const result = await addFarmer({
      ...farmerData,
      uid: user.uid,
      email: user.email
    });
    
    return { user, farmerId: result.id };
  } catch (error) {
    throw new Error(error.message);
  }
}

// Register buyer
export async function registerBuyer(email, password, buyerData) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update user profile
    await updateProfile(user, {
      displayName: buyerData.businessName || buyerData.contactPerson
    });
    
    // Add buyer data to Firestore
    const result = await addBuyer({
      ...buyerData,
      uid: user.uid,
      email: user.email
    });
    
    return { user, buyerId: result.id };
  } catch (error) {
    throw new Error(error.message);
  }
}

// Login user
export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get user data from Firestore
    let userData = await getUserByUID(user.uid, "farmer");
    let userType = "farmer";
    
    if (!userData) {
      userData = await getUserByUID(user.uid, "buyer");
      userType = "buyer";
    }
    
    return { user, userData, userType };
  } catch (error) {
    throw new Error(error.message);
  }
}

// Logout user
export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(error.message);
  }
}

// Auth state observer
export function onAuthStateChange(callback) {
  return onAuthStateChanged(auth, callback);
}
