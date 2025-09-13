import React from "react";

const FarmerDashboard = () => (
  <div className="dashboard-container">
    <h2>Farmer Dashboard</h2>
    {/* Registration/Login Form */}
    <form className="kyc-form">
      <h3>Register / Login</h3>
      <input type="text" placeholder="Aadhaar No" required />
      <input type="text" placeholder="Name" required />
      <input type="text" placeholder="Mobile" required />
      <input type="text" placeholder="Bank Account" required />
      <button type="submit">Submit</button>
    </form>  {/* ...removed crop listing section... */}
  </div>
);

export default FarmerDashboard;
