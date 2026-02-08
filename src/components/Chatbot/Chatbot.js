import React, { useState, useRef, useEffect } from 'react';
import CONFIG from '../../config';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'model', text: "Hello! I'm the Librarian. I can help you find books or recommend something based on your mood. Ask me anything!" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const toggleChat = () => setIsOpen(!isOpen);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            // Prepare history for API (convert to Gemini format if needed, here just sending last few)
            // Ideally, backend handles full history, but we can send a simplified version
            const history = messages.map(m => ({
                role: m.role === 'model' ? 'model' : 'user',
                parts: [{ text: m.text }]
            }));

            const res = await fetch(`${CONFIG.API_BASE_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMsg.text,
                    history: history
                })
            });
            const data = await res.json();

            if (data.books && data.books.length > 0) {
                // Response with books
                setMessages(prev => [...prev, {
                    role: 'model',
                    text: data.text,
                    books: data.books
                }]);
            } else {
                // Text only
                setMessages(prev => [...prev, { role: 'model', text: data.text }]);
            }

        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting to the archives. Please try again later." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    // Render Book Card inside Chat
    const renderBookCard = (book) => (
        <div key={book.id} style={styles.bookCard}>
            <img src={book.cover_url} alt={book.title} style={styles.bookCover} />
            <div style={styles.bookInfo}>
                <div style={styles.bookTitle}>{book.title}</div>
                <div style={styles.bookAuthor}>{book.author}</div>
                <button
                    style={styles.readBtn}
                    onClick={() => window.open(`http://localhost:3000?book=${book.id}`, '_self')}
                >
                    READ
                </button>
            </div>
        </div>
    );

    if (!isOpen) {
        return (
            <button onClick={toggleChat} style={styles.floatingBtn}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
                        <path d="M12 6v6l4 2" />
                    </svg>
                    <span style={{ fontWeight: '600', letterSpacing: '0.5px' }}>Librarian</span>
                </div>
                <button onClick={toggleChat} style={styles.closeBtn}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>

            <div style={styles.messagesArea}>
                {messages.map((msg, idx) => (
                    <div key={idx} style={{
                        ...styles.messageRow,
                        justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                    }}>
                        <div style={{
                            ...styles.bubble,
                            background: msg.role === 'user' ? '#1a1a1a' : '#f8f9fa',
                            color: msg.role === 'user' ? 'white' : '#333',
                            borderBottomRightRadius: msg.role === 'user' ? '0' : '12px',
                            borderBottomLeftRadius: msg.role === 'model' ? '0' : '12px',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}>
                            {msg.text}
                            {msg.books && (
                                <div style={styles.bookGrid}>
                                    {msg.books.map(renderBookCard)}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {loading && <div style={{ ...styles.messageRow, justifyContent: 'flex-start' }}>
                    <div style={{ ...styles.bubble, background: '#f8f9fa', color: '#999', fontStyle: 'italic' }}>
                        Consulting the archives...
                    </div>
                </div>}
                <div ref={messagesEndRef} />
            </div>

            <div style={styles.inputArea}>
                <input
                    style={styles.input}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask for a recommendation..."
                    autoFocus
                />
                <button onClick={handleSend} style={styles.sendBtn}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </button>
            </div>
        </div>
    );
};

const styles = {
    floatingBtn: {
        position: 'fixed', bottom: '30px', right: '30px',
        width: '56px', height: '56px', borderRadius: '50%',
        background: '#1a1a1a', color: 'white', border: 'none',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)', cursor: 'pointer',
        zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'transform 0.2s',
        animation: 'fadeIn 0.5s ease'
    },
    container: {
        position: 'fixed', bottom: '100px', right: '30px',
        width: '360px', height: '550px', background: 'white',
        borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        zIndex: 1000, animation: 'fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        border: '1px solid #eee'
    },
    header: {
        padding: '16px 20px', background: '#1a1a1a', color: 'white',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    },
    closeBtn: { background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' },
    messagesArea: { flex: 1, padding: '20px', overflowY: 'auto', background: '#fff' },
    messageRow: { display: 'flex', marginBottom: '12px' },
    bubble: {
        padding: '12px 16px', borderRadius: '12px', maxWidth: '85%',
        fontSize: '14px', lineHeight: '1.5'
    },
    inputArea: {
        padding: '16px', borderTop: '1px solid #f0f0f0',
        display: 'flex', gap: '10px', background: 'white'
    },
    input: {
        flex: 1, padding: '12px 16px', borderRadius: '24px', border: '1px solid #e0e0e0',
        outline: 'none', fontSize: '14px', background: '#f8f9fa', transition: 'border 0.2s'
    },
    sendBtn: {
        background: '#1a1a1a', color: 'white', border: 'none',
        width: '42px', height: '42px', borderRadius: '50%', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
    },
    // Mini Book Card
    bookGrid: { marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' },
    bookCard: {
        display: 'flex', gap: '12px', background: 'white',
        padding: '10px', borderRadius: '10px', alignItems: 'center',
        border: '1px solid #eee', transition: 'transform 0.2s', cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
    },
    bookCover: { width: '45px', height: '68px', objectFit: 'cover', borderRadius: '6px' },
    bookInfo: { flex: 1, minWidth: 0 },
    bookTitle: { fontSize: '13px', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#333' },
    bookAuthor: { fontSize: '11px', color: '#666', marginTop: '2px' },
    readBtn: {
        marginTop: '8px', padding: '6px 0', background: '#1a1a1a',
        color: 'white', border: 'none', borderRadius: '6px',
        fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', width: '100%',
        letterSpacing: '0.5px'
    }
};

export default Chatbot;
