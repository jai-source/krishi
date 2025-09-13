// src/firebase/dbService.js
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  arrayUnion
} from "./localFirebase";
import { db } from "./firebaseConfig";

// Add farmer details
export async function addFarmer(farmerData) {
  try {
    console.log('🔍 Adding farmer to database:', farmerData);
    const docRef = await addDoc(collection(db, "farmers"), {
      ...farmerData,
      userType: "farmer",
      isVerified: false,
      status: "active",
      createdAt: serverTimestamp(),
    });
    console.log('✅ Farmer added successfully with ID:', docRef.id);
    
    // CRITICAL FIX: Also store in localStorage for login fallback
    const farmersStorage = JSON.parse(localStorage.getItem('krishisettu-farmers') || '[]');
    const farmerWithDocId = { ...farmerData, id: docRef.id, userType: "farmer" };
    farmersStorage.push(farmerWithDocId);
    localStorage.setItem('krishisettu-farmers', JSON.stringify(farmersStorage));
    console.log('✅ Farmer also stored in localStorage for emergency fallback');
    
    return { id: docRef.id };
  } catch (error) {
    console.error('❌ Error adding farmer:', error);
    
    // EMERGENCY FALLBACK: If Firebase fails, at least store in localStorage
    try {
      const farmersStorage = JSON.parse(localStorage.getItem('krishisettu-farmers') || '[]');
      const emergencyFarmer = { ...farmerData, id: 'emergency-' + Date.now(), userType: "farmer" };
      farmersStorage.push(emergencyFarmer);
      localStorage.setItem('krishisettu-farmers', JSON.stringify(farmersStorage));
      console.log('🚨 EMERGENCY: Farmer stored in localStorage only due to Firebase error');
      return { id: emergencyFarmer.id };
    } catch (localStorageError) {
      console.error('❌ Emergency localStorage save failed:', localStorageError);
      throw new Error(error.message);
    }
  }
}

// Add buyer details
export async function addBuyer(buyerData) {
  try {
    console.log('🔍 Adding buyer to database:', buyerData);
    const docRef = await addDoc(collection(db, "buyers"), {
      ...buyerData,
      userType: "buyer",
      isVerified: false,
      status: "active",
      createdAt: serverTimestamp(),
    });
    console.log('✅ Buyer added successfully with ID:', docRef.id);
    
    // CRITICAL FIX: Also store in localStorage for login fallback
    const buyersStorage = JSON.parse(localStorage.getItem('krishisettu-buyers') || '[]');
    const buyerWithDocId = { ...buyerData, id: docRef.id, userType: "buyer" };
    buyersStorage.push(buyerWithDocId);
    localStorage.setItem('krishisettu-buyers', JSON.stringify(buyersStorage));
    console.log('✅ Buyer also stored in localStorage for emergency fallback');
    
    return { id: docRef.id };
  } catch (error) {
    console.error('❌ Error adding buyer:', error);
    
    // EMERGENCY FALLBACK: If Firebase fails, at least store in localStorage
    try {
      const buyersStorage = JSON.parse(localStorage.getItem('krishisettu-buyers') || '[]');
      const emergencyBuyer = { ...buyerData, id: 'emergency-' + Date.now(), userType: "buyer" };
      buyersStorage.push(emergencyBuyer);
      localStorage.setItem('krishisettu-buyers', JSON.stringify(buyersStorage));
      console.log('🚨 EMERGENCY: Buyer stored in localStorage only due to Firebase error');
      return { id: emergencyBuyer.id };
    } catch (localStorageError) {
      console.error('❌ Emergency localStorage save failed:', localStorageError);
      throw new Error(error.message);
    }
  }
}

// Get all farmers
export async function getFarmers() {
  try {
    const querySnapshot = await getDocs(collection(db, "farmers"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    return [];
  }
}

// Get all buyers
export async function getBuyers() {
  try {
    const querySnapshot = await getDocs(collection(db, "buyers"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    return [];
  }
}

// Add crop listing
export async function addCrop(cropData) {
  try {
    const docRef = await addDoc(collection(db, "crops"), {
      ...cropData,
      status: "active",
      bids: [],
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id };
  } catch (error) {
    return { error: error.message };
  }
}

// Get all crops
export async function getCrops() {
  try {
    const querySnapshot = await getDocs(collection(db, "crops"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    return [];
  }
}

// Add auction
export async function addAuction(auctionData) {
  try {
    const docRef = await addDoc(collection(db, "auctions"), {
      ...auctionData,
      status: "active",
      bids: [],
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id };
  } catch (error) {
    return { error: error.message };
  }
}

// Get all auctions
export async function getAuctions() {
  try {
    const querySnapshot = await getDocs(collection(db, "auctions"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    return [];
  }
}

// Add bid to auction
export async function addBid(auctionId, bidData) {
  try {
    const auctionRef = doc(db, "auctions", auctionId);
    
    // Add bid to separate bids collection
    const bidRef = await addDoc(collection(db, "bids"), {
      ...bidData,
      auctionId,
      createdAt: serverTimestamp(),
    });
    
    // Update the auction document with the new bid and current bid price
    await updateDoc(auctionRef, {
      currentBid: bidData.amount,
      bids: arrayUnion({
        ...bidData,
        bidId: bidRef.id,
        createdAt: serverTimestamp()
      })
    });
    
    return { id: bidRef.id };
  } catch (error) {
    console.error("Error adding bid:", error);
    return { error: error.message };
  }
}

// Get user by UID
export async function getUserByUID(uid, userType) {
  try {
    const collectionName = userType === "farmer" ? "farmers" : "buyers";
    const q = query(collection(db, collectionName), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return { id: userDoc.id, ...userDoc.data() };
    }
    return null;
  } catch (error) {
    return null;
  }
}
