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
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./firebaseConfig";

// Add farmer details
export async function addFarmer(farmerData) {
  try {
    const docRef = await addDoc(collection(db, "farmers"), {
      ...farmerData,
      userType: "farmer",
      isVerified: false,
      status: "active",
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id };
  } catch (error) {
    return { error: error.message };
  }
}

// Add buyer details
export async function addBuyer(buyerData) {
  try {
    const docRef = await addDoc(collection(db, "buyers"), {
      ...buyerData,
      userType: "buyer",
      isVerified: false,
      status: "active",
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id };
  } catch (error) {
    return { error: error.message };
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
    const bidRef = await addDoc(collection(db, "bids"), {
      ...bidData,
      auctionId,
      createdAt: serverTimestamp(),
    });
    return { id: bidRef.id };
  } catch (error) {
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
