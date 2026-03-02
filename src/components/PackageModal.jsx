import React, { useState } from 'react';
import './PackageModal.css';

const PackageModal = ({ packages, onPurchase, onClose }) => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    if (!selectedPackage) return;

    setLoading(true);

    // TODO: Integrate Razorpay here
    // For now, just call onPurchase
    
    try {
      await onPurchase(selectedPackage);
    } catch (err) {
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="package-overlay">
      <div className="package-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        
        <div className="package-header">
          <h2>🔒 Choose Your Package</h2>
          <p>Select a package to continue generating programs</p>
        </div>

        <div className="packages-grid">
          {Object.entries(packages).map(([key, pkg]) => (
            <div 
              key={key}
              className={`package-card ${selectedPackage === key ? 'selected' : ''}`}
              onClick={() => setSelectedPackage(key)}
            >
              <div className="package-name">{pkg.name}</div>
              
              <div className="package-price">
                <span className="currency">₹</span>
                <span className="amount">{pkg.price.toLocaleString('en-IN')}</span>
              </div>

              <div className="package-details">
                <div className="detail-item">
                  <span className="icon">📦</span>
                  <span>{pkg.generations} Programs</span>
                </div>
                <div className="detail-item">
                  <span className="icon">⏰</span>
                  <span>{pkg.validity_days} Days Validity</span>
                </div>
                <div className="detail-item">
                  <span className="icon">💰</span>
                  <span>₹{pkg.price_per_program.toLocaleString('en-IN')}/program</span>
                </div>
              </div>

              {key === 'platinum' && (
                <div className="best-value-badge">BEST VALUE</div>
              )}
            </div>
          ))}
        </div>

        <button 
          className="btn-purchase"
          onClick={handlePurchase}
          disabled={!selectedPackage || loading}
        >
          {loading ? 'Processing...' : `Purchase ${selectedPackage ? packages[selectedPackage].name : 'Package'}`}
        </button>
      </div>
    </div>
  );
};

export default PackageModal;
