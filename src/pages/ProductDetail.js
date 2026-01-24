import React, { useState, useEffect } from 'react';

const ProductDetail = ({ book, onBack, addToCart }) => {
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [communityRating, setCommunityRating] = useState(0); // Added missing state
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [user, setUser] = useState(null);

  // Fallback Book Data
  const currentBook = book || {
    title: "Loading...",
    author: "Unknown",
    price: "0",
    description: "Please select a book from the store.",
    rating: 4.5,
    cover_url: "https://via.placeholder.com/300x450"
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('papero_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      fetchComments();
    }
  }, [currentBook.id]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/comments?book_id=${currentBook.id}`);
      const data = await res.json();

      // Handle new API structure { comments: [], community_rating: 4.5 }
      if (data.comments && Array.isArray(data.comments)) {
        setComments(data.comments);
        if (data.community_rating) setCommunityRating(data.community_rating);
      } else if (Array.isArray(data)) {
        // Fallback for old structure
        setComments(data);
      } else {
        setComments([]);
      }
    } catch (err) {
      console.error(err);
      setComments([]);
    }
  };

  const handleLike = async () => {
    if (!user) return alert("Please Login to Like books!");

    setLiked(!liked); // Optimistic UI
    try {
      await fetch('http://localhost:5000/api/interact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, book_id: currentBook.id, action: 'like' })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const postComment = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please Login to Comment!");
    if (!newComment.trim()) return;

    const tempComment = { user_name: user.name, text: newComment, created_at: "Just now" };
    setComments([tempComment, ...comments]); // Optimistic
    setNewComment('');

    try {
      await fetch('http://localhost:5000/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, book_id: currentBook.id, text: newComment })
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      <button onClick={onBack} style={styles.backBtn}>← Back to Store</button>

      <div style={styles.content}>
        <div style={styles.imageCol}>
          <img src={currentBook.cover_url} alt="cover" style={styles.cover} />

          {/* Dual Rating Cards */}
          <div style={styles.ratingBox}>
            <div style={styles.ratingCard}>
              <div style={styles.ratingVal}>⭐ {currentBook.rating || 4.5}</div>
              <div style={styles.ratingLabel}>Global Rating</div>
            </div>
            <div style={{ width: '1px', background: '#eee' }}></div>
            <div style={styles.ratingCard}>
              <div style={styles.ratingVal}>🌟 {communityRating || '--'}</div>
              <div style={styles.ratingLabel}>Community</div>
            </div>
          </div>
        </div>

        <div style={styles.infoCol}>
          <h1 style={styles.title}>{currentBook.title}</h1>
          <p style={styles.author}>by {currentBook.author}</p>

          <div style={styles.impactBadge}>🌱 Scanned from Original Edition</div>

          <p style={styles.desc}>{currentBook.description || "No description available."}</p>

          <div style={styles.priceSection}>
            <span style={styles.price}>₹{currentBook.price}</span>
            <button
              onClick={() => addToCart(currentBook)}
              style={styles.buyBtn}
            >
              Purchase E-Book
            </button>

            {/* LIKE BUTTON */}
            <button
              onClick={handleLike}
              style={{
                ...styles.likeBtn,
                background: liked ? '#FF6B6B' : '#f0f0f0',
                color: liked ? 'white' : '#666'
              }}
            >
              {liked ? '❤️ Liked' : '🤍 Like'}
            </button>
          </div>

          <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #eee' }} />

          {/* COMMENTS SECTION */}
          <h3>Community Reviews</h3>
          <form onSubmit={postComment} style={{ marginTop: '15px' }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <span style={{ alignSelf: 'center', fontWeight: 'bold', color: '#555' }}>Your Rating:</span>
              <select
                value={newRating}
                onChange={(e) => setNewRating(Number(e.target.value))}
                style={styles.ratingSelect}
              >
                <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                <option value="4">⭐⭐⭐⭐ (4)</option>
                <option value="3">⭐⭐⭐ (3)</option>
                <option value="2">⭐⭐ (2)</option>
                <option value="1">⭐ (1)</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a review..."
                style={styles.commentInput}
              />
              <button type="submit" style={styles.postBtn}>Post</button>
            </div>
          </form>

          <div style={styles.commentList}>
            {comments.map((c, i) => (
              <div key={i} style={styles.commentCard}>
                <div style={styles.commentUser}>{c.user_name}</div>
                <div style={styles.commentText}>{c.text}</div>
                <div style={styles.commentTime}>{c.created_at}</div>
              </div>
            ))}
            {comments.length === 0 && <p style={{ color: '#999', marginTop: '10px' }}>No reviews yet. Be the first!</p>}
          </div>

        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '20px', animation: 'fadeIn 0.5s' },
  backBtn: { background: 'none', border: 'none', color: '#FF6B6B', cursor: 'pointer', fontWeight: 'bold', marginBottom: '20px' },
  content: { display: 'flex', gap: '40px', flexWrap: 'wrap' },
  imageCol: { flex: '1', minWidth: '250px' },
  cover: { width: '100%', maxWidth: '300px', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' },
  infoCol: { flex: '2', minWidth: '300px' },
  title: { fontSize: '32px', marginBottom: '10px' },
  author: { fontSize: '18px', color: '#888', marginBottom: '20px' },
  impactBadge: { display: 'inline-block', padding: '5px 15px', borderRadius: '20px', backgroundColor: '#e8f5e9', color: '#2e7d32', fontSize: '12px', fontWeight: 'bold', marginBottom: '20px' },
  desc: { lineHeight: '1.6', color: '#555', marginBottom: '30px' },
  priceSection: { display: 'flex', alignItems: 'center', gap: '20px' },
  price: { fontSize: '28px', fontWeight: 'bold', color: '#333' },
  buyBtn: { padding: '15px 30px', borderRadius: '12px', border: 'none', background: '#FF6B6B', color: 'white', fontWeight: 'bold', cursor: 'pointer' },

  // NEW STYLES
  likeBtn: { padding: '15px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' },
  commentInput: { flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ddd' },
  postBtn: { padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#333', color: 'white', cursor: 'pointer' },
  commentList: { marginTop: '20px', maxHeight: '300px', overflowY: 'auto' },
  commentCard: { background: '#f9f9f9', padding: '15px', borderRadius: '10px', marginBottom: '10px' },
  commentUser: { fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' },
  commentText: { color: '#555', marginBottom: '5px' },
  commentTime: { fontSize: '12px', color: '#aaa' },

  ratingBox: { marginTop: '20px', background: '#f9f9f9', padding: '15px', borderRadius: '15px', display: 'flex', justifyContent: 'space-around', maxWidth: '300px' },
  ratingCard: { textAlign: 'center' },
  ratingVal: { fontSize: '20px', fontWeight: 'bold', color: '#333' },
  ratingLabel: { fontSize: '12px', color: '#888' },
  ratingSelect: { padding: '8px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }
};

export default ProductDetail;