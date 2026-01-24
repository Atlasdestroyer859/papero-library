import React from 'react';

const CommunitySection = () => {
  return (
    <div style={styles.container}>
      {/* Blue Community Card */}
      <div style={styles.blueCard}>
        <div style={styles.content}>
          <h3 style={styles.text}>Join a community of over <span style={styles.bold}>5000 Book Lovers</span></h3>
          <button style={styles.goBtn}>GO</button>
        </div>
        <div style={styles.shelf}>📚📚📚</div>
      </div>

      {/* Subscribe Bar */}
      <div style={styles.subBar}>
        <input type="text" placeholder="Subscribe to Our Blog" style={styles.input} />
        <button style={styles.mailBtn}>📧</button>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' },
  blueCard: { 
    backgroundColor: '#82D8FF', 
    borderRadius: '24px', 
    padding: '25px', 
    color: 'white', 
    position: 'relative', 
    overflow: 'hidden',
    minHeight: '160px'
  },
  content: { position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  text: { fontSize: '18px', margin: 0, lineHeight: '1.4', maxWidth: '70%', fontWeight: '400' },
  bold: { fontWeight: '800' },
  goBtn: { backgroundColor: 'white', color: '#82D8FF', border: 'none', padding: '10px 14px', borderRadius: '12px', fontWeight: '900', cursor: 'pointer' },
  shelf: { textAlign: 'center', marginTop: '30px', fontSize: '40px', opacity: 0.9 },
  subBar: { display: 'flex', border: '1px solid #FF6B6B', borderRadius: '14px', overflow: 'hidden' },
  input: { flex: 1, border: 'none', padding: '15px', outline: 'none', fontSize: '13px' },
  mailBtn: { backgroundColor: '#FF6B6B', border: 'none', color: 'white', padding: '0 20px', cursor: 'pointer', fontSize: '18px' }
};

export default CommunitySection;