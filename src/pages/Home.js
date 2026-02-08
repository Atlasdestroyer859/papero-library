import React from 'react';
import QuoteBanner from '../components/QuoteBanner/QuoteBanner';
import ContinueReading from '../components/ContinueReading/ContinueReading';
import StatCards from '../components/StatCards/StatCards';
import FeaturedBook from '../components/FeaturedBook/FeaturedBook';
import CommunitySection from '../components/CommunitySection/CommunitySection';
import CONFIG from '../config';

const Home = ({ setView, setSelectedBook }) => {
  const [recommendations, setRecommendations] = React.useState({});
  const [loadingRecs, setLoadingRecs] = React.useState(true);
  const [username, setUsername] = React.useState('Reader');

  React.useEffect(() => {
    // Fetch AI Recommendations & User Name
    const user = JSON.parse(localStorage.getItem('papero_user'));
    if (user && user.name) {
      setUsername(user.name.split(' ')[0]); // First Name only
    }
    const userId = user ? user.id : 1;

    fetch(`${CONFIG.API_BASE_URL}/api/global_feed?user_id=${userId}`)
      .then(res => res.json())
      .then(data => {
        // Ensure data is an object, not empty string or error
        if (data && typeof data === 'object') {
          setRecommendations(data);
        } else {
          console.warn("Invalid recommendations data:", data);
        }
        setLoadingRecs(false);
      })
      .catch(err => {
        console.error("Failed to load recommendations", err);
        setLoadingRecs(false);
      });
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon"; // 12 PM - 5 PM
    return "Good Evening";
  };

  return (
    <div style={styles.container}>
      <div style={styles.mainCol}>
        {/* Dynamic Greeting */}
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ fontSize: '28px', color: '#333' }}>
            {getGreeting()}, {username}!
          </h1>
          <p style={{ color: '#888' }}>Ready to continue where you left off?</p>
          <button onClick={() => setView('onboarding')} style={{ marginTop: '10px', padding: '8px 16px', background: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            🔄 Redo AI Onboarding
          </button>
        </div>

        <QuoteBanner />

        {/* Continue Reading Section */}
        <div style={styles.headerRow}>
          <h3>Continue Reading</h3>
          <span onClick={() => setView('library')} style={styles.link}>View All →</span>
        </div>
        <ContinueReading setView={setView} setSelectedBook={setSelectedBook} />

        {/* NEW AI RECOMMENDATIONS SECTION */}
        <div style={{ marginTop: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
              ✨ Recommended For You
            </h3>
            <span
              onClick={() => { localStorage.setItem('store_tab', 'global'); setView('products'); }}
              style={styles.link}
            >
              View All →
            </span>
          </div>

          {loadingRecs ? (
            <div style={{ padding: '20px', color: '#888' }}>Scanning 20M+ books...</div>
          ) : (
            <div className="fade-in">
              {Object.entries(recommendations).slice(0, 1).map(([key, books]) => ( // Show just the top (most relevant) row
                <div key={key}>
                  <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>Based on your interests: <b>{key.replace('Recommended (Because you read ', '').replace(')', '')}</b></p>
                  <div style={styles.horizontalScroll}>
                    {books.map(book => (
                      <div key={book.id} onClick={() => { setSelectedBook(book); setView('product-detail'); }} style={styles.miniCard}>
                        <img src={book.cover_url} alt="cover" style={styles.miniCover} />
                        <p style={styles.miniTitle}>{book.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {Object.keys(recommendations).length === 0 && (
                <p style={{ color: '#999' }}>Start reading or complete onboarding to get recommendations!</p>
              )}
            </div>
          )}
        </div>

        <StatCards />
      </div>

      <div style={styles.sideCol}>
        <FeaturedBook
          book={Object.values(recommendations).length > 0 ? Object.values(recommendations)[0][0] : null}
          onClick={(book) => { setSelectedBook(book); setView('product-detail'); }}
        />
        <CommunitySection setView={setView} />
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
  link: { color: '#FF6B6B', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' },

  // New Styles
  horizontalScroll: { display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px', scrollbarWidth: 'none' },
  miniCard: { minWidth: '100px', width: '100px', cursor: 'pointer', transition: '0.2s' },
  miniCover: { width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', marginBottom: '5px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' },
  miniTitle: { fontSize: '12px', fontWeight: 'bold', color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }
};

export default Home;