import logo from './logo.svg';
import './App.css';
import CoffeeShopMap from './components/CoffeeShopMap';
import TableView from './components/TableView';
import Admin from './components/admin/Admin';
import StatisticsPage from './components/admin/StatisticsPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'


function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<CoffeeShopMap/>} />
        <Route exact path="/tables/:id" element={<TableView/>} />
        <Route exact path="/admin" element={<Admin/>} />
        <Route exact path="/admin/statistic" element={<StatisticsPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
