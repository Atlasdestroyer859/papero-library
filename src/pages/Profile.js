import React, { useState, useEffect } from 'react';
import CONFIG from '../config';

const Profile = ({ onLogout, setView }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('papero_user')));

    if (!user) return <div style={styles.container}>Please log in.</div>;

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <h1 style={styles.header}>My Account</h1>

                {/* Digital Library Card */}
                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <div style={styles.chip}>
                            <img src="https://img.icons8.com/ios-filled/50/ffffff/sim-card-chip.png" alt="chip" width="40" />
                        </div>
                        <div style={styles.logo}>PAPERO</div>
                    </div>

                    <div style={styles.cardBody}>
                        <img
                            src={`https://ui-avatars.com/api/?name=${user.name}&background=fff&color=333&size=128&bold=true`}
                            alt="Profile"
                            style={styles.avatar}
                        />
                        <div style={styles.userDetails}>
                            <h2 style={styles.name}>{user.name}</h2>
                            <p style={styles.email}>{user.email}</p>
                            <p style={styles.memberId}>ID: {String(user.id).padStart(8, '0')}</p>
                        </div>
                    </div>

                    <div style={styles.cardFooter}>
                        <div style={styles.status}>ACTIVE MEMBER</div>
                        <div style={styles.expiry}>VALID THRU 12/30</div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div style={styles.actionsGrid}>
                    <div style={styles.actionCard} onClick={() => setView('library')}>
                        <span style={{ fontSize: '24px' }}>📚</span>
                        <span>My Library</span>
                    </div>

                    <div style={styles.actionCard} onClick={() => setView('onboarding')}>
                        <span style={{ fontSize: '24px' }}>🎨</span>
                        <span>Edit Tastes</span>
                    </div>

                    <div style={styles.actionCard} onClick={() => window.open('https://archive.org/account/login', '_blank')}>
                        <span style={{ fontSize: '24px' }}>🏛️</span>
                        <span>Link Archive.org</span>
                    </div>

                    <div style={{ ...styles.actionCard, color: 'red' }} onClick={onLogout}>
                        <span style={{ fontSize: '24px' }}>🚪</span>
                        <span>Sign Out</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '40px 20px',
        animation: 'fadeIn 0.5s ease',
        display: 'flex',
        justifyContent: 'center'
    },
    content: { width: '100%', maxWidth: '500px' },
    header: { marginBottom: '30px', color: '#333', textAlign: 'center', fontSize: '24px' },

    // Library Card Styles
    card: {
        background: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)',
        borderRadius: '20px',
        padding: '30px',
        color: 'white',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        marginBottom: '40px',
        position: 'relative',
        overflow: 'hidden'
    },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    logo: { fontWeight: '900', letterSpacing: '2px', opacity: 0.8 },
    chip: { opacity: 0.8 },

    cardBody: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' },
    avatar: {
        borderRadius: '50%',
        width: '80px',
        height: '80px',
        border: '3px solid rgba(255,255,255,0.2)'
    },
    userDetails: { flex: 1 },
    name: { margin: 0, fontSize: '20px', letterSpacing: '0.5px' },
    email: { margin: '5px 0', fontSize: '12px', opacity: 0.6 },
    memberId: { fontSize: '12px', fontFamily: 'monospace', opacity: 0.4, marginTop: '5px' },

    cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', fontWeight: 'bold', opacity: 0.6, letterSpacing: '1px' },

    // Actions
    actionsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
    actionCard: {
        background: 'white',
        borderRadius: '15px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#555',
        transition: 'transform 0.2s'
    }
};

export default Profile;
