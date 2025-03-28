import { Link } from "react-router-dom";
import { FaPhoneAlt, FaEnvelope, FaWhatsapp, FaCheckCircle, FaHeadset, FaChartLine, FaHandshake, FaUsers, FaArrowRight } from "react-icons/fa";
import { MdSupportAgent, MdOutlineMarkEmailRead, MdPayments } from "react-icons/md";
import logo from '../assets/logos-jelcom.png';
import Nav from './nav';

const LandingPage = () => {
  const servicios = [
    {
      icon: <MdPayments className="text-4xl mb-3 text-orange-500" />,
      title: "Gestión de Cobranzas",
      description: "Optimiza la recuperación de cartera con nuestras estrategias de cobranza personalizadas y efectivas."
    },
    {
      icon: <FaUsers className="text-4xl mb-3 text-orange-500" />,
      title: "Encuestas Empresariales",
      description: "Conoce la opinión de tus clientes con encuestas precisas que generan insights valiosos para tu negocio."
    },
    {
      icon: <MdOutlineMarkEmailRead className="text-4xl mb-3 text-orange-500" />,
      title: "Marketing Digital",
      description: "Incrementa tus ventas con nuestras campañas de marketing orientadas a resultados medibles."
    },
    {
      icon: <FaHeadset className="text-4xl mb-3 text-orange-500" />,
      title: "Atención al Cliente",
      description: "Brinda una experiencia excepcional a tus clientes con nuestro servicio de atención personalizada."
    }
  ];

  const testimonios = [
    {
      quote: "Gracias a Jelcom, nuestra recuperación de cartera ha mejorado un 40%. Su servicio es excelente y el equipo siempre está disponible cuando los necesitamos.",
      author: "Juan Pérez",
      position: "Gerente de Finanzas",
      company: "Grupo Financiero ABC"
    },
    {
      quote: "Las campañas de marketing que Jelcom ha implementado para nosotros han superado nuestras expectativas, con un ROI de más del 300% en el primer trimestre.",
      author: "María Rodríguez",
      position: "Directora de Marketing",
      company: "Retail Solutions"
    },
    {
      quote: "La plataforma de encuestas de Jelcom nos ha permitido tomar decisiones más informadas y mejorar significativamente la satisfacción de nuestros clientes.",
      author: "Carlos Gómez",
      position: "Director de Operaciones",
      company: "Servicios Globales"
    }
  ];

  const estadisticas = [
    { numero: "98%", descripcion: "Satisfacción de clientes" },
    { numero: "+40%", descripcion: "Mejora en recuperación de cartera" },
    { numero: "+5000", descripcion: "Campañas exitosas" },
    { numero: "+200", descripcion: "Empresas confían en nosotros" }
  ];

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Barra de Navegación */}
      <header className="fixed w-full z-50 bg-gray-900 bg-opacity-95 p-4 flex justify-between items-center shadow-lg">
     <Nav />
      </header>

      {/* Sección Hero */}
      <section className="flex flex-col items-center text-center pt-32 pb-20 px-4 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-extrabold">
            <span className="text-white">Transformamos la </span>
            <span className="text-orange-500">experiencia de contacto</span>
            <span className="text-white"> con tus clientes</span>
          </h2>
          <p className="text-lg text-gray-300 mt-6 max-w-3xl mx-auto">
            En Jelcom ofrecemos soluciones integrales de contact center que maximizan la eficiencia de tus comunicaciones y optimizan tus resultados de negocio.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Link to="/demo" className="bg-orange-500 px-8 py-4 rounded-lg text-lg font-bold hover:bg-orange-600 transition flex items-center justify-center">
              Solicita una Demo <FaArrowRight className="ml-2" />
            </Link>
            <a href="#servicios" className="border-2 border-orange-500 text-orange-500 px-8 py-4 rounded-lg text-lg font-bold hover:bg-orange-500 hover:text-white transition">
              Conoce Nuestros Servicios
            </a>
          </div>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="py-12 bg-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {estadisticas.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl font-bold text-orange-500">{stat.numero}</p>
                <p className="text-gray-300 mt-2">{stat.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section id="servicios" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center">Nuestros <span className="text-orange-500">Servicios</span></h3>
          <p className="text-center text-gray-300 mt-4 max-w-2xl mx-auto">
            Ofrecemos soluciones integrales adaptadas a las necesidades específicas de tu empresa
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {servicios.map((servicio, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg hover:transform hover:-translate-y-2 transition duration-300">
                {servicio.icon}
                <h4 className="text-xl font-bold mb-3">{servicio.title}</h4>
                <p className="text-gray-300">{servicio.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de Beneficios */}
      <section id="beneficios" className="bg-gradient-to-r from-gray-900 to-gray-800 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center">¿Por qué elegir <span className="text-orange-500">Jelcom</span>?</h3>
          <p className="text-center text-gray-300 mt-4 max-w-2xl mx-auto">
            Nuestro enfoque orientado a resultados y tecnología de vanguardia nos diferencia
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {[
              {
                icon: <FaChartLine className="text-orange-500 text-2xl" />,
                title: "Automatización Inteligente",
                description: "Optimiza tus procesos con nuestra tecnología de automatización que reduce costos y mejora la eficiencia."
              },
              {
                icon: <MdSupportAgent className="text-orange-500 text-2xl" />,
                title: "Soporte Especializado 24/7",
                description: "Equipo técnico disponible todos los días para garantizar la continuidad de tus operaciones."
              },
              {
                icon: <FaHandshake className="text-orange-500 text-2xl" />,
                title: "Soluciones Personalizadas",
                description: "Adaptamos nuestros servicios a las necesidades específicas de tu negocio para maximizar resultados."
              },
              {
                icon: <FaCheckCircle className="text-orange-500 text-2xl" />,
                title: "Alta Conversión en Ventas",
                description: "Estrategias probadas que incrementan tus tasas de conversión y generan más ingresos."
              },
              {
                icon: <FaCheckCircle className="text-orange-500 text-2xl" />,
                title: "Recuperación de Cartera Optimizada",
                description: "Métodos efectivos que mejoran significativamente la recuperación de tus cuentas por cobrar."
              },
              {
                icon: <FaCheckCircle className="text-orange-500 text-2xl" />,
                title: "Reporting Detallado",
                description: "Informes completos y transparentes para que puedas medir el ROI de nuestros servicios."
              }
            ].map((beneficio, index) => (
              <div key={index} className="bg-gray-700 p-6 rounded-lg shadow-lg hover:bg-gray-600 transition duration-300">
                <div className="flex items-center space-x-3 mb-4">
                  {beneficio.icon}
                  <h4 className="font-bold text-lg">{beneficio.title}</h4>
                </div>
                <p className="text-gray-300">{beneficio.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-orange-500 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold">¿Listo para transformar la comunicación con tus clientes?</h3>
          <p className="mt-4 text-lg">
            Únete a las más de 200 empresas que confían en nuestras soluciones de contact center
          </p>
          <Link to="/demo" className="mt-8 inline-block bg-white text-orange-500 px-8 py-4 rounded-lg text-lg font-bold hover:bg-gray-100 transition">
            Agenda una Demostración Gratuita
          </Link>
        </div>
      </section>

      {/* Sección de Testimonios */}
      <section id="testimonios" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center">Lo que dicen nuestros <span className="text-orange-500">clientes</span></h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {testimonios.map((testimonio, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="text-orange-500 text-5xl mb-4">"</div>
                <blockquote className="italic text-gray-300 mb-6">{testimonio.quote}</blockquote>
                <div>
                  <p className="font-bold">{testimonio.author}</p>
                  <p className="text-orange-400 text-sm">{testimonio.position}</p>
                  <p className="text-gray-400 text-sm">{testimonio.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de Contacto */}
      <section id="contacto" className="bg-gray-800 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-3xl font-bold text-orange-500">Contáctanos</h3>
              <p className="text-gray-300 mt-4">
                Estamos listos para ayudarte a mejorar la comunicación con tus clientes. Nuestro equipo de expertos está a tu disposición.
              </p>
              <div className="mt-8 space-y-4">
                <a href="https://wa.me/573001234567" target="_blank" rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-gray-300 hover:text-green-500 transition">
                  <FaWhatsapp size={20} className="text-green-500" />
                  <span>+57 300 123 4567</span>
                </a>
                <a href="mailto:contacto@jelcom.com" 
                  className="flex items-center space-x-3 text-gray-300 hover:text-blue-500 transition">
                  <FaEnvelope size={20} className="text-blue-500" />
                  <span>contacto@jelcom.com</span>
                </a>
                <a href="tel:+573001234567" 
                  className="flex items-center space-x-3 text-gray-300 hover:text-orange-500 transition">
                  <FaPhoneAlt size={20} className="text-orange-500" />
                  <span>+57 300 123 4567</span>
                </a>
              </div>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
              <h4 className="text-xl font-bold mb-4">Envíanos un mensaje</h4>
              <form className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2" htmlFor="nombre">Nombre</label>
                  <input 
                    type="text" 
                    id="nombre" 
                    className="w-full bg-gray-800 rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500" 
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2" htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full bg-gray-800 rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500" 
                    placeholder="tu@email.com"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2" htmlFor="empresa">Empresa</label>
                  <input 
                    type="text" 
                    id="empresa" 
                    className="w-full bg-gray-800 rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500" 
                    placeholder="Nombre de tu empresa"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2" htmlFor="mensaje">Mensaje</label>
                  <textarea 
                    id="mensaje" 
                    rows="4" 
                    className="w-full bg-gray-800 rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500" 
                    placeholder="¿En qué podemos ayudarte?"
                  ></textarea>
                </div>
                <button type="submit" className="w-full bg-orange-500 py-3 rounded font-bold hover:bg-orange-600 transition">
                  Enviar Mensaje
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-center py-8 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Jelcom Logo" className="h-12" />
          </div>
          <div className="flex justify-center space-x-6 mb-6">
            <a href="#" className="text-gray-400 hover:text-orange-500 transition">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path></svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-orange-500 transition">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-orange-500 transition">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path></svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-orange-500 transition">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd"></path></svg>
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left mb-8">
            <div>
              <h5 className="font-bold mb-4 text-orange-500">Servicios</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-orange-500 transition">Gestión de Cobranzas</a></li>
                <li><a href="#" className="hover:text-orange-500 transition">Encuestas Empresariales</a></li>
                <li><a href="#" className="hover:text-orange-500 transition">Marketing Digital</a></li>
                <li><a href="#" className="hover:text-orange-500 transition">Atención al Cliente</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4 text-orange-500">Compañía</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-orange-500 transition">Sobre Nosotros</a></li>
                <li><a href="#" className="hover:text-orange-500 transition">Casos de Éxito</a></li>
                <li><a href="#" className="hover:text-orange-500 transition">Blog</a></li>
                <li><a href="#" className="hover:text-orange-500 transition">Carreras</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4 text-orange-500">Soporte</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-orange-500 transition">Centro de Ayuda</a></li>
                <li><a href="#" className="hover:text-orange-500 transition">Base de Conocimiento</a></li>
                <li><a href="#" className="hover:text-orange-500 transition">Contáctanos</a></li>
                <li><a href="#" className="hover:text-orange-500 transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4 text-orange-500">Legal</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-orange-500 transition">Términos de Servicio</a></li>
                <li><a href="#" className="hover:text-orange-500 transition">Política de Privacidad</a></li>
                <li><a href="#" className="hover:text-orange-500 transition">Política de Cookies</a></li>
                <li><a href="#" className="hover:text-orange-500 transition">Cumplimiento GDPR</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6">
            <p className="text-gray-400">
              © {new Date().getFullYear()} Jelcom. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

