import React, { useEffect, useState } from 'react';
import CONFIG from '../../config';

const ContinueReading = ({ setView, setSelectedBook }) => {
  const [book, setBook] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('papero_user'));
    const userId = user ? user.id : 1;

    fetch(`${CONFIG.API_BASE_URL}/api/library?user_id=${userId}`)
      .then(res => res.json())
      .then(data => {
        // Since backend sorts by last_read_at DESC, the first item is the most recent
        if (data.length > 0) {
          const latest = data[0];
          setBook(latest);
        }
      })
      .catch(err => console.error(err));
  }, []);

  if (!book) return (
    <div style={styles.card}>
      <p style={{ color: '#888' }}>No books in progress. Visit the store!</p>
    </div>
  );

  return (
    <div style={styles.card}>
      <div style={styles.imgCol}>
        <img src={book.cover_url} alt="book" style={styles.cover} />
      </div>
      <div style={styles.info}>
        <h4 style={styles.title}>{book.title}</h4>
        <p style={styles.author}>{book.author}</p>
        <p style={{ fontSize: '12px', color: '#2ecc71', marginTop: '5px' }}>Recently Read</p>
      </div>
      <button
        onClick={() => {
          setSelectedBook(book);
          setView('reader');
        }}
        style={styles.btn}
      >
        Resume
      </button>
    </div>
  );
};

const styles = {
  card: { display: 'flex', gap: '20px', backgroundColor: '#F8F9FA', padding: '20px', borderRadius: '20px', alignItems: 'center' },
  imgCol: { width: '60px', height: '90px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0 },
  cover: { width: '100%', height: '100%', objectFit: 'cover' },
  info: { flex: 1 },
  title: { fontSize: '16px', marginBottom: '5px' },
  author: { fontSize: '12px', color: '#888', marginBottom: '10px' },
  progressContainer: { width: '100%', height: '6px', backgroundColor: '#eee', borderRadius: '3px', marginBottom: '5px' },
  bar: { height: '100%', backgroundColor: '#FF6B6B', borderRadius: '3px' },
  pct: { fontSize: '10px', color: '#888', textAlign: 'right' },
  btn: { padding: '10px 20px', backgroundColor: '#1a1a1a', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '12px' }
};

export default ContinueReading;