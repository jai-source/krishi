// Debug component to test buyer registration
import React, { useState } from 'react';
import { registerBuyer } from '../Firebase/authService';

const BuyerRegistrationTest = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const testBuyerRegistration = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Starting buyer registration test...');
      
      const testData = {
        businessName: 'Test Business LLC',
        businessType: 'Wholesale',
        businessLocation: 'Mumbai, Maharashtra',
        contactPerson: 'John Test',
        phoneNumber: '9876543210',
        gstNumber: 'GST123456789'
      };

      const result = await registerBuyer('test-buyer@example.com', 'password123', testData);
      
      console.log('Registration successful:', result);
      setResult(result);
      
      // Check localStorage
      const buyers = JSON.parse(localStorage.getItem('krishisettu-buyers') || '[]');
      console.log('Buyers in localStorage:', buyers);
      
    } catch (error) {
      console.error('Registration failed:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const clearStorage = () => {
    localStorage.removeItem('krishisettu-buyers');
    localStorage.removeItem('krishisettu-current-user');
    localStorage.removeItem('krishisettu-all-users');
    console.log('Storage cleared');
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>Buyer Registration Test</h3>
      <button onClick={testBuyerRegistration} disabled={loading}>
        {loading ? 'Testing...' : 'Test Buyer Registration'}
      </button>
      <button onClick={clearStorage} style={{ marginLeft: '10px' }}>
        Clear Storage
      </button>
      
      {result && (
        <div style={{ marginTop: '10px', color: 'green' }}>
          <strong>Success:</strong>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
      
      {error && (
        <div style={{ marginTop: '10px', color: 'red' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
};

export default BuyerRegistrationTest;
