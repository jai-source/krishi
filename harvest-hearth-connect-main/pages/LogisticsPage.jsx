import React from "react";

const LogisticsPage = () => (
  <div className="logistics-container">
    <h2>Logistics & Payment</h2>
    <section className="payment-status">
      <h3>Payment Status</h3>
      <p>Payment Successful!</p>
    </section>
    <section className="logistics-booking">
      <h3>Book Logistics</h3>
      <form>
        <input type="text" placeholder="Pickup Location" required />
        <input type="text" placeholder="Drop Location" required />
        <select>
          <option>Select Truck</option>
          <option>Small Truck</option>
          <option>Medium Truck</option>
          <option>Large Truck</option>
        </select>
        <input type="number" placeholder="Approx. Fare" required />
        <button type="submit">Book</button>
      </form>
      <p>Booking Confirmed!</p>
    </section>
  </div>
);

export default LogisticsPage;
