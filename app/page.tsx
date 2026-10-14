'use client'

import { useState, useRef, useEffect } from 'react'

export default function CodeNexaHome() {
  const [formData, setFormData] = useState({ name: '', email: '', service: 'Quantika POS', message: '' })
  const [sent, setSent] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Estado para el Modo Oscuro / Claro (Dark mode por defecto)
  const [darkMode, setDarkMode] = useState(true)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])
  
  // Carrusel de Herramientas Principales
  const [activeToolSlide, setActiveToolSlide] = useState(0)
  
  // Galería Interactiva por Pestañas
  const [selectedGalleryTool, setSelectedGalleryTool] = useState(0)
  const [activeModuleIdx, setActiveModuleIdx] = useState(0)

  // Lightbox (imagen en grande)
  const [modalImage, setModalImage] = useState<{ title: string; image: string } | null>(null)

  // Asistente IA
  const [chatOpen, setChatOpen] = useState(false)
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '¡Hola! Soy el Asistente CodeNexa ¿En qué le puedo colaborar hoy? Ya sea sobre Quantika POS Enterprise, MarketGuate, consultorías de arquitectura TI o CodeNexa Academy.' }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [loadingChat, setLoadingChat] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const coreToolsSlides = [
    {
      badge: "SISTEMA FLAGSHIP",
      title: "QuantikaPOS",
      subtitle: "Sistema de Gestión Empresarial Integral",
      desc: "Inventario, control de caja, gestión de clientes, cuentas por pagar/cobrar, cotizaciones profesionales, control multi-sucursal y ventas ultrarrápidas de alta concurrencia.",
      ctaText: "Cotizar Solución Enterprise",
      image: "/image_8acc6b.png"
    },
    {
      badge: "EDICIÓN FITNESS",
      title: "QuantikaPOS • Gimnasios",
      subtitle: "Control Total y Salud Metabólica",
      desc: "Inscripciones con vigencias, control de acceso biométrico/QR, control clínico de nutrición y antropometría, ingresos/egresos y rutinas de entrenamiento a escala.",
      ctaText: "Ver Módulos de Gimnasio",
      image: "/image_b3a918.png"
    },
    {
      badge: "VITRINA COMERCIAL",
      title: "MarketGuate.net",
      subtitle: "Plataforma de E-commerce y Directorio",
      desc: "Vitrina digital corporativa exclusiva para exposición de productos, procesamiento de pedidos online y vinculación comercial a nivel nacional.",
      ctaText: "Visitar MarketGuate",
      image: "/image_marketguate.png"
    }
  ]

  const consultingCatalog = [
    { icon: "🏗️", title: "Arquitectura de Stack Tecnológico Completo", desc: "Diseño integral de sistemas distribuidos corporativos, conectando infraestructura cloud, APIs de alto rendimiento y bases de datos transaccionales." },
    { icon: "☁", title: "Migraciones On-Premise a Cloud", desc: "Estrategias de transición seguras hacia arquitecturas en la nube de alta disponibilidad, optimizando costos y resiliencia." },
    { icon: "🛡️", title: "Ciberseguridad & Hardening", desc: "Auditorías de infraestructura crítica, endurecimiento de servidores, pentesting avanzado y protección de perímetros." },
    { icon: "🗄️", title: "Bases de Datos de Misión Crítica", desc: "Diseño, modelado y optimización de motores de alto rendimiento (SQL Server, PostgreSQL, Supabase) para operaciones masivas." },
    { icon: "📈", title: "Gestión de Proyectos TI", desc: "Dirección técnica y administrativa bajo estándares corporativos rigurosos de control de calidad y mitigación de riesgos." },
    { icon: "🔄", title: "Metodologías Ágiles (Scrum/Kanban)", desc: "Implementación de marcos ágiles a escala para acelerar ciclos de entrega y maximizar el retorno de inversión tecnológica." }
  ]

  const toolsGalleries = [
    {
      category: "QuantikaPOS • Empresarial",
      badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
      modules: [
        { title: "Acceso Seguro (Login)", desc: "Autenticación cifrada para usuarios y roles corporativos autorizados por sucursal.", image: "/image_8ac8c8.png" },
        { title: "Panel Principal Corporativo", desc: "Control gerencial multi-sucursal, personal, categorías y estados financieros.", image: "/image_8acc6b.png" },
        { title: "Punto de Venta (POS)", desc: "Interfaz optimizada para transacciones rápidas y control estricto de inventario.", image: "/image_8acd3d.jpg" },
        { title: "Estadísticas y Reportes", desc: "Métricas gerenciales detalladas de ventas y proyecciones de ingresos.", image: "/image_8ac960.png" },
        { title: "Cuentas por Cobrar y Pagar", desc: "Control financiero detallado de créditos corporativos y pasivos.", image: "/image_8accc9.png" }
      ]
    },
    {
      category: "QuantikaPOS • Gimnasios",
      badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
      modules: [
        { title: "Panel de Administración Fitness", desc: "Control centralizado de accesos, socios, nutrición y clases grupales.", image: "/image_b3a918.png" },
        { title: "Inscripciones y Planes", desc: "Gestión de membresías corporativas y emisión de carnets de acceso.", image: "/image_inscripciones.png" },
        { title: "Control Financiero", desc: "Gestión detallada de flujos de caja operativos y administrativos.", image: "/image_control.png" },
        { title: "Seguimiento Nutricional", desc: "Evaluación antropométrica y asignación de planes alimenticios.", image: "/image_nutricion.png" },
        { title: "Rutinas", desc: "Asignación y seguimiento de programas de acondicionamiento físico.", image: "/image_rutina.png" }
      ]
    },
    {
      category: "MarketGuate.net",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      modules: [
        { title: "Plataforma E-commerce", desc: "Infraestructura digital de exposición y directorio comercial.", image: "/image_marketguate.png" },
        { title: "Catálogo de Artículos", desc: "Exhibición estructurada de productos con altos estándares visuales.", image: "/image_productos_web.png" },
        { title: "Procesamiento de Pedidos", desc: "Gestión automatizada de órdenes de compra en línea.", image: "/image_pedido_web.png" },
        { title: "Trazabilidad Logística", desc: "Monitoreo del estatus de despachos y entregas en tiempo real.", image: "/image_seguimiento_pedido.png" }
      ]
    }
  ]

  const activeGalleryToolObj = toolsGalleries[selectedGalleryTool]
  const activeModuleObj = activeGalleryToolObj.modules[activeModuleIdx] || activeGalleryToolObj.modules[0]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSent(false)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) setSent(true)
      else alert('Hubo un error al procesar su solicitud.')
    } catch {
      alert('Error de conexión con el servidor corporativo.')
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || loadingChat) return
    const userMsg = inputMessage
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }])
    setInputMessage('')
    setLoadingChat(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { sender: 'bot', text: data.reply }])
    } catch {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Lo siento, ocurrió un error de comunicación.' }])
    } finally {
      setLoadingChat(false)
    }
  }

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <div className={`min-h-screen flex flex-col font-sans notranslate selection:bg-cyan-500 selection:text-white relative overflow-x-hidden transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'}`} translate="no">
      
      {/* NAVBAR */}
      <header className={`fixed top-0 left-0 w-full px-4 sm:px-8 py-4 flex justify-between items-center backdrop-blur-md border-b z-50 transition-colors duration-300 ${darkMode ? 'bg-slate-950/90 border-slate-800' : 'bg-white/95 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <button onClick={scrollToTop} className="flex items-center gap-3.5 cursor-pointer text-left group">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-cyan-500/50 bg-slate-900 shadow-xl flex items-center justify-center p-1 group-hover:scale-105 transition-transform">
              <img src="/CodeNexa Logo.webp" alt="CodeNexa Logo" className="w-full h-full object-cover rounded-xl" />
            </div>
            <div>
              <span className={`text-lg font-black tracking-wider ${darkMode ? 'text-white' : 'text-slate-900'}`}>CODE<span className="text-cyan-400">NEXA</span></span>
              <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded font-extrabold ml-1 border border-cyan-500/30">.NET</span>
            </div>
          </button>

          <nav className={`hidden lg:flex items-center gap-6 text-xs font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            <a href="#inicio" className="hover:text-cyan-400 transition-colors">INICIO</a>
            <a href="#nosotros" className="hover:text-cyan-400 transition-colors">QUIÉNES SOMOS</a>
            <a href="#soluciones" className="hover:text-cyan-400 transition-colors">SISTEMAS</a>
            <a href="#galeria" className="hover:text-cyan-400 transition-colors">GALERÍA</a>
            <a href="#consultoria" className="hover:text-cyan-400 transition-colors">CONSULTORÍA TI</a>
            <a href="#academia" className="hover:text-purple-400 transition-colors text-purple-400">ACADEMY</a>
            
            <button onClick={() => setDarkMode(!darkMode)} className={`p-2.5 rounded-xl border transition-all ${darkMode ? 'bg-slate-900 border-slate-700 text-amber-400 hover:bg-slate-800' : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'}`} title="Cambiar Tema">
              {darkMode ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
            </button>

            <a href="#contacto" className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 px-5 py-2.5 rounded-xl shadow-lg transition-all font-black">CONTACTO</a>
          </nav>

          <div className="flex items-center gap-3 lg:hidden">
            <button onClick={() => setDarkMode(!darkMode)} className={`p-2.5 rounded-xl border text-xs font-bold ${darkMode ? 'bg-slate-900 border-slate-700 text-amber-400' : 'bg-slate-100 border-slate-300 text-slate-800'}`}>
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`p-2.5 rounded-xl border text-lg font-bold ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-100 border-slate-300 text-slate-800'}`}>
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </header>

      {/* MENÚ MÓVIL */}
      {mobileMenuOpen && (
        <div className={`lg:hidden fixed top-[77px] left-0 w-full border-b p-6 flex flex-col space-y-4 text-xs font-bold z-40 shadow-2xl transition-colors ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
          <a href="#inicio" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-slate-800">INICIO</a>
          <a href="#nosotros" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-slate-800">QUIÉNES SOMOS</a>
          <a href="#soluciones" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-slate-800">SISTEMAS</a>
          <a href="#galeria" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-slate-800">GALERÍA</a>
          <a href="#consultoria" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-slate-800">CONSULTORÍA TI</a>
          <a href="#academia" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-slate-800 text-purple-400">ACADEMY</a>
          <a href="#contacto" onClick={() => setMobileMenuOpen(false)} className="bg-cyan-500 text-slate-950 text-center py-3 rounded-xl uppercase font-black">CONTACTO</a>
        </div>
      )}

      {/* HERO SECTION */}
      <section id="inicio" className="max-w-7xl mx-auto px-4 pt-36 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-[11px] font-bold border ${darkMode ? 'bg-slate-900 border-slate-800 text-cyan-400' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
            <span>🚀 CODENEXA ENTERPRISE</span>
          </div>

          <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            POTENCIAMOS TU ORGANIZACIÓN CON TECNOLOGÍA, SOFTWARE Y EXPERTISE
          </h1>

          <p className={`text-sm sm:text-base leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Elevamos la capacidad tecnológica de su empresa mediante sistemas corporativos robustos a la medida, consultoría especializada en stack completo y formación ejecutiva de alto nivel.
          </p>

          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-semibold border-t pt-6 ${darkMode ? 'border-slate-800 text-slate-300' : 'border-slate-200 text-slate-800'}`}>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-400"></span> Modernización Tecnológica</div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-400"></span> Consultoría TI & Ciberseguridad</div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-400"></span> Sistemas Enterprise & POS</div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-400"></span> Capacitaciones Especializadas</div>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <a href="#contacto" className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-black px-7 py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-lg transition-all">
              Solicitar Asesoría Ejecutiva
            </a>
            <a href="#nosotros" className={`font-bold px-7 py-3.5 rounded-xl text-xs uppercase tracking-wider border transition-all ${darkMode ? 'bg-slate-900 hover:bg-slate-800 text-white border-slate-700' : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300'}`}>
              Conozca Nuestra Firma
            </a>
          </div>
        </div>

        {/* LOGO AMPLIADO Y PROTAGONISTA EN EL HERO */}
        <div className="lg:col-span-5 flex items-center justify-center">
          <div className={`w-full p-8 sm:p-10 rounded-3xl shadow-2xl border flex flex-col items-center text-center relative overflow-hidden ${darkMode ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 border-cyan-500/30' : 'bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 border-cyan-500/30 text-white'}`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.2),transparent_60%)] pointer-events-none"></div>
            
            {/* Contenedor del logo con mayor tamaño (w-36 h-36) para que destaque */}
            <div className="w-36 h-36 rounded-3xl overflow-hidden border-2 border-cyan-400 bg-slate-950 shadow-2xl mb-6 flex items-center justify-center p-3 transform hover:scale-105 transition-transform duration-500 shadow-cyan-500/20">
              <img src="/CodeNexa Logo.webp" alt="CodeNexa Logo" className="w-full h-full object-cover rounded-2xl" />
            </div>

            <h3 className="text-xl font-black text-white mb-2 tracking-wide">CodeNexa Ecosystem</h3>
            <p className="text-slate-300 text-xs leading-relaxed mb-6 max-w-sm">
              Infraestructura, bases de datos y software empresarial diseñado para escalar al ritmo de su corporación.
            </p>

            <a href="https://wa.me/50248069299" target="_blank" rel="noopener noreferrer" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg">
              💬 WhatsApp Directo: 4806-9299
            </a>
          </div>
        </div>
      </section>

      {/* QUIÉNES SOMOS */}
      <section id="nosotros" className={`max-w-7xl mx-auto w-full px-4 py-16 border-t relative z-10 scroll-mt-28 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-4 py-1.5 rounded-full border border-cyan-500/30 inline-block mb-3">Quiénes Somos</span>
          <h2 className={`text-3xl sm:text-4xl font-extrabold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Ingeniería de Vanguardia para la Gran Empresa</h2>
          <p className={`text-xs sm:text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            En <strong>CodeNexa</strong> somos una firma de tecnología especializada en transformar las operaciones corporativas mediante arquitectura de sistemas distribuidos de misión crítica, bases de datos de alto rendimiento, ciberseguridad avanzada y capacitación técnica ejecutiva.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className={`border p-8 rounded-3xl shadow-lg transition-all ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-3xl mb-4 block p-3.5 w-max rounded-2xl border shadow-xs bg-cyan-500/10 border-cyan-500/30 text-cyan-400">🎯</span>
            <h3 className={`text-lg font-black mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Nuestra Misión</h3>
            <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Dotar a las organizaciones de infraestructura tecnológica blindada y escalable que garantice la continuidad de sus procesos críticos.</p>
          </div>
          <div className={`border p-8 rounded-3xl shadow-lg transition-all ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-3xl mb-4 block p-3.5 w-max rounded-2xl border shadow-xs bg-blue-500/10 border-blue-500/30 text-blue-400">🔭</span>
            <h3 className={`text-lg font-black mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Nuestra Visión</h3>
            <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Consolidarnos como el socio tecnológico estratégico de referencia corporativa en modernización de sistemas y desarrollo.</p>
          </div>
          <div className={`border p-8 rounded-3xl shadow-lg transition-all ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-3xl mb-4 block p-3.5 w-max rounded-2xl border shadow-xs bg-purple-500/10 border-purple-500/30 text-purple-400">⚡</span>
            <h3 className={`text-lg font-black mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Nuestros Valores</h3>
            <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Rigor técnico absoluto, estándares estrictos de ciberseguridad, arquitectura limpia y compromiso con el éxito corporativo.</p>
          </div>
        </div>
      </section>

      {/* ESTADÍSTICAS */}
      <section className="max-w-6xl mx-auto w-full px-4 py-12 relative z-10">
        <div className={`rounded-2xl p-8 sm:p-10 shadow-2xl border ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-900 text-white border-slate-800'}`}>
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-cyan-400 font-mono text-xs uppercase tracking-widest block mb-1">make IT secure & reliable</span>
            <h3 className="text-xl sm:text-2xl font-black text-white">CodeNexa • Ecosistema Tecnológico Enterprise</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="border border-slate-700 p-5 rounded-xl bg-slate-950/60">
              <span className="text-3xl sm:text-4xl font-black text-cyan-400 font-mono">100%</span>
              <p className="text-[11px] text-slate-300 font-semibold mt-1">Soporte y Respaldo Corporativo</p>
            </div>
            <div className="border border-slate-700 p-5 rounded-xl bg-slate-950/60">
              <span className="text-3xl sm:text-4xl font-black text-cyan-400 font-mono">360°</span>
              <p className="text-[11px] text-slate-300 font-semibold mt-1">Software, Arquitectura y Training</p>
            </div>
            <div className="border border-slate-700 p-5 rounded-xl bg-slate-950/60">
              <span className="text-3xl sm:text-4xl font-black text-cyan-400 font-mono">24/7</span>
              <p className="text-[11px] text-slate-300 font-semibold mt-1">Alta Disponibilidad en Cloud</p>
            </div>
          </div>
        </div>
      </section>

      {/* SISTEMAS PRINCIPALES */}
      <section id="soluciones" className={`max-w-6xl mx-auto w-full px-4 py-16 border-t relative z-10 scroll-mt-28 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-4 py-1.5 rounded-full border border-cyan-500/30 inline-block mb-2">Ecosistema de Software</span>
          <h2 className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Soluciones Tecnológicas Enterprise</h2>
        </div>

        <div className={`border rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-10 relative ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 min-h-[360px]">
            <div className="w-full lg:w-1/2 space-y-4 text-left">
              <span className="inline-block text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-cyan-400">
                ★ {coreToolsSlides[activeToolSlide].badge}
              </span>
              <h3 className={`text-2xl sm:text-4xl font-black leading-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {coreToolsSlides[activeToolSlide].title}
              </h3>
              <h4 className="text-sm font-bold text-cyan-400">{coreToolsSlides[activeToolSlide].subtitle}</h4>
              <p className={`text-xs sm:text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{coreToolsSlides[activeToolSlide].desc}</p>
              <div className="pt-2">
                <a href="#contacto" className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-black px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all inline-block">
                  ✉️ {coreToolsSlides[activeToolSlide].ctaText}
                </a>
              </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center">
              <div className={`relative rounded-2xl overflow-hidden border bg-slate-950 shadow-md group max-w-md aspect-[16/10] w-full flex items-center justify-center p-1 cursor-pointer ${darkMode ? 'border-slate-800' : 'border-slate-200'}`} onClick={() => setModalImage({ title: coreToolsSlides[activeToolSlide].title, image: coreToolsSlides[activeToolSlide].image })}>
                <img src={coreToolsSlides[activeToolSlide].image} alt={coreToolsSlides[activeToolSlide].title} className="w-full h-full object-cover object-top rounded-xl transform group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                  🔍 Clic para ampliar imagen
                </div>
              </div>
            </div>
          </div>

          <div className={`flex items-center justify-center gap-3 mt-8 pt-6 border-t ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            {coreToolsSlides.map((tool, idx) => (
              <button key={idx} onClick={() => setActiveToolSlide(idx)} className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all border flex items-center gap-2 ${activeToolSlide === idx ? 'bg-cyan-500 text-slate-950 border-cyan-500 shadow-md scale-105 font-black' : darkMode ? 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'}`}>
                <span>{idx === 0 ? '💼' : idx === 1 ? '🏋️' : '🛒'}</span>
                <span>{tool.title}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* GALERÍA INTERACTIVA */}
      <section id="galeria" className={`max-w-7xl mx-auto w-full px-4 py-16 border-t relative z-10 scroll-mt-28 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-4 py-1.5 rounded-full border border-cyan-500/30 inline-block mb-3">Galería Interactiva</span>
          <h2 className={`text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Explora Módulos y Arquitectura</h2>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {toolsGalleries.map((tool, idx) => (
            <button key={idx} onClick={() => { setSelectedGalleryTool(idx); setActiveModuleIdx(0); }} className={`px-6 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all border flex items-center gap-2.5 ${selectedGalleryTool === idx ? 'bg-cyan-500 text-slate-950 border-cyan-500 shadow-lg scale-105' : darkMode ? 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700' : 'bg-white text-slate-700 border-slate-200'}`}>
              <span>{idx === 0 ? '💼' : idx === 1 ? '🏋️' : '🛒'}</span>
              <span>{tool.category}</span>
            </button>
          ))}
        </div>

        <div className={`border rounded-3xl p-6 sm:p-10 max-w-5xl mx-auto shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="lg:col-span-5 space-y-3 text-left">
            <span className={`text-[10px] px-3.5 py-1 rounded-full font-extrabold uppercase border inline-block ${activeGalleryToolObj.badgeColor}`}>
              {activeGalleryToolObj.category}
            </span>
            <h3 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{activeModuleObj.title}</h3>
            <p className={`text-xs sm:text-sm leading-relaxed pb-2 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{activeModuleObj.desc}</p>
            
            <div className={`space-y-2 pt-2 border-t ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider mb-2">Módulos:</span>
              {activeGalleryToolObj.modules.map((mod, mIdx) => (
                <button key={mIdx} onClick={() => setActiveModuleIdx(mIdx)} className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-between ${activeModuleIdx === mIdx ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 shadow-xs' : darkMode ? 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                  <span>{mod.title}</span>
                  <span>{activeModuleIdx === mIdx ? '▶' : '•'}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-2.5 shadow-inner flex flex-col">
            <div className="bg-slate-900 px-4 py-2.5 rounded-t-xl flex items-center justify-between border-b border-slate-800 mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">{activeModuleObj.title}</span>
              <div className="w-10"></div>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-slate-800 aspect-[16/10] flex items-center justify-center group bg-slate-950 cursor-pointer" onClick={() => setModalImage({ title: activeModuleObj.title, image: activeModuleObj.image })}>
              <img src={activeModuleObj.image} alt={activeModuleObj.title} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                🔍 Clic para Ampliar
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONSULTORÍA TI */}
      <section id="consultoria" className={`max-w-7xl mx-auto w-full px-4 py-16 border-t relative z-10 scroll-mt-28 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/30 inline-block mb-3">Catálogo de Servicios Ejecutivos</span>
          <h2 className={`text-3xl sm:text-4xl font-extrabold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Consultoría TI y Modernización</h2>
          <p className={`text-xs sm:text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Soluciones corporativas integrales orientadas a blindar, escalar y transformar la infraestructura digital de su organización.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {consultingCatalog.map((item, idx) => (
            <div key={idx} className={`border p-6 sm:p-8 rounded-3xl shadow-lg transition-all flex flex-col justify-between group hover:border-blue-500 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div>
                <span className={`text-3xl mb-4 block p-3.5 w-max rounded-2xl border transition-transform shadow-xs group-hover:scale-110 ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>{item.icon}</span>
                <h3 className={`font-extrabold text-base mb-2.5 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{item.title}</h3>
                <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{item.desc}</p>
              </div>
              <div className={`mt-8 pt-4 border-t flex items-center justify-between ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Servicio Corporativo</span>
                <a href="#contacto" className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors">Solicitar Asesoría →</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CODENEXA ACADEMY */}
      <section id="academia" className={`max-w-7xl mx-auto w-full px-4 py-16 border-t relative z-10 scroll-mt-28 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="bg-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border border-purple-500/30 mb-4 inline-block">🎓 CodeNexa Academy • Capacitaciones Ejecutivas</span>
          <h2 className={`text-3xl sm:text-4xl font-black mt-2 mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Ruta de Capacitaciones y Cursos Habilitados (Sábados)</h2>
          <p className={`text-xs sm:text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Inscriba a su equipo técnico al <strong>Nivel 1</strong> en los horarios sabatinos específicos (Inversión: Q600 por 2 meses de duración).</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className={`border rounded-3xl p-6 shadow-lg flex flex-col justify-between ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div>
              <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full font-bold uppercase border border-cyan-500/30 mb-3 inline-block">Bases de Datos</span>
              <h3 className={`text-lg font-black mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>SQL Server</h3>
              <div className="bg-cyan-950/40 border border-cyan-500/30 p-3 rounded-xl my-3 text-[11px] text-cyan-300 font-semibold space-y-1">
                <div className="text-cyan-400 text-center font-bold">🟢 Nivel 1 (Habilitado)</div>
                <div className="text-center text-slate-200 bg-slate-900 py-1 rounded border border-cyan-500/20">⏰ Sábados 8:00 AM - 10:00 AM</div>
                <div className="flex justify-between pt-1 border-t border-cyan-500/20"><span>⏱️ 2 meses</span><span>💰 Q600</span></div>
              </div>
              <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Fundamentos relacionales, consultas SELECT, INSERT, UPDATE, DELETE y SSMS.</p>
            </div>
            <div className={`mt-6 pt-3 border-t ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <a href="#contacto" className="block text-center bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-black py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md">Inscribirme</a>
            </div>
          </div>

          <div className={`border rounded-3xl p-6 shadow-lg flex flex-col justify-between ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div>
              <span className="text-[10px] bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full font-bold uppercase border border-blue-500/30 mb-3 inline-block">Desarrollo</span>
              <h3 className={`text-lg font-black mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Programación</h3>
              <div className="bg-blue-950/40 border border-blue-500/30 p-3 rounded-xl my-3 text-[11px] text-blue-300 font-semibold space-y-1">
                <div className="text-blue-400 text-center font-bold">🟢 Nivel 1 (Habilitado)</div>
                <div className="text-center text-slate-200 bg-slate-900 py-1 rounded border border-blue-500/20">⏰ Sábados 10:30 AM - 12:30 PM</div>
                <div className="flex justify-between pt-1 border-t border-blue-500/20"><span>⏱️ 2 meses</span><span>💰 Q600</span></div>
              </div>
              <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Lógica de programación, algoritmos, variables y estructuras de control.</p>
            </div>
            <div className={`mt-6 pt-3 border-t ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <a href="#contacto" className="block text-center bg-blue-500 hover:bg-blue-600 text-slate-950 font-black py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md">Inscribirme</a>
            </div>
          </div>

          <div className={`border rounded-3xl p-6 shadow-lg flex flex-col justify-between ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div>
              <span className="text-[10px] bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full font-bold uppercase border border-amber-500/30 mb-3 inline-block">Gestión TI</span>
              <h3 className={`text-lg font-black mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Gestión de Proyectos</h3>
              <div className="bg-amber-950/40 border border-amber-500/30 p-3 rounded-xl my-3 text-[11px] text-amber-300 font-semibold space-y-1">
                <div className="text-amber-400 text-center font-bold">🟢 Nivel 1 (Habilitado)</div>
                <div className="text-center text-slate-200 bg-slate-900 py-1 rounded border border-amber-500/20">⏰ Sábados 2:30 PM - 4:30 PM</div>
                <div className="flex justify-between pt-1 border-t border-amber-500/20"><span>⏱️ 2 meses</span><span>💰 Q600</span></div>
              </div>
              <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Ciclo de vida del proyecto, marcos PMBOK y Agile fundacional.</p>
            </div>
            <div className={`mt-6 pt-3 border-t ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <a href="#contacto" className="block text-center bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md">Inscribirme</a>
            </div>
          </div>

          <div className={`border rounded-3xl p-6 shadow-lg flex flex-col justify-between ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full font-bold uppercase border border-emerald-500/30 mb-3 inline-block">Analítica</span>
              <h3 className={`text-lg font-black mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Power BI y Datos</h3>
              <div className="bg-emerald-950/40 border border-emerald-500/30 p-3 rounded-xl my-3 text-[11px] text-emerald-300 font-semibold space-y-1">
                <div className="text-emerald-400 text-center font-bold">🟢 Nivel 1 (Habilitado)</div>
                <div className="text-center text-slate-200 bg-slate-900 py-1 rounded border border-emerald-500/20">⏰ Sábados 5:00 PM - 7:00 PM</div>
                <div className="flex justify-between pt-1 border-t border-emerald-500/20"><span>⏱️ 2 meses</span><span>💰 Q600</span></div>
              </div>
              <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Fundamentos de BI, conexión a fuentes de datos, Power Query y limpieza.</p>
            </div>
            <div className={`mt-6 pt-3 border-t ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <a href="#contacto" className="block text-center bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md">Inscribirme</a>
            </div>
          </div>
        </div>
      </section>

      {/* LIGHTBOX */}
      {modalImage && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-fadeIn" onClick={() => setModalImage(null)}>
          <div className="relative max-w-5xl w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-widest">CodeNexa • Vista Detallada</span>
                <h3 className="text-sm sm:text-lg font-black text-white">{modalImage.title}</h3>
              </div>
              <button onClick={() => setModalImage(null)} className="bg-slate-800 hover:bg-slate-700 text-white w-9 h-9 rounded-full flex items-center justify-center font-bold">✕</button>
            </div>
            <div className="p-4 bg-slate-950 flex items-center justify-center max-h-[75vh] overflow-auto">
              <img src={modalImage.image} alt={modalImage.title} className="max-w-full max-h-[70vh] object-contain rounded-xl border border-slate-800 shadow-xl" />
            </div>
          </div>
        </div>
      )}

      {/* CONTACTO */}
      <section id="contacto" className={`max-w-xl mx-auto w-full px-4 py-16 border-t relative z-10 scroll-mt-28 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className={`border p-8 sm:p-10 rounded-3xl shadow-2xl ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <h2 className={`text-2xl font-black mb-2 text-center ${darkMode ? 'text-white' : 'text-slate-900'}`}>Inicie un Proyecto o Inscriba a su Equipo</h2>
          <p className="text-slate-400 text-xs text-center mb-6">Complete el formulario corporativo y nos pondremos en contacto con usted.</p>
          {sent ? (
            <div className="bg-cyan-500/20 text-cyan-300 p-4 rounded-xl text-center text-xs font-bold border border-cyan-500/40">¡Solicitud enviada con éxito!</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs text-left">
              <input type="text" required placeholder="Nombre completo / Representante" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={`w-full border rounded-xl px-4 py-3.5 outline-none focus:border-cyan-500 ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} />
              <input type="email" required placeholder="Correo electrónico corporativo" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={`w-full border rounded-xl px-4 py-3.5 outline-none focus:border-cyan-500 ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} />
              <select value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})} className={`w-full border rounded-xl px-4 py-3.5 outline-none focus:border-cyan-500 ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}>
                <option value="Quantika POS">Quantika POS (Sistema Enterprise)</option>
                <option value="QuantikaPOS • Gimnasios">QuantikaPOS • Gimnasios</option>
                <option value="MarketGuate.net">MarketGuate.net</option>
                <option value="Consultoria TI">Consultoría TI / Modernización / Hardening</option>
                <option value="SQL Server Nivel 1">SQL Server Nivel 1 (Sábados - Q600)</option>
                <option value="Programación Nivel 1">Programación Nivel 1 (Sábados - Q600)</option>
                <option value="Gestión Proyectos Nivel 1">Gestión Proyectos Nivel 1 (Sábados - Q600)</option>
                <option value="Power BI Nivel 1">Power BI Nivel 1 (Sábados - Q600)</option>
              </select>
              <textarea rows={3} required placeholder="Describa los requerimientos de su organización..." value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className={`w-full border rounded-xl p-4 outline-none resize-none focus:border-cyan-500 ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}></textarea>
              <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-black py-3.5 rounded-xl uppercase tracking-wider shadow-lg transition-all">Enviar Requerimiento</button>
            </form>
          )}
        </div>
      </section>

      {/* CHAT IA FLOTANTE CON ASISTENTE SONRIENTE Y ATRACTIVO */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {!chatOpen && (
          <button 
            onClick={() => setChatOpen(true)} 
            className="group relative bg-gradient-to-tr from-cyan-600 via-teal-500 to-cyan-400 text-slate-950 p-2.5 rounded-3xl shadow-2xl w-16 h-16 flex items-center justify-center border-2 border-cyan-200 hover:scale-110 transition-all duration-300 shadow-cyan-500/40"
            title="Abrir Asistente CodeNexa"
          >
            {/* Indicador de estado online */}
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse"></span>
            
            {/* Rostro Sonriente y Atractivo */}
            <svg className="w-9 h-9 text-slate-950 group-hover:rotate-6 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" stroke="currentColor" fill="rgba(255,255,255,0.25)" />
              <circle cx="9" cy="10" r="1.2" fill="currentColor" />
              <circle cx="15" cy="10" r="1.2" fill="currentColor" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 13.5c1.5 2 4.5 2 8 0" />
            </svg>
          </button>
        )}

        {chatOpen && (
          <div className={`border w-80 sm:w-96 h-[460px] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            
            {/* CABECERA DEL CHAT CON AVATAR SONRIENTE */}
            <div className={`p-4 border-b flex justify-between items-center text-xs ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-md border border-cyan-200">
                  <svg className="w-6 h-6 text-slate-950" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" fill="rgba(255,255,255,0.25)" />
                    <circle cx="9" cy="10" r="1.2" fill="currentColor" />
                    <circle cx="15" cy="10" r="1.2" fill="currentColor" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 13.5c1.5 2 4.5 2 8 0" />
                  </svg>
                </div>
                <div>
                  <span className="font-black block text-sm">CodeNexa Bot</span>
                  <span className="text-[10px] text-cyan-400 flex items-center gap-1 font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> ¡Hola! ¿En qué te ayudo?
                  </span>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-slate-400 hover:text-white font-bold text-sm w-7 h-7 rounded-full bg-slate-800/50 flex items-center justify-center">✕</button>
            </div>

            {/* CUERPO DE MENSAJES */}
            <div className={`flex-1 p-3.5 overflow-y-auto space-y-3 text-xs text-left ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${m.sender === 'user' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' : darkMode ? 'bg-slate-900 border border-slate-800 text-slate-200' : 'bg-white border border-slate-200 text-slate-800'}`}>{m.text}</div>
                </div>
              ))}
              {loadingChat && <div className="text-[10px] text-cyan-400 animate-pulse font-mono">CodeNexaBot está escribiendo...</div>}
              <div ref={messagesEndRef} />
            </div>

            {/* ENTRADA DE TEXTO */}
            <form onSubmit={handleSendMessage} className={`p-3 border-t flex gap-2 ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
              <input type="text" placeholder="Escribe tu consulta corporativa..." value={inputMessage} onChange={e => setInputMessage(e.target.value)} className={`flex-1 border rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-cyan-500 ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} />
              <button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-black transition-colors">Enviar</button>
            </form>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className={`mt-auto py-12 border-t relative z-10 ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'}`}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-center sm:text-left">
          <p>© {new Date().getFullYear()} CodeNexa — Modernización Tecnológica, Infraestructura y Educación Especializada.</p>
          <div className="flex items-center gap-4">
            <a href="https://wa.me/50248069299" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 font-bold">WhatsApp: 4806-9299</a>
          </div>
        </div>
      </footer>

    </div>
  )
}