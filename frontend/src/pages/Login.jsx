import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';

export default function Login() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const toggleMode = () => {
    setIsSignUp((prev) => !prev);
    setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);

    try {
      if (isSignUp) {
        const { data } = await api.post('/auth/signup', {
          name,
          email,
          password,
          mobile,
        });

        setMessage({
          text: data.message || 'Account created successfully. You can now sign in.',
          type: 'success',
        });
        setIsSignUp(false);
      } else {
        const { data } = await api.post('/auth/login', { email, password });
        setMessage({ text: `Welcome, ${data.name}!`, type: 'success' });
        localStorage.setItem('user_id', data.user_id);
        localStorage.setItem('user_name', data.name);
        navigate('/mainpage');
      }
    } catch (err) {
      const text = err.response?.data?.message || 'Unexpected error occurred.';
      setMessage({ text, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        :root {
          --accent: #0b76ef;
          --orange: #FF9900;
          --black: #0B1F3F;
          --white: #ffffff;
          --overlay: rgba(0,0,0,0.2);
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: Inter, sans-serif;
        }

        .login-page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, var(--black), var(--accent));
          color: var(--white);
          padding: 24px;
          position: relative;
        }

        .login-page::before {
          content: "";
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: var(--overlay);
          z-index: -1;
        }

        .login-page .card {
          background: rgba(11,31,63,0.92);
          width: 100%;
          max-width: 420px;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.4);
          color: var(--white);
        }

        .login-page header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .login-page .logo {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          background: var(--orange);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 20px;
          color: var(--white);
          flex-shrink: 0;
        }

        .login-page h1 {
          font-size: 24px;
          margin: 0;
        }

        .login-page p.lead {
          margin: 4px 0 0;
          font-size: 14px;
          color: rgba(255,255,255,0.7);
        }

        .login-page form {
          display: grid;
          gap: 16px;
        }

        .login-page label {
          font-size: 13px;
          color: rgba(255,255,255,0.8);
          display: block;
          margin-bottom: 6px;
        }

        .login-page .input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .login-page .input-icon {
          position: absolute;
          left: 12px;
          width: 18px;
          height: 18px;
          stroke: rgba(255,255,255,0.5);
          pointer-events: none;
          flex-shrink: 0;
        }

        .login-page .input-wrap input {
          width: 100%;
          padding: 12px 14px 12px 38px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.1);
          color: var(--white);
          font-size: 14px;
        }

        .login-page .input-wrap input::placeholder {
          color: rgba(255,255,255,0.5);
        }

        /* Keep icons visible when the browser gives autofilled inputs a light background. */
        .login-page .input-wrap:has(input:-webkit-autofill) .input-icon,
        .login-page .input-wrap:has(input:autofill) .input-icon {
          stroke: #64748b;
          opacity: 1;
          z-index: 1;
        }

        .login-page .eye-btn {
          position: absolute;
          right: 12px;
          background: transparent !important;
          border: none;
          padding: 0;
          cursor: pointer;
          display: flex;
          align-items: center;
          box-shadow: none !important;
          width: auto !important;
        }

        .login-page .eye-btn:hover {
          background: transparent !important;
          transform: none !important;
        }

        .login-page .eye-btn svg {
          width: 18px;
          height: 18px;
          stroke: rgba(255,255,255,0.6);
        }

        .login-page .input-wrap:has(input:-webkit-autofill) .eye-btn svg,
        .login-page .input-wrap:has(input:autofill) .eye-btn svg {
          stroke: #64748b !important;
        }

        .login-page .submit-btn {
          width: 100%;
          background: var(--accent);
          color: var(--white);
          padding: 12px 16px;
          border-radius: 12px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          font-size: 16px;
          transition: transform 0.2s, background 0.2s;
        }

        .login-page .submit-btn:hover {
          background: var(--orange);
          transform: translateY(-2px);
        }

        .login-page .toggle-btn {
          display: inline-block;
          background: transparent !important;
          border: none;
          color: var(--accent);
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          padding: 8px 0 0;
          margin-top: 8px;
          width: auto !important;
          box-shadow: none !important;
          text-align: left;
        }

        .login-page .toggle-btn:hover {
          background: transparent !important;
          transform: none !important;
          text-decoration: underline;
          color: var(--orange);
        }

        .login-page .msg {
          padding: 10px;
          border-radius: 12px;
          font-size: 13px;
          margin-bottom: 12px;
        }

        .login-page .msg.success {
          background: #065f46;
          color: #ecfdf5;
        }

        .login-page .msg.error {
          background: #991b1b;
          color: #fff1f2;
        }

        .login-page .spinner {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.4);
          border-left-color: white;
          display: inline-block;
          vertical-align: middle;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media(max-width: 480px) {
          .login-page .card {
            padding: 24px;
            border-radius: 12px;
          }

          .login-page h1 {
            font-size: 20px;
          }
        }
      `}</style>

      <div className="login-page">
        <main className="card" role="main">
          <header>
            <div className="logo">KF</div>
            <div>
              <h1>Kibonde Fuels</h1>
              <p className="lead">
                {isSignUp
                  ? 'Create your account'
                  : 'Sign in with your email and password'}
              </p>
            </div>
          </header>

          <div aria-live="polite">
            {message && (
              <div className={`msg ${message.type}`}>{message.text}</div>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">Name</label>
              <div className="input-wrap">
                <svg
                  className="input-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
                <input
                  id="name"
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isSignUp}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email">Email</label>
              <div className="input-wrap">
                <svg
                  className="input-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0-9.75 6.75L2.25 6.75"
                  />
                </svg>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <div className="input-wrap">
                <svg
                  className="input-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ paddingRight: '40px' }}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword((p) => !p)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.8}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.8}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="mobile">Mobile Number</label>
              <div className="input-wrap">
                <svg
                  className="input-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
                  />
                </svg>
                <input
                  id="mobile"
                  type="text"
                  placeholder="Your mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner"></span> Processing...
                </>
              ) : isSignUp ? (
                'Sign up'
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <button
            type="button"
            className="toggle-btn"
            onClick={toggleMode}
          >
            {isSignUp
              ? 'Already have an account? Sign in'
              : "Don't have an account? Sign up"}
          </button>
        </main>
      </div>
    </>
  );
}