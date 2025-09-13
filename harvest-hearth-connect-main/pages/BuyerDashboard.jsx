import React from "react";

const BuyerDashboard = () => (
  <div className="dashboard-container">
    <h2>Buyer Dashboard</h2>
    {/* Registration/Login Form */}
    <form className="kyc-form">
      <h3>Register / Login</h3>
      <input type="text" placeholder="GST" required />
      <input type="text" placeholder="Business Name" required />
      <input type="text" placeholder="Contact Info" required />
      <button type="submit">Submit</button>
    </form>
    {/* Browse Auctions */}
    <section className="browse-auctions">
      <h3>Browse Auctions</h3>
      <ul>
        <li>Wheat Auction - Live</li>
        <li>Rice Auction - Upcoming</li>
      </ul>
      <a href="/auction/1" className="btn">Join Auction Room</a>
    </section>
  </div>
);

export default BuyerDashboard;
