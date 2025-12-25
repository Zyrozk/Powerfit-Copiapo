import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';
import Button from "../common/Button";
const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* 1. Logo y Descripción */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                 {/* Logo placeholder */}
                 <span className="font-bold text-green-600">P</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900 leading-none">Powerfit</span>
                <span className="text-xs text-gray-500">Copiapó</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Tu destino fitness en Copiapó. Transformamos vidas a través del ejercicio y la motivación.
            </p>
          </div>

          {/* 2. Contacto (Basado en Figura 7) */}
          <div>
            <h3 className="text-gray-900 font-bold mb-4">Contacto</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-green-500 mt-0.5" />
                <span>Calle Lastarria #1098, Esquina Algarrobo, Copiapó</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-green-500" />
                <span>+56 9 1234 5678</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-green-500" />
                <span>info@powerfitcopiapo.cl</span>
              </li>
            </ul>
          </div>

          {/* 3. Redes y CTA */}
          <div>
            <h3 className="text-gray-900 font-bold mb-4">Síguenos</h3>
            <div className="flex gap-4 mb-6">
              <a href="https://www.instagram.com/powerfit_copiapo/" className="w-10 h-10 rounded-lg border border-green-500 flex items-center justify-center text-green-500 hover:bg-green-50 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://www.facebook.com/PowerFITcopiapo/" className="w-10 h-10 rounded-lg border border-green-500 flex items-center justify-center text-green-500 hover:bg-green-50 transition-colors">
                <Facebook size={20} />
              </a>
            </div>
            <Button variant="primary" className="w-full">Únete ahora</Button>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 text-center text-xs text-gray-400">
          &copy; 2025 Powerfit Copiapó. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;