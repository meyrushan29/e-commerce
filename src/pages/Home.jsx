import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaShoppingCart } from 'react-icons/fa';

// Hardcoded product list for demonstration
const products = [
  { id: 1, name: "Product 1", price: "Rs.20", description: "This is a description of Product 1.", image: "https://via.placeholder.com/150" },
  { id: 2, name: "Product 2", price: "Rs.30", description: "This is a description of Product 2.", image: "https://via.placeholder.com/150" },
  { id: 3, name: "Product 3", price: "Rs.40", description: "This is a description of Product 3.", image: "https://via.placeholder.com/150" },
  { id: 4, name: "Product 4", price: "Rs.50", description: "This is a description of Product 4.", image: "https://via.placeholder.com/150" },
];

const Home = () => {
  const { user, logout } = useAuth();
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCartModal, setShowCartModal] = useState(false);

  // Persist cart to localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  useEffect(() => {
    // Store cart in localStorage whenever it changes
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Add product to cart
  const addToCart = (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Remove product from cart
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // Update product quantity in cart
  const updateQuantity = (id, change) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
      )
    );
  };

  // Calculate total cost of items in the cart
  const totalCost = cart.reduce((total, item) => total + item.quantity * parseFloat(item.price.slice(3)), 0);

  // Search filter function
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar with Profile, Logout, and Cart Icon */}
      <nav className="bg-indigo-600 p-4 shadow-md flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img
            src={user.profilePicture || "https://via.placeholder.com/150"}
            alt="User Profile"
            className="w-12 h-12 rounded-full object-cover border-2 border-indigo-600"
          />
          <div className="text-white">
            <h1 className="text-xl font-semibold">{user.name}</h1>
            <p className="text-sm">{user.email}</p>
          </div>
        </div>
        <div className="flex p-0  space-x-4">
          <button
            onClick={logout}
            className="bg-red-600 text-white px-3 py-3 rounded-lg hover:bg-red-500 transition duration-300"
          >
            Logout
          </button>

          {/* Cart Icon with Item Count */}
          <button
            onClick={() => setShowCartModal(true)}
            className="relative p-2 text-white"
          >
            <FaShoppingCart size={40} />
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full px-2 py-1">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-8">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search Products"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4 p-2 border border-gray-300 rounded-lg w-full"
        />

        {/* Product List Section */}
        <div id="products" className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              className="bg-white rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-32 object-cover mb-6 transition-transform duration-300 transform hover:scale-110"
              />
              <div className="px-4 pb-6">
                <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
                <p className="text-sm text-gray-600 mt-2">{product.description}</p>
                <p className="text-lg font-bold text-indigo-600 mt-4">{product.price}</p>
                <button
                  onClick={() => addToCart(product)}
                  className="bg-indigo-600 text-white px-4 py-2 mt-4 rounded-lg hover:bg-indigo-500 transition duration-300"
                >
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Cart Modal */}
      {showCartModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-4">Shopping Cart</h2>
            {cart.length === 0 ? (
              <p>Your cart is empty!</p>
            ) : (
              <div>
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover mr-4" />
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p>{item.price} x {item.quantity}</p>
                      </div>
                    </div>
                    <div className="flex space-x-4 items-center">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="bg-indigo-600 text-white px-2 py-1 rounded-lg hover:bg-indigo-500"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="bg-indigo-600 text-white px-2 py-1 rounded-lg hover:bg-indigo-500"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition duration-300"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <div className="mt-4 text-xl font-bold">
                  <p>Total Cost: Rs.{totalCost.toFixed(2)}</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setShowCartModal(false)}
              className="mt-4 w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-500"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-indigo-600 text-white text-center py-12 mt-auto">
        <div className="text-sm">© 2024 My Shopping Site. All Rights Reserved.</div>
      </footer>
    </div>
  );
};

export default Home;
