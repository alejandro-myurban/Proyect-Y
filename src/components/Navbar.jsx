import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Skull } from 'lucide-react';
import { useState } from 'react';
import './Navbar.css';

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const navLinks = [
        { path: '/', label: 'Inicio' },
        { path: '/guides', label: 'Guías de Raid' },
        { path: '/loot', label: 'Sistema de Loot' },
        { path: '/calendar', label: 'Calendario' },
    ];

    return (
        <nav className="navbar">
            <div className="navbar-container container">
                <Link to="/" className="navbar-logo">
                    <Skull size={32} className="logo-icon" color="#3db518" />
                    <span className="logo-text">Spanish<span className="text-primary">Mafia</span></span>
                </Link>

                <div className="menu-icon" onClick={toggleMenu}>
                    {isOpen ? <X size={28} color="#3db518" /> : <Menu size={28} color="#3db518" />}
                </div>

                <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
                    {navLinks.map((link) => (
                        <li className="nav-item" key={link.path}>
                            <Link
                                to={link.path}
                                className={`nav-links ${location.pathname === link.path ? 'active' : ''}`}
                                onClick={() => setIsOpen(false)}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                    <li className="nav-item mobile-only">
                        <Link to="/calendar" className="btn btn-primary nav-btn" onClick={() => setIsOpen(false)}>
                            Unirse a Raid
                        </Link>
                    </li>
                </ul>

                <div className="nav-desktop-btn">
                    <Link to="/calendar" className="btn btn-primary">Unirse a Raid</Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
