import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Home, Clipboard, Users, Package } from 'lucide-react';
import Treatments from './components/Treatments';
import Clients from './components/Clients';
import Products from './components/Products';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex">
        {/* Sidebar */}
        <nav className="bg-white w-64 p-6 space-y-6">
          <div className="text-2xl font-bold text-indigo-600">SPA Dashboard</div>
          <ul className="space-y-4">
            <li>
              <Link to="/" className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600">
                <Home size={20} />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link to="/treatments" className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600">
                <Clipboard size={20} />
                <span>Treatments</span>
              </Link>
            </li>
            <li>
              <Link to="/clients" className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600">
                <Users size={20} />
                <span>Clients</span>
              </Link>
            </li>
            <li>
              <Link to="/products" className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600">
                <Package size={20} />
                <span>Products</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Main content */}
        <main className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<h1 className="text-3xl font-bold">Welcome to the Dashboard</h1>} />
            <Route path="/treatments" element={<Treatments />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/products" element={<Products />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;