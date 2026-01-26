import React, { useEffect, useState } from 'react';
import CONFIG from '../config';

const Library = ({ setView, setSelectedBook }) => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('papero_user')) || { id: 1 };

        fetch(`${CONFIG.API_BASE_URL}/api/library?user_id=${user.id}`)
            .then(res => res.json())
            .then(data => {
                setBooks(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ marginBottom: '30px', color: '#1a1a1a' }}>My Paperless Library</h2>

            {loading ? (
                <p>Loading your collection...</p>
            ) : books.length === 0 ? (
                <div style={styles.emptyState}>
                    <div style={{ fontSize: '50px', marginBottom: '20px' }}>📚</div>
                    <h3>Your library is empty.</h3>
                    <p>Visit the store to start your collection.</p>
                    <button onClick={() => setView('products')} style={styles.storeBtn}>Go to Store</button>
                </div>
            ) : (
                <div style={styles.grid}>
                    {books.map((book, index) => (
                        <div key={index} style={styles.card}>
                            <div style={styles.coverContainer}>
                                <img src={book.cover_url} alt="cover" style={styles.cover} />
                            </div>
                            <h3 style={styles.title}>{book.title}</h3>
                            <button
                                onClick={() => {
                                    setSelectedBook(book); // Pass book object to App state
                                    setView('reader');     // Switch to Reader View
                                }}
                                style={styles.readBtn}
                            >
                                Read Now
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const styles = {
    emptyState: { textAlign: 'center', marginTop: '50px', color: '#888' },
    storeBtn: { marginTop: '20px', padding: '10px 20px', backgroundColor: '#FF6B6B', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '30px' },
    card: { backgroundColor: 'white', borderRadius: '15px', padding: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', textAlign: 'center', transition: '0.3s' },
    coverContainer: { height: '250px', overflow: 'hidden', borderRadius: '10px', marginBottom: '15px' },
    cover: { width: '100%', height: '100%', objectFit: 'cover' },
    title: { fontSize: '16px', marginBottom: '15px', height: '40px', overflow: 'hidden' },
    readBtn: { width: '100%', padding: '10px', backgroundColor: '#1a1a1a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }
};

export default Library;
