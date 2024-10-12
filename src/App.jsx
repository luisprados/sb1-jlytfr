import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Home, Clipboard, Users, Package } from 'lucide-react';
import Treatments from './components/Treatments';
import Clients from './components/Clients';
import Products from './components/Products';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex">
        {/* Sidebar */}
        <nav className="bg-white w-64 shadow-lg p-6 space-y-8">
          <div className="text-3xl font-bold text-indigo-600">SPA Dashboard</div>
          <ul className="space-y-6">
            {[
              { to: "/", icon: Home, label: "Home" },
              { to: "/treatments", icon: Clipboard, label: "Treatments" },
              { to: "/clients", icon: Users, label: "Clients" },
              { to: "/products", icon: Package, label: "Products" },
            ].map(({ to, icon: Icon, label }) => (
              <li key={to}>
                <Link to={to} className="flex items-center space-x-3 text-gray-700 hover:text-indigo-600 transition-colors duration-200">
                  <Icon size={24} />
                  <span className="text-lg">{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main content */}
        <main className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<h1 className="text-4xl font-bold text-indigo-800">Welcome to the Dashboard</h1>} />
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