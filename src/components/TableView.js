import React, { useState, useEffect } from "react";
import { FaPlus, FaMinus, FaChair, FaCoffee, FaSearch } from "react-icons/fa";

const TableView = () => {
  const [table, setTable] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    // Simulating API call to fetch table data
    setTimeout(() => {
      setTable({
        id: 1,
        chairs: 5,
        occupied: false,
        type: "regular"
      });
      setLoading(false);
    }, 1000);

    // Fetch menu items from dummyjson API
    fetch('https://dummyjson.com/products')
      .then(response => response.json())
      .then(data => {
        setMenuItems(data.products);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setError('Failed to load menu items');
      });
  }, []);

  const handleAddChair = () => {
    setTable(prevTable => ({
      ...prevTable,
      chairs: prevTable.chairs < 8 ? prevTable.chairs + 1 : prevTable.chairs
    }));
  };

  const handleRemoveChair = () => {
    setTable(prevTable => ({
      ...prevTable,
      chairs: prevTable.chairs > 1 ? prevTable.chairs - 1 : prevTable.chairs
    }));
  };

  const handleAddDish = (dish) => {
    setSelectedDishes(prevDishes => [...prevDishes, dish]);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const categories = ["All", ...new Set(menuItems.map(item => item.category))];

  const filteredMenuItems = menuItems.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === "All" || item.category === selectedCategory)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  if (!table) {
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
        <div className="relative w-64 h-64 mx-auto mb-8">
          {/* Table */}
          <div className="absolute inset-0 bg-gray-300 rounded-full">
            {/* Chairs */}
            {[...Array(table.chairs)].map((_, index) => (
              <div
                key={index}
                className="absolute w-8 h-8 bg-blue-500 rounded-full"
                style={{
                  top: `${50 + 40 * Math.sin(index * (2 * Math.PI) / table.chairs)}%`,
                  left: `${50 + 40 * Math.cos(index * (2 * Math.PI) / table.chairs)}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <FaChair className="text-white w-full h-full p-1" />
              </div>
            ))}
            {/* Buttons inside the table */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex space-x-2">
              <button className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors duration-300">
                <FaPlus />
              </button>
              <button className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-300">
                <FaMinus />
              </button>
            </div>
          </div>
        </div>
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold">Table {table.id}</h2>
          <p className="mb-2">
            Status:{" "}
            <span
              className={`px-2 py-1 rounded-full text-xs ${table.occupied ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}
            >
              {table.occupied ? "Occupied" : "Available"}
            </span>
          </p>
          <p className="mb-2">Type: {table.type}</p>
          <p>Chairs: {table.chairs}</p>
        </div>
        <div className="space-y-2">
          <button 
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
            onClick={() => setShowMenu(!showMenu)}
          >
            <FaCoffee className="inline-block mr-2" /> {showMenu ? "Hide Menu" : "Show Menu"}
          </button>
          {showMenu && (
            <div className="mt-4 bg-gray-100 p-4 rounded">
              <h3 className="text-lg font-semibold mb-2">Menu Items</h3>
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search menu items..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <FaSearch className="absolute right-3 top-3 text-gray-400" />
                </div>
              </div>
              <div className="mb-4 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-3 py-1 rounded ${selectedCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <div className="h-64 overflow-y-auto">
                {filteredMenuItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 mb-4 p-2 bg-white rounded shadow">
                    <img src={item.thumbnail} alt={item.title} className="w-20 h-20 object-cover rounded" />
                    <div className="flex-grow">
                      <h4 className="text-md font-semibold">{item.title}</h4>
                      <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">{item.category}</p>
                    </div>
                    <button
                      onClick={() => handleAddDish(item)}
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition-colors duration-300"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {selectedDishes.length > 0 && (
            <div className="mt-4 bg-gray-100 p-4 rounded">
              <h3 className="text-lg font-semibold mb-2">Selected Dishes</h3>
              <ul className="space-y-2">
                {selectedDishes.map((dish, index) => (
                  <li key={index}>{dish.title} - ${dish.price.toFixed(2)}</li>
                ))}
              </ul>
              <p className="mt-2 font-bold">
                Total: ${selectedDishes.reduce((total, dish) => total + dish.price, 0).toFixed(2)}
              </p>
            </div>
          )}
          <button className="w-full bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors duration-300">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableView;