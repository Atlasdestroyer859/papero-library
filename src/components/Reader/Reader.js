import React, { useEffect, useState } from 'react';

const Reader = ({ book, onBack }) => {
    const [embedUrl, setEmbedUrl] = useState(null);
    const [page, setPage] = useState(book.progress || 0);

    useEffect(() => {
        if (book) {
            fetch(`http://localhost:5000/api/read/${book.id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.url) setEmbedUrl(data.url);
                })
                .catch(err => console.error(err));
        }
    }, [book]);

    const saveProgress = () => {
        fetch('http://localhost:5000/api/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: 1, book_id: book.id, progress: page })
        });
        alert(`Progress Saved: ${page}%`);
    };

    return (
        <div style={styles.container}>
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
                {embedUrl ? (
                    <iframe
                        src={embedUrl}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        allowFullScreen
                        title="reader"
                    ></iframe>
                ) : (
                    <div style={styles.loading}>
                        <p>Loading Book Experience...</p>
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
