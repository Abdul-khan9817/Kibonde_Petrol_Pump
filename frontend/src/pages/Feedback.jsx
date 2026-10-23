import { useEffect, useState } from 'react';
import api from '../api.js';

export default function Feedback() {
  const [messages, setMessages] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/contact')
      .then(({ data }) => setMessages(data))
      .catch((err) => setError(err.response?.data?.message || err.message));
  }, []);

  return (
    <>
      <style>{`
        :root {
          --accent: #0b76ef; --orange: #FF9900; --black: #0B1F3F; --white: #ffffff;
          --overlay: rgba(0,0,0,0.4); --card-bg: rgba(255,255,255,0.05);
        }
        * { box-sizing: border-box; margin:0; padding:0; font-family: Inter, sans-serif; }
        .feedback-page {
          min-height: 100vh; display: flex; flex-direction: column;
          background: linear-gradient(135deg, var(--black), var(--accent)); color: var(--white); padding: 24px;
          position: relative;
        }
        .feedback-page::before {
          content: ""; position: absolute; top:0; left:0; width:100%; height:100%;
          background: var(--overlay); z-index: -1;
        }
        .feedback-page header {
          padding: 16px 24px; background: rgba(11,31,63,0.7);
          border-radius: 12px; margin-bottom: 32px; text-align: center; font-size: 28px; font-weight: 700;
        }
        .feedback-page .container {
          max-width: 800px; margin: 0 auto; background: rgba(11,31,63,0.7); padding: 32px;
          border-radius: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }
        .feedback-page h1 { text-align: center; margin-bottom: 24px; font-size: 32px; }
        .feedback-page table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        .feedback-page th, .feedback-page td {
          padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.2); text-align: left;
          font-size: 14px; color: var(--white);
        }
        .feedback-page th { font-weight: 600; }
        .feedback-page tr:nth-child(even) { background: rgba(255,255,255,0.05); }
        .feedback-page .msg { padding: 10px; border-radius: 12px; font-size: 13px; margin-bottom: 12px; }
        .feedback-page .msg.error { background: #991b1b; color: #fff1f2; }
        @media(max-width: 600px) {
          .feedback-page .container { padding: 24px; border-radius: 12px; }
          .feedback-page h1 { font-size: 24px; }
          .feedback-page th, .feedback-page td { font-size: 12px; padding: 8px; }
        }
      `}</style>

      <div className="feedback-page">
        <header>Contact Messages Dashboard</header>

        <div className="container">
          {error && <div className="msg error">{error}</div>}
          <h1>Messages</h1>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {messages === null && !error && (
                <tr><td colSpan="5" style={{ textAlign: 'center' }}>Loading messages...</td></tr>
              )}
              {messages && messages.length === 0 && (
                <tr><td colSpan="5" style={{ textAlign: 'center' }}>No messages found</td></tr>
              )}
              {messages && messages.map((msg, index) => (
                <tr key={msg._id}>
                  <td>{index + 1}</td>
                  <td>{msg.name}</td>
                  <td>{msg.email}</td>
                  <td>{msg.message}</td>
                  <td>{new Date(msg.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
