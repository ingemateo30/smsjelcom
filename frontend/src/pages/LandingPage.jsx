import { Link } from "react-router-dom";
import { FaPhoneAlt, FaEnvelope, FaWhatsapp } from "react-icons/fa";
import logo from '../assets/logos-jelcom.png';

const LandingPage = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Barra de Navegación */}
      <header className="bg-gray-800 p-4 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold text-orange-500">Jelcom</h1>
        <Link to="/login" className="bg-orange-500 px-4 py-2 rounded font-bold hover:bg-orange-600 transition">
          Iniciar Sesión
        </Link>
      </header>

      {/* Sección Hero */}
      <section className="flex flex-col items-center text-center py-20 px-4">
      <img src={logo} alt="Jelcom Logo" className="h-20" />
        <h2 className="text-4xl font-extrabold text-orange-500">Soluciones en Contact Center</h2>
        <p className="text-lg text-gray-300 mt-4 max-w-2xl">
          En <span className="text-orange-400 font-bold">Jelcom</span>, optimizamos la comunicación con tus clientes a través de 
          servicios de cobranzas, encuestas, marketing y más.
        </p>
        <Link to="/login" className="mt-6 bg-orange-500 px-6 py-3 rounded-lg text-lg font-bold hover:bg-orange-600 transition">
          Comienza Ahora
        </Link>
      </section>

      {/* Sección de Servicios */}
      <section className="bg-gray-800 py-16 px-4">
        <h3 className="text-3xl font-bold text-center text-orange-500">Nuestros Servicios</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 max-w-5xl mx-auto">
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
            <h4 className="text-xl font-bold text-orange-400">Cobranzas y Recuperación</h4>
            <p className="text-gray-300 mt-2">Estrategias eficientes para la recuperación de cartera.</p>
          </div>
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
            <h4 className="text-xl font-bold text-orange-400">Encuestas y Estudios</h4>
            <p className="text-gray-300 mt-2">Obtén datos clave sobre tu mercado y clientes.</p>
          </div>
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
            <h4 className="text-xl font-bold text-orange-400">Promoción de Productos</h4>
            <p className="text-gray-300 mt-2">Impulsa tus ventas con campañas efectivas.</p>
          </div>
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
            <h4 className="text-xl font-bold text-orange-400">Lanzamiento de Campañas</h4>
            <p className="text-gray-300 mt-2">Planeamos y ejecutamos estrategias publicitarias.</p>
          </div>
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
            <h4 className="text-xl font-bold text-orange-400">Fidelización de Clientes</h4>
            <p className="text-gray-300 mt-2">Mantenemos a tus clientes comprometidos con tu marca.</p>
          </div>
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
            <h4 className="text-xl font-bold text-orange-400">Envío Masivo de Mensajes</h4>
            <p className="text-gray-300 mt-2">Automatizamos el envío de SMS y WhatsApp.</p>
          </div>
        </div>
      </section>

      {/* Sección de Contacto */}
      <section className="text-center py-16 px-4">
        <h3 className="text-3xl font-bold text-orange-500">Contáctanos</h3>
        <p className="text-gray-300 mt-4">¿Tienes preguntas? Escríbenos y te ayudaremos.</p>
        <div className="flex justify-center mt-6 space-x-4">
          <a href="https://wa.me/573001234567" target="_blank" rel="noopener noreferrer"
            className="flex items-center space-x-2 bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600 transition">
            <FaWhatsapp size={20} />
            <span>WhatsApp</span>
          </a>
          <a href="mailto:contacto@jelcom.com" className="flex items-center space-x-2 bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition">
            <FaEnvelope size={20} />
            <span>Email</span>
          </a>
          <a href="tel:+573001234567" className="flex items-center space-x-2 bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition">
            <FaPhoneAlt size={20} />
            <span>Llámanos</span>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-center py-4 text-gray-400">
        © {new Date().getFullYear()} Jelcom. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default LandingPage;
