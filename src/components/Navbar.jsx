import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Home, Info, GraduationCap, Microscope, Users, Activity, Mail } from 'lucide-react';

const navItems = [
  { label: 'Home', target: 'home', icon: Home },
  { label: 'About', target: 'about', icon: Info },
  { label: 'Programs', target: 'programs', icon: GraduationCap },
  { label: 'Laboratories', target: 'facilities', icon: Microscope },
  { label: 'Faculty', target: 'faculty', icon: Users },
  { label: 'Activities', target: 'activities', icon: Activity },
  { label: 'Contact', target: 'contact', icon: Mail },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll spy to highlight active nav item on scroll
  useEffect(() => {
    if (location.pathname !== '/') return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      for (const item of navItems) {
        const el = document.getElementById(item.target);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(item.target);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  const handleNavClick = (target) => {
    setIsOpen(false);
    if (location.pathname !== '/') {
      navigate(`/#${target}`);
    } else {
      const el = document.getElementById(target);
      if (el) {
        const yOffset = -70; // Offset for sticky navbar
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
        setActiveSection(target);
      }
    }
  };

  return (
    <nav className="sticky top-0 z-50 shadow-md bg-[#082b50] w-full border-b border-white/10 main-navbar">
      <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between h-full w-full">
        {/* Logo Brand */}
        <button 
          onClick={() => navigate('/')} 
          className="nav-brand text-white font-extrabold tracking-wide hover:text-accent transition-colors duration-200 bg-transparent cursor-pointer flex-shrink-0 text-left leading-tight"
        >
          Department of Civil Engineering
        </button>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="menu-toggle p-2 text-white/90 hover:text-white border-0 transition-colors focus:outline-none bg-transparent cursor-pointer"
          aria-label="Toggle navigation"
        >
          {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-1 font-medium ml-auto">
          <ul className="flex items-center space-x-2 font-medium m-0 p-0 list-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === '/' && activeSection === item.target;
              return (
                <li key={item.target}>
                  <button
                    onClick={() => handleNavClick(item.target)}
                    className={`flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 group bg-transparent border-0 cursor-pointer text-sm font-semibold
                      ${isActive 
                        ? 'text-accent bg-white/10' 
                        : 'text-white/80 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    <Icon className={`w-4 h-4 mr-2 group-hover:text-accent transition-colors ${isActive ? 'text-accent' : 'text-white/60'}`} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="lg:hidden bg-[#082b50] border-t border-white/10 pb-4 animate-fadeIn w-full">
          <ul className="flex flex-col space-y-1 pt-2 font-medium m-0 p-0 list-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === '/' && activeSection === item.target;
              return (
                <li key={item.target}>
                  <button
                    onClick={() => handleNavClick(item.target)}
                    className={`flex items-center w-full text-left px-6 py-3 transition-all duration-200 bg-transparent border-0 cursor-pointer text-base
                      ${isActive 
                        ? 'text-accent bg-white/10 font-bold' 
                        : 'text-white/80 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    <Icon className="w-5 h-5 mr-3 text-accent" />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
