// src/pages/FarmerRegister.jsx
import React, { useState } from "react";
import { addFarmer } from "../Firebase/DBService";

export default function FarmerRegister() {
  const [form, setForm] = useState({
    name: "",
    aadhar: "",
    mobile: "",
    bankAcc: "",
  });
  const [message, setMessage] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await addFarmer(form);
    if (res.error) setMessage(res.error);
    else setMessage(`Farmer registered! ID: ${res.id}`);
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl mb-4">Farmer Registration</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input name="name" placeholder="Name" onChange={handleChange} required />
        <input name="aadhar" placeholder="Aadhar ID" onChange={handleChange} required />
        <input name="mobile" placeholder="Mobile No" onChange={handleChange} required />
        <input name="bankAcc" placeholder="Bank Account" onChange={handleChange} required />
        <button type="submit" className="btn">Register Farmer</button>
      </form>
      <p className="mt-2">{message}</p>
    </div>
  );
}
