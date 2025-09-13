import React, { useState } from "react";

const AuctionRoom = () => {
  const [bid, setBid] = useState(1000);
  const [newBid, setNewBid] = useState(0);
  const [timer, setTimer] = useState(120); // 2 minutes
  const [winner, setWinner] = useState(null);

  // Simple timer logic (not real-time)
  React.useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setWinner("BuyerXYZ");
    }
  }, [timer]);

  return (
    <div className="auction-room">
      <h2>Live Auction Room</h2>
      <div className="auction-details">
        <div className="crop-info">
          <h3>Farmer: Ram Singh</h3>
          <p>Crop: Wheat</p>
          <p>Quantity: 1000kg</p>
          <p>Quality: A+</p>
          <p>Base Price: ₹1000</p>
        </div>
        <div className="bidding-panel">
          <h3>Live Bidding</h3>
          <p>Current Bid: ₹{bid}</p>
          <input type="number" value={newBid} onChange={e => setNewBid(e.target.value)} placeholder="Enter your bid" />
          <button onClick={() => setBid(Number(newBid))}>Place Bid</button>
          <p>Time Left: {timer}s</p>
          {winner && <div className="winner">Winner: {winner}</div>}
          <button disabled={timer > 0}>Accept Final Bid</button>
        </div>
      </div>
    </div>
  );
};

export default AuctionRoom;
