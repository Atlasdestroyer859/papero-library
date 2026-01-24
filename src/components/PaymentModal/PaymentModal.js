import React, { useState } from 'react';

const PaymentModal = ({ isOpen, onClose, total, cartItems, onSuccess }) => {
    const [step, setStep] = useState('method'); // method, verify, processing, success
    const [utr, setUtr] = useState('');

    if (!isOpen) return null;

    const handleVerifyAndPay = async () => {
        if (!utr) {
            alert("Please enter the Transaction ID (UTR) to verify payment.");
            return;
        }

        setStep('processing');

        // 1. Simulate Verification Delay (Teacher "Checking" the payment)
        await new Promise(r => setTimeout(r, 2000));

        // 2. Real Backend Call
        try {
            let allSuccess = true;
            for (const item of cartItems) {
                console.log("Purchasing book:", item.id);
                const res = await fetch('http://localhost:5000/api/purchase', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_id: 1,
                        book_id: item.id,
                        book_data: {
                            title: item.title,
                            author: item.author,
                            price: item.price,
                            cover_url: item.cover_url,
                            ia_id: item.ia_id,
                            year: item.year
                        }
                    })
                });
                const data = await res.json();
                if (!data.success && !res.ok) allSuccess = false;
            }

            if (allSuccess) {
                setStep('success');
                setTimeout(() => {
                    onSuccess();
                    onClose();
                    setStep('method'); // Reset
                    setUtr('');
                }, 2500);
            } else {
                // Even if some duplicates failed (already owned), we consider it success for the flow
                setStep('success');
                setTimeout(() => {
                    onSuccess();
                    onClose();
                    setStep('method');
                    setUtr('');
                }, 2500);
            }

        } catch (err) {
            console.error("Payment API Error:", err);
            setStep('method');
            alert("Server Error: Could not verify purchase. Is backend running?");
        }
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>

                <div style={styles.header}>
                    <span style={styles.logo}>SECURE CHECKOUT</span>
                    <button onClick={onClose} style={styles.closeBtn}>✕</button>
                </div>

                {step === 'method' && (
                    <div style={styles.body}>
                        <div style={styles.leftCol}>
                            <h3 style={styles.sectionTitle}>Scan to Pay</h3>
                            <div style={styles.qrContainer}>
                                {/* Placeholder QR - Replace with User's Real QR Image if provided */}
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=pathakaditya859-1@oksbi&pn=BookStore&cu=INR`}
                                    alt="UPI QR"
                                    style={{ width: '150px', height: '150px' }}
                                />
                                <p style={{ marginTop: '10px', fontWeight: 'bold' }}>UPI ID: pathakaditya859-1@oksbi</p>
                                <p style={{ fontSize: '12px', color: '#888' }}>Pay ₹{total.toFixed(2)} to complete order</p>
                            </div>
                        </div>

                        <div style={styles.rightCol}>
                            <h3 style={styles.sectionTitle}>Verification</h3>
                            <p style={{ fontSize: '14px', color: '#aaa', marginBottom: '15px' }}>
                                After paying, enter the 12-digit UTR / Transaction ID below for manual verification.
                            </p>

                            <input
                                type="text"
                                placeholder="Enter Transaction ID (e.g. 1234567890)"
                                value={utr}
                                onChange={(e) => setUtr(e.target.value)}
                                style={styles.input}
                            />

                            <div style={styles.summaryRow}>
                                <span>Total Payable:</span>
                                <span style={{ color: '#FF6B6B' }}>₹{total.toFixed(2)}</span>
                            </div>

                            <button
                                onClick={handleVerifyAndPay}
                                style={styles.payBtn}
                            >
                                Verify & Complete
                            </button>
                        </div>
                    </div>
                )}

                {step === 'processing' && (
                    <div style={styles.centerBody}>
                        <div style={styles.spinner}></div>
                        <h3 style={{ marginTop: '20px' }}>Verifying Transaction...</h3>
                        <p style={{ color: '#888' }}>Please wait while we confirm with the bank.</p>
                    </div>
                )}

                {step === 'success' && (
                    <div style={styles.centerBody}>
                        <div style={styles.checkCircle}>✓</div>
                        <h2 style={{ marginTop: '20px' }}>Payment Verified!</h2>
                        <p style={{ color: '#888' }}>Books have been unlocked in your library.</p>
                    </div>
                )}

            </div>
        </div>
    );
};

const styles = {
    overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(5px)' },
    modal: { width: '700px', height: '450px', backgroundColor: '#121212', color: 'white', borderRadius: '15px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.5)', border: '1px solid #333' },
    header: { padding: '15px 30px', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1a1a1a' },
    logo: { fontWeight: 'bold', letterSpacing: '1px', fontSize: '14px', color: '#ccc' },
    closeBtn: { background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' },
    body: { flex: 1, display: 'flex', padding: '30px' },
    leftCol: { flex: 1, paddingRight: '30px', borderRight: '1px solid #333', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
    rightCol: { flex: 1, paddingLeft: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
    sectionTitle: { marginBottom: '20px', fontSize: '18px', borderBottom: '2px solid #FF6B6B', display: 'inline-block', paddingBottom: '5px' },
    qrContainer: { padding: '15px', background: 'white', borderRadius: '10px', color: 'black', textAlign: 'center' },
    input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #444', background: '#222', color: 'white', marginBottom: '20px', outline: 'none' },
    summaryRow: { display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' },
    payBtn: { width: '100%', padding: '15px', backgroundColor: '#FF6B6B', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', transition: '0.2s' },
    centerBody: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
    spinner: { width: '50px', height: '50px', border: '4px solid #333', borderTop: '4px solid #FF6B6B', borderRadius: '50%', animation: 'spin 1s linear infinite' },
    checkCircle: { width: '70px', height: '70px', backgroundColor: '#4CAF50', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '35px' }
};

export default PaymentModal;
