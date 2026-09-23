'use client'

import { useState, useEffect, useRef } from 'react'

export default function CodeNexaHome() {
  const [formData, setFormData] = useState({ name: '', email: '', service: 'Quantika POS', message: '' })
  const [sent, setSent] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Estado para la captura seleccionada en la galería interactiva de Quantika POS
  const [activeScreen, setActiveScreen] = useState(0)

  // Estado para el Lightbox (imagen en grande)
  const [modalImage, setModalImage] = useState<{ title: string; image: string } | null>(null)

  // Estado para acordeón de Preguntas Frecuentes (FAQ)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // Estados para el Asistente CodeNexa con IA
  const [chatOpen, setChatOpen] = useState(false)
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '¡Hola! Soy el Asistente CodeNexa ¿En qué te puedo ayudar hoy? Ya sea sobre Quantika POS, nuestras consultorías especializadas o los cursos de CodeNexa Academy.' }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [loadingChat, setLoadingChat] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Estados para el Teaser Publicitario Animado con Narración de Voz pausada
  const [teaserScene, setTeaserScene] = useState(0)
  const [teaserPlaying, setTeaserPlaying] = useState(true)
  const [teaserProgress, setTeaserProgress] = useState(0)
  const [isMuted, setIsMuted] = useState(false)

  const teaserScenesList = [
    {
      tag: "SEGURIDAD & ACCESO",
      title: "Acceso Seguro y Cifrado por Sucursal",
      desc: "Autenticación robusta para cajeros y administradores con roles delimitados en Quantika POS.",
      image: "/image_8ac8c8.png",
      accent: "from-blue-600/30 to-cyan-500/20 border-cyan-500/50 text-cyan-400"
    },
    {
      tag: "PANEL GERENCIAL",
      title: "Panel de Administración del Negocio",
      desc: "Control centralizado de sucursales, personal, categorías, inventario y cuentas financieras.",
      image: "/image_8acc6b.png",
      accent: "from-cyan-600/30 to-emerald-500/20 border-emerald-500/50 text-emerald-400"
    },
    {
      tag: "PUNTO DE VENTA",
      title: "POS Ultra Ágil y Táctil",
      desc: "Procesa ventas en segundos con categorías optimizadas, control de stock y múltiples medios de pago.",
      image: "/image_8acd3d.jpg",
      accent: "from-emerald-600/30 to-teal-500/20 border-teal-500/50 text-teal-400"
    },
    {
      tag: "FINANZAS Y REPORTES",
      title: "Estadísticas y Métodos de Pago en Vivo",
      desc: "Visualiza ventas totales, márgenes brutos, gráficos de tendencia y distribución por efectivo, tarjeta y crédito.",
      image: "/image_8ac960.png",
      accent: "from-purple-600/30 to-indigo-500/20 border-purple-500/50 text-purple-400"
    },
    {
      tag: "CONTROL EMPRESARIAL",
      title: "Gestión de Sucursales, Créditos y Proveedores",
      desc: "Administra límites de crédito, cuentas por cobrar de clientes y deudas pendientes con proveedores de forma segura.",
      image: "/image_8accc9.png",
      accent: "from-amber-600/30 to-orange-500/20 border-amber-500/50 text-amber-400"
    }
  ]

  const speakText = (text: string) => {
    if (isMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'es-ES'
      utterance.rate = 0.95
      utterance.pitch = 1.0
      window.speechSynthesis.speak(utterance)
    }, 145)
  }

  useEffect(() => {
    if (!teaserPlaying) return
    const timer = setInterval(() => {
      setTeaserProgress(prev => {
        if (prev >= 100) {
          const nextScene = (teaserScene + 1) % teaserScenesList.length
          setTeaserScene(nextScene)
          speakText(teaserScenesList[nextScene].desc)
          return 0
        }
        return prev + 1.2
      })
    }, 100)
    return () => clearInterval(timer)
  }, [teaserPlaying, teaserScene, isMuted])

  useEffect(() => {
    if (isMuted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }, [isMuted])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, loadingChat])

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
      else alert('Hubo un error al enviar la solicitud.')
    } catch (error) {
      alert('Error de conexión con el servidor.')
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Lo siento, ocurrió un error de conexión.' }])
    } finally {
      setLoadingChat(false)
    }
  }

  const featuresList = [
    { icon: "⚡", title: "Punto de Venta Ultra Ágil", desc: "Procesa transacciones en segundos con soporte para múltiples medios de pago y cálculo exacto de cambio." },
    { icon: "🍽️", title: "Control de Mesa para Restaurantes", desc: "Administración de mesas, salones y comedores con control de comandas y estado de cuentas en tiempo real." },
    { icon: "🛍️", title: "Control de Compras y Proveedores", desc: "Gestión integral de órdenes de compra, directorio de proveedores y control de deudas pendientes." },
    { icon: "🔄", title: "Traslados de Inventario", desc: "Movimientos seguros de mercancía y existencias en vivo entre diferentes sucursales o bodegas." },
    { icon: "💵", title: "Módulo de Caja y Turnos", desc: "Control estricto de apertura, arqueo y cierre de turnos de caja para una auditoría exacta del efectivo." },
    { icon: "👥", title: "Módulo de Clientes", desc: "Base de datos de clientes frecuentes, historial de compras, créditos autorizados y estados de cuenta." },
    { icon: "🏢", title: "Control Multi-Sucursal", desc: "Administra varias tiendas desde una sola plataforma con aislamiento seguro y supervisión centralizada." },
    { icon: "📦", title: "Inventario y Stock Crítico", desc: "Monitoreo permanente de existencias con alertas automáticas para productos con stock bajo y control de mermas." },
    { icon: "📊", title: "Analíticas y Reportes", desc: "Visualiza ventas totales, margen bruto, ticket promedio y rendimiento desglosado por día de la semana." },
    { icon: "📋", title: "Cotizaciones y Proformas", desc: "Presupuestos con vigencia, re-impresión en PDF y carga directa al POS como contado o crédito." },
    { icon: "📅", title: "Pedidos Especiales y Agenda", desc: "Módulo de producción y bodega para manejar fechas de entrega, notas técnicas y estados de órdenes." },
    { icon: "🚀", title: "Bono Plus: MarketGuate", desc: "Opción exclusiva de adquirir e integrar la publicación de tu negocio en nuestra tienda MarketGuate.net." }
  ]

  const consultingCatalog = [
    { icon: "☁️", title: "Migraciones On-Premise a Cloud", desc: "Estrategias de transición seguras hacia infraestructuras en la nube, optimizando costos y disponibilidad." },
    { icon: "🛡️", title: "Ciberseguridad & Hardening", desc: "Auditorías de infraestructura, endurecimiento de servidores, pentesting y protección de APIs corporativas." },
    { icon: "🗄️", title: "Arquitecturas y Bases de Datos", desc: "Diseño y optimización de motores de misión crítica (SQL Server, MongoDB, PostgreSQL) de alto rendimiento." },
    { icon: "📈", title: "Gestión de Proyectos TI", desc: "Dirección técnica y administrativa bajo estándares rigurosos de control y mitigación de riesgos." },
    { icon: "🔄", title: "Metodologías Ágiles (Scrum/Kanban)", desc: "Implementación de marcos ágiles para acelerar ciclos de entrega y maximizar el valor de negocio." },
    { icon: "💡", title: "Cultura Tecnológica y Gobierno", desc: "Asesoría ejecutiva para alinear la tecnología con los objetivos estratégicos de la organización." }
  ]

  const posScreens = [
    { title: "Acceso Seguro (Login)", desc: "Autenticación cifrada para usuarios y roles autorizados por sucursal.", image: "/image_8ac8c8.png" },
    { title: "Panel Principal del Negocio", desc: "Control gerencial de sucursales, personal, categorías y finanzas.", image: "/image_8acc6b.png" },
    { title: "Punto de Venta Móvil (POS)", desc: "Interfaz táctil optimizada para cobros rápidos y control de stock.", image: "/image_8acd3d.jpg" },
    { title: "Gestión de Sucursales", desc: "Configuración de localidades activas y límites de compras al crédito.", image: "/image_8acca3.png" },
    { title: "Estadísticas y Reportes", desc: "Gráficos detallados de ventas mensuales y tendencias de ingresos.", image: "/image_8ac960.png" },
    { title: "Métodos de Pago", desc: "Distribución de ingresos por efectivo, tarjeta, crédito y contado.", image: "/image_8ac97f.png" },
    { title: "Cuentas por Cobrar", desc: "Control detallado de créditos de clientes y saldos pendientes.", image: "/image_8accc9.png" },
    { title: "Cuentas por Pagar", desc: "Auditoría de deudas pendientes y compras al crédito a proveedores.", image: "/image_8acd01.png" },
    { title: "Alertas de Stock Mínimo", desc: "Avisos visuales automáticos en existencias críticas.", image: "/pos_stock_bajo.png" },
    { title: "Gestión de Cotizaciones", desc: "Control de proformas y re-impresión directa.", image: "/pos_gestion_cotizaciones.png" },
    { title: "Vista Previa PDF", desc: "Formato profesional impreso con datos de la empresa.", image: "/pos_cotizacion_pdf.png" },
    { title: "Pedidos y Agenda", desc: "Módulo de bodega para fechas de entrega y notas.", image: "/pos_pedidos_agenda.png" },
    { title: "Administración de Inventario", desc: "Control de existencias y movimientos de mercancía.", image: "/pos_inventario.png" },
    { title: "Proveedores y Compras", desc: "Directorio corporativo y entradas de inventario.", image: "/pos_compras_proveedores.png" },
    { title: "Módulo de Traslados", desc: "Consulta de stock en otras tiendas y traslados unificados.", image: "/modulo_traslados.png" }
  ]

  const testimonialsList = [
    {
      name: "Lic. Carlos Mendoza",
      role: "Gerente General - Distribuidora Comercial",
      content: "Implementar Quantika POS nos cambió la operación por completo. El control multi-sucursal y la rapidez en caja nos han ahorrado horas de auditoría y evitado mermas.",
      rating: "⭐⭐⭐⭐⭐"
    },
    {
      name: "Ing. Andrea Castillo",
      role: "Egresada CodeNexa Academy (SQL Server)",
      content: "Las clases de los sábados son sumamente prácticas. Aprendí a dominar consultas avanzadas y modelado de bases de datos que apliqué directamente en mi trabajo actual.",
      rating: "⭐⭐⭐⭐⭐"
    },
    {
      name: "Mario Estuardo Morales",
      role: "Propietario de Farmacia y Servicios",
      content: "El soporte técnico y la asesoría en infraestructura que nos brindó CodeNexa superaron nuestras expectativas. 100 recomendados para cualquier empresa.",
      rating: "⭐⭐⭐⭐⭐"
    }
  ]

  const faqsList = [
    {
      q: "¿Cuáles son los requisitos técnicos para utilizar Quantika POS?",
      a: "Quantika POS opera de manera fluida desde cualquier navegador moderno y dispositivos con conexión a internet, asegurando respaldo seguro y sincronización en la nube."
    },
    {
      q: "¿Cómo se realizan los pagos de los cursos en CodeNexa Academy?",
      a: "Cada nivel tiene una inversión de Q600 con una duración de 2 meses. Los pagos se coordinan de forma directa y segura a través de nuestros canales de contacto o transferencia bancaria."
    },
    {
      q: "¿Qué sucede si no puedo asistir a una clase en vivo los sábados?",
      a: "Todas nuestras sesiones cuentan con material complementario y guías prácticas para asegurar que ningún estudiante pierda el hilo de la especialización."
    },
    {
      q: "¿Cómo funciona el Bono Plus de MarketGuate.net?",
      a: "Al adquirir Quantika POS o nuestros servicios de consultoría, obtienes acceso preferencial para publicar y posicionar tu negocio directamente en nuestra plataforma comercial en Guatemala."
    }
  ]

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans notranslate selection:bg-cyan-500 selection:text-white relative overflow-x-hidden" translate="no">
      
      {/* FONDO AMBIENTAL CON DEGRADADOS LUMINOSOS */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-cyan-500/10 blur-[140px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 blur-[160px] rounded-full pointer-events-none -z-10"></div>
      
      {/* NAVBAR FIJO SIEMPRE VISIBLE */}
      <header className="fixed top-0 left-0 w-full px-4 sm:px-8 py-4 flex justify-between items-center bg-[#030712]/90 backdrop-blur-xl border-b border-slate-800/80 z-50 shadow-xl shadow-black/30">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <button onClick={scrollToTop} className="flex items-center gap-3 cursor-pointer text-left group">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-cyan-500/40 bg-slate-900 shadow-md group-hover:border-cyan-400 transition-colors">
              <img src="/CodeNexa Logo.webp" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-base font-black tracking-wider text-white">CODE<span className="text-cyan-400">NEXA</span></span>
              <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded font-extrabold ml-1.5 border border-cyan-500/30">.NET</span>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-3 text-xs font-semibold text-slate-300">
            <a href="#teaser" className="hover:text-cyan-400 transition-colors">Spot</a>
            <a href="#galeria" className="hover:text-cyan-400 transition-colors">POS</a>
            <a href="#marketguate" className="hover:text-cyan-400 transition-colors font-bold text-cyan-300">MarketGuate</a>
            <a href="#consultoria" className="hover:text-cyan-400 transition-colors">Consultoría</a>
            <a href="#academia" className="hover:text-cyan-400 transition-colors font-bold text-purple-300">Academy</a>
            <a href="#testimonios" className="hover:text-cyan-400 transition-colors">Testimonios</a>
            <a href="#faq" className="hover:text-cyan-400 transition-colors">FAQ</a>
            
            {/* ICONOS DE REDES SOCIALES Y WHATSAPP EN NAVBAR */}
            <div className="flex items-center gap-1.5 ml-1">
              <a 
                href="https://wa.me/50248069299" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                title="Escríbenos por WhatsApp"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.124-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
              </a>

              <a 
                href="https://www.facebook.com/profile.php?id=61594659541708" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center text-blue-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                title="Síguenos en Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>

              <a 
                href="https://www.instagram.com/codenexaacademy/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center text-pink-400 hover:bg-pink-600 hover:text-white transition-all shadow-sm"
                title="Síguenos en Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>

              <a 
                href="https://www.tiktok.com/@codenexa5" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center text-slate-100 hover:bg-black hover:text-white transition-all shadow-sm"
                title="Síguenos en TikTok"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
              </a>
            </div>

            <a href="#contacto" className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-3.5 py-2 rounded-xl shadow-lg shadow-cyan-600/20 transition-all font-bold">Cotizar</a>
          </nav>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="lg:hidden p-2.5 rounded-xl bg-slate-900 text-cyan-400 border border-slate-800 text-lg font-bold focus:outline-none"
            aria-label="Menú"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {/* MENÚ MÓVIL DESPLEGABLE */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-[73px] left-0 w-full bg-[#070b12]/95 border-b border-slate-800 p-6 flex flex-col space-y-4 text-xs font-bold shadow-2xl backdrop-blur-2xl z-40 animate-fadeIn">
          <a href="#teaser" onClick={() => setMobileMenuOpen(false)} className="text-slate-200 hover:text-cyan-400 py-2 border-b border-slate-800/60">🎬 Spot Animado con Voz</a>
          <a href="#galeria" onClick={() => setMobileMenuOpen(false)} className="text-slate-200 hover:text-cyan-400 py-2 border-b border-slate-800/60">📱 Pantallas Reales de Quantika POS</a>
          <a href="#marketguate" onClick={() => setMobileMenuOpen(false)} className="text-cyan-300 hover:text-cyan-400 py-2 border-b border-slate-800/60">🛒 Tienda MarketGuate.net</a>
          <a href="#consultoria" onClick={() => setMobileMenuOpen(false)} className="text-slate-200 hover:text-cyan-400 py-2 border-b border-slate-800/60">💼 Consultoría TI y Ciberseguridad</a>
          <a href="#academia" onClick={() => setMobileMenuOpen(false)} className="text-purple-300 hover:text-purple-400 py-2 border-b border-slate-800/60">🎓 CodeNexa Academy</a>
          <a href="#testimonios" onClick={() => setMobileMenuOpen(false)} className="text-slate-200 hover:text-cyan-400 py-2 border-b border-slate-800/60">⭐ Testimonios</a>
          <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-slate-200 hover:text-cyan-400 py-2 border-b border-slate-800/60">❓ Preguntas Frecuentes</a>
          
          <div className="flex flex-col gap-2 pt-2">
            <span className="text-slate-400">Contacto y Redes Sociales:</span>
            <div className="grid grid-cols-2 gap-2">
              <a 
                href="https://wa.me/50248069299" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2.5 rounded-xl bg-slate-900 text-emerald-400 border border-slate-700 flex flex-col items-center justify-center gap-1"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.124-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                <span className="text-[10px]">WhatsApp</span>
              </a>
              <a 
                href="https://www.facebook.com/profile.php?id=61594659541708" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2.5 rounded-xl bg-slate-900 text-blue-400 border border-slate-700 flex flex-col items-center justify-center gap-1"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                <span className="text-[10px]">Facebook</span>
              </a>
              <a 
                href="https://www.instagram.com/codenexaacademy/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2.5 rounded-xl bg-slate-900 text-pink-400 border border-slate-700 flex flex-col items-center justify-center gap-1"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                <span className="text-[10px]">Instagram</span>
              </a>
              <a 
                href="https://www.tiktok.com/@codenexa5" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2.5 rounded-xl bg-slate-900 text-slate-100 border border-slate-700 flex flex-col items-center justify-center gap-1"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                <span className="text-[10px]">TikTok</span>
              </a>
            </div>
          </div>

          <a href="#contacto" onClick={() => setMobileMenuOpen(false)} className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-center py-3 rounded-xl shadow-lg mt-2 font-extrabold uppercase tracking-wider">✉️ Cotizar Servicio / Demo</a>
        </div>
      )}
      
      {/* HERO SECTION */}
      <section className="max-w-5xl mx-auto px-4 pt-32 pb-12 text-center flex flex-col items-center relative z-10">
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 leading-tight">
          Modernización Tecnológica, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400">Consultoría</span> y <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400">Capacitación</span>
        </h1>
        
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mb-10 leading-relaxed">
          Soluciones corporativas de misión crítica con Quantika POS, arquitectura de bases de datos robustas, hardening de seguridad avanzada y formación técnica especializada.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <a href="#teaser" className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold px-6 py-3.5 rounded-2xl text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-cyan-600/30 transition-all flex items-center gap-2">
            <span>🎬</span> Ver Spot Interactivo
          </a>
          <a href="#academia" className="bg-slate-900 hover:bg-slate-800 text-purple-300 font-bold px-6 py-3.5 rounded-2xl text-xs sm:text-sm uppercase tracking-wider border border-purple-500/40 transition-all shadow-lg">
            🎓 Ver Cursos Academy
          </a>
        </div>
      </section>

      {/* BARRA DE STACK TECNOLÓGICO Y SEGURIDAD (NUEVO) */}
      <section className="max-w-5xl mx-auto w-full px-4 py-4 relative z-10">
        <div className="bg-[#0b101d]/80 border border-slate-800/80 rounded-2xl p-4 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[11px] font-mono text-slate-400 backdrop-blur-md shadow-lg">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold">🛡️ SSL / Cifrado Seguros</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-400 font-bold">🗄️ SQL Server & Cloud</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-400 font-bold">⚡ Next.js & TypeScript</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">🔒 APIs Protegidas</span>
          </div>
        </div>
      </section>

      {/* BARRA DE MÉTRICAS Y ESTADÍSTICAS CORPORATIVAS */}
      <section className="max-w-6xl mx-auto w-full px-4 py-8 relative z-10">
        <div className="bg-gradient-to-r from-[#0b101d] via-[#111827] to-[#0b101d] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center backdrop-blur-xl">
          <div className="space-y-1 border-r border-slate-800/60 last:border-none">
            <span className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">99.9%</span>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Disponibilidad Cloud</p>
          </div>
          <div className="space-y-1 border-r border-slate-800/60 last:border-none">
            <span className="text-2xl sm:text-3xl font-black text-blue-400 font-mono">+15</span>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Módulos POS Activos</p>
          </div>
          <div className="space-y-1 border-r border-slate-800/60 last:border-none">
            <span className="text-2xl sm:text-3xl font-black text-purple-400 font-mono">100%</span>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Datos Seguros (RLS)</p>
          </div>
          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">24/7</span>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Soporte y Asistencia</p>
          </div>
        </div>
      </section>

      {/* TEASER PUBLICITARIO ANIMADO */}
      <section id="teaser" className="max-w-5xl mx-auto w-full px-4 py-12 relative z-10 scroll-mt-28">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-4 py-1.5 rounded-full border border-cyan-500/20 inline-block mb-3 shadow-sm">
            Spot Publicitario Web con Narración
          </span>
          <h2 className="text-3xl font-black text-white">Quantika POS en Acción</h2>
        </div>

        <div className="relative bg-[#0b101d] border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 backdrop-blur-2xl">
          <div className="flex justify-between items-center pb-4 mb-6 border-b border-slate-800/80 text-xs">
            <div className="flex items-center gap-2.5">
              <span className={`w-3 h-3 rounded-full ${teaserPlaying ? 'bg-red-500 animate-pulse' : 'bg-amber-500'}`}></span>
              <span className="font-mono text-slate-300 font-extrabold uppercase tracking-wider">
                {teaserPlaying ? '● SPOT EN VIVO' : '⏸ PAUSADO'}
              </span>
            </div>
            
            <div className="flex items-center gap-2.5">
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all border text-xs flex items-center gap-1.5 ${isMuted ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'}`}
                title={isMuted ? "Activar Narración de Voz" : "Silenciar Narración"}
              >
                {isMuted ? '🔇 Silenciado' : '🔊 Con Voz'}
              </button>

              <button onClick={() => setTeaserPlaying(!teaserPlaying)} className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-xl font-bold transition-colors">
                {teaserPlaying ? 'Pausar ⏸' : 'Reproducir ▶'}
              </button>
              
              <button onClick={() => { setTeaserScene(0); setTeaserProgress(0); }} className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-xl font-bold transition-colors">
                Reiniciar ↺
              </button>
            </div>
          </div>

          <div className="relative min-h-[380px] bg-gradient-to-br from-[#111827]/90 to-[#070b12] rounded-2xl border border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden transition-all duration-700 shadow-inner">
            <div className={`absolute inset-0 bg-gradient-to-r ${teaserScenesList[teaserScene].accent} opacity-30 blur-3xl pointer-events-none transition-all duration-700`}></div>

            <div className="w-full md:w-1/2 space-y-4 relative z-10 text-left">
              <span className="inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-cyan-400 shadow">
                [{teaserScenesList[teaserScene].tag}] — Escena {teaserScene + 1} de {teaserScenesList.length}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {teaserScenesList[teaserScene].title}
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {teaserScenesList[teaserScene].desc}
              </p>
              <div className="flex flex-wrap gap-2 pt-4">
                {teaserScenesList.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => { 
                      setTeaserScene(idx); 
                      setTeaserProgress(0); 
                      speakText(teaserScenesList[idx].desc);
                    }}
                    className={`h-2.5 rounded-full transition-all ${teaserScene === idx ? 'w-10 bg-cyan-400 shadow-md shadow-cyan-400/50' : 'w-2.5 bg-slate-700 hover:bg-slate-600'}`}
                  />
                ))}
              </div>
            </div>

            <div className="w-full md:w-1/2 relative z-10 flex items-center justify-center">
              <div 
                className="relative rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-900 shadow-2xl group max-w-md aspect-[4/3] w-full flex items-center justify-center p-1.5 cursor-pointer"
                onClick={() => setModalImage({ title: teaserScenesList[teaserScene].title, image: teaserScenesList[teaserScene].image })}
              >
                <img src={teaserScenesList[teaserScene].image} alt={teaserScenesList[teaserScene].title} className="w-full h-full object-cover object-top rounded-xl transform group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold backdrop-blur-xs">
                  🔍 Clic para ampliar imagen
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 flex items-center gap-4">
            <span className="text-[10px] font-mono text-slate-400">Escena {teaserScene + 1}</span>
            <div className="flex-1 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-100 ease-linear shadow" style={{ width: `${teaserProgress}%` }}></div>
            </div>
            <span className="text-[10px] font-mono text-slate-400">8s</span>
          </div>
        </div>
      </section>

      {/* GALERÍA DE PANTALLAS REALES */}
      <section id="galeria" className="max-w-7xl mx-auto w-full px-4 py-16 border-t border-slate-800/80 relative z-10 scroll-mt-28">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-4 py-1.5 rounded-full border border-cyan-500/20 inline-block mb-3 shadow-sm">
            Galería Interactiva
          </span>
          <h2 className="text-3xl font-extrabold text-white">Explora Todas las Pantallas de Quantika POS</h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2">Navega por cada módulo del sistema operativo empresarial y descubre su interfaz profesional.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-5xl mx-auto">
          {posScreens.map((screen, idx) => (
            <button
              key={idx}
              onClick={() => setActiveScreen(idx)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${activeScreen === idx ? 'bg-cyan-600 text-white border-cyan-400 shadow-lg shadow-cyan-600/30' : 'bg-[#0b101d] text-slate-300 border-slate-800 hover:border-slate-700'}`}
            >
              {screen.title}
            </button>
          ))}
        </div>

        <div className="bg-[#0b101d] border border-slate-800 rounded-3xl p-6 sm:p-10 max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 shadow-2xl backdrop-blur-xl">
          <div className="w-full md:w-1/2 space-y-4">
            <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full font-bold uppercase border border-cyan-500/30">Módulo #{activeScreen + 1} de {posScreens.length}</span>
            <h3 className="text-2xl font-black text-white">{posScreens[activeScreen].title}</h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{posScreens[activeScreen].desc}</p>
            <button onClick={() => setModalImage({ title: posScreens[activeScreen].title, image: posScreens[activeScreen].image })} className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-600/20 flex items-center gap-2">
              <span>🔍</span> Ver Imagen en Grande
            </button>
          </div>
          <div className="w-full md:w-1/2 bg-[#030712] border border-slate-800 rounded-2xl p-2.5 aspect-[4/3] flex items-center justify-center overflow-hidden cursor-pointer group relative shadow-inner" onClick={() => setModalImage({ title: posScreens[activeScreen].title, image: posScreens[activeScreen].image })}>
            <img src={posScreens[activeScreen].image} alt={posScreens[activeScreen].title} className="w-full h-full object-cover object-top rounded-xl group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold backdrop-blur-xs">
              🔍 Clic para Ampliar
            </div>
          </div>
        </div>
      </section>

      {/* MODAL / LIGHTBOX */}
      {modalImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-fadeIn" onClick={() => setModalImage(null)}>
          <div className="relative max-w-5xl w-full bg-[#0b101d] border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="bg-[#030712] px-6 py-4 border-b border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-widest block">Quantika POS • Vista Detallada</span>
                <h3 className="text-sm sm:text-lg font-black text-white">{modalImage.title}</h3>
              </div>
              <button onClick={() => setModalImage(null)} className="bg-slate-800 hover:bg-slate-700 text-white w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-colors">✕</button>
            </div>
            <div className="p-4 bg-black/70 flex items-center justify-center max-h-[75vh] overflow-auto">
              <img src={modalImage.image} alt={modalImage.title} className="max-w-full max-h-[70vh] object-contain rounded-xl border border-slate-800 shadow-2xl" />
            </div>
            <div className="bg-[#030712] px-6 py-3 border-t border-slate-800 flex justify-end">
              <button onClick={() => setModalImage(null)} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow">Cerrar Ventana</button>
            </div>
          </div>
        </div>
      )}

      {/* CARACTERÍSTICAS PRINCIPALES */}
      <section id="caracteristicas" className="max-w-7xl mx-auto w-full px-4 py-16 border-t border-slate-800/80 relative z-10 scroll-mt-28">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-4 py-1.5 rounded-full border border-cyan-500/20 inline-block mb-3 shadow-sm">
            Rendimiento Superior
          </span>
          <h2 className="text-3xl font-extrabold text-white">Características Principales de Quantika POS</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuresList.map((f, idx) => (
            <div key={idx} className={`bg-gradient-to-b from-[#0b101d] to-[#070b12] border p-6 rounded-3xl shadow-xl flex flex-col justify-between transition-all group ${idx === featuresList.length - 1 ? 'border-cyan-500/60 bg-cyan-950/20' : 'border-slate-800 hover:border-cyan-500/40'}`}>
              <div>
                <span className="text-2xl mb-4 block p-3 bg-slate-900/90 w-max rounded-2xl border border-slate-800 group-hover:scale-110 transition-transform shadow-inner">{f.icon}</span>
                <h3 className="font-extrabold text-sm text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN: TIENDA MARKETGUATE.NET */}
      <section id="marketguate" className="max-w-7xl mx-auto w-full px-4 py-16 border-t border-slate-800/80 relative z-10 scroll-mt-28">
        <div className="bg-gradient-to-r from-[#0b101d] via-[#10192e] to-[#0b101d] border border-cyan-500/40 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none"></div>
          
          <div className="max-w-3xl space-y-6 relative z-10">
            <span className="bg-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border border-cyan-500/30 inline-block shadow">
              🛒 Bono Plus Exclusivo
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              Impulsa tu Negocio en <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">MarketGuate.net</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Al adquirir Quantika POS o nuestros servicios, puedes optar por nuestro **Bono Plus**, el cual incluye la publicación y difusión directa de tus productos o servicios en nuestra plataforma comercial oficial de Guatemala.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <a 
                href="https://www.marketguate.net" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold px-6 py-3.5 rounded-2xl text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-cyan-600/30 transition-all flex items-center gap-2"
              >
                <span>🌐</span> Visitar MarketGuate.net →
              </a>
              <a 
                href="#contacto" 
                className="bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold px-6 py-3.5 rounded-2xl text-xs sm:text-sm uppercase tracking-wider border border-slate-700 transition-all shadow"
              >
                Solicitar Bono Plus
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CONSULTORÍA TI */}
      <section id="consultoria" className="max-w-7xl mx-auto w-full px-4 py-16 border-t border-slate-800/80 relative z-10 scroll-mt-28">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20 inline-block mb-3 shadow-sm">Catálogo de Servicios Ejecutivos</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">Consultoría TI y Asesorías Tecnológicas de Alto Impacto</h2>
          <p className="text-slate-400 text-xs sm:text-sm">Soluciones integrales orientadas a blindar, escalar y transformar la infraestructura digital de tu organización.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {consultingCatalog.map((item, idx) => (
            <div key={idx} className="bg-gradient-to-b from-[#0b101d] to-[#070b12] border border-slate-800 hover:border-blue-500/50 p-6 sm:p-8 rounded-3xl shadow-xl transition-all flex flex-col justify-between group">
              <div>
                <span className="text-3xl mb-4 block p-3.5 bg-slate-900/90 w-max rounded-2xl border border-slate-800 group-hover:scale-110 transition-transform shadow-inner">{item.icon}</span>
                <h3 className="font-extrabold text-base text-white mb-2.5">{item.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Servicio Corporativo</span>
                <a href="#contacto" className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors">Solicitar →</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CODENEXA ACADEMY - NIVEL 1 HABILITADO Y RUTA COMPLETA */}
      <section id="academia" className="max-w-7xl mx-auto w-full px-4 py-16 border-t border-slate-800/80 relative z-10 scroll-mt-28">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="bg-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border border-purple-500/20 mb-4 inline-block shadow-sm">
            🎓 CodeNexa Academy • Formación Especializada
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-3 mb-4">
            Ruta de Aprendizaje y Cursos Habilitados (Sábados)
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4">
            Inscríbete al **Nivel 1** en los horarios sabatinos específicos de cada curso. Conoce todo lo que dominarás en la ruta formativa completa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          {/* CURSO 1: SQL SERVER */}
          <div className="bg-gradient-to-b from-[#0b101d] to-[#070b12] border border-cyan-500/50 rounded-3xl p-6 shadow-2xl flex flex-col justify-between relative overflow-hidden">
            <div>
              <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full font-bold uppercase border border-cyan-500/30 mb-3 inline-block">Bases de Datos</span>
              <h3 className="text-lg font-black text-white mb-1">SQL Server</h3>
              
              <div className="bg-cyan-950/30 border border-cyan-500/30 p-2.5 rounded-xl my-3 text-[11px] text-cyan-300 font-semibold space-y-1">
                <div className="text-cyan-200 text-center font-bold">🟢 Nivel 1 (Habilitado)</div>
                <div className="text-center text-white bg-cyan-900/50 py-1 rounded">⏰ Sábados 8:00 AM - 10:00 AM</div>
                <div className="flex justify-between pt-1 border-t border-cyan-500/20"><span>⏱️ 2 meses</span><span>💰 Q600</span></div>
              </div>

              <div className="space-y-3 text-xs text-slate-300 border-t border-slate-800 pt-3">
                <div>
                  <span className="text-cyan-400 font-bold block mb-0.5">• Nivel 1 (Activo):</span>
                  <p className="text-[11px] text-slate-400">Fundamentos relacionales, consultas SELECT, INSERT, UPDATE, DELETE y SSMS.</p>
                </div>
                <div>
                  <span className="text-amber-400 font-bold block mb-0.5">• Nivel Intermedio (Próximamente):</span>
                  <p className="text-[11px] text-slate-400">Modelado avanzado, JOINs complejos, Vistas y Stored Procedures.</p>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block mb-0.5">• Nivel Avanzado (Próximamente):</span>
                  <p className="text-[11px] text-slate-400">Optimización de consultas, índices, transacciones y seguridad.</p>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-3 border-t border-slate-800">
              <a href="#contacto" className="block text-center bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors shadow">Inscribirme a Nivel 1</a>
            </div>
          </div>

          {/* CURSO 2: PROGRAMACION */}
          <div className="bg-gradient-to-b from-[#0b101d] to-[#070b12] border border-blue-500/50 rounded-3xl p-6 shadow-2xl flex flex-col justify-between relative overflow-hidden">
            <div>
              <span className="text-[10px] bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full font-bold uppercase border border-blue-500/30 mb-3 inline-block">Desarrollo</span>
              <h3 className="text-lg font-black text-white mb-1">Programación</h3>
              
              <div className="bg-blue-950/30 border border-blue-500/30 p-2.5 rounded-xl my-3 text-[11px] text-blue-300 font-semibold space-y-1">
                <div className="text-blue-200 text-center font-bold">🟢 Nivel 1 (Habilitado)</div>
                <div className="text-center text-white bg-blue-900/50 py-1 rounded">⏰ Sábados 10:30 AM - 12:30 PM</div>
                <div className="flex justify-between pt-1 border-t border-blue-500/20"><span>⏱️ 2 meses</span><span>💰 Q600</span></div>
              </div>

              <div className="space-y-3 text-xs text-slate-300 border-t border-slate-800 pt-3">
                <div>
                  <span className="text-blue-400 font-bold block mb-0.5">• Nivel 1 (Activo):</span>
                  <p className="text-[11px] text-slate-400">Lógica de programación, algoritmos, variables y estructuras de control.</p>
                </div>
                <div>
                  <span className="text-amber-400 font-bold block mb-0.5">• Nivel Medio (Próximamente):</span>
                  <p className="text-[11px] text-slate-400">Programación Orientada a Objetos (POO), manejo de APIs y arquitectura.</p>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block mb-0.5">• Nivel Avanzado (Próximamente):</span>
                  <p className="text-[11px] text-slate-400">Patrones de diseño, microservicios y despliegue en la nube.</p>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-3 border-t border-slate-800">
              <a href="#contacto" className="block text-center bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors shadow">Inscribirme a Nivel 1</a>
            </div>
          </div>

          {/* CURSO 3: GESTION DE PROYECTOS */}
          <div className="bg-gradient-to-b from-[#0b101d] to-[#070b12] border border-amber-500/50 rounded-3xl p-6 shadow-2xl flex flex-col justify-between relative overflow-hidden">
            <div>
              <span className="text-[10px] bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full font-bold uppercase border border-amber-500/30 mb-3 inline-block">Gestión TI</span>
              <h3 className="text-lg font-black text-white mb-1">Gestión de Proyectos</h3>
              
              <div className="bg-amber-950/30 border border-amber-500/30 p-2.5 rounded-xl my-3 text-[11px] text-amber-300 font-semibold space-y-1">
                <div className="text-amber-200 text-center font-bold">🟢 Nivel 1 (Habilitado)</div>
                <div className="text-center text-white bg-amber-900/50 py-1 rounded">⏰ Sábados 2:30 PM - 4:30 PM</div>
                <div className="flex justify-between pt-1 border-t border-amber-500/20"><span>⏱️ 2 meses</span><span>💰 Q600</span></div>
              </div>

              <div className="space-y-3 text-xs text-slate-300 border-t border-slate-800 pt-3">
                <div>
                  <span className="text-amber-400 font-bold block mb-0.5">• Nivel 1 (Activo):</span>
                  <p className="text-[11px] text-slate-400">Ciclo de vida del proyecto, marcos PMBOK y Agile fundacional.</p>
                </div>
                <div>
                  <span className="text-amber-400 font-bold block mb-0.5">• Nivel 2 (Próximamente):</span>
                  <p className="text-[11px] text-slate-400">Presupuestos, estimación de costos, asignación de recursos y ruta crítica.</p>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block mb-0.5">• Nivel 3 (Próximamente):</span>
                  <p className="text-[11px] text-slate-400">Scrum avanzado, tableros Kanban y mitigación de riesgos corporativos.</p>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-3 border-t border-slate-800">
              <a href="#contacto" className="block text-center bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors shadow">Inscribirme a Nivel 1</a>
            </div>
          </div>

          {/* CURSO 4: POWER BI Y DATOS */}
          <div className="bg-gradient-to-b from-[#0b101d] to-[#070b12] border border-emerald-500/50 rounded-3xl p-6 shadow-2xl flex flex-col justify-between relative overflow-hidden">
            <div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-bold uppercase border border-emerald-500/30 mb-3 inline-block">Analítica</span>
              <h3 className="text-lg font-black text-white mb-1">Power BI y Datos</h3>
              
              <div className="bg-emerald-950/30 border border-emerald-500/30 p-2.5 rounded-xl my-3 text-[11px] text-emerald-300 font-semibold space-y-1">
                <div className="text-emerald-200 text-center font-bold">🟢 Nivel 1 (Habilitado)</div>
                <div className="text-center text-white bg-emerald-900/50 py-1 rounded">⏰ Sábados 5:00 PM - 7:00 PM</div>
                <div className="flex justify-between pt-1 border-t border-emerald-500/20"><span>⏱️ 2 meses</span><span>💰 Q600</span></div>
              </div>

              <div className="space-y-3 text-xs text-slate-300 border-t border-slate-800 pt-3">
                <div>
                  <span className="text-emerald-400 font-bold block mb-0.5">• Nivel 1 (Activo):</span>
                  <p className="text-[11px] text-slate-400">Fundamentos de BI, conexión a fuentes de datos, Power Query y limpieza.</p>
                </div>
                <div>
                  <span className="text-amber-400 font-bold block mb-0.5">• Nivel Intermedio (Próximamente):</span>
                  <p className="text-[11px] text-slate-400">Modelado de datos relacionales, esquemas estrella y lenguaje DAX básico.</p>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block mb-0.5">• Nivel Avanzado (Próximamente):</span>
                  <p className="text-[11px] text-slate-400">DAX avanzado, dashboards interactivos profesionales y Power BI Service.</p>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-3 border-t border-slate-800">
              <a href="#contacto" className="block text-center bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors shadow">Inscribirme a Nivel 1</a>
            </div>
          </div>

        </div>
      </section>

      {/* SECCIÓN DE TESTIMONIOS Y CASOS DE ÉXITO (NUEVO) */}
      <section id="testimonios" className="max-w-7xl mx-auto w-full px-4 py-16 border-t border-slate-800/80 relative z-10 scroll-mt-28">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-4 py-1.5 rounded-full border border-cyan-500/20 inline-block mb-3 shadow-sm">
            Prueba Social
          </span>
          <h2 className="text-3xl font-extrabold text-white">Lo Que Opinan Nuestros Clientes y Estudiantes</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonialsList.map((t, idx) => (
            <div key={idx} className="bg-gradient-to-b from-[#0b101d] to-[#070b12] border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-base mb-3 block">{t.rating}</span>
                <p className="text-slate-300 text-xs leading-relaxed italic mb-4">"{t.content}"</p>
              </div>
              <div className="pt-4 border-t border-slate-800/80">
                <span className="font-bold text-xs text-white block">{t.name}</span>
                <span className="text-[10px] text-cyan-400 block">{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN DE PREGUNTAS FRECUENTES (FAQ) INTERACTIVA (NUEVO) */}
      <section id="faq" className="max-w-4xl mx-auto w-full px-4 py-16 border-t border-slate-800/80 relative z-10 scroll-mt-28">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20 inline-block mb-3 shadow-sm">
            Resolución de Dudas
          </span>
          <h2 className="text-3xl font-extrabold text-white">Preguntas Frecuentes (FAQ)</h2>
        </div>
        
        <div className="space-y-4">
          {faqsList.map((faq, idx) => (
            <div key={idx} className="bg-[#0b101d] border border-slate-800 rounded-2xl overflow-hidden shadow-lg transition-colors">
              <button 
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex justify-between items-center gap-4 text-xs sm:text-sm font-bold text-white hover:text-cyan-400 transition-colors focus:outline-none"
              >
                <span>{faq.q}</span>
                <span className="text-cyan-400 font-mono text-base">{openFaq === idx ? '−' : '+'}</span>
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 pt-1 text-slate-300 text-xs leading-relaxed border-t border-slate-800/60 animate-fadeIn">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN DE CONTACTO GENERAL */}
      <section id="contacto" className="max-w-xl mx-auto w-full px-4 py-16 border-t border-slate-800/80 relative z-10 scroll-mt-28">
        <div className="bg-[#0b101d] border border-slate-700/80 p-8 sm:p-10 rounded-3xl shadow-2xl backdrop-blur-xl">
          <h2 className="text-2xl font-black text-white mb-2 text-center">Inicia un Proyecto o Inscríbete</h2>
          <p className="text-slate-400 text-xs text-center mb-6">Completa el formulario y nos pondremos en contacto contigo a la brevedad.</p>
          {sent ? (
            <div className="bg-cyan-500/10 text-cyan-400 p-4 rounded-xl text-center text-xs font-bold border border-cyan-500/30">¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <input type="text" required placeholder="Nombre completo" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#030712] border border-slate-700 rounded-xl px-4 py-3.5 text-white outline-none focus:border-cyan-500 transition-colors" />
              <input type="email" required placeholder="Correo electrónico" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-[#030712] border border-slate-700 rounded-xl px-4 py-3.5 text-white outline-none focus:border-cyan-500 transition-colors" />
              <select value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})} className="w-full bg-[#030712] border border-slate-700 rounded-xl px-4 py-3.5 text-white outline-none focus:border-cyan-500 transition-colors">
                <option value="Quantika POS">Quantika POS (Sistema de Ventas)</option>
                <option value="Consultoria TI">Consultoría TI / Ciberseguridad / Arquitectura</option>
                <option value="SQL Server Nivel 1 (8:00 - 10:00 AM)">SQL Server Nivel 1 - Sábados 8:00 AM (Q600 - 2 meses)</option>
                <option value="Programación Nivel 1 (10:30 - 12:30 PM)">Programación Nivel 1 - Sábados 10:30 AM (Q600 - 2 meses)</option>
                <option value="Gestión Proyectos Nivel 1 (2:30 - 4:30 PM)">Gestión Proyectos Nivel 1 - Sábados 2:30 PM (Q600 - 2 meses)</option>
                <option value="Power BI Nivel 1 (5:00 - 7:00 PM)">Power BI Nivel 1 - Sábados 5:00 PM (Q600 - 2 meses)</option>
                <option value="Bono Plus MarketGuate">Bono Plus MarketGuate.net</option>
              </select>
              <textarea rows={3} required placeholder="Cuéntanos sobre tu requerimiento..." value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full bg-[#030712] border border-slate-700 rounded-xl p-4 text-white outline-none resize-none focus:border-cyan-500 transition-colors"></textarea>
              <button type="submit" className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold py-3.5 rounded-xl uppercase tracking-wider shadow-lg shadow-cyan-600/30 transition-all">Enviar Solicitud</button>
            </form>
          )}
        </div>
      </section>

      {/* CHAT FLOTANTE CON IA */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {!chatOpen && (
          <button onClick={() => setChatOpen(true)} className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-4 rounded-full shadow-2xl text-2xl w-14 h-14 flex items-center justify-center animate-bounce border border-cyan-400/40">🤖</button>
        )}
        {chatOpen && (
          <div className="bg-[#0b101d] border border-slate-700 w-80 sm:w-96 h-[440px] rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl animate-fadeIn">
            <div className="bg-[#030712] p-4 border-b border-slate-800 flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
                <span className="font-extrabold text-white">Asistente CodeNexa AI</span>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>
            <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${m.sender === 'user' ? 'bg-cyan-600 text-white shadow' : 'bg-[#030712] border border-slate-800 text-slate-200'}`}>{m.text}</div>
                </div>
              ))}
              {loadingChat && <div className="text-[10px] text-cyan-400 animate-pulse font-mono">CodeNexaBot está escribiendo...</div>}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-3 bg-[#030712] border-t border-slate-800 flex gap-2">
              <input type="text" placeholder="Escribe tu duda..." value={inputMessage} onChange={e => setInputMessage(e.target.value)} className="flex-1 bg-[#0b101d] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-500" />
              <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors">Enviar</button>
            </form>
          </div>
        )}
      </div>

      {/* FOOTER CON REDES SOCIALES Y WHATSAPP */}
      <footer className="mt-auto py-12 border-t border-slate-800/80 bg-[#030712] relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CodeNexa — Modernización Tecnológica, Infraestructura y Educación Especializada.</p>
          
          <div className="flex items-center gap-4">
            <span className="text-slate-400 font-semibold">Contacto y Redes:</span>
            
            <a 
              href="https://wa.me/50248069299" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-9 h-9 rounded-xl bg-[#0b101d] border border-slate-700/80 flex items-center justify-center text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all shadow-md"
              title="WhatsApp"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.124-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
            </a>

            <a 
              href="https://www.facebook.com/profile.php?id=61594659541708" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-9 h-9 rounded-xl bg-[#0b101d] border border-slate-700/80 flex items-center justify-center text-blue-400 hover:bg-blue-600 hover:text-white transition-all shadow-md"
              title="Facebook Oficial"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>

            <a 
              href="https://www.instagram.com/codenexaacademy/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-9 h-9 rounded-xl bg-[#0b101d] border border-slate-700/80 flex items-center justify-center text-pink-400 hover:bg-pink-600 hover:text-white transition-all shadow-md"
              title="Instagram CodeNexa Academy"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>

            <a 
              href="https://www.tiktok.com/@codenexa5" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-9 h-9 rounded-xl bg-[#0b101d] border border-slate-700/80 flex items-center justify-center text-slate-100 hover:bg-black hover:text-white transition-all shadow-md"
              title="TikTok CodeNexa"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
            </a>
          </div>
        </div>
      </footer>

    </div>
  )
}