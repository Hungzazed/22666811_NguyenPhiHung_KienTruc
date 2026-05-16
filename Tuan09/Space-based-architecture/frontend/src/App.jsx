import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ShoppingBag, X, CheckCircle, AlertCircle, Loader2, Zap } from 'lucide-react';

const PU1_URL = 'http://localhost:8081';
const PU2_URL = 'http://localhost:8082';
const PU3_URL = 'http://localhost:8083';
const PU4_URL = 'http://localhost:8084';

const USER_ID = 'user_123'; // Demo User

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [stocks, setStocks] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchInitialData();
    const stockInterval = setInterval(fetchStocks, 3000); // Poll stocks for real-time feel
    return () => clearInterval(stockInterval);
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [prodRes, cartRes] = await Promise.all([
        axios.get(`${PU1_URL}/products`),
        axios.get(`${PU2_URL}/cart/${USER_ID}`)
      ]);
      setProducts(prodRes.data);
      setCart(cartRes.data);
      await fetchStocks(prodRes.data);
    } catch (err) {
      showNotification('Error loading data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStocks = async (productList = products) => {
    try {
      const stockData = {};
      await Promise.all(
        productList.map(async (p) => {
          const res = await axios.get(`${PU4_URL}/stock/${p.id}`);
          stockData[p.id] = res.data.stock;
        })
      );
      setStocks(stockData);
    } catch (err) {
      console.error('Failed to fetch stocks', err);
    }
  };

  const addToCart = async (productId) => {
    try {
      const currentQty = parseInt(cart[productId] || 0);
      await axios.post(`${PU2_URL}/cart/add`, {
        userId: USER_ID,
        productId,
        quantity: currentQty + 1
      });
      setCart(prev => ({ ...prev, [productId]: currentQty + 1 }));
      showNotification('Added to cart', 'success');
    } catch (err) {
      showNotification('Failed to add to cart', 'error');
    }
  };

  const handleCheckout = async () => {
    if (Object.keys(cart).length === 0) return;
    try {
      setCheckingOut(true);
      const res = await axios.post(`${PU3_URL}/checkout`, { userId: USER_ID });
      setCart({});
      setIsCartOpen(false);
      showNotification('Checkout successful!', 'success');
      fetchStocks();
    } catch (err) {
      showNotification(err.response?.data?.error || 'Checkout failed', 'error');
    } finally {
      setCheckingOut(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const cartCount = Object.values(cart).reduce((a, b) => a + parseInt(b), 0);
  const cartTotal = products
    .filter(p => cart[p.id])
    .reduce((sum, p) => sum + parseFloat(p.price) * parseInt(cart[p.id]), 0);

  if (loading) {
    return (
      <div className="app-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Loader2 className="animate-spin" size={48} color="#ff4d4d" />
      </div>
    );
  }

  return (
    <div className="app-container">
      <header>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1>NEO FLASH <span className="flash-tag flash-sale-active">LIVE</span></h1>
        </motion.div>

        <motion.div 
          className="cart-toggle" 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCartOpen(true)}
        >
          <ShoppingCart size={20} />
          <span>My Cart</span>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </motion.div>
      </header>

      <div className="product-grid">
        {products.map((product, idx) => (
          <motion.div 
            key={product.id}
            className="product-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="product-image-placeholder">
              <ShoppingBag size={64} color="rgba(255,255,255,0.1)" />
            </div>
            <div className="product-name">{product.name}</div>
            <div className="product-price">${product.price}</div>
            <div className="product-stock">
              Stock: <span className="stock-count">{stocks[product.id] ?? '...'}</span> left
            </div>
            <button 
              className="btn-add" 
              onClick={() => addToCart(product.id)}
              disabled={stocks[product.id] <= 0}
            >
              {stocks[product.id] <= 0 ? 'Out of Stock' : (
                <>
                  <Zap size={18} fill="currentColor" />
                  Snag it Now
                </>
              )}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              className="overlay" 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
            />
            <motion.div 
              className="cart-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="drawer-header">
                <h2>Your Bag</h2>
                <X style={{ cursor: 'pointer' }} onClick={() => setIsCartOpen(false)} />
              </div>

              <div className="cart-items">
                {Object.entries(cart).map(([id, qty]) => {
                  const product = products.find(p => p.id === id);
                  if (!product) return null;
                  return (
                    <div key={id} className="cart-item">
                      <div>
                        <div style={{ fontWeight: 700 }}>{product.name}</div>
                        <div style={{ color: 'var(--text-muted)' }}>Qty: {qty}</div>
                      </div>
                      <div style={{ fontWeight: 800 }}>${(product.price * qty).toFixed(2)}</div>
                    </div>
                  );
                })}
                {Object.keys(cart).length === 0 && (
                  <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)' }}>
                    Your cart is empty.
                  </div>
                )}
              </div>

              <div className="cart-footer">
                <div className="total-row">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <button 
                  className="btn-checkout" 
                  disabled={Object.keys(cart).length === 0 || checkingOut}
                  onClick={handleCheckout}
                >
                  {checkingOut ? <Loader2 className="animate-spin" style={{ margin: '0 auto' }} /> : 'CHECKOUT NOW'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            className={`notification ${notification.type}`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
