import React, { useState } from "react";
import FarmerDashboard from "./FarmerDashboard";

const LandingPage = () => {
  const [language, setLanguage] = useState(null);

  if (!language) {
    return (
      <div className="landing-container">
        <header className="hero">
          <h1>AgriLive Auction</h1>
          <p>Connecting Farmers and Buyers Through Live Auctions.</p>
          <div className="hero-buttons">
            <button className="btn" onClick={() => setLanguage("en")}>English</button>
            <button className="btn" onClick={() => setLanguage("hi")}>हिन्दी</button>
          </div>
        </header>
      </div>
    );
  }

  return (
    <div className="landing-container">
      <FarmerDashboard language={language} />
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <a href="/buyer" className="btn" style={{ display: "inline-block" }}>
          {language === "en" ? "Buyer Login" : "खरीदार लॉगिन"}
        </a>
      </div>
    </div>
  );
};

export default LandingPage;
