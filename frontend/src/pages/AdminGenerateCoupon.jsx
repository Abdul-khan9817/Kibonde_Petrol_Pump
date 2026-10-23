import { useEffect, useState } from 'react';
import api from '../api.js';

const DISCOUNTS = [5, 10, 15, 20, 25, 30];

export default function AdminGenerateCoupon() {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState('');
  const [discount, setDiscount] = useState('');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    api.get('/coupons/users/list')
      .then(({ data }) => setUsers(data))
      .catch((err) => setMessage({ text: 'Error loading users: ' + (err.response?.data?.message || err.message), type: 'error' }));
  }, []);

  const handleGenerate = async () => {
    if (!userId || !discount) {
      setMessage({ text: 'Please select both user and discount.', type: 'error' });
      return;
    }

    try {
      const { data } = await api.post('/coupons', { user_id: userId, discount_percent: discount });
      setMessage({ text: `Coupon ${data.code} generated for ${discount}% discount for the selected user!`, type: 'success' });
    } catch (err) {
      setMessage({ text: 'Error generating coupon: ' + (err.response?.data?.message || err.message), type: 'error' });
    }
  };

  return (
    <>
      <style>{`
        :root {
          --orange: #FF9900; --blue: #009CFF; --black: #0B1F3F; --white: #ffffff;
          --overlay: rgba(0,0,0,0.4); --card-bg: rgba(255,255,255,0.05);
        }
        * { box-sizing: border-box; margin:0; padding:0; font-family: Inter, sans-serif; }
        html, body { height: 100%; }
        .admin-coupon-page {
          min-height: 100vh; background: linear-gradient(135deg, var(--black), var(--blue));
          color: var(--white); display: flex; justify-content: center; align-items: center; padding: 24px;
          position: relative;
        }
        .admin-coupon-page::before {
          content: ""; position: absolute; top:0; left:0; width:100%; height:100%;
          background: var(--overlay); z-index: -1;
        }
        .admin-coupon-page .card {
          background: var(--card-bg); backdrop-filter: blur(12px); padding: 32px; border-radius: 16px;
          max-width: 500px; width: 100%; box-shadow: 0 8px 24px rgba(0,0,0,0.3); text-align: center;
        }
        .admin-coupon-page h1 { font-size: 28px; margin-bottom: 24px; color: var(--white); text-shadow: 1px 1px 6px rgba(0,0,0,0.5); }
        .admin-coupon-page label { display: block; margin-top: 16px; margin-bottom: 6px; font-size: 14px; color: var(--white); }
        .admin-coupon-page select, .admin-coupon-page input {
          width: 100%; padding: 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.2);
          font-size: 14px; background: rgba(255,255,255,0.1); color: var(--white);
        }
        .admin-coupon-page select option, .admin-coupon-page input { background: var(--black); color: var(--white); }
        .admin-coupon-page button {
          margin-top: 24px; padding: 12px; width: 100%; background: var(--orange); color: var(--white);
          border: none; border-radius: 12px; cursor: pointer; font-weight: 600; transition: background 0.2s, transform 0.2s;
        }
        .admin-coupon-page button:hover { background: var(--blue); transform: translateY(-2px); }
        .admin-coupon-page .msg { margin-top: 16px; padding: 12px; border-radius: 12px; font-size: 14px; text-align: center; }
        .admin-coupon-page .msg.success { background: rgba(0,255,128,0.2); color: #00ff80; }
        .admin-coupon-page .msg.error { background: rgba(255,0,0,0.2); color: #ff4d4d; }
        @media(max-width: 480px){
          .admin-coupon-page .card { padding: 24px; border-radius: 12px; }
          .admin-coupon-page h1 { font-size: 24px; }
        }
      `}</style>

      <div className="admin-coupon-page">
        <div className="card">
          <h1>Generate Coupon</h1>

          <label htmlFor="userSelect">Select User</label>
          <select id="userSelect" value={userId} onChange={(e) => setUserId(e.target.value)}>
            <option value="">-- Select User --</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>{user.name} ({user.email})</option>
            ))}
          </select>

          <label htmlFor="discountSelect">Select Discount %</label>
          <select id="discountSelect" value={discount} onChange={(e) => setDiscount(e.target.value)}>
            <option value="">-- Select Discount --</option>
            {DISCOUNTS.map((d) => (
              <option key={d} value={d}>{d}%</option>
            ))}
          </select>

          <button onClick={handleGenerate}>Generate Coupon</button>
          {message && <div className={`msg ${message.type}`}>{message.text}</div>}
        </div>
      </div>
    </>
  );
}
