import React, { useEffect, useState } from 'react';
import CONFIG from '../../config';

const StatCards = () => {
  const [stats, setStats] = useState({
    books: 0,
    authors: 0,
    trees: 0
  });

  useEffect(() => {
    // Fetch user library to calculate stats
    const user = JSON.parse(localStorage.getItem('papero_user'));
    const userId = user ? user.id : 1;

    fetch(`${CONFIG.API_BASE_URL}/api/library?user_id=${userId}`)
      .then(res => res.json())
      .then(data => {
        const uniqueAuthors = new Set(data.map(b => b.author)).size;
        // Approx: 1 tree = 8,333 pages. Avg book = 300 pages.
        // Trees = (Books * 300) / 8333
        const treesSaved = ((data.length * 300) / 8333).toFixed(2);

        setStats({
          books: data.length,
          authors: uniqueAuthors,
          trees: treesSaved
        });
      })
      .catch(err => console.error(err));
  }, []);

  const cards = [
    { label: 'Books Owned', value: stats.books, color: '#FFE5E5', icon: '📚' },
    { label: 'Authors', value: stats.authors, color: '#FFF9E5', icon: '✍️' },
    { label: 'Trees Saved', value: stats.trees, color: '#E5F6FF', icon: '🌳' },
  ];

  return (
    <div style={styles.container}>
      {cards.map((stat, index) => (
        <div key={index} style={styles.card} className="stat-card">
          <div style={{ ...styles.iconBox, backgroundColor: stat.color }}>{stat.icon}</div>
          <div style={styles.info}>
            <span style={styles.value} className="fade-in">{stat.value}</span>
            <span style={styles.label}>{stat.label}</span>
          </div>
        </div>
      ))}
      <style>{`
        .stat-card { transition: all 0.3s ease; }
        .stat-card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
        .fade-in { animation: fadeIn 0.5s ease-in; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

const styles = {
  container: { display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '30px' },
  card: { flex: '1 1 180px', backgroundColor: 'white', padding: '20px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid #f0f0f0', cursor: 'pointer' },
  iconBox: { width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' },
  info: { display: 'flex', flexDirection: 'column' },
  value: { fontSize: '22px', fontWeight: '800', color: '#333' },
  label: { fontSize: '12px', color: '#999', fontWeight: '600' }
};

export default StatCards;