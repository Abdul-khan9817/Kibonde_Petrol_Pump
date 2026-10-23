export default function About() {
  return (
    <>
      <style>{`
        :root {
          --accent: #0b76ef; --orange: #FF9900; --black: #0B1F3F; --white: #ffffff;
          --overlay: rgba(0,0,0,0.2); --card-bg: rgba(255,255,255,0.05);
        }
        * { box-sizing: border-box; margin:0; padding:0; font-family: Inter, sans-serif; }
        .about-page {
          position: relative;
          min-height: 100vh; display: flex; flex-direction: column;
          background: linear-gradient(135deg, var(--black), var(--accent)); color: var(--white); padding: 24px;
        }
        .about-page::before {
          content: ""; position: absolute; top:0; left:0; width:100%; height:100%;
          background: var(--overlay); z-index: -1;
        }
        .about-page header {
          padding: 16px 24px; background: rgba(11,31,63,0.7);
          border-radius: 12px; margin-bottom: 32px; text-align: center; font-size: 28px; font-weight: 700;
        }
        .about-page .container {
          max-width: 900px; margin: 0 auto; background: rgba(11,31,63,0.7); padding: 32px;
          border-radius: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }
        .about-page h1 { text-align: center; margin-bottom: 24px; font-size: 32px; }
        .about-page p { font-size: 16px; line-height: 1.6; margin-bottom: 16px; color: var(--white); }
      `}</style>

      <div className="about-page">
        <header>Kibonde Fuels</header>

        <div className="container">
          <h1>About Us</h1>
          <p>Kibonde Fuels was founded by <strong>Kibonde Mzungu</strong>, an entrepreneur passionate about energy solutions in Tanzania. Our company is dedicated to supplying high-quality fuel across the nation, ensuring reliable service to both individual and corporate clients.</p>
          <p>From our headquarters in Tanzania, we have partnered with well-known companies and multiple fuel stations, providing consistent and efficient fuel supply. Our mission is to become a leading fuel supplier in every region of Tanzania, supporting economic growth and mobility.</p>
          <p>At Kibonde Fuels, we value trust, professionalism, and sustainability. We aim to expand our reach while maintaining strong relationships with our customers and partners.</p>
          <p>Our goal is simple: <strong>powering Tanzania forward, one fuel delivery at a time.</strong></p>
        </div>
      </div>
    </>
  );
}
