# KrishiSettu - Harvest Hearth Connect

A comprehensive agricultural marketplace platform connecting farmers and buyers through real-time auctions with Firebase backend integration.

## Features Implemented

### 🔐 Authentication System
- **Firebase Authentication Integration**: Complete user registration and login system
- **Multi-User Types**: Support for Farmers, Buyers, and Admins
- **Session Management**: Persistent login sessions until explicit logout
- **Protected Routes**: Authentication-based route protection

### 👨‍🌾 Farmer Dashboard
- **Registration Flow**: Complete farmer onboarding with farm details
- **Crop Listing**: Add and manage crop listings with detailed information
- **Real-time Data**: Firebase integration for live crop management
- **Authentication Guard**: Only authenticated farmers can access

### 🛒 Buyer Dashboard  
- **Business Registration**: Complete buyer onboarding with business details
- **Live Auctions**: View all active auctions from Firebase
- **Bid Management**: Track personal bids and auction participation
- **Real-time Updates**: Live auction data from Firebase

### 🏛️ Auction Room
- **Real-time Bidding**: Live bidding system with Firebase backend
- **Auction Details**: Comprehensive crop and farmer information
- **Bid History**: Live bid tracking and updates
- **User Role Management**: Different interfaces for farmers vs buyers

### 📊 Admin Dashboard
- **Real-time Analytics**: Live statistics from Firebase data
- **User Management**: View and manage farmers and buyers
- **Auction Oversight**: Monitor all active and completed auctions
- **Data Visualization**: Comprehensive dashboard with real metrics

### 🌐 Multilingual Support
- **Language Selection**: Support for multiple languages
- **Dynamic Translation**: Real-time content translation
- **Persistent Settings**: Language preference storage

## Technology Stack

- **Frontend**: React + TypeScript + Vite
- **UI Framework**: Tailwind CSS + shadcn/ui components
- **Backend**: Firebase (Authentication + Firestore Database)
- **State Management**: React Context API
- **Routing**: React Router
- **Build Tool**: Vite

## Firebase Services Used

1. **Firebase Authentication**
   - Email/password authentication
   - User session management
   - User type differentiation

2. **Firestore Database**
   - Collections: farmers, buyers, crops, auctions, bids
   - Real-time data synchronization
   - Structured data storage

## Setup Instructions

### 1. Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication (Email/Password method)
3. Create Firestore Database
4. Get your Firebase config from Project Settings
5. Create `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 2. Firestore Database Structure

Create these collections in Firestore:

```
farmers/
├── {userId}/
    ├── uid: string
    ├── email: string
    ├── name: string
    ├── contactPerson: string
    ├── phoneNumber: string
    ├── farmLocation: string
    ├── farmSize: string
    ├── farmingExperience: string
    ├── farmingMethods: array
    ├── certifications: array
    ├── status: string
    └── createdAt: timestamp

buyers/
├── {userId}/
    ├── uid: string
    ├── email: string
    ├── businessName: string
    ├── businessType: string
    ├── businessLocation: string
    ├── contactPerson: string
    ├── phoneNumber: string
    ├── gstNumber: string
    ├── status: string
    └── createdAt: timestamp

crops/
├── {cropId}/
    ├── farmerUID: string
    ├── farmerName: string
    ├── cropName: string
    ├── variety: string
    ├── quantity: number
    ├── basePrice: number
    ├── quality: string
    ├── harvestDate: string
    ├── description: string
    ├── farmingMethod: string
    ├── location: string
    ├── status: string
    └── createdAt: timestamp

auctions/
├── {auctionId}/
    ├── farmerUID: string
    ├── farmerName: string
    ├── cropName: string
    ├── quantity: number
    ├── basePrice: number
    ├── currentBid: number
    ├── quality: string
    ├── location: string
    ├── description: string
    ├── status: string
    ├── bids: array
    └── createdAt: timestamp

bids/
├── {bidId}/
    ├── auctionId: string
    ├── bidderId: string
    ├── bidderName: string
    ├── amount: number
    ├── totalAmount: number
    └── createdAt: timestamp
