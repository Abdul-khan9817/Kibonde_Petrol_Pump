export default function Help() {
  return (
    <>
      <style>{`
        :root {
          --accent: #0b76ef; --orange: #FF9900; --black: #0B1F3F; --white: #ffffff;
          --overlay: rgba(0,0,0,0.2); --card-bg: rgba(255,255,255,0.05);
        }
        * { box-sizing: border-box; margin:0; padding:0; font-family: Inter, sans-serif; }
        .help-page {
          min-height: 100vh; display: flex; flex-direction: column;
          background: linear-gradient(135deg, var(--black), var(--accent)); color: var(--white); padding: 24px;
          position: relative;
        }
        .help-page::before {
          content: ""; position: absolute; top:0; left:0; width:100%; height:100%;
          background: var(--overlay); z-index: -1;
        }
        .help-page header {
          padding: 16px 24px; background: rgba(11,31,63,0.7);
          border-radius: 12px; margin-bottom: 32px; text-align: center; font-size: 28px; font-weight: 700;
        }
        .help-page .container {
          max-width: 900px; margin: 0 auto; background: rgba(11,31,63,0.7); padding: 32px;
          border-radius: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }
        .help-page h1 { text-align: center; margin-bottom: 24px; font-size: 32px; }
        .help-page ul { margin-top:16px; list-style: disc; padding-left: 20px; }
        .help-page li { margin-bottom:12px; font-size:16px; line-height:1.6; color: var(--white); }
      `}</style>

      <div className="help-page">
        <header>Help & Support</header>

        <div className="container">
          <h1>Frequently Asked Questions</h1>
          <ul>
            <li><strong>How can I place an order?</strong> — Orders can be placed directly via our website or by contacting our support team.</li>
            <li><strong>What areas do you supply fuel to?</strong> — We supply across all regions of Tanzania and are expanding to reach more clients.</li>
            <li><strong>What types of fuel are available?</strong> — We provide diesel, petrol for both commercial and private clients.</li>
            <li><strong>Payment methods accepted:</strong> — Cash, mobile money, and corporate invoicing are accepted.</li>
            <li><strong>How do I track my delivery?</strong> — You can track pending and delivered orders via the "Delivery Status" page.</li>
            <li><strong>Need further assistance?</strong> — Contact our support team through the Contact page or call our hotline.</li>
          </ul>
        </div>
      </div>
    </>
  );
}
