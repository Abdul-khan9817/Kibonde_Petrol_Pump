import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';
import { clearAdminSession } from '../auth.js';

const STATUS_OPTIONS = ['pending', 'in transit', 'collected', 'delivered'];

export default function AdminManageOrders() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [pendingStatus, setPendingStatus] = useState({}); // orderId -> selected status

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (err) {
      alert('Error fetching orders: ' + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleLogout = () => {
    clearAdminSession();
    navigate('/admin-login', { replace: true });
  };

  const handleStatusChange = (orderId, value) => {
    setPendingStatus((prev) => ({ ...prev, [orderId]: value }));
  };

  const handleUpdate = async (order) => {
    const newStatus = pendingStatus[order._id] ?? order.status;
    try {
      await api.patch(`/orders/${order._id}/status`, { status: newStatus });
      alert('Status updated successfully!');
      fetchOrders();
    } catch (err) {
      alert('Error updating status: ' + (err.response?.data?.message || err.message));
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
        .admin-orders-page {
          min-height: 100vh; background: linear-gradient(135deg, var(--black), var(--blue));
          color: var(--white); display: flex; flex-direction: column;
        }
        .admin-orders-page::before {
          content: ""; position: fixed; top:0; left:0; width:100%; height:100%;
          background: var(--overlay); z-index: -1;
        }
        .admin-orders-page header {
          display: flex; justify-content: space-between; align-items: center; padding: 16px 24px;
          background: rgba(0,0,0,0.5); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.2);
        }
        .admin-orders-page header .logo { font-weight: 700; font-size: 24px; }
        .admin-orders-page .profile { position: relative; display: inline-block; }
        .admin-orders-page .profile-btn { background: transparent; border: none; color: var(--white); cursor: pointer; font-size: 14px; }
        .admin-orders-page .dropdown {
          display: none; position: absolute; right: 0; top: 28px; background: var(--black); color: var(--white);
          border-radius: 12px; min-width: 160px; z-index: 5; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }
        .admin-orders-page .dropdown.open { display: block; }
        .admin-orders-page .dropdown button {
          display: block; padding: 12px 16px; width: 100%; border: none; background: transparent;
          text-align: left; cursor: pointer; color: var(--white); font-weight: 600;
        }
        .admin-orders-page .dropdown button:hover { background: rgba(255,255,255,0.1); }
        .admin-orders-page .container { flex: 1; padding: 40px 20px; display: flex; flex-direction: column; align-items: center; }
        .admin-orders-page h1 { margin-bottom: 32px; font-size: 28px; text-shadow: 1px 1px 6px rgba(0,0,0,0.5); }
        .admin-orders-page .table-card {
          width: 100%; max-width: 1000px; background: var(--card-bg); backdrop-filter: blur(12px);
          border-radius: 16px; padding: 24px; overflow-x: auto;
        }
        .admin-orders-page table { width: 100%; border-collapse: collapse; color: var(--white); }
        .admin-orders-page th, .admin-orders-page td { border: 1px solid rgba(255,255,255,0.2); padding: 12px; text-align: left; font-size: 14px; }
        .admin-orders-page th { background: rgba(255,255,255,0.1); }
        .admin-orders-page select {
          padding: 6px 8px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.3);
          background: rgba(0,0,0,0.2); color: var(--white);
        }
        .admin-orders-page button.updateBtn {
          background: var(--orange); color: var(--white); padding: 6px 12px; border: none;
          border-radius: 12px; cursor: pointer; font-weight: 600; transition: background 0.2s, transform 0.2s;
        }
        .admin-orders-page button.updateBtn:hover { background: var(--blue); transform: translateY(-2px); }
        @media(max-width: 768px){
          .admin-orders-page table { font-size: 12px; }
          .admin-orders-page th, .admin-orders-page td { padding: 8px; }
        }
      `}</style>

      <div className="admin-orders-page">
        <header>
          <div className="logo">Admin Dashboard</div>
          <div className="profile">
            <button className="profile-btn" onClick={() => setDropdownOpen((o) => !o)}>Profile ▼</button>
            <div className={`dropdown ${dropdownOpen ? 'open' : ''}`}>
              <button onClick={() => navigate('/admin_dashboard')}>Dashboard</button>
              <button onClick={() => navigate('/admin_profile')}>My Profile</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </header>

        <div className="container">
          <h1>Manage Orders</h1>
          <div className="table-card">
            <table>
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Fuel</th>
                  <th>Litres</th>
                  <th>Location</th>
                  <th>Payment</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.order_number}</td>
                    <td>{order.fuel_type}</td>
                    <td>{order.number_of_litres}</td>
                    <td>{order.delivery_location}</td>
                    <td>{order.mode_of_payment}</td>
                    <td>{order.price}</td>
                    <td>
                      <select
                        value={pendingStatus[order._id] ?? order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt.charAt(0).toUpperCase() + opt.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td><button className="updateBtn" onClick={() => handleUpdate(order)}>Update</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}