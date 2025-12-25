import { Dumbbell, Users, Coffee, ArrowRight, Clock } from 'lucide-react';
import Button from '../../components/common/Button';
import Footer from '../../components/layout/Footer';
import FondoImg from '../../assets/images/fondo2.jpeg';
import Fondo2Img from '../../assets/images/fondo3.jpeg';
import Fondo3Img from '../../assets/images/fondo4.jpeg';
import baileImg from '../../assets/images/baile.jpeg';
import localizadoImg from '../../assets/images/localizado.jpeg';

const Landing = () => {
  return (
    <div className="flex flex-col min-h-screen">

      <section className="relative h-[380px] md:h-[500px] overflow-hidden">

  {/* Grid de imágenes */}
  <div className="absolute inset-0 grid grid-cols-3">
    
    {/* Imagen izquierda */}
    <div className="relative">
      <img
        src={Fondo2Img}
        alt="PowerFit comunidad"
        className="w-full h-full object-cover"
      />
    </div>

    {/* Imagen central */}
    <div className="relative">
      <img
        src={FondoImg}
        alt="Gimnasio PowerFit"
        className="w-full h-full object-cover"
      />
    </div>

    {/* Imagen derecha */}
    <div className="relative">
      <img
        src={Fondo3Img}
        alt="Entrenamiento PowerFit"
        className="w-full h-full object-cover"
      />
    </div>

  </div>

  {/* Overlay general */}
  <div className="absolute inset-0 bg-black/60"></div>

  {/* Contenido */}
  <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 space-y-6">
    <span className="inline-block py-1 px-3 rounded-full bg-green-500/20 border border-green-500 text-green-400 text-sm font-semibold">
      El mejor gimnasio de Copiapó
    </span>

    <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
      Transforma tu cuerpo <br />
      <span className="text-green-500">Transforma tu vida</span>
    </h1>

    <p className="text-gray-200 text-lg md:text-xl max-w-2xl">
      Entrena con coach de bienestar motivados y ambiente alegre.
    </p>
  </div>
</section>



      {/* --- SECCIÓN 2: SERVICIOS --- */}
      <section id="servicios" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Nuestros <span className="text-green-500">servicios</span>
            </h2>
            <p className="text-gray-500 mt-2">
              Todo lo que necesitas para alcanzar tus metas fitness en un solo lugar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-gray-100">
              <div className="w-16 h-16 mx-auto bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-6">
                <Dumbbell size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Entrenamiento personalizado</h3>
              <p className="text-gray-500 text-sm">
                Planes diseñados específicamente para tus objetivos con seguimiento profesional.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-gray-100">
              <div className="w-16 h-16 mx-auto bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-6">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Clases grupales</h3>
              <p className="text-gray-500 text-sm">
                Baile entretenido, Salsa fit, Localizado y más entrenamientos dinámicos.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-gray-100">
              <div className="w-16 h-16 mx-auto bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-6">
                <Coffee size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Energía en batido</h3>
              <p className="text-gray-500 text-sm">
                Nutre tu cuerpo y recarga tu energía antes o después de entrenar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECCIÓN 3: INSTALACIONES --- */}
      <section id="instalaciones" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Instalaciones <span className="text-green-500">cómodas y funcionales</span>
          </h2>
          <p className="text-gray-500 mb-12">
            Espacios bien equipados y pensados para ofrecerte una experiencia completa
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative h-64 rounded-2xl overflow-hidden">
              <img src={baileImg} alt="Baile" className="w-full h-full object-cover" />
            </div>
            <div className="relative h-64 rounded-2xl overflow-hidden">
              <img src={localizadoImg} alt="Localizado" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* --- SECCIÓN 4: HORARIOS --- */}
      <section id="horarios" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Horarios <span className="text-green-500">flexibles</span>
            </h2>
            <p className="text-gray-500 mt-2">
              Entrena cuando quieras con nuestros amplios horarios
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <h3 className="flex items-center gap-2 text-xl font-bold mb-6">
                <Clock className="text-green-500" /> Horarios de atención
              </h3>
              <p>Lunes a Viernes: 6:00 AM - 11:00 PM</p>
              <p>Sábados: 8:00 AM - 8:00 PM</p>
              <p>Domingos: 9:00 AM - 6:00 PM</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <h3 className="flex items-center gap-2 text-xl font-bold mb-6">
                <Clock className="text-green-500" /> Clases programadas
              </h3>
              <p>Localizado - 9:00 AM</p>
              <p>Baile Entretenido - 10:30 AM</p>
              <p>Step - 10:30 AM</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
