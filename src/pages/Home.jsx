import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { FaBars } from 'react-icons/fa';
import { FaSignOutAlt } from 'react-icons/fa';



const products = [
  { id: 1, name: "Product 1", price: "Rs.20", category: "Electronics", description: "This is a description of Product 1.", image: "https://picsum.photos/id/10/300/300" },
  { id: 2, name: "Product 2", price: "Rs.30", category: "Clothing", description: "This is a description of Product 2.", image: "https://picsum.photos/id/20/300/300" },
  { id: 3, name: "Product 3", price: "Rs.40", category: "Groceries", description: "This is a description of Product 3.", image: "https://picsum.photos/id/30/300/300" },
  { id: 4, name: "Product 4", price: "Rs.50", category: "Electronics", description: "This is a description of Product 4.", image: "https://picsum.photos/id/40/300/300" },
  { id: 5, name: "Product 5", price: "Rs.60", category: "Clothing", description: "This is a description of Product 5.", image: "https://picsum.photos/id/50/300/300" },
  { id: 6, name: "Product 6", price: "Rs.70", category: "Groceries", description: "This is a description of Product 6.", image: "https://picsum.photos/id/60/300/300" },
  { id: 7, name: "Product 7", price: "Rs.80", category: "Electronics", description: "This is a description of Product 7.", image: "https://picsum.photos/id/70/300/300" },
  { id: 8, name: "Product 8", price: "Rs.90", category: "Clothing", description: "This is a description of Product 8.", image: "https://picsum.photos/id/80/300/300" },
  { id: 9, name: "Product 9", price: "Rs.100", category: "Groceries", description: "This is a description of Product 9.", image: "https://picsum.photos/id/90/300/300" },
  { id: 10, name: "Product 10", price: "Rs.110", category: "Electronics", description: "This is a description of Product 10.", image: "https://picsum.photos/id/100/300/300" },
];

const Home = () => {
  const { user, logout } = useAuth();
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
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

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, change) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
      )
    );
  };

  const totalCost = cart.reduce((total, item) => total + item.quantity * parseFloat(item.price.slice(3)), 0);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
    const matchesPrice = priceFilter ? parseFloat(product.price.slice(3)) <= parseFloat(priceFilter) : true;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-blue-300 pt-28"> {/* Added pt-28 to ensure space for both the navbar and search bar */}
      {/* Navigation Bar */}
      <nav className="bg-indigo-600 p-4 shadow-md flex justify-between items-center flex-wrap fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center space-x-4">
          <a href="/" className="text-white text-2xl font-semibold">Shopify</a>
        </div>

        <div className="flex space-x-4 items-center mx-4">
          <div className="text-lg font-semibold text-white hidden sm:block">
            {user.name}
          </div>

          <button
            onClick={logout}
            className="flex items-center justify-center bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-500 transition duration-300 text-sm sm:text-base shadow-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50"
          >
            <FaSignOutAlt className="mr-2" size={18} /> {/* Smaller Logout Icon */}
            Logout
          </button>

          <button
            onClick={() => setShowCartModal(true)}
            className="relative p-2 text-white"
          >
            <FaShoppingCart size={26} /> {/* Adjusted Cart Icon size */}
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-600 rounded-xl text-white text-xs  px-2 py-1">
                {cart.length}
              </span>
            )}
          </button>
        </div>

        <div className="sm:hidden flex items-center">
          <button className="text-white p-2">
            <FaBars size={24} /> {/* Adjusted Hamburger Icon size */}
          </button>
        </div>
      </nav>

      {/* Fixed Search Bar and Filters */}
      <div className="bg-white p-2 sm:p-8 lg:p-8 shadow-md fixed top-14 left-0 right-0 z-40">
        <input
          type="text"
          placeholder="Search Products"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-6 p-2 border border-gray-300  w-full"
        />

        <div className="flex flex-wrap mb-4 gap-4">
          <select
            onChange={(e) => setCategoryFilter(e.target.value)}
            value={categoryFilter}
            className="p-2 border border-gray-300  w-full sm:w-1/2 md:w-auto mb-2 sm:mb-0"
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Groceries">Groceries</option>
          </select>

          <div className="flex items-center gap-4">
  <label htmlFor="priceFilter" className="text-sm font-semibold">Max Price: Rs. {priceFilter}</label>
  <input
    id="priceFilter"
    type="range"
    min="0"
    max="200"
    step="10"
    value={priceFilter}
    onChange={(e) => setPriceFilter(e.target.value)}
    className="w-full sm:w-1/2 md:w-auto"
  />
