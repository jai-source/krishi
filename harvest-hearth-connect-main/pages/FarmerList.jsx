import React, { useEffect, useState } from "react";
import { getFarmers } from "../firebase/dbService";

export default function FarmerList() {
  const [farmers, setFarmers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getFarmers();
      setFarmers(data);
    }
    fetchData();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl mb-4">Registered Farmers</h2>
      <table className="border w-full">
        <thead>
          <tr className="bg-gray-200">
            <th>Name</th>
            <th>Aadhar</th>
            <th>Mobile</th>
            <th>Bank Acc</th>
          </tr>
        </thead>
        <tbody>
          {farmers.map(farmer => (
            <tr key={farmer.id} className="border-t">
              <td>{farmer.name}</td>
              <td>{farmer.aadhar}</td>
              <td>{farmer.mobile}</td>
              <td>{farmer.bankAcc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
