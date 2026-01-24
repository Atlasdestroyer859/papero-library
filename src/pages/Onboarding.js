import React, { useState } from 'react';

const genres = [
    { id: 'sci-fi', label: '🚀 Sci-Fi', color: '#1a237e' },
    { id: 'romance', label: '💖 Romance', color: '#e91e63' },
    { id: 'mystery', label: '🕵️ Mystery', color: '#607d8b' },
    { id: 'fantasy', label: '🧙‍♂️ Fantasy', color: '#673ab7' },
    { id: 'history', label: '📜 History', color: '#795548' },
    { id: 'business', label: '💼 Business', color: '#2196f3' },
    { id: 'horror', label: '👻 Horror', color: '#212121' },
    { id: 'art', label: '🎨 Art', color: '#ff9800' }
];

const Onboarding = ({ user, onFinish }) => {
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(false);

    const toggleGenre = (id) => {
        if (selected.includes(id)) {
            setSelected(selected.filter(g => g !== id));
        } else {
            if (selected.length < 5) setSelected([...selected, id]);
        }
    };

    const handleFinish = async () => {
        setLoading(true);
        try {
            // Send to backend
            await fetch('http://localhost:5000/api/onboarding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: user.id || 1, genres: selected })
            });
            onFinish(); // Redirect to Home
        } catch (err) {
            console.error(err);
            onFinish(); // Proceed anyway
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <h1 style={styles.title}>What do you love?</h1>
                <p style={styles.subtitle}>Pick 3 or more genres to build your AI profile.</p>

                <div style={styles.grid}>
                    {genres.map(g => (
                        <div
                            key={g.id}
                            onClick={() => toggleGenre(g.id)}
                            style={{
                                ...styles.card,
                                backgroundColor: selected.includes(g.id) ? g.color : '#f5f5f5',
                                color: selected.includes(g.id) ? 'white' : '#333',
                                transform: selected.includes(g.id) ? 'scale(1.05)' : 'scale(1)'
                            }}
                        >
                            {g.label}
                            {selected.includes(g.id) && <div style={styles.check}>✓</div>}
                        </div>
                    ))}
                </div>

                <button
                    disabled={selected.length < 3}
                    onClick={handleFinish}
                    style={{
                        ...styles.btn,
                        opacity: selected.length < 3 ? 0.3 : 1
                    }}
                >
                    {loading ? 'Personalizing...' : 'Start Reading'}
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'white', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    content: { maxWidth: '600px', width: '100%', padding: '20px', textAlign: 'center' },
    title: { fontSize: '32px', fontWeight: '800', marginBottom: '10px' },
    subtitle: { color: '#888', marginBottom: '40px' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '40px' },
    card: { padding: '25px', borderRadius: '20px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' },
    check: { position: 'absolute', top: '10px', right: '10px', background: 'white', color: 'black', borderRadius: '50%', width: '25px', height: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' },
    btn: { padding: '15px 40px', fontSize: '18px', borderRadius: '30px', background: '#FF6B6B', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' }
};

export default Onboarding;
