import React, { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import Home from './pages/Home';
import About from './pages/About';
import Auth from './pages/Auth';
import Products from './pages/Products';
import Focus from './pages/Focus';
import ProductDetail from './pages/ProductDetail';
import Cart from './components/Cart/Cart';
import Library from './pages/Library';
import Reader from './components/Reader/Reader';
import Profile from './pages/Profile';
import Onboarding from './pages/Onboarding';

import LandingPage from './pages/LandingPage';
import Chatbot from './components/Chatbot/Chatbot';

function App() {
  // Default to landing page
  const [view, setView] = useState('landing');
  const [user, setUser] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  // Restore session on load
  React.useEffect(() => {
    const savedUser = localStorage.getItem('papero_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setView('home'); // Go to home if logged in
    }
  }, []);



  const addToCart = (book) => {
    setCartItems([...cartItems, book]);
    setIsCartOpen(true);
  };

  const handleLogin = (userObj) => {
    setUser(userObj);
    localStorage.setItem('papero_user', JSON.stringify(userObj));
    setView('onboarding');
  };

  const handleLogout = () => {
    if (window.confirm("Logout of your paperless library?")) {
      setUser(null);
      localStorage.removeItem('papero_user');
      setView('auth');
    }
  };

  const renderContent = () => {
    switch (view) {
      case 'landing': return <LandingPage setView={setView} />;
      case 'home': return <Home setView={setView} setSelectedBook={setSelectedBook} />;
      case 'about': return <About />;
      case 'products': return <Products setView={setView} setSelectedBook={setSelectedBook} />;
      case 'focus': return <Focus />;
      case 'library': return <Library setView={setView} setSelectedBook={setSelectedBook} />;
      case 'reader': return <Reader book={selectedBook} onBack={() => setView('library')} />;
      case 'product-detail': return <ProductDetail book={selectedBook} onBack={() => setView('products')} addToCart={addToCart} />;
      case 'profile': return <Profile user={user} setView={setView} />;
      case 'auth': return <Auth onAuthSuccess={handleLogin} />;
      case 'onboarding': return <Onboarding user={user} onFinish={() => setView('home')} />;
      default: return <LandingPage setView={setView} />;
    }
  };

  return (
    <div style={styles.appWrapper}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
        
        .sidebar-container { 
          width: 90px; 
          /* background moved to Sidebar component for expansion */
          height: 100vh; 
          position: fixed; 
          left: 0; 
          top: 0; 
          z-index: 1000;
        }

        @media (max-width: 768px) {
          .sidebar-container { 
            width: 100%; 
            height: 70px; 
            bottom: 0; 
            top: auto; 
            left: 0;
            border-radius: 25px 25px 0 0;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .main-content { 
            margin-left: 0 !important; 
            padding: 15px !important; 
            margin-bottom: 80px; 
            border-radius: 0 !important;
          }
        }
      `}</style>

      {view === 'landing' ? (
        <LandingPage setView={setView} />
      ) : (
        <>
          <div className="sidebar-container">
            <Sidebar activeView={view} setView={setView} onLogout={handleLogout} />
          </div>

          <main className="main-content" style={styles.main}>
            <Header
              user={user}
              setView={setView}
              cartCount={cartItems.length}
              onCartClick={() => setIsCartOpen(true)}
            />
            <div style={{ marginTop: '20px' }}>
              {renderContent()}
            </div>
          </main>
        </>
      )}

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemove={(idx) => setCartItems(cartItems.filter((_, i) => i !== idx))}
        onClear={() => setCartItems([])}
      />
      <Chatbot />
    </div>
  );
}

const styles = {
  appWrapper: { display: 'flex', backgroundColor: '#FF6B6B', minHeight: '100vh' },
  main: {
    flex: 1,
    marginLeft: '90px',
    backgroundColor: 'white',
    borderRadius: '40px 0 0 40px',
    padding: '40px',
    minHeight: '100vh',
    overflowY: 'auto'
  }
};

export default App;