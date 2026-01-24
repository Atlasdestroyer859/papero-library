import React from 'react';

const Header = ({ user, setView, cartCount, onCartClick }) => {
  return (
    <div style={styles.header}>
      {/* Actions */}
      <div style={styles.actions}>
        {/* Cart Icon with Badge */}
        <div style={styles.cartIconWrapper} onClick={onCartClick}>
          <span style={{ fontSize: '22px' }}>🛒</span>
          {cartCount > 0 && (
            <div style={styles.badge}>{cartCount}</div>
          )}
        </div>

        <div style={styles.notif}>🔔</div>

        {user ? (
          <div style={styles.profile} onClick={() => setView('auth')}>
            <img src={`https://ui-avatars.com/api/?name=${user.name || 'User'}&background=FF6B6B&color=fff`} alt="User" style={styles.avatar} />
            <span style={styles.userName}>{user.name || 'User'}</span>
          </div>
        ) : (
          <button style={styles.loginBtn} onClick={() => setView('auth')}>Sign In</button>
        )}
      </div>
    </div>
  );
};

const styles = {
  header: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%', gap: '20px', padding: '10px 0' },
  // searchContainer removed
  actions: { display: 'flex', alignItems: 'center', gap: '25px' },
  cartIconWrapper: { position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  badge: { position: 'absolute', top: '-8px', right: '-8px', background: '#FF6B6B', color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', border: '2px solid white' },
  notif: { fontSize: '20px', cursor: 'pointer', color: '#666' },
  profile: { display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' },
  avatar: { width: '35px', height: '35px', borderRadius: '50%' },
  userName: { fontWeight: '600', fontSize: '14px', color: '#444' },
  loginBtn: { padding: '8px 20px', borderRadius: '12px', border: 'none', backgroundColor: '#FF6B6B', color: 'white', fontWeight: 'bold', cursor: 'pointer' }
};

export default Header;