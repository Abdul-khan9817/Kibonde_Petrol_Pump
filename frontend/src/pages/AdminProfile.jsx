import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';
import { getAdminName, updateAdminInfo, clearAdminSession } from '../auth.js';

export default function AdminProfile() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Profile form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profilePassword, setProfilePassword] = useState('');
  const [profileMsg, setProfileMsg] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState(null);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    api.get('/admin/profile')
      .then(({ data }) => {
        setName(data.name);
        setEmail(data.email || '');
      })
      .catch((err) => {
        setProfileMsg({ text: err.response?.data?.message || 'Could not load profile', type: 'error' });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    clearAdminSession();
    navigate('/admin-login', { replace: true });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg(null);
    setSavingProfile(true);
    try {
      const { data } = await api.put('/admin/profile', { name, email, currentPassword: profilePassword });
      updateAdminInfo(data);
      setName(data.name);
      setEmail(data.email || '');
      setProfilePassword('');
      setProfileMsg({ text: 'Profile updated successfully.', type: 'success' });
    } catch (err) {
      setProfileMsg({ text: err.response?.data?.message || 'Unexpected error occurred', type: 'error' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword.length < 8) {
      setPasswordMsg({ text: 'New password must be at least 8 characters.', type: 'error' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: 'New password and confirmation do not match.', type: 'error' });
      return;
    }

    setSavingPassword(true);
    try {
      await api.put('/admin/password', { currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordMsg({ text: 'Password changed successfully.', type: 'success' });
    } catch (err) {
      setPasswordMsg({ text: err.response?.data?.message || 'Unexpected error occurred', type: 'error' });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <>
      <style>{`
        :root {
          --accent: #0b76ef; --orange: #FF9900; --blue: #009CFF; --black: #0B1F3F; --white: #ffffff;
          --overlay: rgba(0,0,0,0.2); --card-bg: rgba(255,255,255,0.05);
        }
        * { box-sizing: border-box; margin:0; padding:0; font-family: Inter, sans-serif; }
        .admin-profile-page {
          min-height: 100vh; display: flex; flex-direction: column;
          background: linear-gradient(135deg, var(--black), var(--accent)); color: var(--white); padding: 24px;
        }
        .admin-profile-page::before {
          content: ""; position: fixed; top:0; left:0; width:100%; height:100%;
          background: var(--overlay); z-index: -1;
        }
        .admin-profile-page header {
          display: flex; justify-content: space-between; align-items: center; padding: 16px 24px;
          background: var(--card-bg); backdrop-filter: blur(12px); border-radius: 12px; margin-bottom: 32px;
        }
        .admin-profile-page header .logo { font-weight: 700; font-size: 24px; }
        .admin-profile-page .profile { position: relative; }
        .admin-profile-page .profile-btn { background: transparent; border: none; color: var(--white); cursor: pointer; font-weight: 600; font-size: 14px; }
        .admin-profile-page .dropdown {
          display: none; position: absolute; right: 0; top: 28px; background: var(--black); color: var(--white);
          border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.3); min-width: 160px; z-index: 5; overflow: hidden;
        }
        .admin-profile-page .dropdown.open { display: block; }
        .admin-profile-page .dropdown button {
          display: block; padding: 12px 16px; width: 100%; border: none; background: transparent;
          color: var(--white); text-align: left; cursor: pointer; font-weight: 600; transition: background 0.2s;
        }
        .admin-profile-page .dropdown button:hover { background: var(--accent); }
        .admin-profile-page .container {
          flex: 1; display: flex; flex-wrap: wrap; justify-content: center; align-items: flex-start; gap: 24px;
        }
        .admin-profile-page .card {
          background: var(--card-bg); backdrop-filter: blur(12px); border-radius: 16px; padding: 28px;
          width: 100%; max-width: 440px; box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }
        .admin-profile-page h1 { text-align: center; font-size: 28px; margin-bottom: 24px; width: 100%; text-shadow: 1px 1px 6px rgba(0,0,0,0.5); }
        .admin-profile-page h2 { font-size: 20px; margin-bottom: 16px; }
        .admin-profile-page form { display: grid; gap: 14px; }
        .admin-profile-page label { font-size: 13px; color: rgba(255,255,255,0.8); display: block; margin-bottom: 6px; }
        .admin-profile-page input {
          width: 100%; padding: 12px 14px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.08); color: var(--white); font-size: 14px;
        }
        .admin-profile-page input::placeholder { color: rgba(255,255,255,0.5); }
        .admin-profile-page .hint { font-size: 12px; color: rgba(255,255,255,0.6); margin-top: 4px; }
        .admin-profile-page button.primary {
          background: var(--orange); color: var(--white); padding: 12px 16px; border-radius: 12px; border: none;
          font-weight: 600; cursor: pointer; font-size: 15px; transition: transform 0.2s, background 0.2s;
        }
        .admin-profile-page button.primary:hover:not(:disabled) { background: var(--blue); transform: translateY(-2px); }
        .admin-profile-page button.primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .admin-profile-page .msg { padding: 10px 12px; border-radius: 12px; font-size: 13px; margin-bottom: 14px; }
        .admin-profile-page .msg.success { background: #065f46; color: #ecfdf5; }
        .admin-profile-page .msg.error { background: #991b1b; color: #fff1f2; }
        @media(max-width: 480px){
          .admin-profile-page header { flex-direction: column; align-items: flex-start; gap: 12px; }
          .admin-profile-page .card { padding: 20px; }
        }
      `}</style>

      <div className="admin-profile-page">
        <header>
          <div className="logo">Kizongo Fuel Admin</div>
          <div className="profile">
            <button className="profile-btn" onClick={() => setDropdownOpen((o) => !o)}>Profile ▼</button>
            <div className={`dropdown ${dropdownOpen ? 'open' : ''}`}>
              <button onClick={() => navigate('/admin_dashboard')}>Dashboard</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </header>

        <div className="container">
          <h1>My Profile{!loading && name ? ` – ${name}` : ` – ${getAdminName()}`}</h1>

          <section className="card">
            <h2>Account details</h2>
            {profileMsg && <div className={`msg ${profileMsg.type}`}>{profileMsg.text}</div>}
            <form onSubmit={handleProfileSubmit}>
              <div>
                <label htmlFor="pf-name">Name</label>
                <input id="pf-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <label htmlFor="pf-email">Email</label>
                <input id="pf-email" type="email" placeholder="admin@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                <p className="hint">You can log in with either your name or your email.</p>
              </div>
              <div>
                <label htmlFor="pf-pass">Current password (to confirm changes)</label>
                <input id="pf-pass" type="password" value={profilePassword} onChange={(e) => setProfilePassword(e.target.value)} required />
              </div>
              <button className="primary" type="submit" disabled={savingProfile || loading}>
                {savingProfile ? 'Saving...' : 'Save changes'}
              </button>
            </form>
          </section>

          <section className="card">
            <h2>Change password</h2>
            {passwordMsg && <div className={`msg ${passwordMsg.type}`}>{passwordMsg.text}</div>}
            <form onSubmit={handlePasswordSubmit}>
              <div>
                <label htmlFor="pw-current">Current password</label>
                <input id="pw-current" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
              </div>
              <div>
                <label htmlFor="pw-new">New password</label>
                <input id="pw-new" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                <p className="hint">At least 8 characters.</p>
              </div>
              <div>
                <label htmlFor="pw-confirm">Confirm new password</label>
                <input id="pw-confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </div>
              <button className="primary" type="submit" disabled={savingPassword}>
                {savingPassword ? 'Updating...' : 'Update password'}
              </button>
            </form>
          </section>
        </div>
      </div>
    </>
  );
}