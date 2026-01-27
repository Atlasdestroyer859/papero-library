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
        // Find book with highest progress, or just the last purchased one
        if (data.length > 0) {
          const latest = data[data.length - 1];
          // Simple simulation: If progress is 0, show 5% to encourage reading
          setBook({ ...latest, progress: latest.progress || 5 });
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
        <div style={styles.progressContainer}>
          <div style={{ ...styles.bar, width: `${book.progress}%` }}></div>
        </div>
        <p style={styles.pct}>{book.progress}% Complete</p>
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