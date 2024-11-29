import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { FaBars } from 'react-icons/fa';
import { FaSignOutAlt } from 'react-icons/fa';
import { FaSearch } from "react-icons/fa";


const products = [
  { id: 1, name: "Wireless Bluetooth Speaker", price: "Rs.20", category: "Electronics", description: "Compact and portable speaker with superior sound quality.", image: "https://picsum.photos/id/10/300/300" },
  { id: 2, name: "Men's Cotton T-Shirt", price: "Rs.30", category: "Clothing", description: "Comfortable and stylish cotton t-shirt available in various colors.", image: "https://picsum.photos/id/20/300/300" },
  { id: 3, name: "Organic Almonds (500g)", price: "Rs.40", category: "Groceries", description: "Premium quality organic almonds, perfect for snacking.", image: "https://picsum.photos/id/30/300/300" },
  { id: 4, name: "Noise-Cancelling", price: "Rs.50", category: "Electronics", description: "Over-ear headphones with active noise-cancellation.", image: "https://picsum.photos/id/40/300/300" },
  { id: 5, name: "Women's Summer Dress", price: "Rs.60", category: "Clothing", description: "Elegant and lightweight summer dress for casual outings.", image: "https://picsum.photos/id/50/300/300" },
  { id: 6, name: "Organic Brown Rice (1kg)", price: "Rs.70", category: "Groceries", description: "Healthy and nutritious organic brown rice.", image: "https://picsum.photos/id/60/300/300" },
  { id: 7, name: "Smartphone (64GB)", price: "Rs.80", category: "Electronics", description: "Feature-packed smartphone with a stunning display and great battery life.", image: "https://picsum.photos/id/70/300/300" },
  { id: 8, name: "Unisex Denim Jacket", price: "Rs.90", category: "Clothing", description: "Stylish and durable denim jacket for all seasons.", image: "https://picsum.photos/id/80/300/300" },
  { id: 9, name: "Fresh Apples (1kg)", price: "Rs.100", category: "Groceries", description: "Crisp and juicy apples, directly sourced from farms.", image: "https://picsum.photos/id/90/300/300" },
  { id: 10, name: "Smart TV (43-inch)", price: "Rs.110", category: "Electronics", description: "Ultra HD Smart TV with vibrant display and built-in streaming apps.", image: "https://picsum.photos/id/100/300/300" },
  { id: 11, name: "Wireless Earbuds", price: "Rs.120", category: "Electronics", description: "True wireless earbuds with crystal clear sound and long battery life.", image: "https://picsum.photos/id/110/300/300" },
  { id: 12, name: "Leather Wallet", price: "Rs.130", category: "Accessories", description: "Premium leather wallet with multiple card slots and a sleek design.", image: "https://picsum.photos/id/120/300/300" },
];


