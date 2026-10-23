import logo from "../assets/images/logo.png";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MainPage() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    const storedName = localStorage.getItem('user_name');

    if (!userId || !storedName) {
      alert('No user logged in. Redirecting to login.');
      navigate('/login');
    } else {
      setUserName(storedName);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_name');
    navigate('/login', { replace: true });
  };

  const initial = (userName || 'U').charAt(0).toUpperCase();

  return (
    <>
      <style>{`
        :root {
          --orange: #FF9900;
          --blue: #009CFF;
          --accent: #0b76ef;
          --black: #0B1F3F;
          --white: #ffffff;
          --overlay: rgba(0,0,0,0.4);
          --card-bg: rgba(255,255,255,0.05);
        }
        * { box-sizing: border-box; margin:0; padding:0; font-family: Inter, sans-serif; }
        html, body { height: 100%; }
        .mainpage-page {
          display: flex; flex-direction: column; min-height: 100vh;
          background: linear-gradient(135deg, var(--black), var(--blue));
          color: var(--white);
        }
        .mainpage-page::before {
          content: ""; position: fixed; top:0; left:0; width:100%; height:100%;
          background: var(--overlay); z-index: -1;
        }

        /* Navbar */
        .mainpage-page header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 24px;
          background: linear-gradient(90deg, #ffffff 0%, #e6f0fd 100%);
          box-shadow: 0 4px 16px rgba(0,0,0,0.25);
        }
        .mainpage-page header .logo {
          display: flex; align-items: center; gap: 12px; font-weight: 700; font-size: 24px;
          color: var(--black);
        }
        .mainpage-page .logo-img { height: 45px; width: auto; }

        /* Profile */
        .mainpage-page .profile { position: relative; }
        .mainpage-page .profile-btn {
          display: flex; align-items: center; gap: 12px; padding: 6px 10px; border: none;
          background: transparent; border-radius: 12px; cursor: pointer; color: var(--black);
          transition: background 0.2s;
        }
        .mainpage-page .profile-btn:hover { background: rgba(11,118,239,0.1); }
        .mainpage-page .avatar {
          width: 38px; height: 38px; border-radius: 50%; background: var(--accent); color: var(--white);
          display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px;
          flex-shrink: 0;
        }
        .mainpage-page .profile-text { display: flex; flex-direction: column; align-items: flex-start; line-height: 1.25; text-align: left; }
        .mainpage-page .profile-name { font-size: 14px; font-weight: 700; color: var(--black); }
        .mainpage-page .profile-role { font-size: 12px; font-weight: 500; color: #5b6b82; }
        .mainpage-page .chevron { font-size: 11px; color: var(--black); transition: transform 0.2s; }
        .mainpage-page .chevron.open { transform: rotate(180deg); }

        .mainpage-page .dropdown {
          display: none; position: absolute; right: 0; top: calc(100% + 10px);
          background: var(--black); color: var(--white); border-radius: 12px; min-width: 160px;
          z-index: 5; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }
        .mainpage-page .dropdown.open { display: block; }
        .mainpage-page .dropdown button {
          display: block; padding: 12px 16px; width: 100%; border: none; background: transparent;
          text-align: left; cursor: pointer; color: var(--white); font-weight: 600; transition: background 0.2s;
        }
        .mainpage-page .dropdown button:hover { background: var(--accent); }

        /* Content */
        .mainpage-page .container { flex: 1; padding: 40px 20px; text-align: center; }
        .mainpage-page h1 { margin-bottom: 32px; font-size: 32px; color: var(--white); text-shadow: 1px 1px 6px rgba(0,0,0,0.5); }
        .mainpage-page .services-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; margin-top: 24px;
        }
        .mainpage-page .service-card {
          background: var(--card-bg); backdrop-filter: blur(12px); border-radius: 16px;
          padding: 40px 20px; cursor: pointer; transition: transform 0.3s, background 0.3s;
          display: flex; flex-direction: column; align-items: center; justify-content: center; height: 200px;
        }
        .mainpage-page .service-card:hover { transform: translateY(-8px); background: rgba(255,255,255,0.1); }
        .mainpage-page .service-card h2 { margin-top: 16px; font-size: 20px; color: var(--white); text-shadow: 1px 1px 4px rgba(0,0,0,0.5); }
        .mainpage-page footer {
          display: flex; justify-content: center; gap: 24px; color: var(--white); padding: 24px;
          font-size: 13px; background: rgba(0,0,0,0.5); backdrop-filter: blur(12px);
          border-top: 1px solid rgba(255,255,255,0.2);
        }
        .mainpage-page footer a { color: var(--white); text-decoration: none; transition: color 0.2s; }
        .mainpage-page footer a:hover { color: var(--orange); }

        @media(max-width: 480px){
          .mainpage-page header { padding: 10px 16px; }
          .mainpage-page header .logo { font-size: 18px; gap: 8px; }
          .mainpage-page .logo-img { height: 36px; }
          .mainpage-page .profile-text { display: none; }
          .mainpage-page h1 { font-size: 24px; }
        }
      `}</style>

      <div className="mainpage-page">
        <header>
          <div className="logo">
            <img src={logo} alt="Logo" className="logo-img" />
            <span>Kibonde Fuels</span>
          </div>

          <div className="profile">
            <button className="profile-btn" onClick={() => setDropdownOpen((o) => !o)}>
              <span className="avatar">{initial}</span>
              <span className="profile-text">
                <span className="profile-name">{userName}</span>
                <span className="profile-role">Customer</span>
              </span>
              <span className={`chevron ${dropdownOpen ? 'open' : ''}`}>▼</span>
            </button>
            <div className={`dropdown ${dropdownOpen ? 'open' : ''}`}>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </header>

        <div className="container">
          <h1>{userName ? `Welcome, ${userName}!` : 'Welcome!'}</h1>

          <div className="services-grid">
            <div className="service-card" onClick={() => navigate('/buynow')}>
              <i className="fas fa-gas-pump" style={{ fontSize: 40, color: 'var(--orange)' }}></i>
              <h2>Buy Fuel</h2>
            </div>
            <div className="service-card" onClick={() => navigate('/vieworders')}>
              <i className="fas fa-truck" style={{ fontSize: 40, color: 'var(--orange)' }}></i>
              <h2>View Orders</h2>
            </div>
            <div className="service-card" onClick={() => navigate('/delivery')}>
              <i className="fas fa-map-marker-alt" style={{ fontSize: 40, color: 'var(--orange)' }}></i>
              <h2>Delivery</h2>
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