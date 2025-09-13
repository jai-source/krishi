// Firebase seed data script
import { addFarmer, addBuyer, addCrop, addAuction } from "./DBService.js";

// Sample farmers data
const sampleFarmers = [
  {
    uid: "farmer1",
    email: "ravi.kumar@example.com",
    name: "Ravi Kumar",
    contactPerson: "Ravi Kumar",
    phoneNumber: "+91-9876543210",
    farmLocation: "Village Rampur, Punjab",
    farmSize: "25 acres",
    farmingExperience: "15 years",
    farmingMethods: ["organic", "traditional"],
    certifications: ["Organic Certification"],
    status: "active"
  },
  {
    uid: "farmer2", 
    email: "sita.devi@example.com",
    name: "Sita Devi",
    contactPerson: "Sita Devi",
    phoneNumber: "+91-9876543211",
    farmLocation: "Village Haryana, Haryana",
    farmSize: "15 acres",
    farmingExperience: "12 years",
    farmingMethods: ["traditional"],
    certifications: [],
    status: "active"
  },
  {
    uid: "farmer3",
    email: "arjun.singh@example.com", 
    name: "Arjun Singh",
    contactPerson: "Arjun Singh",
    phoneNumber: "+91-9876543212",
    farmLocation: "Village Maharashtra, Maharashtra", 
    farmSize: "30 acres",
    farmingExperience: "20 years",
    farmingMethods: ["organic", "hydroponic"],
    certifications: ["Organic Certification", "GAP Certification"],
    status: "active"
  }
];

// Sample buyers data
const sampleBuyers = [
  {
    uid: "buyer1",
    email: "farmfresh@example.com",
    businessName: "Farm Fresh Co.",
    businessType: "wholesaler",
    businessLocation: "Delhi",
    contactPerson: "Rajesh Gupta",
    phoneNumber: "+91-9876543220",
    gstNumber: "07AAACF2729R1Z2",
    status: "active"
  },
  {
    uid: "buyer2",
    email: "greenvalley@example.com", 
    businessName: "Green Valley Traders",
    businessType: "retailer",
    businessLocation: "Mumbai",
    contactPerson: "Priya Sharma",
    phoneNumber: "+91-9876543221",
    gstNumber: "27AAACG1234Q1Z5",
    status: "active"
  },
  {
    uid: "buyer3",
    email: "organicfoods@example.com",
    businessName: "Organic Foods Ltd.",
    businessType: "processor", 
    businessLocation: "Bangalore",
    contactPerson: "Amit Patel",
    phoneNumber: "+91-9876543222",
    gstNumber: "29AAACF9876T1Z8",
    status: "active"
  }
];

// Sample crops data
const sampleCrops = [
  {
    farmerUID: "farmer1",
    farmerName: "Ravi Kumar",
    cropName: "Organic Wheat",
    variety: "PBW 343",
    quantity: 500,
    basePrice: 25,
    quality: "Premium",
    harvestDate: "2024-01-15",
    description: "Premium quality organic wheat grown using sustainable farming practices. No pesticides or chemical fertilizers used.",
    farmingMethod: "Organic",
    location: "Punjab",
    images: [],
    status: "active"
  },
  {
    farmerUID: "farmer2",
    farmerName: "Sita Devi", 
    cropName: "Basmati Rice",
    variety: "Pusa Basmati 1121",
    quantity: 300,
    basePrice: 45,
    quality: "Premium", 
    harvestDate: "2024-01-10",
    description: "High quality basmati rice with excellent aroma and taste.",
    farmingMethod: "Traditional",
    location: "Haryana",
    images: [],
    status: "active"
  },
  {
    farmerUID: "farmer3",
    farmerName: "Arjun Singh",
    cropName: "Fresh Tomatoes", 
    variety: "Hybrid Tomato",
    quantity: 200,
    basePrice: 12,
    quality: "Grade A",
    harvestDate: "2024-01-20",
    description: "Fresh and juicy tomatoes grown using organic methods.",
    farmingMethod: "Organic",
    location: "Maharashtra", 
    images: [],
    status: "active"
  }
];

// Sample auctions data
const sampleAuctions = [
  {
    farmerUID: "farmer1",
    farmerName: "Ravi Kumar",
    cropName: "Organic Wheat", 
    variety: "PBW 343",
    quantity: 500,
    basePrice: 25,
    currentBid: 27,
    quality: "Premium",
    location: "Punjab",
    description: "Premium quality organic wheat grown using sustainable farming practices.",
    farmingMethod: "Organic",
    harvestDate: "2024-01-15",
    status: "active",
    bids: [
      {
        bidderId: "buyer1",
        bidderName: "Farm Fresh Co.",
        amount: 27,
        timestamp: "2024-01-25T10:30:00Z"
      },
      {
        bidderId: "buyer2", 
        bidderName: "Green Valley Traders",
        amount: 26,
        timestamp: "2024-01-25T09:15:00Z"
      }
    ]
  },
  {
    farmerUID: "farmer2",
    farmerName: "Sita Devi",
    cropName: "Basmati Rice",
    variety: "Pusa Basmati 1121", 
    quantity: 300,
    basePrice: 45,
    currentBid: 48,
    quality: "Premium",
    location: "Haryana",
    description: "High quality basmati rice with excellent aroma and taste.",
    farmingMethod: "Traditional",
    harvestDate: "2024-01-10",
    status: "active",
    bids: [
      {
        bidderId: "buyer3",
        bidderName: "Organic Foods Ltd.",
        amount: 48,
        timestamp: "2024-01-25T11:45:00Z"
      }
    ]
  }
];

// Function to seed all data
export async function seedDatabase() {
  console.log("Starting database seeding...");
  
  try {
    // Add farmers
    console.log("Adding farmers...");
    for (const farmer of sampleFarmers) {
      const result = await addFarmer(farmer);
      console.log("Farmer added:", result);
    }
    
    // Add buyers  
    console.log("Adding buyers...");
    for (const buyer of sampleBuyers) {
      const result = await addBuyer(buyer);
      console.log("Buyer added:", result);
    }
    
    // Add crops
    console.log("Adding crops...");
    for (const crop of sampleCrops) {
      const result = await addCrop(crop);
      console.log("Crop added:", result);
    }
    
    // Add auctions
    console.log("Adding auctions...");
    for (const auction of sampleAuctions) {
      const result = await addAuction(auction);
      console.log("Auction added:", result);
    }
    
    console.log("Database seeding completed successfully!");
    
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Uncomment the line below to run the seeding when this file is executed
// seedDatabase();
