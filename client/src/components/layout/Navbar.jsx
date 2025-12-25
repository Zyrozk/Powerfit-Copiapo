import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from "../common/Button";
import { Menu, X } from 'lucide-react'; // Iconos para menú móvil
import logo from "../../assets/images/logo.jpeg";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Enlaces centrales basados en image006.png (Servicios), image008.png (Horarios), image007.png (Instalaciones)
  const navLinks = [
    { name: 'Servicios', path: '#servicios' },
    { name: 'Horarios', path: '#horarios' },
    { name: 'Instalaciones', path: '#instalaciones' },
  ];

  return (
    <nav className="bg-white fixed w-full z-50 top-0 left-0 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* 1. Logo y Nombre (Izquierda) */}
          <Link to="/" className="flex items-center gap-3">
            {/* Placeholder para el logo circular verde de la imagen */}
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center overflow-hidden">
               {/* Si no tienes la imagen aún, usa este div verde temporal */}
               <img src={logo} alt="PowerFit Logo" className="w-full h-full object-cover" /> 
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900 leading-none">Powerfit</span>
              <span className="text-xs text-gray-500">Copiapó</span>
            </div>
          </Link>

          {/* 2. Enlaces Centrales (Escritorio) - Ocultos en móvil */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.path} 
                className="text-gray-600 hover:text-green-500 font-medium transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* 3. Botones de Acción (Derecha) - Basados en image005.jpg */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login">
              <Button variant="secondary">
                Iniciar sesión
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="primary">
                Registrarse
              </Button>
            </Link>
          </div>

          {/* Botón Menú Móvil (Hamburguesa) */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600">
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Móvil Desplegable */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.path} 
                className="block px-3 py-2 text-gray-700 hover:text-green-500 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 flex flex-col gap-3">
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="secondary" className="w-full">Iniciar sesión</Button>
              </Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                <Button variant="primary" className="w-full">Registrarse</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;