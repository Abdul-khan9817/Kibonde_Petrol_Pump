import { useNavigate } from 'react-router-dom';
import petrolImg from '../assets/images/petrol.jpg';
import dieselImg from '../assets/images/diesel.jpg';
import deliverImg from '../assets/images/deliver.jpg';
import paymentImg from '../assets/images/payment.jpg';

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        :root {
          --orange: #FF9900;
          --blue: #009CFF;
          --black: #000000;
          --white: #ffffff;
        }
        * { box-sizing: border-box; margin:0; padding:0; font-family: Inter, sans-serif; }
        body {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, #0B1F3F, #009CFF);
          color: var(--white);
        }
        .home-page {
          position: relative;
        }
        .home-page::before {
          content: "";
          position: absolute;
          top: 0; left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.4);
          z-index: -1;
        }
        .home-page header {
          width: 100%;
          padding: 20px;
          background: rgba(0,0,0,0.7);
          color: var(--white);
          text-align: center;
          font-size: 28px;
          font-weight: bold;
          letter-spacing: 1px;
          border-bottom: 2px solid rgba(255,255,255,0.2);
          backdrop-filter: blur(12px);
          position: sticky;
          top: 0;
          z-index: 1000;
        }
        .home-page main {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding: 60px 20px;
          text-align: center;
        }
        .home-page h1 {
          font-size: 36px;
          margin-bottom: 12px;
          color: var(--white);
          text-shadow: 2px 2px 6px rgba(0,0,0,0.7);
        }
        .home-page p {
          margin-bottom: 32px;
          font-size: 18px;
          max-width: 600px;
          color: var(--white);
          text-shadow: 1px 1px 4px rgba(0,0,0,0.7);
        }
        .home-page .buttons {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 40px;
        }
        .home-page .btn {
          padding: 16px 24px;
          font-size: 16px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          color: var(--white);
          background: var(--orange);
          transition: transform 0.2s, background 0.2s;
        }
        .home-page .btn:hover {
          background: var(--blue);
          transform: translateY(-2px);
        }
        .home-page .services-heading {
          font-size: 28px;
          font-weight: bold;
          margin: 40px 0 20px 0;
          color: var(--white);
          text-shadow: 2px 2px 6px rgba(0,0,0,0.7);
          width: 100%;
          text-align: center;
        }
        .home-page .fuel-grid {
          display: flex;
          flex-direction: column;
          width: 100%;
          margin-top: 20px;
          gap: 24px;
        }
        .home-page .fuel-card {
          position: relative;
          width: 100%;
          height: 400px;
          overflow: hidden;
          border-radius: 0;
          box-shadow: 0 6px 20px rgba(0,0,0,0.4);
          cursor: pointer;
          text-decoration: none;
          color: inherit;
          display: block;
          background: rgba(0,0,0,0.2);
        }
        .home-page .fuel-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
          filter: brightness(0.8);
        }
        .home-page .fuel-card:hover img {
          transform: scale(1.2);
        }
        .home-page .fuel-label {
          position: absolute;
          top: 70%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0,0,0,0.5);
          padding: 20px 30px;
          border-radius: 8px;
          font-weight: bold;
          font-size: 22px;
          color: var(--white);
          text-transform: uppercase;
          letter-spacing: 1px;
          opacity: 0.8;
          transition: opacity 0.4s ease, background 0.4s ease;
          text-align: center;
        }
        .home-page .fuel-card:hover .fuel-label {
          opacity: 1;
          background: rgba(0,0,0,0.7);
        }
        .home-page footer {
          padding: 16px;
          color: var(--white);
          font-size: 13px;
          text-align: center;
          background: rgba(0,0,0,0.7);
          border-top: 1px solid rgba(255,255,255,0.2);
        }
        @media (max-width: 768px) {
          .home-page header { font-size: 22px; padding: 16px; }
          .home-page h1 { font-size: 28px; }
          .home-page p { font-size: 16px; }
          .home-page .btn { font-size: 14px; padding: 12px 18px; }
          .home-page .fuel-card { height: 300px; }
          .home-page .fuel-label { font-size: 18px; padding: 14px 20px; top: 70%; }
          .home-page .services-heading { font-size: 24px; margin: 30px 0 15px 0; }
        }
        @media (max-width: 480px) {
          .home-page h1 { font-size: 22px; }
          .home-page .buttons { flex-direction: column; gap: 12px; }
          .home-page .btn { width: 100%; max-width: 250px; }
          .home-page .fuel-card { height: 250px; }
          .home-page .fuel-label { font-size: 16px; top: 70%; }
          .home-page .services-heading { font-size: 20px; margin: 20px 0 10px 0; }
        }
      `}</style>

      <div className="home-page">
        <header>Kibonde Fuels</header>

        <main>
          <h1>Welcome to Kibonde Fuels</h1>
          <p>Efficient fuel delivery and pickup services at your fingertips. Buy fuel, track your orders, and enjoy exclusive discounts.</p>

          <div className="buttons">
            <button className="btn" onClick={() => navigate('/login')}>User Login</button>
            <button className="btn" onClick={() => navigate('/admin-login')}>Admin Login</button>
          </div>

          <div className="services-heading">Our Services</div>

          <div className="fuel-grid">
            <a href="/login" className="fuel-card" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>
              <img src={petrolImg} alt="Petrol" />
              <div className="fuel-label">Petrol</div>
            </a>
            <a href="/login" className="fuel-card" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>
              <img src={dieselImg} alt="Diesel" />
              <div className="fuel-label">Diesel</div>
            </a>
            <a href="/login" className="fuel-card" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>
              <img src={deliverImg} alt="Delivery" />
              <div className="fuel-label">Delivery</div>
            </a>
            <a href="/login" className="fuel-card" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>
              <img src={paymentImg} alt="Cash & Online Payment" />
              <div className="fuel-label">Cash & Online Payment</div>
            </a>
          </div>
        </main>

        <footer>&copy; 2025 Kibonde Fuels. All rights reserved.</footer>
      </div>
    </>
  );
}
