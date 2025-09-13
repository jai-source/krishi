// Firebase seed data script - Enhanced version
import { addFarmer, addBuyer, addCrop, addAuction } from "./DBService.js";

// Sample farmers data
const sampleFarmers = [
  {
    uid: "farmer1",
    email: "ravi.kumar@krishisettu.com",
    fullName: "Ravi Kumar",
    phoneNumber: "+91-9876543210",
    farmLocation: "Village Rampur, Punjab",
    farmSize: "25",
    aadharNumber: "1234-5678-9012",
    farmingExperience: "15 years",
    farmingMethods: ["organic", "traditional"],
    certifications: ["Organic Certification"],
    status: "active"
  },
  {
    uid: "farmer2", 
    email: "sita.devi@krishisettu.com",
    fullName: "Sita Devi",
    phoneNumber: "+91-9876543211",
    farmLocation: "Village Kharkhoda, Haryana",
    farmSize: "15",
    aadharNumber: "2345-6789-0123",
    farmingExperience: "12 years",
    farmingMethods: ["traditional"],
    certifications: [],
    status: "active"
  },
  {
    uid: "farmer3",
    email: "arjun.singh@krishisettu.com", 
    fullName: "Arjun Singh",
    phoneNumber: "+91-9876543212",
    farmLocation: "Village Deulgaon, Maharashtra", 
    farmSize: "30",
    aadharNumber: "3456-7890-1234",
    farmingExperience: "20 years",
    farmingMethods: ["organic", "hydroponic"],
    certifications: ["Organic Certification", "GAP Certification"],
    status: "active"
  },
  {
    uid: "farmer4",
    email: "krishna.reddy@krishisettu.com",
    fullName: "Krishna Reddy",
    phoneNumber: "+91-9876543213",
    farmLocation: "Village Kadapa, Andhra Pradesh",
    farmSize: "20",
    aadharNumber: "4567-8901-2345",
    farmingExperience: "18 years",
    farmingMethods: ["traditional", "irrigation"],
    certifications: ["Good Agricultural Practices"],
    status: "active"
  }
];

// Sample buyers data
const sampleBuyers = [
  {
    uid: "buyer1",
    email: "contact@farmfreshco.com",
    businessName: "Farm Fresh Co.",
    businessType: "Wholesaler",
    businessLocation: "New Delhi",
    contactPerson: "Rajesh Gupta",
    phoneNumber: "+91-9876543220",
    gstNumber: "07AABCU9603R1ZX",
    status: "active"
  },
  {
    uid: "buyer2",
    email: "orders@organicmart.com",
    businessName: "Organic Mart Ltd.",
    businessType: "Retailer",
    businessLocation: "Mumbai",
    contactPerson: "Priya Sharma",
    phoneNumber: "+91-9876543221",
    gstNumber: "27AABCU9603R1ZY",
    status: "active"
  },
  {
    uid: "buyer3",
    email: "procurement@agriprocessors.com",
    businessName: "Agri Processors Pvt Ltd",
    businessType: "Food Processor",
    businessLocation: "Bangalore",
    contactPerson: "Amit Patel",
    phoneNumber: "+91-9876543222",
    gstNumber: "29AABCU9603R1ZZ",
    status: "active"
  },
  {
    uid: "buyer4",
    email: "purchase@greenvalley.com",
    businessName: "Green Valley Export House",
    businessType: "Exporter",
    businessLocation: "Chennai",
    contactPerson: "Meera Iyer",
    phoneNumber: "+91-9876543223",
    gstNumber: "33AABCU9603R1ZA",
    status: "active"
  }
];

// Sample crops data
const sampleCrops = [
  {
    farmerUID: "farmer1",
    farmerName: "Ravi Kumar",
    farmerLocation: "Village Rampur, Punjab",
    cropName: "Organic Wheat",
    variety: "PBW 343",
    quantity: 500,
    basePrice: 25,
    quality: "Premium",
    harvestDate: "2024-03-15",
    description: "Premium quality organic wheat grown without chemicals. Perfect for flour production.",
    farmingMethod: "Organic",
    auctionDuration: "7",
    status: "active"
  },
  {
    farmerUID: "farmer2",
    farmerName: "Sita Devi",
    farmerLocation: "Village Kharkhoda, Haryana",
    cropName: "Basmati Rice",
    variety: "Pusa Basmati 1509",
    quantity: 300,
    basePrice: 45,
    quality: "Premium",
    harvestDate: "2024-04-10",
    description: "Aromatic Basmati rice with long grains and excellent cooking quality.",
    farmingMethod: "Traditional",
    auctionDuration: "5",
    status: "active"
  },
  {
    farmerUID: "farmer3",
    farmerName: "Arjun Singh",
    farmerLocation: "Village Deulgaon, Maharashtra",
    cropName: "Organic Tomatoes",
    variety: "Roma",
    quantity: 200,
    basePrice: 15,
    quality: "Grade A",
    harvestDate: "2024-04-20",
    description: "Fresh organic tomatoes, perfect for processing and direct consumption.",
    farmingMethod: "Organic",
    auctionDuration: "3",
    status: "active"
  },
  {
    farmerUID: "farmer4",
    farmerName: "Krishna Reddy",
    farmerLocation: "Village Kadapa, Andhra Pradesh",
    cropName: "Red Chili",
    variety: "Guntur Sannam",
    quantity: 150,
    basePrice: 180,
    quality: "Export Quality",
    harvestDate: "2024-04-25",
    description: "High pungency red chili, ideal for export and spice processing.",
    farmingMethod: "Traditional",
    auctionDuration: "4",
    status: "active"
  },
  {
    farmerUID: "farmer1",
    farmerName: "Ravi Kumar",
    farmerLocation: "Village Rampur, Punjab",
    cropName: "Yellow Corn",
    variety: "Sweet Corn Hybrid",
    quantity: 800,
    basePrice: 18,
    quality: "Premium",
    harvestDate: "2024-04-30",
    description: "High-quality yellow corn suitable for feed and food processing.",
    farmingMethod: "Traditional",
    auctionDuration: "6",
    status: "active"
  }
];

