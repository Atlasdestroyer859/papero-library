import React from 'react';
import QuoteBanner from '../components/QuoteBanner/QuoteBanner';
import ContinueReading from '../components/ContinueReading/ContinueReading';
import StatCards from '../components/StatCards/StatCards';
import FeaturedBook from '../components/FeaturedBook/FeaturedBook';
import CommunitySection from '../components/CommunitySection/CommunitySection';

const Home = ({ setView, setSelectedBook }) => {
  return (
    <div style={styles.container}>
      <div style={styles.mainCol}>
        {/* Dynamic Greeting */}
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ fontSize: '28px', color: '#333' }}>
            {new Date().getHours() < 12 ? "Good Morning" : new Date().getHours() < 18 ? "Good Afternoon" : "Good Evening"}, Reader!
          </h1>
          <p style={{ color: '#888' }}>Ready to continue where you left off?</p>
          <button onClick={() => setView('onboarding')} style={{ marginTop: '10px', padding: '8px 16px', background: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            🔄 Redo AI Onboarding
          </button>
        </div>

        <QuoteBanner />
        <div style={styles.headerRow}>
          <h3>Continue Reading</h3>
          <span onClick={() => setView('products')} style={styles.link}>View All →</span>
        </div>
        <ContinueReading setView={setView} setSelectedBook={setSelectedBook} />
        <StatCards />
      </div>

      <div style={styles.sideCol}>
        <div onClick={() => setView('products')} style={{ cursor: 'pointer' }}>
          <FeaturedBook />
        </div>
        <CommunitySection />
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .home-flex { flex-direction: column; }
          .side-col { width: 100% !important; flex-direction: row !important; display: flex; gap: 20px; }
        }
        @media (max-width: 600px) {
          .side-col { flex-direction: column !important; }
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: { display: 'flex', gap: '30px', flexWrap: 'wrap' },
  mainCol: { flex: '2', minWidth: '300px' },
  sideCol: { flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '25px' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0' },
  link: { color: '#FF6B6B', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }
};

export default Home;