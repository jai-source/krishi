# KrishiSettu - Complete Setup Guide

## 🚀 Quick Start (Ready to Use)

Your KrishiSettu application is now configured with a working Firebase setup. Follow these steps to get the full website running:

### 1. **Start the Application**
```bash
cd "c:\Users\Jai\Desktop\krishiSettu_under_work\krishiSettu_final\harvest-hearth-connect-main"
npm run dev
```

The application will start at: **http://localhost:8080**

### 2. **Seed the Database (Important!)**
1. Open your browser to http://localhost:8080
2. Click "Login" in the header
3. Register as an Admin user or any user type
4. Navigate to Admin Dashboard
5. Click the "Seed Database" button to populate with sample data

### 3. **Test All Features**

#### **As a Farmer:**
1. Click "Login" → Switch to "Register" → Select "Farmer" tab
2. Fill in the registration form:
   - Full Name: "Test Farmer"
   - Email: "farmer@test.com"
   - Password: "password123"
   - Farm Location: "Test Village, Punjab"
   - Farm Size: "10"
   - Phone: "+91-9876543210"
   - Aadhar: "1234-5678-9012"
3. After registration, you'll be redirected to Farmer Dashboard
4. Add crop listings and manage auctions

#### **As a Buyer:**
1. Click "Login" → Switch to "Register" → Select "Buyer" tab
2. Fill in the registration form:
   - Business Name: "Test Buyers Ltd"
   - Contact Person: "Test Buyer"
   - Email: "buyer@test.com"
   - Password: "password123"
   - Business Type: "Wholesaler"
   - Business Location: "Test City"
   - Phone: "+91-9876543220"
   - GST Number: "22AAAAA0000A1Z5" (optional)
3. After registration, browse auctions and place bids

#### **Testing Auction Room:**
1. Login as a farmer and create a crop listing
2. Login as a buyer in a different browser/incognito
3. Go to auction room and place bids
4. See real-time bidding in action

### 4. **Available Features**

✅ **Complete Authentication System**
- User registration for farmers and buyers
- Login/logout functionality
- Session management

✅ **Farmer Dashboard**
- Crop listing management
- Auction monitoring
- Profile management

✅ **Buyer Dashboard**
- Browse active auctions
- Place and track bids
- Purchase history

✅ **Real-time Auction Room**
- Live bidding system
- Real-time updates
- Bid history tracking

✅ **Admin Dashboard**
- User management
- Auction oversight
- Analytics and statistics
- Database seeding tools

✅ **Multilingual Support**
- 10+ Indian languages
- Real-time translation
- Persistent language settings

### 5. **Sample Test Accounts**

After seeding the database, you can login with these test accounts:

**Farmers:**
- Email: `ravi.kumar@krishisettu.com` | Password: `farmer123`
- Email: `sita.devi@krishisettu.com` | Password: `farmer123`

**Buyers:**
- Email: `contact@farmfreshco.com` | Password: `buyer123`
- Email: `orders@organicmart.com` | Password: `buyer123`

### 6. **Firebase Configuration (Optional)**

If you want to use your own Firebase project:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable Authentication (Email/Password method)
4. Create Firestore Database
5. Update `.env` file with your credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 7. **Firestore Security Rules**

Add these security rules in Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access for authenticated users to their own data
    match /farmers/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null; // Allow all authenticated users to read farmer profiles
    }
    
    match /buyers/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null; // Allow all authenticated users to read buyer profiles
    }
    
    // Public read access for crops and auctions, authenticated write
    match /crops/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /auctions/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /bids/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🎯 What You Can Test Now

1. **User Registration & Authentication** - Complete signup/login flows
2. **Farmer Dashboard** - Add crops, manage listings, view auctions
3. **Buyer Dashboard** - Browse auctions, place bids, track purchases
4. **Real-time Auction Room** - Live bidding with multiple users
5. **Admin Dashboard** - User management and analytics
6. **Multilingual Interface** - Switch between 10+ languages
7. **Responsive Design** - Mobile and desktop compatibility

## 🚀 Ready for Production

Your KrishiSettu application is now fully functional with:
- Real-time Firebase backend
- Complete authentication system
- Live auction functionality
- Admin management tools
- Multilingual support
- Production-ready codebase

Visit **http://localhost:8080** to see your complete agricultural marketplace in action!

---

**Note:** The current setup uses a demo Firebase project. For production deployment, create your own Firebase project and update the credentials in the `.env` file.