const Home = () => {
  const { user, logout } = useAuth();
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [showCartModal, setShowCartModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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
    setSuccessMessage(`Added ${product.name} to your cart!`);
    setTimeout(() => {
      setSuccessMessage(''); // Clear the success message after 3 seconds
    }, 3000);
    
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
    <div className="min-h-screen bg-white pt-28"> {/* Added pt-28 to ensure space for both the navbar and search bar */}
      {/* Navigation Bar */}
      <nav className="bg-orange-600 p-4 shadow-md flex justify-between items-center flex-wrap fixed top-0 left-0 right-0 z-50 ">
        <div className="flex items-center space-x-4">
          <a href="/" className="text-white text-2xl font-semibold">E-Store</a>
        </div>

        <div className="flex space-x-4 items-center mx-4">
          <div className="text-lg font-semibold text-white hidden sm:block">
            User : {user.name}
          </div>

          <button
            onClick={logout}
            className="flex items-center justify-center bg-white text-black px-4 py-2 rounded-full hover:bg-orange-500 transition duration-300 text-sm sm:text-base shadow-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50"
          >
            <FaSignOutAlt className="mr-2" size={10} /> {/* Smaller Logout Icon */}
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
<div className="bg-white p-2 sm:p-8 lg:p-8 shadow-md fixed top-14 left-0 right-0 z-40 border-4 border-orange-400">
  {/* Search Input */}
  <div className="relative mb-6 w-full">
    <input
      type="text"
      placeholder="Search Products"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="p-2 pl-10 pr-10 border-2 border-orange-400 w-full rounded-md"
    />
    <span className="absolute inset-y-0 right-3 flex items-center text-orange-400">
      <FaSearch />
    </span>
  </div>

  {/* Filters */}
  <div className="flex flex-wrap mb-4 gap-4">
    {/* Category Filter */}
    <select
      onChange={(e) => setCategoryFilter(e.target.value)}
      value={categoryFilter}
      className="p-2 border-2 border-orange-400 w-full sm:w-1/2 md:w-auto rounded-md"
    >
      <option value="">All Categories</option>
      <option value="Electronics">Electronics</option>
      <option value="Clothing">Clothing</option>
      <option value="Groceries">Groceries</option>
    </select>

    {/* Price Filter */}
    <div className="flex items-center gap-2 w-full sm:w-auto">
      <label htmlFor="priceRange" className="text-orange-600 font-medium">
        Price:
      </label>
      <select
        id="priceRange"
        onChange={(e) => setPriceFilter(e.target.value)}
        value={priceFilter}
        className="p-2 border-2 border-orange-400 rounded-md w-full sm:w-auto"
      >
        <option value="">All Prices</option>
        <option value="0-50">Rs.0 - Rs.50</option>
        <option value="50-100">Rs.50 - Rs.100</option>
        <option value="100-500">Rs.100 - Rs.500</option>
        <option value="500-1000">Rs.500 - Rs.1000</option>
        <option value="1000+">Rs.1000</option>
      </select>
    </div>
  </div>

  {/* Success Message */}
  {successMessage && (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="fixed top-20 left-3/4 transform -translate-x-1/2 bg-orange-600 text-white px-6 py-2 rounded-md shadow-lg z-50"
    >
      {successMessage}
    </motion.div>
  )}
</div>


      {/* Main Content */}
      <div className="p-4 sm:p-6 lg:p-8 mt-32"> {/* Added mt-32 to create space for fixed elements */}
      <div id="products"className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6 gap-6">
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
        className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between min-h-[400px] h-auto 
          transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
      >
        <div className="flex flex-col items-center">
          {/* Product Image */}
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover rounded-md"
          />
          {/* Product Name */}
          <h3 className="text-lg font-bold mt-4 text-center">{product.name}</h3>
          {/* Product Description */}
          <p className="text-sm text-gray-500 mt-2 text-center">
            {product.description}
          </p>
        </div>
        <div className="mt-4 flex justify-between items-center">
          {/* Product Price */}
           <span className="text-xl font-semibold text-black">
            {product.price}
          </span>
          {/* Add to Cart Button */}
           <button
            onClick={() => addToCart(product)}
            className="bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-black transition duration-300">
                         Add to Cart
           </button>
          </div>
      </motion.div>  )) )}
      </div>
   </div>
   
     
      {/* Cart Modal */}
      {showCartModal && (
  <div className="fixed inset-0 bg-opacity-85 flex justify-center items-center z-50 bg-orange-300 ">
    <div className="bg-white p-12 w-124 shadow-lg rounded-lg max-h-[120vh] overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
      {cart.length === 0 ? (
        <>
          <p>Your cart is empty.</p>
          {/* Close Button when cart is empty */}
          <div className="flex justify-end mt-6 mx-40">
            <button
              onClick={() => setShowCartModal(false)}
              className="bg-orange-400 text-white px-4 py-2 rounded-md"
            >
              Close
            </button>
          </div>
        </>
      ) : (
        <>
          <ul className="space-y-4 overflow-y-auto max-h-[60vh] pr-2">
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  {/* Product Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-28 object-cover mr-20"
                  />
                  <div className="flex flex-col gap-1 mr-20">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-500 text-sm">
                      Rs. {item.price} x {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Decrease Quantity Button */}
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="border border-gray-400 text-gray-700 px-3 py-1 rounded-md"
                  >
                    -
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  {/* Increase Quantity Button */}
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="border border-gray-400 text-gray-700 px-3 py-1 rounded-md"
                  >
                    +
                  </button>
                  {/* Remove from Cart Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="bg-red-500 text-white p-2 ml-6 rounded-md"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center mt-4">
            <span className="font-semibold">Total: Rs. {totalCost}</span>
            <div className="flex gap-4">
              <button
                onClick={() => setShowCartModal(false)}
                className="bg-orange-400 text-white px-4 py-2 rounded-md"
              >
                Close
              </button>
              <button
                onClick={() => setShowCartModal(false)}
                className="bg-green-600 text-white px-4 py-2 rounded-md"
              >
                Check Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  </div>
)}


<footer className="bg-gray-800 text-white py-6">
  <div className="container mx-auto text-center">
    <p>&copy; 2024 Your Company. All rights reserved.</p>
    <div className="flex justify-center space-x-6 mt-4">
      <a href="#" className="hover:text-gray-400">Privacy Policy</a>
      <a href="#" className="hover:text-gray-400">Terms of Service</a>
      <a href="#" className="hover:text-gray-400">Contact Us</a>
    </div>
  </div>
</footer>
    </div>
  );
};

export default Home;
