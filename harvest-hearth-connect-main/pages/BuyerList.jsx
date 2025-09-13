import React, { useEffect, useState } from "react";
import { getBuyers } from "../Firebase/DBService";

export default function BuyerList() {
  const [buyers, setBuyers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getBuyers();
      setBuyers(data);
    }
    fetchData();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl mb-4">Registered Buyers</h2>
      <table className="border w-full">
        <thead>
          <tr className="bg-gray-200">
            <th>Business Name</th>
            <th>GST</th>
            <th>Contact</th>
          </tr>
        </thead>
        <tbody>
          {buyers.map(buyer => (
            <tr key={buyer.id} className="border-t">
              <td>{buyer.businessName}</td>
              <td>{buyer.gst}</td>
              <td>{buyer.contact}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
