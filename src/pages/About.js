import React, { useState } from 'react';

const About = () => {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: "How does the 'Global Library' work?",
      a: "Our Global Library connects to the OpenLibrary archive, giving you access to over 20 million books. When you 'buy' a book here, we import the digital edition instantly into your personal cloud library."
    },
    {
      q: "Is the payment real?",
      a: "No. This is a university project demonstration. The UPI QR code is for simulation purposes only. No actual money is deducted, and books are free to access for testing."
    },
    {
      q: "Can I read offline?",
      a: "Currently, our reader requires an active internet connection to stream book content from the Internet Archive servers. Offline support is planned for v2.0."
    },
    {
      q: "Why do some books look different?",
      a: "Since we source from public archives, some books are scanned originals (PDFs) while others are digital EPUBs. We try to provide the best available quality automatically."
    }
  ];

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <h1 style={styles.title}>About Papero</h1>
        <p style={styles.subtitle}>Reimagining the library for the digital age.</p>
      </div>

      <div style={styles.content}>

        {/* Mission */}
        <div style={styles.section}>
          <h2 style={styles.header}>Our Mission</h2>
          <p style={styles.text}>
            Papero is designed to make knowledge universally accessible. By bridging local curated collections with the vast
            resources of the Internet Archive, we provide a seamless, paperless reading experience that fits in your pocket.
            We believe in clean design, distraction-free reading, and the power of open knowledge.
          </p>
        </div>

        {/* Help & FAQs */}
        <div style={styles.section}>
          <h2 style={styles.header}>Help Center & FAQs</h2>
          <div style={styles.faqContainer}>
            {faqs.map((item, index) => (
              <div key={index} style={styles.faqItem}>
                <div
                  style={styles.faqQuestion}
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                >
                  <span>{item.q}</span>
                  <span style={{ transform: openFaq === index ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }}>▼</span>
                </div>
                {openFaq === index && (
                  <div style={styles.faqAnswer}>
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact / Legal */}
        <div style={styles.grid}>
          <div style={styles.card}>
            <h3>📞 Contact Us</h3>
            <p style={{ marginTop: '10px', color: '#666' }}>
              <strong>Support:</strong> help@papero.edu<br />
              <strong>Office:</strong> Amity University<br />
              <strong>Phone:</strong> +91 98765 43210
            </p>
          </div>
          <div style={styles.card}>
            <h3>⚖️ Legal</h3>
            <p style={{ marginTop: '10px', color: '#666' }}>
              <a href="#" style={styles.link}>Terms of Service</a><br />
              <a href="#" style={styles.link}>Privacy Policy</a><br />
              <a href="#" style={styles.link}>Refund Policy</a>
            </p>
          </div>
        </div>

        <div style={styles.footer}>
          © 2024 Papero Library Project. All rights reserved. <br />
          Built with React, Flask & OpenLibrary.
        </div>

      </div>
    </div>
  );
};

const styles = {
  container: { padding: '20px', maxWidth: '800px', margin: '0 auto' },
  hero: { textAlign: 'center', marginBottom: '50px', padding: '40px 0', borderBottom: '1px solid #eee' },
  title: { fontSize: '42px', fontWeight: '800', color: '#333', marginBottom: '10px' },
  subtitle: { fontSize: '18px', color: '#888' },
  section: { marginBottom: '50px' },
  header: { fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', borderLeft: '4px solid #FF6B6B', paddingLeft: '15px' },
  text: { fontSize: '16px', lineHeight: '1.6', color: '#555' },

  faqContainer: { display: 'flex', flexDirection: 'column', gap: '15px' },
  faqItem: { border: '1px solid #eee', borderRadius: '10px', overflow: 'hidden' },
  faqQuestion: { padding: '15px 20px', backgroundColor: '#f9f9f9', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', fontWeight: '600' },
  faqAnswer: { padding: '15px 20px', backgroundColor: 'white', color: '#666', lineHeight: '1.5', borderTop: '1px solid #eee' },

  grid: { display: 'flex', gap: '20px', marginBottom: '50px' },
  card: { flex: 1, padding: '25px', backgroundColor: '#f5f5f5', borderRadius: '15px' },
  link: { color: '#FF6B6B', textDecoration: 'none', lineHeight: '2' },

  footer: { textAlign: 'center', color: '#aaa', fontSize: '14px', lineHeight: '1.6', borderTop: '1px solid #eee', paddingTop: '30px' }
};

export default About;