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
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.heading}>My Collection</h2>
                <div style={styles.stats}>{books.length} Books</div>
            </div>

            {loading ? (
                <div style={styles.loading}>Loading your digital shelf...</div>
            ) : books.length === 0 ? (
                <div style={styles.emptyState}>
                    <div style={{ fontSize: '60px', marginBottom: '20px', opacity: 0.5 }}>📚</div>
                    <h3>Your library is waiting.</h3>
                    <p style={{ marginBottom: '30px' }}>Start your journey by adding books from the store.</p>
                    <button onClick={() => setView('products')} style={styles.storeBtn}>Browse Store</button>
                </div>
            ) : (
                <div style={styles.grid}>
                    {books.map((book, index) => (
                        <div key={index} style={styles.card} className="book-card">
                            <div style={styles.coverWrapper}>
                                <img src={book.cover_url} alt={book.title} style={styles.cover} />
                                <div className="overlay">
                                    <button
                                        onClick={() => {
                                            setSelectedBook(book);
                                            setView('reader');
                                        }}
                                        style={styles.readBtn}
                                    >
                                        READ NOW
                                    </button>
                                </div>
                                {index === 0 && <div style={styles.recentBadge}>Recently Read</div>}
                            </div>
                            <div style={styles.meta}>
                                <h3 style={styles.title}>{book.title}</h3>
                                <p style={styles.author}>{book.author}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style>{`
                .book-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
                .book-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.15); }
                .overlay {
                    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.4);
                    display: flex; align-items: center; justify-content: center;
                    opacity: 0; transition: opacity 0.3s ease;
                    border-radius: 12px;
                }
                .book-card:hover .overlay { opacity: 1; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

const styles = {
    container: { padding: '40px 5%', animation: 'fadeIn 0.6s ease', maxWidth: '1400px', margin: '0 auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', borderBottom: '1px solid #eee', paddingBottom: '20px' },
    heading: { fontSize: '32px', fontWeight: '800', margin: 0, color: '#2c3e50', letterSpacing: '-0.5px' },
    stats: { fontSize: '14px', fontWeight: 'bold', color: '#7f8c8d', paddingBottom: '5px' },

    loading: { textAlign: 'center', marginTop: '50px', color: '#999', fontStyle: 'italic' },

    emptyState: { textAlign: 'center', marginTop: '80px', color: '#555', maxWidth: '400px', margin: '80px auto' },
    storeBtn: { padding: '12px 30px', backgroundColor: '#2c3e50', color: 'white', border: 'none', borderRadius: '50px', cursor: 'pointer', fontWeight: '600', letterSpacing: '0.5px', transition: 'background 0.2s' },

    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '40px' },

    card: { position: 'relative', cursor: 'pointer', borderRadius: '12px', background: 'white' },
    coverWrapper: { position: 'relative', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 20px rgba(0,0,0,0.08)', aspectRatio: '2/3' },
    cover: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' },

    readBtn: { padding: '12px 24px', background: 'white', color: 'black', border: 'none', borderRadius: '30px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', letterSpacing: '1px', boxShadow: '0 5px 15px rgba(0,0,0,0.2)' },

    recentBadge: { position: 'absolute', top: '10px', left: '10px', background: '#2ecc71', color: 'white', fontSize: '10px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' },

    meta: { marginTop: '15px', textAlign: 'left' },
    title: { fontSize: '14px', fontWeight: '700', color: '#2c3e50', margin: '0 0 5px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    author: { fontSize: '12px', color: '#95a5a6', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }
};

export default Library;
