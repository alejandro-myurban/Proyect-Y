import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Guides from './pages/Guides';
import LootSystem from './pages/LootSystem';
import Calendar from './pages/Calendar';
import Profile from './pages/Profile';

import { Toaster } from "sileo";
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Footer from './components/Footer';

function App() {
  return (
    <AuthProvider>
      <Toaster  
      
        offset={{ top: 100, right: 16 }}
        options={{

          fill: "#2E2E2E",
          styles: { description: "text-white" },
        }} 
        position="top-center"
      />
      <Navbar />
      <div className="min-h-screen pt-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/loot" element={<LootSystem />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
      <Footer />
    </AuthProvider>
  )
}

export default App;
