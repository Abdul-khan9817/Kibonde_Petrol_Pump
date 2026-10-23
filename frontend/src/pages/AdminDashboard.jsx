import logo from "../assets/images/logo.png";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminName, clearAdminSession } from '../auth.js';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const adminName = getAdminName();
  const initial = (adminName || 'A').charAt(0).toUpperCase();

  const handleLogout = () => {
    clearAdminSession();
    navigate('/admin-login', { replace: true });
  };

  return (
    <>
      <style>{`
        :root {
          --accent: #0b76ef; --orange: #FF9900; --black: #0B1F3F; --white: #ffffff;
          --overlay: rgba(0,0,0,0.2); --card-bg: rgba(255,255,255,0.05);
        }
        * { box-sizing: border-box; margin:0; padding:0; font-family: Inter, sans-serif; }
        html, body { height: 100%; }
        .admin-dashboard-page {
          min-height: 100vh; display: flex; flex-direction: column;
          background: linear-gradient(135deg, var(--black), var(--accent)); color: var(--white);
        }
        .admin-dashboard-page::before {
          content: ""; position: fixed; top:0; left:0; width:100%; height:100%;
          background: var(--overlay); z-index: -1;
        }

        /* Navbar (same as MainPage) */
        .admin-dashboard-page header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 24px;
          background: linear-gradient(90deg, #ffffff 0%, #e6f0fd 100%);
          box-shadow: 0 4px 16px rgba(0,0,0,0.25);
        }
        .admin-dashboard-page header .logo {
          display: flex; align-items: center; gap: 12px; font-weight: 700; font-size: 24px;
          color: var(--black);
        }
        .admin-dashboard-page .logo-img { height: 45px; width: auto; }

        /* Profile */
        .admin-dashboard-page .profile { position: relative; }
        .admin-dashboard-page .profile-btn {
          display: flex; align-items: center; gap: 12px; padding: 6px 10px; border: none;
          background: transparent; border-radius: 12px; cursor: pointer; color: var(--black);
          transition: background 0.2s;
        }
        .admin-dashboard-page .profile-btn:hover { background: rgba(11,118,239,0.1); }
        .admin-dashboard-page .avatar {
          width: 38px; height: 38px; border-radius: 50%; background: var(--accent); color: var(--white);
          display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px;
          flex-shrink: 0;
        }
        .admin-dashboard-page .profile-text { display: flex; flex-direction: column; align-items: flex-start; line-height: 1.25; text-align: left; }
        .admin-dashboard-page .profile-name { font-size: 14px; font-weight: 700; color: var(--black); }
        .admin-dashboard-page .profile-role { font-size: 12px; font-weight: 500; color: #5b6b82; }
        .admin-dashboard-page .chevron { font-size: 11px; color: var(--black); transition: transform 0.2s; }
        .admin-dashboard-page .chevron.open { transform: rotate(180deg); }

        .admin-dashboard-page .dropdown {
          display: none; position: absolute; right: 0; top: calc(100% + 10px);
          background: var(--black); color: var(--white); border-radius: 12px; min-width: 180px;
          z-index: 5; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }
        .admin-dashboard-page .dropdown.open { display: block; }
        .admin-dashboard-page .dropdown button {
          display: block; padding: 12px 16px; width: 100%; border: none; background: transparent;
          color: var(--white); text-align: left; cursor: pointer; font-weight: 600; transition: background 0.2s;
        }
        .admin-dashboard-page .dropdown button:hover { background: var(--accent); }

        /* Content */
        .admin-dashboard-page .container {
          flex: 1; display: flex; flex-direction: column; align-items: center; gap: 40px; padding: 40px 24px;
        }
        .admin-dashboard-page h1 { font-size: 28px; text-align: center; text-shadow: 1px 1px 6px rgba(0,0,0,0.5); }
        .admin-dashboard-page .buttons { display: flex; gap: 24px; flex-wrap: wrap; justify-content: center; }
        .admin-dashboard-page .buttons button {
          display: flex; align-items: center; justify-content: center; gap: 8px; padding: 16px 32px;
          font-size: 16px; border: none; border-radius: 16px; cursor: pointer; font-weight: 600;
          color: var(--white); background: var(--accent); backdrop-filter: blur(12px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.3); transition: transform 0.2s, background 0.2s;
        }
        .admin-dashboard-page .buttons button:hover { background: var(--orange); transform: translateY(-2px); }
        .admin-dashboard-page .btn-icon { width: 20px; height: 20px; stroke-width: 2; stroke: currentColor; transition: transform 0.2s; }
        .admin-dashboard-page .buttons button:hover .btn-icon { transform: scale(1.1); }

        @media(max-width: 480px){
          .admin-dashboard-page header { padding: 10px 16px; }
          .admin-dashboard-page header .logo { font-size: 18px; gap: 8px; }
          .admin-dashboard-page .logo-img { height: 36px; }
          .admin-dashboard-page .profile-text { display: none; }
          .admin-dashboard-page .buttons { flex-direction: column; gap: 16px; width: 100%; }
          .admin-dashboard-page .buttons button { width: 100%; }
        }
      `}</style>

      <div className="admin-dashboard-page">
        <header>
          <div className="logo">
            <img src={logo} alt="Logo" className="logo-img" />
            <span>Kibonde Fuels</span>
          </div>

          <div className="profile">
            <button className="profile-btn" onClick={() => setDropdownOpen((o) => !o)}>
              <span className="avatar">{initial}</span>
              <span className="profile-text">
                <span className="profile-name">{adminName}</span>
                <span className="profile-role">Admin</span>
              </span>
              <span className={`chevron ${dropdownOpen ? 'open' : ''}`}>▼</span>
            </button>
            <div className={`dropdown ${dropdownOpen ? 'open' : ''}`}>
              <button onClick={() => navigate('/admin_profile')}>My Profile</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </header>

        <div className="container">
          <h1>Welcome, {adminName}!</h1>
          <div className="buttons">
            <button onClick={() => navigate('/admin_manage_orders')}>
              <svg xmlns="http://www.w3.org/2000/svg" className="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m2 0a2 2 0 012 2v4a2 2 0 01-2 2H7a2 2 0 01-2-2v-4a2 2 0 012-2h6zM9 12V6a2 2 0 012-2h2a2 2 0 012 2v6" />
              </svg>
              Manage Orders
            </button>

            <button onClick={() => navigate('/admin_generate_coupon')}>
              <svg xmlns="http://www.w3.org/2000/svg" className="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2-8h.01M6 8h.01M3 6h18v12H3V6z" />
              </svg>
              Generate Coupon
            </button>

            <button onClick={() => navigate('/feedback')}>
              <svg xmlns="http://www.w3.org/2000/svg" className="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m0 8v-8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2z" />
              </svg>
              View Messages
            </button>
          </div>
        </div>
      </div>
    </>
  );
}