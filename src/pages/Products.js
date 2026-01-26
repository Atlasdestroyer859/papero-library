import React, { useState, useEffect } from 'react';
import CONFIG from '../config';

const Products = ({ setView, setSelectedBook }) => {
  const [books, setBooks] = React.useState([]);
  const [term, setTerm] = React.useState('');
  const [visibleCount, setVisibleCount] = React.useState(20);
  const [isGlobal, setIsGlobal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // New State for AI Feed
  const [globalFeed, setGlobalFeed] = React.useState(null);
  const [loadingFeed, setLoadingFeed] = React.useState(false);

  React.useEffect(() => {
    // 1. Check for explicit navigation hint (from "View All")
    const tabHint = localStorage.getItem('store_tab');
    if (tabHint === 'global') {
      setIsGlobal(true);
      localStorage.removeItem('store_tab'); // Consume hint
      return;
    }

    // 2. Fallback to last used mode
    const savedMode = localStorage.getItem('store_mode');
    if (savedMode === 'global') {
      setIsGlobal(true);
    } else {
      loadLocalBooks();
    }
  }, []);

  // Fetch Global Feed (with Caching)
  React.useEffect(() => {
    if (isGlobal && !term && !globalFeed) {

      // Try Cache First
      const cached = sessionStorage.getItem('global_feed_cache');
      if (cached) {
        setGlobalFeed(JSON.parse(cached));
        return;
      }

      setLoadingFeed(true);
      fetch(`${CONFIG.API_BASE_URL}/api/global_feed?user_id=1`)
        .then(res => res.json())
        .then(data => {
          setGlobalFeed(data);
          sessionStorage.setItem('global_feed_cache', JSON.stringify(data)); // Cache it
          setLoadingFeed(false);
        })
        .catch(err => {
          console.error(err);
          setLoadingFeed(false);
        });
    }
  }, [isGlobal, term, globalFeed]);

  const loadLocalBooks = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/books')
      .then(res => res.json())
      .then(data => {
        setBooks(data);
        setLoading(false);
      })
      .catch(err => setLoading(false));
  };

  const categories = React.useMemo(() => {
    if (isGlobal) {
      // If searching, return nothing (handled by grid). If feed, return feed.
      if (term) return {};
      return globalFeed || {};
    }
    // Local Logic
    const groups = {};
    books.forEach(book => {
      const cat = book.category || 'Classics';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(book);
    });
    return groups;
  }, [books, isGlobal, term, globalFeed]);

  const handleSearch = (e) => {
    const val = e.target.value;
    setTerm(val);

    if (isGlobal && val.length > 2) {
      setLoading(true);
      fetch(`http://localhost:5000/api/search_external?q=${val}`)
        .then(res => res.json())
        .then(data => {
          setBooks(data);
          setLoading(false);
        })
        .catch(err => setLoading(false));
    }
  };

  const loadMoreGlobal = () => {
    // Naive Load More implementation for Demo
    setVisibleCount(prev => prev + 20);
  };

  const toggleGlobal = (mode) => {
    const wantGlobal = mode === 'global';
    if (isGlobal === wantGlobal) return; // No change

    setIsGlobal(wantGlobal);
    setTerm('');
    setLoading(false); // Reset loading state

    localStorage.setItem('store_mode', mode); // Persist selection

    if (!wantGlobal) {
      loadLocalBooks();
    }
  };

  // Combined list for Grid View (Search)
  const filteredBooks = React.useMemo(() => {
    // For Global Search, we use 'books' which is populated by search results
    if (isGlobal && term) return books;

    // For Local Search
    return books.filter(b =>
      b.title.toLowerCase().includes(term.toLowerCase()) ||
      b.author.toLowerCase().includes(term.toLowerCase())
    );
  }, [books, term, isGlobal]);


  const visibleBooks = filteredBooks.slice(0, visibleCount);
  const showGrid = (isGlobal && term) || (!isGlobal && term); // Show grid if searching (Global or Local)

  return (
    <div style={{ padding: '10px', paddingBottom: '50px' }}>
      <div style={styles.header}>
        <h2 style={{ marginBottom: '20px' }}>{isGlobal ? "Global Library (20M+ Books)" : "Curated Collection"}</h2>
        <div style={styles.searchBox}>
          <input
            style={styles.search}
            placeholder={isGlobal ? "Search 20M+ books..." : "Filter local books..."}
            value={term}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* NEW BANNERS */}
      <div style={styles.bannerContainer}>
        <div
          onClick={() => toggleGlobal('local')}
          style={{ ...styles.banner, border: !isGlobal ? '2px solid #FF6B6B' : '2px solid transparent', opacity: !isGlobal ? 1 : 0.7 }}
        >
          <div style={styles.bannerIcon}>🏠</div>
          <div>
            <h3 style={styles.bannerTitle}>Curated Collection</h3>
            <p style={styles.bannerSub}>Fast, reliable classics & genres.</p>
          </div>
        </div>

        <div
          onClick={() => toggleGlobal('global')}
          style={{ ...styles.banner, border: isGlobal ? '2px solid #4CAF50' : '2px solid transparent', opacity: isGlobal ? 1 : 0.7 }}
        >
          <div style={styles.bannerIcon}>🌎</div>
          <div>
            <h3 style={styles.bannerTitle}>Global Library</h3>
            <p style={styles.bannerSub}>AI Recommendations + 20M Books</p>
          </div>
        </div>
      </div>

      {loadingFeed && isGlobal && !term && (
        <div style={{ textAlign: 'center', padding: '80px', animation: 'fadeIn 1s' }}>
          {/* AI Pulse Animation */}
          <div className="ai-pulse-container">
            <div className="ai-pulse-ring"></div>
            <div className="ai-pulse-ring"></div>
            <div className="ai-pulse-ring"></div>
            <div className="ai-emoji">🧠</div>
          </div>
          <p style={{ marginTop: '30px', color: '#666', fontWeight: '500' }}>Curating your personal library...</p>

          <style>{`
            .ai-pulse-container {
              position: relative;
              width: 80px;
              height: 80px;
              margin: 0 auto;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .ai-emoji {
              font-size: 40px;
              z-index: 2;
            }
            .ai-pulse-ring {
              position: absolute;
              width: 100%;
              height: 100%;
              border-radius: 50%;
              border: 4px solid #FF6B6B;
              opacity: 0;
              animation: pulseRing 2s linear infinite;
            }
            .ai-pulse-ring:nth-child(2) { animation-delay: 0.5s; }
            .ai-pulse-ring:nth-child(3) { animation-delay: 1s; }
            
            @keyframes pulseRing {
              0% { transform: scale(0.5); opacity: 0; }
              50% { opacity: 0.5; }
              100% { transform: scale(1.5); opacity: 0; }
            }
          `}</style>
        </div>
      )}

      {/* RENDER ROWS (Netflix Style) - Works for Local AND Global Feed now */}
      {!term && (Object.keys(categories).length > 0) && (
        <div className="fade-in">
          {Object.entries(categories).map(([category, categoryBooks]) => (
            <div key={category} style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '20px', marginBottom: '15px', color: '#444', borderLeft: isGlobal ? '4px solid #4CAF50' : '4px solid #FF6B6B', paddingLeft: '10px' }}>
                {category} <span style={{ fontSize: '14px', color: '#999', fontWeight: 'normal' }}>({categoryBooks.length})</span>
              </h3>
              <div style={styles.row}>
                {categoryBooks.map(book => (
                  <ProductCard key={book.id} book={book} setSelectedBook={setSelectedBook} setView={setView} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RENDER GRID (Search Results) */}
      {showGrid && (
        <div style={styles.grid}>
          {visibleBooks.map(book => (
            <ProductCard key={book.id} book={book} setSelectedBook={setSelectedBook} setView={setView} />
          ))}
          {visibleBooks.length === 0 && (
            <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#999', marginTop: '50px' }}>
              {isGlobal ? "Searching the globe..." : "No local matches found."}
            </p>
          )}
        </div>
      )}

      {/* Load More Button for Grid */}
      {isGlobal && term && visibleBooks.length > 0 && (
        <button style={styles.loadMore} onClick={loadMoreGlobal}>Load More Results</button>
      )}

    </div>
  );
};

const ProductCard = ({ book, setSelectedBook, setView }) => (
  <div style={styles.productCard}>
    <div style={{ height: '220px', overflow: 'hidden', borderRadius: '10px', marginBottom: '10px' }}>
      <img src={book.cover_url} alt="book" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
    <h4 style={{ margin: '10px 0 5px 0', fontSize: '14px', height: '40px', overflow: 'hidden' }}>{book.title}</h4>
    <p style={{ color: '#888', fontSize: '12px', marginBottom: '5px' }}>{book.author}</p>
    <p style={{ color: '#FF6B6B', fontWeight: 'bold' }}>₹{book.price}</p>
    <button
      onClick={() => { setSelectedBook(book); setView('product-detail'); }}
      style={styles.buyBtn}
    >
      View
    </button>
  </div>
);

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  search: { padding: '10px', borderRadius: '10px', border: '1px solid #ccc', outline: 'none', width: '300px' },
  searchBox: { position: 'relative' },

  // New Banner Styles
  bannerContainer: { display: 'flex', gap: '20px', marginBottom: '30px' },
  banner: {
    flex: 1,
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    transition: '0.2s'
  },
  bannerIcon: { fontSize: '30px' },
  bannerTitle: { margin: 0, fontSize: '18px' },
  bannerSub: { margin: 0, color: '#888', fontSize: '14px' },

  rowsContainer: { display: 'flex', flexDirection: 'column' },
  catTitle: { fontSize: '20px', marginBottom: '15px', marginLeft: '5px', display: 'flex', alignItems: 'center', gap: '5px' },
  row: {
    display: 'flex',
    overflowX: 'auto',
    gap: '20px',
    paddingBottom: '15px',
    whiteSpace: 'nowrap',
    scrollbarWidth: 'none'
  },
  productCard: { minWidth: '180px', width: '180px', padding: '15px', border: '1px solid #eee', borderRadius: '20px', textAlign: 'center', height: '360px', backgroundColor: 'white' },
  buyBtn: { marginTop: '10px', background: '#82D8FF', border: 'none', color: 'white', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' },

  grid: { display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '20px' },
  loadMore: { display: 'block', margin: '30px auto', padding: '10px 30px', background: '#eee', border: 'none', borderRadius: '20px', cursor: 'pointer' }
};

export default Products;