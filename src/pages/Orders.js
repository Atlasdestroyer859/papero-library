import React from 'react';

const Orders = () => {
  const orders = [
    { id: '#8821', title: 'The Great Gatsby', price: '$9.99', date: 'Dec 28, 2025' },
    { id: '#8810', title: 'Sapiens', price: '$14.50', date: 'Dec 15, 2025' },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      <h2 style={{ marginBottom: '20px' }}>Your Digital Library Purchases</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {orders.map(order => (
          <div key={order.id} style={styles.orderCard}>
            <div>
              <p style={{ fontWeight: 'bold' }}>{order.title}</p>
              <p style={{ fontSize: '12px', color: '#999' }}>Order ID: {order.id} • {order.date}</p>
            </div>
            <div style={{ color: '#FF6B6B', fontWeight: 'bold' }}>{order.price}</div>
          </div>
        ))}
      </div>
      <button style={styles.buyBtn}>Browse New Releases</button>
    </div>
  );
};

const styles = {
  orderCard: { padding: '20px', borderRadius: '15px', border: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  buyBtn: { marginTop: '30px', padding: '15px 25px', backgroundColor: '#FF6B6B', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }
};

export default Orders;