import React, { useState, useEffect } from 'react';
import CONFIG from '../../config';

const Reader = ({ book, onBack }) => {
    const [embedUrl, setEmbedUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(book.progress || 0);

    useEffect(() => {
        if (book && book.id) {
            setLoading(true);
            setError('');

            // Fetch User ID
            const user = JSON.parse(localStorage.getItem('papero_user'));
            const userId = user ? user.id : 1;

            // Pass user_id to trigger "Last Read" update
            fetch(`${CONFIG.API_BASE_URL}/api/read/${book.id}?user_id=${userId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.url) {
                        setEmbedUrl(data.url);
                    } else {
                        setError("Book content format not supported.");
                    }
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to load book:", err);
                    setError(`Error: Could not load book. ${err.message}`);
                    setLoading(false);
                });
        } else {
            setError("Error: No book selected.");
            setLoading(false);
        }
    }, [book.id]);

    return (
        <div style={styles.container}>
            <div style={styles.topBar}>
                <button onClick={onBack} style={styles.backBtn}>← Back to Library</button>
                <div style={styles.info}>
                    <span style={{ color: '#888', fontSize: '14px' }}>Reading: <b>{book.title}</b></span>
                </div>
            </div>

            <div style={styles.readerFrame}>
                {loading && (
                    <div style={styles.loading}>
                        <p>Loading Internet Archive Reader...</p>
                    </div>
                )}

                {error && !loading && (
                    <div style={styles.loading}>
                        <p style={{ color: 'red' }}>{error}</p>
                    </div>
                )}

                {!loading && !error && embedUrl && (
                    <iframe
                        src={embedUrl}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        allowFullScreen
                        title="Book Reader"
                    ></iframe>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: { height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' },
    topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
    backBtn: { background: 'none', border: 'none', color: '#FF6B6B', cursor: 'pointer', fontWeight: 'bold' },
    controls: { display: 'flex', alignItems: 'center', gap: '10px' },
    saveBtn: { padding: '5px 15px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    readerFrame: { flex: 1, backgroundColor: '#f0ece0', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' },
    loading: { height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#888' }
};

export default Reader;
