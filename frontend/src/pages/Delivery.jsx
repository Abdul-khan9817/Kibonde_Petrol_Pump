import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';

function getStepIndex(status) {
  switch ((status || '').toLowerCase()) {
    case 'pending': return 0;
    case 'in transit': return 1;
    case 'collected':
    case 'delivered': return 2;
    default: return 0;
  }
}

const stepColors = { 0: 'var(--red)', 1: 'var(--orange)', 2: 'var(--green)' };

function OrderCard({ order }) {
  const currentIndex = getStepIndex(order.status);
  const personIcon = (
    <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
  );

  return (
    <div className="order-card">
      <div className="order-info">
        <div><strong>Order #:</strong> {order.order_number}</div>
        <div><strong>Fuel:</strong> {order.fuel_type}</div>
        <div><strong>Litres:</strong> {order.number_of_litres}</div>
        <div><strong>Location:</strong> {order.delivery_location}</div>
        <div><strong>Status:</strong> {order.status}</div>
      </div>
      <div className="progress-container">
        {[0, 1, 2].map((step) => (
          <div key={step} className={`progress-step ${step === currentIndex ? 'current' : ''}`}>
            <span style={{ display: step === currentIndex ? 'block' : 'none', color: step === currentIndex ? stepColors[currentIndex] : undefined }}>
              {personIcon}
            </span>
          </div>
        ))}
      </div>
      <div className="progress-labels">
        <div>Pending</div>
        <div>In Transit</div>
        <div>Delivered</div>
      </div>
    </div>
  );
}

export default function Delivery() {
  const navigate = useNavigate();
  // MongoDB ids are strings like "65f1...", so keep it as a string (parseInt broke this).
  const userId = localStorage.getItem('user_id');
  const [orders, setOrders] = useState(null); // null = loading
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }

    let active = true;
    async function fetchOrders() {
      try {
        const { data } = await api.get(`/orders/user/${userId}`);
        if (active) {
          setOrders(data);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError(err.response?.data?.message || err.message);
          setOrders((prev) => prev ?? []);
        }
      }
    }

    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => { active = false; clearInterval(interval); };
  }, [userId, navigate]);

  return (
    <>
      <style>{`
        :root {
          --red: #FF4D4D; --orange: #FF9900; --green: #00FF80; --blue: #009CFF;
          --black: #0B1F3F; --white: #ffffff; --overlay: rgba(0,0,0,0.3);
        }
        * { box-sizing: border-box; margin:0; padding:0; font-family: Inter, sans-serif; }
        .delivery-page {
          min-height: 100vh; background: linear-gradient(135deg, var(--black), var(--blue));
          color: var(--white); display: flex; flex-direction: column; padding: 24px;
        }
        .delivery-page::before {
          content: ""; position: fixed; top:0; left:0; width:100%; height:100%;
          background: var(--overlay); z-index: -1;
        }
        .delivery-page header { font-size: 28px; font-weight: 700; text-align: center; margin-bottom: 32px; }
        .delivery-page .order-card { background: rgba(255,255,255,0.05); backdrop-filter: blur(12px); border-radius: 16px; padding: 24px; margin-bottom: 24px; }
        .delivery-page .order-info { margin-bottom: 16px; display: flex; justify-content: space-between; flex-wrap: wrap; }
        .delivery-page .order-info div { margin: 4px 0; }
        .delivery-page .progress-container { display: flex; align-items: center; justify-content: space-between; position: relative; margin-top: 20px; }
        .delivery-page .progress-container::before {
          content: ''; position: absolute; top: 50%; left: 12px; right: 12px; height: 4px;
          background: rgba(255,255,255,0.2); transform: translateY(-50%); z-index: 0; border-radius: 2px;
        }
        .delivery-page .progress-step {
          position: relative; width: 40px; height: 40px; background: rgba(255,255,255,0.2);
          border-radius: 50%; z-index: 1; display: flex; align-items: center; justify-content: center;
          transition: transform 0.3s;
        }
        .delivery-page .progress-step svg { width: 24px; height: 24px; fill: currentColor; }
        .delivery-page .progress-step:not(.current) svg { display: none; }
        .delivery-page .progress-step.current { transform: scale(1.05); }
        .delivery-page .progress-labels { display: flex; justify-content: space-between; margin-top: 8px; font-size: 14px; }
        .delivery-page .progress-labels div { width: 40px; text-align: center; }
        .delivery-page .empty, .delivery-page .error {
          max-width: 500px; margin: 40px auto; padding: 24px; border-radius: 16px; text-align: center;
          background: rgba(255,255,255,0.05); backdrop-filter: blur(12px);
        }
        .delivery-page .error { background: rgba(255,0,0,0.2); color: #ff9d9d; }
        .delivery-page .back-btn {
          align-self: center; margin-top: 16px; padding: 12px 24px; border: none; border-radius: 12px;
          background: var(--orange); color: var(--white); font-weight: 600; font-size: 15px; cursor: pointer;
          transition: transform 0.2s, background 0.2s;
        }
        .delivery-page .back-btn:hover { background: var(--blue); transform: translateY(-2px); }
      `}</style>

      <div className="delivery-page">
        <header>Kibonde Fuels — Delivery Tracker</header>
        <div>
          {orders === null && !error && <div className="empty">Loading your orders...</div>}
          {error && <div className="error">Could not load orders: {error}</div>}
          {orders && orders.length === 0 && !error && (
            <div className="empty">You have no orders to track yet. Place an order and it will show up here.</div>
          )}
          {orders && orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
        <button className="back-btn" onClick={() => navigate('/mainpage')}>Back to Main Page</button>
      </div>
    </>
  );
}