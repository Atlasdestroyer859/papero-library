import React, { useState, useEffect } from 'react';

const quotes = [
  { text: "A room without books is like a body without a soul.", author: "Cicero" },
  { text: "So many books, so little time.", author: "Frank Zappa" },
  { text: "The person, be it gentleman or lady, who has not pleasure in a good novel, must be intolerably stupid.", author: "Jane Austen" },
  { text: "There is no friend as loyal as a book.", author: "Ernest Hemingway" },
  { text: "It is what you read when you don't have to that determines what you will be when you can't help it.", author: "Oscar Wilde" },
  { text: "That's the thing about books. They let you travel without moving your feet.", author: "Jhumpa Lahiri" },
  { text: "Books are a uniquely portable magic.", author: "Stephen King" },
  { text: "I have always imagined that Paradise will be a kind of library.", author: "Jorge Luis Borges" }
];

const QuoteBanner = () => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // Fade out
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % quotes.length);
        setFade(true); // Fade in
      }, 500); // Wait for fade out to finish
    }, 8000); // Change every 8 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.banner}>
      <div style={styles.badge}>Quote Today</div>
      <div style={{ ...styles.content, opacity: fade ? 1 : 0, transform: fade ? 'translateY(0)' : 'translateY(10px)' }}>
        <h2 style={styles.quote}>"{quotes[index].text}"</h2>
        <p style={styles.author}>- {quotes[index].author}</p>
      </div>
      <div style={styles.decoration}>📖</div>
      <style>{`
        @media (max-width: 768px) {
          h2 { fontSize: '20px' !important; }
        }
      `}</style>
    </div>
  );
};

const styles = {
  banner: {
    background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
    borderRadius: '25px',
    padding: '40px',
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(255, 107, 107, 0.3)',
    marginBottom: '30px',
    minHeight: '180px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  badge: {
    display: 'inline-block',
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 'fit-content',
    color: 'white',
    padding: '5px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 'bold',
    marginBottom: '15px'
  },
  content: {
    position: 'relative',
    zIndex: 2,
    maxWidth: '90%',
    transition: 'all 0.5s ease-in-out'
  },
  quote: {
    fontSize: '24px',
    fontStyle: 'italic',
    marginBottom: '15px',
    lineHeight: '1.4',
    fontWeight: '600',
    color: 'white',
    margin: '0 0 10px 0'
  },
  author: {
    fontSize: '16px',
    fontWeight: '500',
    opacity: 0.9,
    color: 'white'
  },
  decoration: {
    position: 'absolute',
    right: '-20px',
    bottom: '-20px',
    fontSize: '150px',
    opacity: 0.1,
    zIndex: 1
  }
};

export default QuoteBanner;