// Sample auctions data
const sampleAuctions = [
  {
    farmerUID: "farmer1",
    farmerName: "Ravi Kumar",
    cropName: "Organic Wheat",
    quantity: 500,
    basePrice: 25,
    currentBid: 28,
    quality: "Premium",
    location: "Village Rampur, Punjab",
    description: "Premium quality organic wheat grown without chemicals.",
    status: "active",
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    bids: [
      { 
        bidderId: "buyer1", 
        bidderName: "Farm Fresh Co.", 
        amount: 26, 
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
      },
      { 
        bidderId: "buyer2", 
        bidderName: "Organic Mart Ltd.", 
        amount: 28, 
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 minutes ago
      }
    ]
  },
  {
    farmerUID: "farmer2",
    farmerName: "Sita Devi",
    cropName: "Basmati Rice",
    quantity: 300,
    basePrice: 45,
    currentBid: 52,
    quality: "Premium",
    location: "Village Kharkhoda, Haryana",
    description: "Aromatic Basmati rice with excellent cooking quality.",
    status: "active",
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    bids: [
      { 
        bidderId: "buyer1", 
        bidderName: "Farm Fresh Co.", 
        amount: 48, 
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4 hours ago
      },
      { 
        bidderId: "buyer3", 
        bidderName: "Agri Processors Pvt Ltd", 
        amount: 52, 
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() // 1 hour ago
      }
    ]
  },
  {
    farmerUID: "farmer3",
    farmerName: "Arjun Singh",
    cropName: "Organic Tomatoes",
    quantity: 200,
    basePrice: 15,
    currentBid: 18,
    quality: "Grade A",
    location: "Village Deulgaon, Maharashtra",
    description: "Fresh organic tomatoes, perfect for processing.",
    status: "active",
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    bids: [
      { 
        bidderId: "buyer2", 
        bidderName: "Organic Mart Ltd.", 
        amount: 16, 
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() // 6 hours ago
      },
      { 
        bidderId: "buyer1", 
        bidderName: "Farm Fresh Co.", 
        amount: 18, 
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
      }
    ]
  },
  {
    farmerUID: "farmer4",
    farmerName: "Krishna Reddy",
    cropName: "Red Chili",
    quantity: 150,
    basePrice: 180,
    currentBid: 195,
    quality: "Export Quality",
    location: "Village Kadapa, Andhra Pradesh",
    description: "High pungency red chili, ideal for export.",
    status: "active",
    endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days from now
    bids: [
      { 
        bidderId: "buyer4", 
        bidderName: "Green Valley Export House", 
        amount: 185, 
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() // 3 hours ago
      },
      { 
        bidderId: "buyer3", 
        bidderName: "Agri Processors Pvt Ltd", 
        amount: 195, 
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() // 1 hour ago
      }
    ]
  }
];

// Function to seed all data
export async function seedDatabase() {
  console.log("🌱 Starting enhanced database seeding...");
  
  try {
    // Add farmers
    console.log("👨‍🌾 Adding farmers...");
    for (const farmer of sampleFarmers) {
      const result = await addFarmer(farmer);
      if (result.error) {
        console.warn(`⚠️ Failed to add farmer ${farmer.fullName}: ${result.error}`);
      } else {
        console.log(`✅ Added farmer: ${farmer.fullName}`);
      }
    }

    // Add buyers
    console.log("🛒 Adding buyers...");
    for (const buyer of sampleBuyers) {
      const result = await addBuyer(buyer);
      if (result.error) {
        console.warn(`⚠️ Failed to add buyer ${buyer.businessName}: ${result.error}`);
      } else {
        console.log(`✅ Added buyer: ${buyer.businessName}`);
      }
    }

    // Add crops
    console.log("🌾 Adding crops...");
    for (const crop of sampleCrops) {
      const result = await addCrop(crop);
      if (result.error) {
        console.warn(`⚠️ Failed to add crop ${crop.cropName}: ${result.error}`);
      } else {
        console.log(`✅ Added crop: ${crop.cropName} by ${crop.farmerName}`);
      }
    }

    // Add auctions
    console.log("🏛️ Adding auctions...");
    for (const auction of sampleAuctions) {
      const result = await addAuction(auction);
      if (result.error) {
        console.warn(`⚠️ Failed to add auction ${auction.cropName}: ${result.error}`);
      } else {
        console.log(`✅ Added auction: ${auction.cropName} by ${auction.farmerName}`);
      }
    }

    console.log("✅ Enhanced database seeding completed successfully!");
    console.log(`📊 Summary: ${sampleFarmers.length} farmers, ${sampleBuyers.length} buyers, ${sampleCrops.length} crops, ${sampleAuctions.length} auctions`);
    
  } catch (error) {
    console.error("❌ Error during database seeding:", error);
  }
}

// Auto-seed function for development
export function initializeSeedData() {
  if (import.meta.env.DEV) {
    console.log("🔧 Development mode detected. To seed database, run seedDatabase() in browser console.");
  }
}

// Export sample data for use in other parts of the app
export { sampleFarmers, sampleBuyers, sampleCrops, sampleAuctions };

// Uncomment the line below to auto-seed when this file is imported
// seedDatabase();
