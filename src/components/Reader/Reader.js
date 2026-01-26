import React, { useState, useEffect } from 'react';
import CONFIG from '../../config';

const Reader = ({ book, onBack }) => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(book.progress || 0);

    useEffect(() => {
        if (book && book.id) {
            setLoading(true);
            fetch(`${CONFIG.API_BASE_URL}/api/read/${book.id}`)
                .then(res => res.json())
                .then(data => {
                    setContent(data.content);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to load book:", err);
                    setContent(`Error: Could not load book content. Server response: ${err.message}`);
                    setLoading(false);
                });
        } else {
            // Handle case where book is missing
            setContent("Error: No book selected.");
            setLoading(false);
        }
    }, [book.id]);

    const saveProgress = () => { /* ... */ };

    return (
        <div style={styles.container}>
            {/* Top Bar omitted for brevity */}
            <div style={styles.topBar}>
                <button onClick={onBack} style={styles.backBtn}>← Back</button>
                <div style={styles.controls}>
                    <span style={{ marginRight: '10px', color: '#666' }}>My Progress:</span>
                    <input
                        type="range" min="0" max="100" value={page}
                        onChange={(e) => setPage(e.target.value)}
                        style={{ cursor: 'pointer' }}
                    />
                    <span style={{ width: '40px', textAlign: 'center' }}>{page}%</span>
                    <button onClick={saveProgress} style={styles.saveBtn}>Save Spot</button>
                </div>
            </div>

            <div style={styles.readerFrame}>
                {loading ? (
                    <div style={styles.loading}>
                        <p>Loading Book Experience... (Connecting to Cloud)</p>
                    </div>
                ) : (
                    <div style={{ padding: '40px', fontSize: '18px', lineHeight: '1.6', overflowY: 'auto', height: '100%', whiteSpace: 'pre-wrap', fontFamily: 'Merriweather, serif' }}>
                        {content || "No content available for this book."}
                    </div>
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
