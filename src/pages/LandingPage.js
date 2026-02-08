import React, { useEffect, useState } from 'react';

const LandingPage = ({ setView }) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: e.clientX,
                y: e.clientY,
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const faqs = [
        { q: "Is Papero really free?", a: "Yes, you can access thousands of public domain books for free. Premium features are coming soon." },
        { q: "How does the AI Librarian work?", a: "Our AI analyzes your reading habits and the content of millions of books to suggest the perfect next read." },
        { q: "Can I use it on mobile?", a: "Absolutely. Papero is fully responsive and works on all devices." },
        { q: "Where do the books come from?", a: "We partner with the Internet Archive and Open Library to bring you a vast digital collection." }
    ];

    return (
        <div style={styles.container}>
            {/* BACKGROUND LAYERS (Fixed) */}
            <div style={styles.backgroundLayer}>
                <div style={styles.gradientOrb1} />
                <div style={styles.gradientOrb2} />
                <div
                    style={{
                        ...styles.cursorGlow,
                        left: mousePosition.x,
                        top: mousePosition.y,
                    }}
                />
                <div style={styles.gridOverlay} />
            </div>

            {/* SCROLLABLE CONTENT */}
            <div style={styles.scrollContent}>

                {/* Navbar */}
                <nav style={styles.nav}>
                    <div style={styles.logo}>Papero.ai</div>
                    <div style={styles.navLinks}>
                        {/* Links removed */}
                    </div>
                </nav>

                {/* Hero Section */}
                <div style={styles.heroSection}>
                    <div style={styles.heroContent}>
                        <div style={styles.badge}>✨ Now with Gemini 2.0 Integration</div>
                        <h1 style={styles.title}>
                            Your Personal <br />
                            <span style={styles.textGradient}>AI Librarian</span>
                        </h1>
                        <p style={styles.subtitle}>
                            Unlock the world's knowledge. Access 20 million+ books,
                            summarized and analyzed by the world's most powerful AI models.
                        </p>

                        <div style={styles.buttonGroup}>
                            <button onClick={() => setView('auth')} style={styles.primaryBtn}>
                                Start Reading for Free
                            </button>
                        </div>

                        {/* Floating Cards */}
                        <div style={styles.floatingCard1}>
                            <span style={styles.icon}>📚</span>
                            <span style={styles.cardText}>20M+ Titles</span>
                        </div>
                        <div style={styles.floatingCard2}>
                            <span style={styles.icon}>🧠</span>
                            <span style={styles.cardText}>Smart Context</span>
                        </div>
                    </div>
                </div>

                {/* Features Section (Added based on user's snippet) */}
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Key Features</h2>
                    <div className="features-grid" style={styles.featuresGrid}>
                        <div className="feature-card" style={styles.featureCard}>
                            <span className="icon" style={styles.featureIcon}>🧠</span>
                            <h3 style={styles.featureTitle}>AI Librarian</h3>
                            <p style={styles.featureDescription}>Ask our smart assistant for personalized book recommendations anytime.</p>
                        </div>
                        <div className="feature-card" style={styles.featureCard}>
                            <span className="icon" style={styles.featureIcon}>🌍</span>
                            <h3 style={styles.featureTitle}>Global Access</h3>
                            <p style={styles.featureDescription}>Read millions of books from the Internet Archive instantly.</p>
                        </div>
                        <div className="feature-card" style={styles.featureCard}>
                            <span className="icon" style={styles.featureIcon}>🏆</span>
                            <h3 style={styles.featureTitle}>Gamified Reading</h3>
                            <p style={styles.featureDescription}>Earn badges, track streaks, and compete with the community.</p>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Frequently Asked Questions</h2>
                    <div style={styles.faqGrid}>
                        {faqs.map((faq, i) => (
                            <div key={i} style={styles.faqCard}>
                                <h3 style={styles.faqQ}>{faq.q}</h3>
                                <p style={styles.faqA}>{faq.a}</p>
                            </div>
                        ))}
                    </div>
                    <div style={styles.footerLink}>
                        <span style={styles.linkText}>View all FAQs →</span>
                    </div>
                </div>

                {/* Footer */}
                <footer style={styles.footer}>
                    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '25px' }}>

                        {/* 1. Marketing Statement */}
                        <h3 style={{ fontSize: '28px', fontWeight: 'bold', background: 'linear-gradient(90deg, #fff, #888)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
                            Redefining how the world reads.
                        </h3>

                        {/* 2. Privacy & Copyright */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', color: '#666', fontSize: '14px' }}>
                            <span style={{ cursor: 'pointer', borderBottom: '1px solid #444' }}>Privacy Policy</span>
                            <span>© 2026 Papero Inc.</span>
                        </div>

                        {/* 3. Credits */}
                        <p style={styles.loveNote}>
                            Made by <b>Aditya Pathak</b> and <b>Mohit Gogia</b> with love ❤️
                        </p>
                    </div>
                </footer>
            </div>
        </div>
    );
};

const styles = {
    container: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#050505',
        color: 'white',
        fontFamily: "'Inter', sans-serif"
    },
    backgroundLayer: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none'
    },
    scrollContent: {
        position: 'relative',
        zIndex: 1,
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        scrollBehavior: 'smooth'
    },
    // ... (Keep existing background styles) ...
    gradientOrb1: {
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        width: '50vw',
        height: '50vw',
        background: 'radial-gradient(circle, rgba(125, 60, 255, 0.3) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(80px)',
        animation: 'float 10s infinite ease-in-out',
    },
    gradientOrb2: {
        position: 'absolute',
        bottom: '-10%',
        right: '-10%',
        width: '60vw',
        height: '60vw',
        background: 'radial-gradient(circle, rgba(255, 60, 120, 0.2) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(80px)',
        animation: 'floatDelayed 12s infinite ease-in-out',
    },
    cursorGlow: {
        position: 'absolute',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, rgba(0,0,0,0) 70%)',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
    },
    gridOverlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
    },

    // Navbar
    nav: {
        padding: '24px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        zIndex: 10
    },
    logo: {
        fontSize: '24px',
        fontWeight: 'bold',
        background: 'linear-gradient(90deg, #fff, #aaa)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    },
    navLinks: {
        display: 'flex',
        gap: '30px',
        color: '#888',
        fontSize: '14px',
        fontWeight: '500'
    },
    navItem: { cursor: 'pointer', transition: 'color 0.2s', ':hover': { color: 'white' } },

    // Hero
    heroSection: {
        minHeight: '90vh', // Take up most of the first screen
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
    },
    heroContent: {
        textAlign: 'center',
        maxWidth: '800px',
        padding: '0 20px',
        position: 'relative'
    },
    badge: {
        display: 'inline-block',
        padding: '8px 16px',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        fontSize: '13px',
        color: '#ccc',
        marginBottom: '30px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    title: {
        fontSize: '72px',
        fontWeight: '800',
        lineHeight: '1.1',
        marginBottom: '24px',
        letterSpacing: '-2px'
    },
    textGradient: {
        background: 'linear-gradient(90deg, #7F7FD5, #86A8E7, #91EAE4)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    },
    subtitle: {
        fontSize: '18px',
        color: '#888',
        lineHeight: '1.6',
        marginBottom: '40px',
        maxWidth: '600px',
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    buttonGroup: { display: 'flex', justifyContent: 'center', gap: '16px' },
    primaryBtn: {
        padding: '16px 32px',
        borderRadius: '12px',
        border: 'none',
        background: 'white',
        color: 'black',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'transform 0.2s',
        boxShadow: '0 0 20px rgba(255, 255, 255, 0.2)'
    },
    secondaryBtn: {
        padding: '16px 32px',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        background: 'transparent',
        color: 'white',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer'
    },
    floatingCard1: {
        position: 'absolute',
        top: '50%',
        left: '-150px',
        background: 'rgba(20, 20, 20, 0.6)',
        backdropFilter: 'blur(20px)',
        padding: '15px 25px',
        borderRadius: '15px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        transform: 'rotate(-12deg)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        animation: 'float 6s infinite ease-in-out'
    },
    floatingCard2: {
        position: 'absolute',
        bottom: '50px',
        right: '-120px',
        background: 'rgba(20, 20, 20, 0.6)',
        backdropFilter: 'blur(20px)',
        padding: '15px 25px',
        borderRadius: '15px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        transform: 'rotate(8deg)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        animation: 'floatDelayed 8s infinite ease-in-out'
    },
    icon: { fontSize: '20px' },
    cardText: { fontSize: '14px', fontWeight: 'bold' },

    // FAQ Section
    section: {
        padding: '100px 20px',
        maxWidth: '1000px',
        margin: '0 auto',
        textAlign: 'center'
    },
    sectionTitle: {
        fontSize: '40px',
        fontWeight: 'bold',
        marginBottom: '60px',
        background: 'linear-gradient(180deg, #fff, #666)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    },
    faqGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '20px',
        textAlign: 'left'
    },
    faqCard: {
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '30px',
        borderRadius: '20px'
    },
    faqQ: { fontSize: '18px', marginBottom: '10px', color: '#fff' },
    faqA: { fontSize: '14px', color: '#888', lineHeight: '1.6' },
    footerLink: { marginTop: '40px' },
    linkText: { color: '#888', borderBottom: '1px solid #444', paddingBottom: '2px', cursor: 'pointer' },

    // Footer
    footer: {
        background: 'black',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '80px 40px 40px 40px'
    },
    footerContent: {
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr',
        gap: '40px',
        marginBottom: '60px'
    },
    footerCol: { display: 'flex', flexDirection: 'column', gap: '15px', color: '#666', fontSize: '14px' },
    footerText: { maxWidth: '200px', lineHeight: '1.6' },
    footerBottom: {
        maxWidth: '1200px',
        margin: '0 auto',
        paddingTop: '30px',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        color: '#444',
        fontSize: '13px'
    },
    loveNote: { color: '#666' }
};

// ... Keyframes (same as before) ...
const styleTag = document.createElement('style');
styleTag.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0) rotate(-12deg); }
        50% { transform: translateY(-20px) rotate(-8deg); }
    }
    @keyframes floatDelayed {
        0%, 100% { transform: translateY(0) rotate(8deg); }
        50% { transform: translateY(20px) rotate(12deg); }
    }
    /* Hide Scrollbar */
    ::-webkit-scrollbar { width: 0px; background: transparent; }
`;
document.head.appendChild(styleTag);

export default LandingPage;
