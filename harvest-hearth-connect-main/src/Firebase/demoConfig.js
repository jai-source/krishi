// Demo mode configuration - for testing without Firebase
export const DEMO_MODE = false;

// Mock Firebase functions for demo
export const mockAuth = {
  currentUser: null,
  signInWithEmailAndPassword: async (email, password) => {
    // Mock successful login
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    return {
      user: { uid: 'demo_user_' + email.split('@')[0], email },
      credential: null
    };
  },
  createUserWithEmailAndPassword: async (email, password) => {
    // Mock successful registration
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
    return {
      user: { uid: 'demo_user_' + Date.now(), email },
      credential: null
    };
  },
  updateProfile: async (user, profile) => {
    // Mock profile update
    return Promise.resolve();
  },
  signOut: async () => {
    return Promise.resolve();
  },
  onAuthStateChanged: (callback) => {
    // Mock auth state change
    setTimeout(() => callback(null), 100);
    return () => {}; // unsubscribe function
  }
};

export const mockFirestore = {
  collection: (collectionName) => ({
    add: async (data) => {
      console.log(`[DEMO] Adding to ${collectionName}:`, data);
      return { id: 'demo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9) };
    },
    get: async () => ({
      docs: [],
      forEach: () => {},
      empty: true
    }),
    where: () => ({
      get: async () => ({ docs: [], empty: true })
    })
  }),
  doc: (collection, id) => ({
    set: async (data) => {
      console.log(`[DEMO] Setting document ${collection}/${id}:`, data);
      return {};
    },
    get: async () => ({ 
      exists: false, 
      data: () => null 
    }),
    update: async (data) => {
      console.log(`[DEMO] Updating document ${collection}/${id}:`, data);
      return {};
    }
  })
};
