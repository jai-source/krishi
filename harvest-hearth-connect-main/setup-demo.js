// Instant Database Setup Script
// Run this in browser console to instantly populate the database

// Import the seeding function
import { seedDatabase } from './src/Firebase/enhancedSeedData.js';

// Function to run complete setup
async function setupKrishiSettuDemo() {
  console.log("🌱 Setting up KrishiSettu Demo...");
  
  try {
    // Seed the database
    await seedDatabase();
    
    console.log("✅ KrishiSettu Demo Setup Complete!");
    console.log("📋 Test Accounts:");
    console.log("👨‍🌾 Farmers:");
    console.log("   - ravi.kumar@krishisettu.com");
    console.log("   - sita.devi@krishisettu.com");
    console.log("🛒 Buyers:");
    console.log("   - contact@farmfreshco.com");
    console.log("   - orders@organicmart.com");
    console.log("🔐 Password for all accounts: test123");
    
    // Refresh the page to show new data
    window.location.reload();
    
  } catch (error) {
    console.error("❌ Setup failed:", error);
  }
}

// Run setup
setupKrishiSettuDemo();
