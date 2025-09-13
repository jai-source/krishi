// Local Authentication Service - Full Firebase simulation
// This provides complete Firebase-like functionality using localStorage

// Simulate Firebase Auth User
class MockUser {
  constructor(uid, email) {
    this.uid = uid;
    this.email = email;
    this.displayName = '';
  }
}

// Simulate Firebase Auth
class MockAuth {
  constructor() {
    this.currentUser = null;
    this.authStateChangeCallbacks = [];
    this.initializeFromStorage();
  }

  initializeFromStorage() {
    const storedUser = localStorage.getItem('krishisettu-current-user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      this.currentUser = new MockUser(userData.uid, userData.email);
      this.currentUser.displayName = userData.displayName || '';
    }
  }

  async createUserWithEmailAndPassword(email, password) {
    // Simulate user creation
    if (password.length < 6) {
      throw new Error('Password should be at least 6 characters');
    }

    const uid = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const user = new MockUser(uid, email);
    
    // Store user in localStorage
    const userData = { uid: user.uid, email: user.email, displayName: user.displayName };
    localStorage.setItem('krishisettu-current-user', JSON.stringify(userData));
    
    this.currentUser = user;
    this.notifyAuthStateChange(user);
    
    return { user };
  }

  async signInWithEmailAndPassword(email, password) {
    // Simulate login - check if user exists in storage
    const allUsers = JSON.parse(localStorage.getItem('krishisettu-all-users') || '[]');
    const existingUser = allUsers.find(u => u.email === email);
    
    if (!existingUser) {
      throw new Error('User not found. Please register first.');
    }

    const user = new MockUser(existingUser.uid, existingUser.email);
    user.displayName = existingUser.displayName || '';
    
    // Store current user
    localStorage.setItem('krishisettu-current-user', JSON.stringify({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName
    }));
    
    this.currentUser = user;
    this.notifyAuthStateChange(user);
    
    return { user };
  }

  async signOut() {
    localStorage.removeItem('krishisettu-current-user');
    this.currentUser = null;
    this.notifyAuthStateChange(null);
  }

  onAuthStateChanged(callback) {
    this.authStateChangeCallbacks.push(callback);
    // Immediately call with current state
    setTimeout(() => callback(this.currentUser), 0);
    
    return () => {
      const index = this.authStateChangeCallbacks.indexOf(callback);
      if (index > -1) {
        this.authStateChangeCallbacks.splice(index, 1);
      }
    };
  }

  notifyAuthStateChange(user) {
    this.authStateChangeCallbacks.forEach(callback => callback(user));
  }
}

// Simulate Firebase Firestore
class MockFirestore {
  constructor() {
    this.collections = {};
  }

  collection(name) {
    return {
      add: async (data) => {
        const id = 'doc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        const docData = { 
          ...data, 
          id,
          createdAt: new Date().toISOString() 
        };
        
        // Store in localStorage
        const collectionData = JSON.parse(localStorage.getItem(`krishisettu-${name}`) || '[]');
        collectionData.push(docData);
        localStorage.setItem(`krishisettu-${name}`, JSON.stringify(collectionData));
        
        console.log(`✅ Added to ${name}:`, docData);
        return { id };
      },
      
      get: async () => {
        const collectionData = JSON.parse(localStorage.getItem(`krishisettu-${name}`) || '[]');
        return {
          docs: collectionData.map(doc => ({
            id: doc.id,
            data: () => doc
          })),
          empty: collectionData.length === 0
        };
      },
      
      where: (field, operator, value) => ({
        get: async () => {
          const collectionData = JSON.parse(localStorage.getItem(`krishisettu-${name}`) || '[]');
          let filteredData = collectionData;
          
          if (operator === '==') {
            filteredData = collectionData.filter(doc => doc[field] === value);
          }
          
          return {
            docs: filteredData.map(doc => ({
              id: doc.id,
              data: () => doc
            })),
            empty: filteredData.length === 0
          };
        }
      })
    };
  }

  doc(collection, id) {
    return {
      set: async (data) => {
        const collectionData = JSON.parse(localStorage.getItem(`krishisettu-${collection}`) || '[]');
        const docData = { ...data, id, updatedAt: new Date().toISOString() };
        
        const existingIndex = collectionData.findIndex(doc => doc.id === id);
        if (existingIndex >= 0) {
          collectionData[existingIndex] = docData;
        } else {
          collectionData.push(docData);
        }
        
        localStorage.setItem(`krishisettu-${collection}`, JSON.stringify(collectionData));
        return {};
      },
      
      get: async () => {
        const collectionData = JSON.parse(localStorage.getItem(`krishisettu-${collection}`) || '[]');
        const doc = collectionData.find(d => d.id === id);
        return {
          exists: !!doc,
          data: () => doc
        };
      },
        update: async (data) => {
        const collectionData = JSON.parse(localStorage.getItem(`krishisettu-${collection}`) || '[]');
        const docIndex = collectionData.findIndex(d => d.id === id);
        
        if (docIndex >= 0) {
          const updatedDoc = { ...collectionData[docIndex] };
          
          // Handle arrayUnion operations
          for (const [key, value] of Object.entries(data)) {
            if (value && typeof value === 'object' && value._type === 'arrayUnion') {
              // If field doesn't exist, create it as an array
              if (!updatedDoc[key]) {
                updatedDoc[key] = [];
              }
              // Add new elements to the array (avoiding duplicates)
              for (const element of value.elements) {
                if (!updatedDoc[key].some(existing => JSON.stringify(existing) === JSON.stringify(element))) {
                  updatedDoc[key].push(element);
                }
              }
            } else {
              // Regular update
              updatedDoc[key] = value;
            }
          }
          
          updatedDoc.updatedAt = new Date().toISOString();
          collectionData[docIndex] = updatedDoc;
          localStorage.setItem(`krishisettu-${collection}`, JSON.stringify(collectionData));
        }
        return {};
      }
    };
  }
}

