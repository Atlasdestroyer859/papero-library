import React, { useState, useEffect } from 'react';
import CONFIG from '../config';

const Profile = ({ onLogout, setView }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('papero_user')));
    const [stats, setStats] = useState({ streak_days: 0, books_read: 0, pages_read: 0 });

    useEffect(() => {
        if (user) {
            fetch(`${CONFIG.API_BASE_URL}/api/user_stats/${user.id}`)
                .then(res => res.json())
                .then(data => setStats(data))
                .catch(err => console.error("Failed to fetch stats", err));
        }
    }, [user]);

    if (!user) return <div style={styles.container}>Please log in.</div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>My Library Card</h1>

            <div style={styles.card}>
                <div style={styles.profileHeader}>
                    <img
                        src={`https://ui-avatars.com/api/?name=${user.name}&background=FF6B6B&color=fff&size=128`}
                        alt="Profile"
                        style={styles.avatar}
                    />
                    <div>
                        <h2 style={styles.name}>{user.name}</h2>
                        <p style={styles.email}>{user.email}</p>
                        <span style={styles.badge}>📚 Avid Reader</span>
                    </div>
                </div>

                <div style={styles.statsGrid}>
                    <div style={styles.statBox}>
                        <div style={styles.statValue}>🔥 {stats?.streak || 0}</div>
                        <div style={styles.statLabel}>Day Streak</div>
                    </div>
                    <div style={styles.statBox}>
                        <div style={styles.statValue}>📖 {stats?.books_read || 0}</div>
                        <div style={styles.statLabel}>Books Read</div>
                    </div>
                </div>

                <div style={styles.section}>
                    <h3>Integrations</h3>
                    <div style={styles.integrationBox}>
                        <div>
                            <h4 style={{ margin: 0 }}>🏛️ Internet Archive</h4>
                            <p style={{ margin: '5px 0', fontSize: '12px', color: '#666' }}>Connect to borrow copyright books directly.</p>
                        </div>
                        <button
                            onClick={() => window.open('https://archive.org/account/login', '_blank')}
                            style={styles.connectBtn}
                        >
                            Connect Account
                        </button>
                    </div>
                </div>

                <div style={styles.section}>
                    <h3>Settings</h3>
                    <button onClick={() => setView('onboarding')} style={styles.actionBtn}>
                        Restart Onboarding (Pick Genres)
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '20px', animation: 'fadeIn 0.5s ease' },
    header: { marginBottom: '30px', color: '#333' },
    card: { background: 'white', borderRadius: '20px', padding: '40px', maxWidth: '600px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' },
    profileHeader: { display: 'flex', alignItems: 'center', gap: '30px', marginBottom: '40px' },
    avatar: { borderRadius: '50%', width: '100px', height: '100px' },
    name: { margin: 0, fontSize: '24px', color: '#2c3e50' },
    email: { color: '#7f8c8d', margin: '5px 0' },
    badge: { display: 'inline-block', background: '#e1f5fe', color: '#039be5', padding: '5px 10px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold', marginTop: '10px' },
    statsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' },
    statBox: { background: '#f8f9fa', padding: '20px', borderRadius: '15px', textAlign: 'center' },
    statValue: { fontSize: '24px', fontWeight: 'bold', color: '#2c3e50' },
    statLabel: { color: '#95a5a6', fontSize: '14px' },
    section: { borderTop: '1px solid #eee', paddingTop: '20px', marginTop: '20px' },
    integrationBox: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f0f0f0', padding: '15px', borderRadius: '10px', marginBottom: '20px' },
    connectBtn: { padding: '8px 15px', background: '#333', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' },
    actionBtn: { padding: '10px 20px', background: '#eee', color: '#333', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }
};

export default Profile;