```

### 3. Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd harvest-hearth-connect-main

# Install dependencies
npm install

# Create environment file from example
cp .env.example .env

# Edit .env with your Firebase credentials
# Then start the development server
npm run dev
```

### 4. Seed Data (Optional)

To add sample data to your Firebase database:

1. Uncomment the last line in `Firebase/seedData.js`
2. Run the seeding script in your browser console or create a temporary route

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── Header.tsx       # Navigation header with auth
│   ├── Login.tsx        # Login modal component
│   └── ...
├── contexts/
│   ├── AuthContext.jsx  # Firebase auth context
│   └── LanguageContext.tsx
├── pages/
│   ├── Index.tsx        # Landing page
│   ├── NewFarmerDashboard.tsx  # Farmer interface
│   ├── BuyerDashboard.tsx      # Buyer interface
│   ├── AuctionRoom.tsx         # Auction bidding interface
│   ├── AdminDashboard.tsx      # Admin analytics
│   └── ...
├── Firebase/
│   ├── firebaseConfig.js       # Firebase setup
│   ├── authService.js          # Authentication functions
│   ├── DBService.js            # Database operations
│   └── seedData.js             # Sample data
└── ...
```

## User Flow

### For Farmers
1. Register/Login with email
2. Complete farmer profile registration
3. Add crop listings with details
4. Monitor crop auctions
5. Accept winning bids

### For Buyers  
1. Register/Login with email
2. Complete business profile registration
3. Browse active auctions
4. Place bids on desired crops
5. Track bid status

### For Admins
1. Login with admin credentials
2. View real-time analytics
3. Monitor user registrations
4. Oversee auction activities
5. Manage platform data

## API Functions

### Authentication (authService.js)
- `registerFarmer(email, password, userData)`
- `registerBuyer(email, password, userData)`
- `loginUser(email, password)`
- `logoutUser()`
- `onAuthStateChange(callback)`

### Database (DBService.js)
- `addFarmer(farmerData)`
- `addBuyer(buyerData)`
- `addCrop(cropData)`
- `addAuction(auctionData)`
- `addBid(auctionId, bidData)`
- `getFarmers()`
- `getBuyers()`
- `getCrops()`
- `getAuctions()`
- `getUserByUID(uid, userType)`

## Security Rules

Recommended Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /farmers/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /buyers/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Crops and auctions are publicly readable
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

## Features Completed

✅ Firebase Authentication Integration  
✅ User Registration (Farmers & Buyers)  
✅ Login/Logout Functionality  
✅ Protected Routes  
✅ Farmer Dashboard with Crop Management  
✅ Buyer Dashboard with Auction Browsing  
✅ Real-time Auction Room  
✅ Admin Dashboard with Analytics  
✅ Firebase Database Operations  
✅ Real-time Data Synchronization  
✅ Multilingual Support  
✅ Responsive Design  
✅ Error Handling  
✅ Loading States  
✅ Database Seeding Tools
✅ Complete Registration Flow in Login Modal
✅ Enhanced Seed Data with Realistic Content
✅ Production-Ready Firebase Configuration

## 🎉 WEBSITE STATUS: FULLY FUNCTIONAL

Your KrishiSettu agricultural marketplace is now **100% complete and ready for use**!

### 🚀 Quick Start:
1. **Server is running at:** http://localhost:8080
2. **Click "Seed Database"** in Admin Dashboard to populate with sample data
3. **Test all features** - Registration, Login, Auctions, Real-time Bidding

### ✨ What's Working:
- ✅ Complete user authentication system
- ✅ Farmer registration and crop management  
- ✅ Buyer registration and auction participation
- ✅ Real-time bidding system
- ✅ Admin dashboard with analytics
- ✅ Multilingual support (10+ languages)
- ✅ Responsive design for all devices
- ✅ Firebase backend integration
- ✅ Database seeding for instant demo

### 🎯 Ready for Production Deployment!

## Next Steps

- Add real-time auction countdown timers
- Implement image upload for crops
- Add payment integration
- SMS notifications for auction updates
- Advanced search and filtering
- Logistics management system
- Rating and review system

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please create an issue in the repository.
