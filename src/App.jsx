import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Guides from './pages/Guides';
import LootSystem from './pages/LootSystem';
import Calendar from './pages/Calendar';
import './App.css';

function App() {
  return (
    <>
      <Navbar />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/loot" element={<LootSystem />} />
          <Route path="/calendar" element={<Calendar />} />
        </Routes>
      </div>
    </>
  )
}

export default App;
