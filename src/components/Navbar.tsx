import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Skull, LogIn } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from './ui/button';

function Navbar() {
    const { user, signOut } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const userInitial = user?.email?.charAt(0).toUpperCase() || "?";


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
        <nav className="bg-[rgba(10,10,12,0.95)] backdrop-blur-[10px] h-20 flex justify-center items-center text-[1.1rem] font-['Inter'] font-bold fixed top-0 w-full z-40 border-b border-[#2a2a33]">
            <div className="flex justify-between items-center w-full max-w-[1440px] mx-auto px-8">
                <Link to="/" className="flex items-center no-underline text-[1.5rem] cursor-pointer">
                    <Skull size={32} color="#3db518" />
                    <span className="ml-2 text-white font-medium font-['Changa_One']">
                        Spanish<span className="text-[#86b518]">Mafia</span>
                    </span>
                </Link>

                {/* Hamburger — solo mobile */}
                <button
                    className="hidden max-[960px]:block absolute top-0 right-0 translate-x-[-100%] translate-y-[60%] cursor-pointer bg-transparent border-none"
                    onClick={toggleMenu}
                >
                    {isOpen ? <X size={28} color="#3db518" /> : <Menu size={28} color="#3db518" />}
                </button>

                {/* Nav links */}
                <ul className={`
                    flex list-none text-center items-center
                    max-[960px]:flex-col max-[960px]:w-full max-[960px]:h-[calc(100vh-80px)]
                    max-[960px]:absolute max-[960px]:top-20 max-[960px]:opacity-100
                    max-[960px]:bg-[rgba(10,10,12,0.98)] max-[960px]:backdrop-blur-[10px]
                    max-[960px]:border-t max-[960px]:border-[#2a2a33]
                    transition-all duration-[0.4s] ease
                    ${isOpen ? 'max-[960px]:left-0 max-[960px]:z-[1]' : 'max-[960px]:left-[-100%]'}
                `}>
                    {navLinks.map((link) => (
                        <li
                            key={link.path}
                            className="h-20 max-[960px]:w-full max-[960px]:flex max-[960px]:justify-center max-[960px]:border-b max-[960px]:border-[#2a2a33]"
                        >
                            <Link
                                to={link.path}
                                className={`
                                    flex items-center no-underline px-6 h-full
                                    uppercase text-[0.9rem] tracking-[1px] relative
                                    max-[960px]:text-center max-[960px]:p-8 max-[960px]:w-full max-[960px]:flex max-[960px]:justify-center
                                    after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2
                                    after:w-0 after:h-[2px] after:bg-[#86b518] after:transition-all after:duration-300
                                    after:shadow-[0_-2px_10px_rgba(61,181,24,0.4)]
                                    hover:after:w-full hover:text-[#86b518] hover:drop-shadow-[0_0_10px_rgba(61,181,24,0.4)]
                                    ${location.pathname === link.path
                                        ? 'text-[#86b518] drop-shadow-[0_0_10px_rgba(61,181,24,0.4)] after:!w-full'
                                        : 'text-[#e2e2e2]'
                                    }
                                `}
                                onClick={() => setIsOpen(false)}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}

                    {/* Botones Auth mobile */}
                    <li className="hidden max-[960px]:flex flex-col gap-4 w-full px-8 mt-8 border-none h-auto">
                        {user ? (
                            <>
                                <div className="flex items-center gap-3 self-center mb-2">
                                    <Avatar className="size-10 border border-primary/20">
                                        <AvatarFallback className="bg-primary/10 text-primary font-bold">{userInitial}</AvatarFallback>
                                    </Avatar>
                                </div>
                                <button onClick={() => { signOut(); setIsOpen(false); }} className="btn w-full">Cerrar Sesión</button>
                            </>
                        ) : (
                            <Link to="/login" className="w-full" onClick={() => setIsOpen(false)}>
                                <Button className="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/50 tracking-wider uppercase text-lg h-12 shadow-[0_0_15px_rgba(134,181,24,0.1)]">
                                    <LogIn className="size-5 mr-2" />
                                    Login
                                </Button>
                            </Link>
                        )}
                    </li>
                </ul>

                {/* Botones Auth desktop */}
                <div className="flex items-center gap-6 max-[960px]:hidden ">
                    {user ? (
                        <div className="flex items-center gap-4 ">
                            <div className="flex items-center gap-2 group cursor-default cursor-pointer">
                                <Avatar className="size-9 border border-primary/20 transition-colors group-hover:border-primary/40">
                                    <AvatarFallback className="bg-primary/10 text-primary font-bold ">{userInitial}</AvatarFallback>
                                </Avatar>
                            </div>
                            <button onClick={signOut} className="btn py-2 px-4 text-[0.8rem]">Salir</button>
                            <Link to="/calendar" className="btn btn-primary">Raid</Link>
                        </div>
                    ) : (
                        <Link to="/login">
                            <Button className="font-sans font-bold bg-primary/10 hover:bg-primary/20 text-primary border border-primary/50 tracking-widest uppercase px-8 shadow-[0_0_15px_rgba(134,181,24,0.1)] hover:shadow-[0_0_25px_rgba(134,181,24,0.3)] transition-all duration-300 group">
                                <LogIn className="size-4 mr-2 group-hover:translate-x-1 transition-transform" />
                                Login
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
