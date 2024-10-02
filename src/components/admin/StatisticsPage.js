import React, { useState, useEffect } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import { FaFilter, FaSort, FaChartBar, FaChartPie, FaChartLine, FaCalendarAlt } from "react-icons/fa";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const StatisticsPage = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState("bar");
  const [filterOption, setFilterOption] = useState("all");
  const [sortOption, setSortOption] = useState("none");
  const [dateFilter, setDateFilter] = useState("all");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("https://dummyjson.com/carts");
      setData(response.data);
      setLoading(false);
    } catch (error) {
      setError("Error fetching data. Please try again later.");
      setLoading(false);
    }
  };

  const processData = () => {
    if (!data) return null;

    let processedData = data.carts.map((cart) => ({
      id: cart.id,
      total: cart.total,
      products: cart.products.length,
      date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
    }));

    if (filterOption !== "all") {
      processedData = processedData.filter(
        (item) => item.total > parseInt(filterOption)
      );
    }

    if (dateFilter !== "all") {
      const today = new Date();
      const filterDate = new Date();

      switch (dateFilter) {
        case "day":
          filterDate.setDate(today.getDate() - 1);
          break;
        case "week":
          filterDate.setDate(today.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(today.getMonth() - 1);
          break;
        case "range":
          processedData = processedData.filter(
            (item) => item.date >= startDate && item.date <= endDate
          );
          return processedData;
      }

      processedData = processedData.filter((item) => item.date >= filterDate);
    }

    if (sortOption !== "none") {
      processedData.sort((a, b) =>
        sortOption === "asc" ? a.total - b.total : b.total - a.total
      );
    }

    return processedData;
  };

  const getChartData = () => {
    const processedData = processData();
    if (!processedData) return null;

    const labels = processedData.map((item) => `Order ${item.id}`);
    const totals = processedData.map((item) => item.total);
    const products = processedData.map((item) => item.products);

    const datasets = [
      {
        label: "Total Sales",
        data: totals,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Number of Products",
        data: products,
        backgroundColor: "rgba(255, 159, 64, 0.6)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ];

    return { labels, datasets };
  };

  const renderChart = () => {
    const chartData = getChartData();
    if (!chartData) return null;

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Sales Statistics",
        },
      },
    };

    switch (chartType) {
      case "bar":
        return <Bar data={chartData} options={options} />;
      case "pie":
        return <Pie data={chartData} options={options} />;
      case "line":
        return <Line data={chartData} options={options} />;
      default:
        return null;
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Sales Statistics</h1>
      <div className="mb-8 flex flex-wrap justify-center items-center gap-4">
        <div className="flex items-center">
          <label htmlFor="filterOption" className="mr-2">
            Filter:
          </label>
          <select
            id="filterOption"
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
            className="border rounded p-2"
          >
            <option value="all">All</option>
            <option value="100">Total &gt; $100</option>
            <option value="500">Total &gt; $500</option>
            <option value="1000">Total &gt; $1000</option>
          </select>
        </div>
        <div className="flex items-center">
          <label htmlFor="sortOption" className="mr-2">
            Sort:
          </label>
          <select
            id="sortOption"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border rounded p-2"
          >
            <option value="none">None</option>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        <div className="flex items-center">
          <label htmlFor="dateFilter" className="mr-2">
            Date Filter:
          </label>
          <select
            id="dateFilter"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border rounded p-2"
          >
            <option value="all">All Time</option>
            <option value="day">Last 24 Hours</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="range">Custom Range</option>
          </select>
        </div>
        {dateFilter === "range" && (
          <div className="flex items-center">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              className="border rounded p-2 mr-2"
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              className="border rounded p-2"
            />
          </div>
        )}
        <div className="flex items-center">
          <label className="mr-2">Chart Type:</label>
          <div className="flex gap-2">
            <button
              onClick={() => setChartType("bar")}
              className={`p-2 rounded ${
                chartType === "bar" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              aria-label="Bar Chart"
            >
              <FaChartBar />
            </button>
            <button
              onClick={() => setChartType("pie")}
              className={`p-2 rounded ${
                chartType === "pie" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              aria-label="Pie Chart"
            >
              <FaChartPie />
            </button>
            <button
              onClick={() => setChartType("line")}
              className={`p-2 rounded ${
                chartType === "line" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              aria-label="Line Chart"
            >
              <FaChartLine />
            </button>
          </div>
        </div>
      </div>
      <div className="w-full h-[60vh] bg-white rounded-lg shadow-lg p-4 mb-8">
        {renderChart()}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Total Sales</h2>
          <p className="text-3xl font-bold text-blue-500">
            ${data.total.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Total Orders</h2>
          <p className="text-3xl font-bold text-green-500">
            {data.carts.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Average Order Value</h2>
          <p className="text-3xl font-bold text-purple-500">
            $
            {(data.total / data.carts.length).toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Total Products Sold</h2>
          <p className="text-3xl font-bold text-orange-500">
            {data.carts.reduce((sum, cart) => sum + cart.totalProducts, 0)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