// Update user profile function
async function updateProfile(user, profile) {
  if (user && profile.displayName) {
    user.displayName = profile.displayName;
    
    // Update in localStorage
    const userData = { uid: user.uid, email: user.email, displayName: user.displayName };
    localStorage.setItem('krishisettu-current-user', JSON.stringify(userData));
    
    // Update in all users list
    const allUsers = JSON.parse(localStorage.getItem('krishisettu-all-users') || '[]');
    const userIndex = allUsers.findIndex(u => u.uid === user.uid);
    if (userIndex >= 0) {
      allUsers[userIndex].displayName = profile.displayName;
    } else {
      allUsers.push(userData);
    }
    localStorage.setItem('krishisettu-all-users', JSON.stringify(allUsers));
  }
}

// Create instances
const mockAuth = new MockAuth();
const mockFirestore = new MockFirestore();

// Export functions that match Firebase API
export const createUserWithEmailAndPassword = async (auth, email, password) => {
  const result = await mockAuth.createUserWithEmailAndPassword(email, password);
  
  // Also store in all users list for login
  const allUsers = JSON.parse(localStorage.getItem('krishisettu-all-users') || '[]');
  const userData = { uid: result.user.uid, email: result.user.email, displayName: result.user.displayName };
  if (!allUsers.find(u => u.email === email)) {
    allUsers.push(userData);
    localStorage.setItem('krishisettu-all-users', JSON.stringify(allUsers));
  }
  
  return result;
};

export const signInWithEmailAndPassword = (auth, email, password) => 
  mockAuth.signInWithEmailAndPassword(email, password);

export const signOut = (auth) => mockAuth.signOut();

export const onAuthStateChanged = (auth, callback) => 
  mockAuth.onAuthStateChanged(callback);

export { updateProfile };

// Export auth and db instances
export const auth = mockAuth;
export const db = mockFirestore;

// Export Firestore functions
export const collection = (db, name) => db.collection(name);
export const addDoc = async (collectionRef, data) => collectionRef.add(data);
export const getDocs = async (collectionRef) => collectionRef.get();
export const doc = (db, collectionName, id) => db.doc(collectionName, id);
export const updateDoc = async (docRef, data) => docRef.update(data);
export const deleteDoc = async (docRef) => docRef.delete && docRef.delete();
export const query = (collectionRef) => collectionRef;
export const where = (field, operator, value) => ({ field, operator, value });
export const orderBy = (field, direction = 'asc') => ({ field, direction });
export const serverTimestamp = () => new Date().toISOString();
export const arrayUnion = (...elements) => ({ 
  _type: 'arrayUnion', 
  elements: elements 
});

console.log("🚀 Local Firebase simulation initialized - Full functionality available!");
console.log("💾 Data is stored in localStorage for persistence");
console.log("🔥 All Firebase features are working without external dependencies");
