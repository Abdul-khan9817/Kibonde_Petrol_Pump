import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';

function calculatePrice(fuel, litres) {
  let pricePerLitre = 0;
  if (fuel === 'Petrol') pricePerLitre = litres > 100 ? 1.0 : 1.1;
  if (fuel === 'Diesel') pricePerLitre = litres > 100 ? 1.2 : 1.5;
  return pricePerLitre * litres;
}

export default function BuyNow() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('user_id');

  const [fuelType, setFuelType] = useState('Petrol');
  const [litres, setLitres] = useState('');
  const [mode, setMode] = useState('Pickup');
  const [location, setLocation] = useState('');
  const [coupon, setCoupon] = useState('');
  const [summary, setSummary] = useState({
    fuel: 'Petrol',
    litres: 0,
    mode: 'Pickup',
    location: 'N/A',
    couponDisplay: 'N/A',
    price: 0
  });

  useEffect(() => {
    if (!userId) {
      alert('No user logged in. Redirecting to login.');
      navigate('/login');
    }
  }, [userId, navigate]);

  useEffect(() => {
    let active = true;

    async function updateSummary() {
      const litresNum = parseFloat(litres) || 0;
      const loc = mode === 'Delivery' ? (location || 'N/A') : 'N/A';
      const couponCode = coupon.trim();
      let price = calculatePrice(fuelType, litresNum);
      let couponDisplay = 'N/A';

      if (couponCode) {
        try {
          const { data } = await api.get(`/coupons/${encodeURIComponent(couponCode)}`);
          const discount = parseFloat(data.discount_percent);
          price = price * (1 - discount / 100);
          couponDisplay = `${couponCode} (${discount}% off)`;
        } catch {
          couponDisplay = 'Invalid';
        }
      }

      if (active) {
        setSummary({ fuel: fuelType, litres: litresNum, mode, location: loc, couponDisplay, price });
      }
    }

    updateSummary();
    return () => { active = false; };
  }, [fuelType, litres, mode, location, coupon]);

  async function proceedPayment(modeOfPayment) {
    const litresNum = parseFloat(litres);
    if (!litresNum || litresNum <= 0) { alert('Enter valid litres'); return; }
    if (mode === 'Delivery' && (!location || location.trim() === '')) { alert('Enter delivery location'); return; }

    let price = calculatePrice(fuelType, litresNum);
    const couponCode = coupon.trim();
    if (couponCode) {
      try {
        const { data } = await api.get(`/coupons/${encodeURIComponent(couponCode)}`);
        price = price * (1 - parseFloat(data.discount_percent) / 100);
      } catch {
        // invalid coupon, ignore discount
      }
    }

    try {
      const { data: order } = await api.post('/orders', {
        user_id: userId,
        fuel_type: fuelType,
        number_of_litres: litresNum,
        delivery_location: mode === 'Delivery' ? location : null,
        mode_of_payment: modeOfPayment,
        price: Number(price.toFixed(2))
      });
      alert(`Order placed successfully! Your order number: ${order.order_number}\nTotal Price: $${price.toFixed(2)}`);
      navigate('/vieworders');
    } catch (err) {
      alert('Error placing order: ' + (err.response?.data?.message || err.message));
    }
  }

  return (
    <>
      <style>{`
        :root {
          --orange: #FF9900; --blue: #009CFF; --black: #0B1F3F; --white: #ffffff;
          --overlay: rgba(0,0,0,0.4); --card-bg: rgba(255,255,255,0.05);
        }
        * { box-sizing: border-box; margin:0; padding:0; font-family: Inter, sans-serif; }
        html, body { height: 100%; }
        .buynow-page {
          display: flex; flex-direction: column; min-height: 100vh;
          background: linear-gradient(135deg, var(--black), var(--blue)); color: var(--white);
          position: relative;
        }
        .buynow-page::before {
          content: ""; position: absolute; top:0; left:0; width:100%; height:100%;
          background: var(--overlay); z-index: -1;
        }
        .buynow-page .container { flex: 1; display: flex; justify-content: center; align-items: center; padding: 40px 20px; }
        .buynow-page .card {
          background: rgba(11,31,63,0.85); width: 100%; max-width: 500px;
          border-radius: 16px; padding: 32px; box-shadow: 0 8px 24px rgba(0,0,0,0.3);
          text-align: center; transition: transform 0.2s;
        }
        .buynow-page .card:hover { transform: scale(1.02); }
        .buynow-page h1 { margin-bottom: 24px; font-size: 28px; color: var(--white); text-shadow: 1px 1px 6px rgba(0,0,0,0.5); }
        .buynow-page label { display: block; margin-top: 12px; margin-bottom: 4px; color: var(--white); font-size: 14px; }
        .buynow-page select, .buynow-page input[type="text"], .buynow-page input[type="number"] {
          width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2);
          font-size: 14px; background: rgba(255,255,255,0.1); color: var(--white);
        }
        .buynow-page select option, .buynow-page input { background: var(--black); color: var(--white); }
        .buynow-page .radio-group { display: flex; gap: 16px; margin-top: 8px; }
        .buynow-page .summary { margin-top: 16px; padding: 12px; background: rgba(255,255,255,0.1); border-radius: 12px; color: var(--white); text-align: left; }
        .buynow-page .hidden { display: none; }
        .buynow-page button {
          padding: 12px 24px; margin-top: 16px; background: var(--orange); color: var(--white);
          border: none; border-radius: 12px; cursor: pointer; font-weight: 600;
          transition: background 0.2s, transform 0.2s; width: 48%;
        }
        .buynow-page button:hover { background: var(--blue); transform: translateY(-2px); }
        .buynow-page button + button { margin-left: 4%; }
        .buynow-page footer {
          display: flex; justify-content: center; gap: 24px; color: var(--white); padding: 24px;
          font-size: 13px; background: rgba(0,0,0,0.5);
          border-top: 1px solid rgba(255,255,255,0.2);
        }
        .buynow-page footer a { color: var(--white); text-decoration: none; transition: color 0.2s; }
        .buynow-page footer a:hover { color: var(--orange); }
      `}</style>

      <div className="buynow-page">
        <div className="container">
          <div className="card">
            <h1>Buy Fuel</h1>

            <label htmlFor="fuelType">Fuel Type</label>
            <select id="fuelType" value={fuelType} onChange={(e) => setFuelType(e.target.value)}>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
            </select>

            <label htmlFor="litres">Number of Litres</label>
            <input
              type="number"
              id="litres"
              min="1"
              placeholder="Enter number of litres"
              value={litres}
              onChange={(e) => setLitres(e.target.value)}
            />

            <label>Mode</label>
            <div className="radio-group">
              <label>
                <input type="radio" name="mode" value="Pickup" checked={mode === 'Pickup'} onChange={() => setMode('Pickup')} /> Pickup
              </label>
              <label>
                <input type="radio" name="mode" value="Delivery" checked={mode === 'Delivery'} onChange={() => setMode('Delivery')} /> Delivery
              </label>
            </div>

            <div className={mode === 'Delivery' ? '' : 'hidden'}>
              <label htmlFor="location">Delivery Location</label>
              <input
                type="text"
                id="location"
                placeholder="Enter delivery location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <label htmlFor="coupon">Coupon Code (optional)</label>
            <input
              type="text"
              id="coupon"
              placeholder="Enter coupon code"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />

            <div className="summary">
              <strong>Summary:</strong><br />
              Fuel: {summary.fuel}<br />
              Litres: {summary.litres}<br />
              Mode: {summary.mode}<br />
              Location: {summary.location}<br />
              Coupon: {summary.couponDisplay}<br />
              Price: ${summary.price.toFixed(2)}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => proceedPayment('Cash')}>Pay with Cash</button>
              <button onClick={() => proceedPayment('PayNow')}>Pay Now</button>
            </div>
          </div>
        </div>

        <footer>
          <a href="/contact" onClick={(e) => { e.preventDefault(); navigate('/contact'); }}>Contact</a>
          <a href="/help" onClick={(e) => { e.preventDefault(); navigate('/help'); }}>Help</a>
          <a href="/about" onClick={(e) => { e.preventDefault(); navigate('/about'); }}>About</a>
        </footer>
      </div>
    </>
  );
}
