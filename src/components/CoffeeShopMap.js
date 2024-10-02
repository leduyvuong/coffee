import React, { useState, useEffect } from "react";
import { FaPlus, FaMinus, FaChair, FaCoffee, FaFilter, FaSearch } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

const CoffeeShopMap = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const tablesPerPage = 6;

  useEffect(() => {
    // Simulating API call to fetch tables
    setLoading(true);
    setTimeout(() => {
      const generatedTables = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        occupied: Math.random() > 0.5,
        type: Math.random() > 0.5 ? "regular" : "booth",
      }));
      setTables(generatedTables);
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

  const filteredTables = tables.filter((table) => {
    if (filter === "all") return true;
    if (filter === "available") return !table.occupied;
    if (filter === "occupied") return table.occupied;
    if (filter === "booth") return table.type === "booth";
    return true;
  });

  const paginatedTables = filteredTables.slice(
    (currentPage - 1) * tablesPerPage,
    currentPage * tablesPerPage
  );

  const totalPages = Math.ceil(filteredTables.length / tablesPerPage);

  const handleTableClick = (table) => {
    setSelectedTable(table);
  };

  const handleCloseMenu = () => {
    setSelectedTable(null);
    setShowMenu(false);
    setSelectedDishes([]);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handleAddDish = (dish) => {
    setSelectedDishes((prevDishes) => [...prevDishes, dish]);
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Coffee Shop Map</h1>
      <div className="mb-4 flex justify-center space-x-2">
        <button
          onClick={() => handleFilterChange("all")}
          className={`px-4 py-2 rounded ${filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          All
        </button>
        <button
          onClick={() => handleFilterChange("available")}
          className={`px-4 py-2 rounded ${filter === "available" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Available
        </button>
        <button
          onClick={() => handleFilterChange("occupied")}
          className={`px-4 py-2 rounded ${filter === "occupied" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Occupied
        </button>
        <button
          onClick={() => handleFilterChange("booth")}
          className={`px-4 py-2 rounded ${filter === "booth" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Booth
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {paginatedTables.map((table) => (
          <div
            key={table.id}
            className={`p-4 border rounded-lg shadow-md transition-all duration-300 ${table.occupied ? "bg-red-100" : "bg-green-100"} hover:shadow-lg`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold">Table {table.id}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${table.occupied ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}>
                {table.occupied ? "Occupied" : "Available"}
              </span>
            </div>
            <div className="flex items-center justify-center mb-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <FaChair key={index} className="text-gray-600 mx-1" />
              ))}
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => handleTableClick(table)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
                aria-label={`Open menu for Table ${table.id}`}
              >
                <FaPlus />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-center space-x-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
      {selectedTable && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Table {selectedTable.id}</h2>
              <button
                onClick={handleCloseMenu}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close menu"
              >
                <IoMdClose size={24} />
              </button>
            </div>
            <div className="mb-4">
              <p className="mb-2">
                Status:{" "}
                <span
                  className={`px-2 py-1 rounded-full text-xs ${selectedTable.occupied ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}
                >
                  {selectedTable.occupied ? "Occupied" : "Available"}
                </span>
              </p>
              <p className="mb-2">Type: {selectedTable.type}</p>
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
      )}
    </div>
  );
};

export default CoffeeShopMap;
