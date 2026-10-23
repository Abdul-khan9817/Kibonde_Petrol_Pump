import { useState } from 'react';
import api from '../api.js';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);

    try {
      await api.post('/contact', { name, email, message: messageInput });
      setMessage({ text: 'Thank you! Your message has been sent.', type: 'success' });
      setName('');
      setEmail('');
      setMessageInput('');
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Unexpected error occurred', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        :root {
          --accent: #0b76ef; --orange: #FF9900; --black: #0B1F3F; --white: #ffffff;
          --overlay: rgba(0,0,0,0.4); --card-bg: rgba(255,255,255,0.05);
        }
        * { box-sizing: border-box; margin:0; padding:0; font-family: Inter, sans-serif; }
        .contact-page {
          min-height: 100vh; display: flex; flex-direction: column;
          background: linear-gradient(135deg, var(--black), var(--accent)); color: var(--white); padding: 24px;
          position: relative;
        }
        .contact-page::before {
          content: ""; position: absolute; top:0; left:0; width:100%; height:100%;
          background: var(--overlay); z-index: -1;
        }
        .contact-page header {
          padding: 16px 24px; background: rgba(11,31,63,0.7);
          border-radius: 12px; margin-bottom: 32px; text-align: center; font-size: 28px; font-weight: 700;
        }
        .contact-page .container {
          max-width: 600px; margin: 0 auto; background: rgba(11,31,63,0.7); padding: 32px;
          border-radius: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }
        .contact-page h1 { text-align: center; margin-bottom: 24px; font-size: 32px; }
        .contact-page label { display:block; margin-top: 12px; margin-bottom:4px; font-size:14px; color:var(--white); }
        .contact-page input, .contact-page textarea {
          width:100%; padding:12px; border-radius:12px; border:1px solid rgba(255,255,255,0.3);
          background:rgba(255,255,255,0.05); color:var(--white); font-size:14px; font-family: Inter, sans-serif;
        }
        .contact-page button {
          margin-top: 20px; padding:12px; width:100%; border:none; border-radius:12px;
          font-weight:600; background:var(--accent); color:var(--white); cursor:pointer;
          transition: transform 0.2s, background 0.2s;
        }
        .contact-page button:hover { background:var(--orange); transform: translateY(-2px); }
        .contact-page .msg { padding: 10px; border-radius: 12px; font-size: 13px; margin-top: 12px; }
        .contact-page .msg.success { background: #065f46; color: #ecfdf5; }
        .contact-page .msg.error { background: #991b1b; color: #fff1f2; }
        .contact-page .spinner {
          width: 16px; height: 16px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.4);
          border-left-color: white; display: inline-block; vertical-align: middle; animation: spin 1s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media(max-width: 480px) {
          .contact-page .container { padding: 24px; border-radius: 12px; }
          .contact-page h1 { font-size: 24px; }
        }
      `}</style>

      <div className="contact-page">
        <header>Contact Us</header>

        <div className="container">
          <h1>Get in Touch</h1>
          <p>If you have any questions, inquiries, or feedback, feel free to reach out to us. Our team is here to help and provide information regarding our fuel supply services.</p>

          {message && <div className={`msg ${message.type}`}>{message.text}</div>}

          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name</label>
            <input id="name" type="text" placeholder="Your Name" required value={name} onChange={(e) => setName(e.target.value)} />

            <label htmlFor="email">Email</label>
            <input id="email" type="email" placeholder="Your Email" required value={email} onChange={(e) => setEmail(e.target.value)} />

            <label htmlFor="messageInput">Message</label>
            <textarea id="messageInput" rows="5" placeholder="Write your message..." required value={messageInput} onChange={(e) => setMessageInput(e.target.value)}></textarea>

            <button type="submit" disabled={submitting}>
              {submitting ? (<><span className="spinner"></span> Sending...</>) : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
