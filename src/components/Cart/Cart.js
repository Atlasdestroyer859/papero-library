import React, { useState } from 'react';
import PaymentModal from '../PaymentModal/PaymentModal';

const Cart = ({ isOpen, onClose, cartItems, onRemove, onClear }) => {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const total = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) || 0), 0);

  return (
    <>
      {/* Dark Overlay */}
      {isOpen && <div onClick={onClose} style={styles.overlay} />}

      {/* Cart Drawer */}
      <div style={{ ...styles.drawer, right: isOpen ? '0' : '-400px' }}>
        <div style={styles.header}>
          <h2>Your Library Cart</h2>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        <div style={styles.itemList}>
          {cartItems.length === 0 ? (
            <p style={styles.emptyText}>Your cart is empty. Start saving trees! 🌳</p>
          ) : (
            cartItems.map((item, index) => (
              <div key={index} style={styles.cartItem}>
                <img src={item.cover_url || item.img} alt="book" style={styles.itemImg} />
                <div style={styles.itemInfo}>
                  <p style={styles.itemTitle}>{item.title}</p>
                  <p style={styles.itemPrice}>₹{item.price}</p>
                </div>
                <button onClick={() => onRemove(index)} style={styles.removeBtn}>🗑️</button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div style={styles.footer}>
            <div style={styles.totalRow}>
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <button style={styles.checkoutBtn} onClick={() => setIsPaymentOpen(true)}>
              Checkout
            </button>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        total={total}
        cartItems={cartItems}
        onSuccess={() => {
          onClear();
          onClose(); // Close Cart too
        }}
      />
    </>
  );
};

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 200 },
  drawer: { position: 'fixed', top: 0, width: '350px', height: '100vh', background: 'white', zIndex: 201, transition: '0.4s ease', padding: '30px', boxShadow: '-10px 0 30px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  closeBtn: { background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' },
  itemList: { flex: 1, overflowY: 'auto' },
  emptyText: { textAlign: 'center', color: '#888', marginTop: '50px' },
  cartItem: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' },
  itemImg: { width: '50px', height: '70px', borderRadius: '5px', objectFit: 'cover' },
  itemInfo: { flex: 1 },
  itemTitle: { fontSize: '14px', fontWeight: 'bold' },
  itemPrice: { color: '#FF6B6B', fontSize: '13px' },
  removeBtn: { background: 'none', border: 'none', cursor: 'pointer' },
  footer: { borderTop: '2px solid #eee', paddingTop: '20px' },
  totalRow: { display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' },
  checkoutBtn: { width: '100%', padding: '15px', background: '#FF6B6B', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }
};

export default Cart;