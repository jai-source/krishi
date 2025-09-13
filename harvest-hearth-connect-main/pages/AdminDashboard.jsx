import React from "react";

const AdminDashboard = () => (
  <div className="admin-container">
    <h2>Admin Dashboard</h2>
    <section className="users-list">
      <h3>Registered Farmers</h3>
      <ul>
        <li>Ram Singh</li>
        <li>Geeta Devi</li>
      </ul>
      <h3>Registered Buyers</h3>
      <ul>
        <li>BuyerXYZ</li>
        <li>BuyerABC</li>
      </ul>
    </section>
    <section className="auctions-monitor">
      <h3>All Auctions</h3>
      <ul>
        <li>Wheat Auction - ₹1200 - Live</li>
        <li>Rice Auction - ₹900 - Ended</li>
      </ul>
    </section>
    <section className="analytics">
      <h3>Analytics</h3>
      <p>Top Crop: Wheat</p>
      <p>Average Price: ₹1050</p>
      <p>Regions: Punjab, Haryana</p>
      <p>Demand Trend: High</p>
    </section>
  </div>
);

export default AdminDashboard;