</div>

        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 lg:p-8 mt-32"> {/* Added mt-32 to create space for fixed elements */}
      <div id="products" className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-10">
  {filteredProducts.length === 0 ? (
    <div className="col-span-full text-center text-xl font-semibold text-gray-700">
      No items found.
    </div>
  ) : (
    filteredProducts.map((product) => (
      <motion.div
        key={product.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-4  shadow-lg"
      >
        <img src={product.image} alt={product.name} className="w-full h-56 object-cover" />
        <h3 className="text-xl font-semibold mt-4">{product.name}</h3>
        <p className="text-gray-500 mt-2">{product.description}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xl font-bold">{product.price}</span>
          <button
            onClick={() => addToCart(product)}
            className="bg-blue-500 text-white py-2 px-4  hover:bg-blue-400 transition duration-300"
          >
            Add to Cart
          </button>
        </div>
      </motion.div>
    ))
  )}
</div>
      </div>



      {/* Cart Modal */}
     
      {showCartModal && (
  <div className="fixed inset-0 bg-opacity-85 flex justify-center items-center z-50 bg-blue-400">
  <div className="bg-white p-20  w-120 shadow-lg">
    <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
    {cart.length === 0 ? (
      <>
        <p>Your cart is empty.</p>
        {/* Close Button when cart is empty */}
        <div className="flex justify-end mt-4">
          <button
            onClick={() => setShowCartModal(false)}
            className="bg-indigo-600 text-white px-4 py-2 "
          >
            Close
          </button>
        </div>
      </>
    ) : (
      <>
        <ul>
          {cart.map((item) => (
            <li key={item.id} className="flex justify-between items-center mb-4 mx-6">
              <div className="flex items-center">
                {/* Product Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-28 object-cover mr-4 mb-6" // Adjusted size of the image
                />
                <div className="inline-flex gap-10">
                  <h3 className="flex font-semibold">{item.name}</h3>
                  <p className="flex text-gray-500 text-sm gap-2">
                    Rs. {item.price} x {item.quantity}
                  </p>
                </div>
              </div>
              <div className="inline-flex gap-2">
                {/* Decrease Quantity Button */}
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="border border-gray-400 text-gray-700 px-3 py-1 mr-2 mx-4"
                >
                  -
                </button>
                <span className="mx-2">{item.quantity}</span>
                {/* Increase Quantity Button */}
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="border border-gray-400 text-gray-700 px-3 py-1 ml-2 mx-4"
                >
                  +
                </button>
              </div>
              {/* Remove from Cart Button */}
              <button
                onClick={() => removeFromCart(item.id)}
                className="bg-red-500 text-white p-2 ml-2"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        <div className="flex justify-between items-center mt-4 mx-3">
          <span className="font-semibold">Total: Rs. {totalCost}</span>
          <button
            onClick={() => setShowCartModal(false)}
            className="bg-indigo-600 text-white px-4 py-2"
          >
            Close
          </button>
          <button
            onClick={() => setShowCartModal(false)}
            className="bg-indigo-600 text-white px-4 py-2 "
          >
            Check Out
          </button>
        </div>
      </>
    )}
  </div>
</div>

)}


    </div>
  );
};

export default Home;
