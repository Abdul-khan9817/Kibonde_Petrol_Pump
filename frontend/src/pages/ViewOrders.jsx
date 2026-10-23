import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';

export default function ViewOrders() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('user_id');
  const [orders, setOrders] = useState(null); // null = loading
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      alert('No user logged in. Redirecting to login page.');
      navigate('/login');
      return;
    }

    api.get(`/orders/user/${userId}`)
      .then(({ data }) => setOrders(data))
      .catch((err) => setError(err.response?.data?.message || err.message));
  }, [userId, navigate]);

  return (
    <>
      <style>{`
        :root {
          --orange: #FF9900; --blue: #009CFF; --black: #0B1F3F; --white: #ffffff;
          --overlay: rgba(0,0,0,0.4); --card-bg: rgba(255,255,255,0.05);
        }
        * { box-sizing: border-box; margin:0; padding:0; font-family: Inter, sans-serif; }
        html, body { height: 100%; }
        .vieworders-page {
          display: flex; flex-direction: column; min-height: 100vh;
          background: linear-gradient(135deg, var(--black), var(--blue)); color: var(--white);
          position: relative;
        }
        .vieworders-page::before {
          content: ""; position: absolute; top:0; left:0; width:100%; height:100%;
          background: var(--overlay); z-index: -1;
        }
        .vieworders-page .container { flex: 1; display: flex; justify-content: center; align-items: center; padding: 40px 20px; }
        .vieworders-page .card {
          background: rgba(11,31,63,0.85); width: 100%; max-width: 1000px;
          border-radius: 16px; padding: 32px; box-shadow: 0 8px 24px rgba(0,0,0,0.3); text-align: center;
        }
        .vieworders-page h1 { margin-bottom: 24px; font-size: 28px; color: var(--white); text-shadow: 1px 1px 6px rgba(0,0,0,0.5); }
        .vieworders-page table { width: 100%; border-collapse: collapse; margin-top: 16px; color: var(--white); }
        .vieworders-page th, .vieworders-page td { padding: 12px; border: 1px solid rgba(255,255,255,0.2); font-size: 14px; text-align: center; }
        .vieworders-page th { background: var(--orange); color: var(--white); }
        .vieworders-page tr:nth-child(even) { background: rgba(255,255,255,0.05); }
        .vieworders-page .no-orders { text-align: center; margin-top: 24px; color: rgba(255,255,255,0.7); }
        .vieworders-page button {
          padding: 12px 24px; margin-top: 24px; background: var(--orange); color: var(--white);
          border: none; border-radius: 12px; cursor: pointer; font-weight: 600;
          transition: background 0.2s, transform 0.2s;
        }
        .vieworders-page button:hover { background: var(--blue); transform: translateY(-2px); }
        .vieworders-page footer {
          display: flex; justify-content: center; gap: 24px; color: var(--white); padding: 24px;
          font-size: 13px; background: rgba(0,0,0,0.5);
          border-top: 1px solid rgba(255,255,255,0.2);
        }
        .vieworders-page footer a { color: var(--white); text-decoration: none; transition: color 0.2s; }
        .vieworders-page footer a:hover { color: var(--orange); }
      `}</style>

      <div className="vieworders-page">
        <div className="container">
          <div className="card">
            <h1>Your Orders</h1>

            {error && <p className="no-orders">Error fetching orders: {error}</p>}

            {!error && orders === null && <p className="no-orders">Loading...</p>}

            {!error && orders && orders.length === 0 && (
              <p className="no-orders">You have no orders yet.</p>
            )}

            {!error && orders && orders.length > 0 && (
              <table>
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Fuel</th>
                    <th>Litres</th>
                    <th>Price ($)</th>
                    <th>Mode</th>
                    <th>Location</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order.order_number || '-'}</td>
                      <td>{order.fuel_type || '-'}</td>
                      <td>{order.number_of_litres || '-'}</td>
                      <td>{order.price || '-'}</td>
                      <td>{order.mode_of_payment || '-'}</td>
                      <td>{order.delivery_location || '-'}</td>
                      <td>{order.status || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <button onClick={() => navigate('/mainpage')}>Back to Main Page</button>
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
