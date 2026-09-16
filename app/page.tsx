'use client'

import { useState, useEffect, useRef } from 'react'

export default function CodeNexaHome() {
  const [formData, setFormData] = useState({ name: '', email: '', service: 'Quantika POS', message: '' })
  const [sent, setSent] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  // Estado para la captura seleccionada en la galería interactiva de Quantika POS
  const [activeScreen, setActiveScreen] = useState(0)

  // Estado para el Lightbox (imagen en grande)
  const [modalImage, setModalImage] = useState<{ title: string; image: string } | null>(null)

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
      accent: "from-blue-500/20 to-cyan-500/20 border-blue-500/40 text-blue-400"
    },
    {
      tag: "PANEL GERENCIAL",
      title: "Panel de Administración del Negocio",
      desc: "Control centralizado de sucursales, personal, categorías, inventario y cuentas financieras.",
      image: "/image_8acc6b.png",
      accent: "from-cyan-500/20 to-emerald-500/20 border-cyan-500/40 text-cyan-400"
    },
    {
      tag: "PUNTO DE VENTA",
      title: "POS Ultra Ágil y Táctil",
      desc: "Procesa ventas en segundos con categorías optimizadas, control de stock y múltiples medios de pago.",
      image: "/image_8acd3d.jpg",
      accent: "from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-400"
    },
    {
      tag: "FINANZAS Y REPORTES",
      title: "Estadísticas y Métodos de Pago en Vivo",
      desc: "Visualiza ventas totales, márgenes brutos, gráficos de tendencia y distribución por efectivo, tarjeta y crédito.",
      image: "/image_8ac960.png",
      accent: "from-purple-500/20 to-indigo-500/20 border-purple-500/40 text-purple-400"
    },
    {
      tag: "CONTROL EMPRESARIAL",
      title: "Gestión de Sucursales, Créditos y Proveedores",
      desc: "Administra límites de crédito, cuentas por cobrar de clientes y deudas pendientes con proveedores de forma segura.",
      image: "/image_8accc9.png",
      accent: "from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-400"
    }
  ]

// Función de Narración de Voz con retardo de estabilización para evitar cortar la primera palabra
  const speakText = (text: string) => {
    if (isMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) return
    
    window.speechSynthesis.cancel() // Limpiar audio anterior

    // Pequeño retardo de 150ms para permitir que el sintetizador abra el canal de audio completo
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'es-ES'
      utterance.rate = 0.95
      utterance.pitch = 1.0
      window.speechSynthesis.speak(utterance)
    }, 145)
  }

  // Automatizar las transiciones del teaser animado con un intervalo más lento (aprox. 8 segundos por escena)
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
        return prev + 1.2 // Incremento más lento para dar tiempo a la voz
      })
    }, 100)
    return () => clearInterval(timer)
  }, [teaserPlaying, teaserScene, isMuted])

  // Detener voz si se silencia o desmonta
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

      if (res.ok) {
        setSent(true)
      } else {
        alert('Hubo un error al enviar la solicitud. Intenta de nuevo.')
      }
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
    {
      icon: "⚡",
      title: "Punto de Venta Ultra Ágil",
      desc: "Procesa transacciones en segundos con soporte para múltiples métodos de pago: efectivo, tarjeta, transferencias y pagos mixtos con cálculo exacto de cambio."
    },
    {
      icon: "🏢",
      title: "Control Multi-Sucursal",
      desc: "Administra varias tiendas desde una sola plataforma con aislamiento seguro de datos, inventarios independientes y traslados de mercancía en tiempo real."
    },
    {
      icon: "📦",
      title: "Inventario y Stock Crítico",
      desc: "Monitoreo permanente de existencias con alertas automáticas para productos con stock bajo (≤ 3 unidades) y registro detallado de mermas y ajustes."
    },
    {
      icon: "📊",
      title: "Analíticas y Reportes Financieros",
      desc: "Visualiza ventas totales, margen bruto, ticket promedio, línea de tendencia mensual y el rendimiento de ventas desglosado por día de la semana."
    },
    {
      icon: "💵",
      title: "Gestión de Caja y Turnos",
      desc: "Control estricto de apertura, arqueo y cierre de turnos de caja, asegurando la auditoría exacta del dinero ingresado por cada cajero."
    },
    {
      icon: "👥",
      title: "Cuentas por Cobrar y Pagar",
      desc: "Lleva el control financiero de créditos pendientes con clientes (cuentas por cobrar) y compromisos de pago con proveedores (cuentas por pagar)."
    },
    {
      icon: "📋",
      title: "Cotizaciones y Proformas",
      desc: "Creación de presupuestos con vigencia, re-impresión en PDF, búsqueda avanzada y carga directa al POS como contado o crédito."
    },
    {
      icon: "📅",
      title: "Pedidos Especiales y Agenda",
      desc: "Módulo de producción y bodega para manejar fechas de entrega, notas técnicas y estados de órdenes (pendientes o entregados)."
    }
  ]

  const ventajasList = [
    { num: "01", title: "Reducción de Gastos", desc: "Reduce los gastos en equipamiento informático e infraestructura pesada." },
    { num: "02", title: "Cero Problemas de Versión", desc: "Reduce o elimina problemas asociados con controles de versión del software, actualizaciones, etcétera." },
    { num: "03", title: "Agilidad y Experimentación", desc: "Permite mayor grado de experimentación, elección y agilidad en términos de aplicaciones utilizadas." },
    { num: "04", title: "Participación y Colaboración", desc: "Reduce barreras a la participación, la contribución y compartir información corporativa." },
    { num: "05", title: "Disponibilidad del Sistema", desc: "Disponibilidad de la información crítica el 99.5% del tiempo garantizada." },
    { num: "06", title: "Acceso Web Universal", desc: "Fácil acceso puesto que es un servicio nativo vía web." },
    { num: "07", title: "Optimización de Hardware", desc: "Reducción de costos a nivel hardware así como el mantenimiento de los mismos." },
    { num: "08", title: "Multi-Dispositivo", desc: "Acceso a través de cualquier dispositivo electrónico (PCs, Smartphones, Tablets, etc.)." }
  ]

  const consultingCatalog = [
    {
      icon: "☁️",
      title: "Migraciones On-Premise a Cloud",
      desc: "Estrategias de transición seguras y eficientes hacia infraestructuras en la nube, optimizando costos, escalabilidad y disponibilidad operativa."
    },
    {
      icon: "🛡️",
      title: "Ciberseguridad & Hardening",
      desc: "Auditorías de infraestructura, endurecimiento de servidores, pentesting y protección de APIs corporativas contra vulnerabilidades críticas."
    },
    {
      icon: "🗄️",
      title: "Arquitecturas y Bases de Datos",
      desc: "Diseño, modelado y optimización de motores de misión crítica (SQL Server, MongoDB, MySQL, PostgreSQL, Oracle), garantizando alto rendimiento."
    },
    {
      icon: "📈",
      title: "Gestión de Proyectos TI",
      desc: "Dirección técnica y administrativa de proyectos tecnológicos bajo estándares de control rigurosos, mitigación de riesgos y cumplimiento de hitos."
    },
    {
      icon: "🔄",
      title: "Metodologías Ágiles (Scrum, Kanban)",
      desc: "Implementación de marcos ágiles para acelerar ciclos de entrega, fomentar la auto-organización de equipos y maximizar el valor de negocio."
    },
    {
      icon: "💡",
      title: "Cultura Tecnológica y Gobierno",
      desc: "Asesoría ejecutiva para alinear la tecnología con los objetivos de negocio, fomentando la innovación, buenas prácticas y transformación digital."
    }
  ]

  const posScreens = [
    { title: "Pantalla de Acceso Seguro (Login)", desc: "Autenticación cifrada para usuarios y roles autorizados por sucursal.", image: "/image_8ac8c8.png" },
    { title: "Panel Principal del Negocio", desc: "Acceso directo a la administración de sucursales, personal, categorías y módulos de cuentas.", image: "/image_8acc6b.png" },
    { title: "Punto de Venta Móvil (POS)", desc: "Interfaz táctil optimizada para cobros rápidos, categorías y control de stock.", image: "/image_8acd3d.jpg" },
    { title: "Gestión de Sucursales", desc: "Configuración de localidades activas y límites de compras al crédito.", image: "/image_8acca3.png" },
    { title: "Estadísticas y Reportes Financieros", desc: "Gráficos detallados de ventas mensuales y tendencias de ingresos.", image: "/image_8ac960.png" },
    { title: "Rendimiento y Métodos de Pago", desc: "Distribución de ingresos por efectivo, tarjeta, crédito, contado y mixto.", image: "/image_8ac97f.png" },
    { title: "Cuentas por Cobrar (Acreedores)", desc: "Control detallado de créditos de clientes, saldos pendientes y abonos.", image: "/image_8accc9.png" },
    { title: "Cuentas por Pagar (Proveedores)", desc: "Auditoría de deudas pendientes y compras de mercancía al crédito.", image: "/image_8acd01.png" },
    { title: "Alertas de Stock Mínimo", desc: "Avisos visuales automáticos cuando los productos alcanzan existencias críticas.", image: "/pos_stock_bajo.png" },
    { title: "Gestión de Cotizaciones", desc: "Control de proformas, búsqueda avanzada por cliente/NIT y re-impresión directa.", image: "/pos_gestion_cotizaciones.png" },
    { title: "Vista Previa de Cotización PDF", desc: "Formato profesional impreso con datos de la empresa y validación de stock.", image: "/pos_cotizacion_pdf.png" },
    { title: "Pedidos Especiales y Agenda", desc: "Módulo de producción y bodega para manejar fechas de entrega, notas y estados.", image: "/pos_pedidos_agenda.png" },
    { title: "Administración de Inventario", desc: "Control de existencias por sucursal y visibilidad de movimientos de mercancía.", image: "/pos_inventario.png" },
    { title: "Proveedores y Compras", desc: "Directorio corporativo, entradas de inventario y control de cuentas por pagar.", image: "/pos_compras_proveedores.png" },
    { title: "Inventario en Red y Módulo de Traslados", desc: "Consulta de stock en otras tiendas y gestión unificada de traslados.", image: "/modulo_traslados.png" }
  ]

  return (
    <div className="min-h-screen bg-[#070b12] text-white flex flex-col font-sans notranslate selection:bg-cyan-500 selection:text-white" translate="no">
      
      {/* NAVBAR MODERNO */}
      <header className="max-w-7xl mx-auto w-full p-4 md:px-8 flex flex-col border-b border-slate-800/80 sticky top-0 bg-[#070b12]/95 backdrop-blur-md z-50">
        <div className="flex justify-between items-center w-full">
          <button onClick={scrollToTop} className="flex items-center gap-3 cursor-pointer text-left">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-cyan-500/40 bg-[#0f172a]">
              <img src="/CodeNexa Logo.webp" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-lg font-black text-white">CODE<span className="text-cyan-400">NEXA</span></span>
              <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded font-bold ml-1.5">.NET</span>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#teaser" className="hover:text-cyan-400">🎬 Spot Animado</a>
            <a href="#galeria" className="hover:text-cyan-400">📱 Pantallas</a>
            <a href="#caracteristicas" className="hover:text-cyan-400">⚡ Características</a>
            <a href="#consultoria" className="hover:text-cyan-400">💼 Consultoría TI</a>
            <a href="#academia" className="hover:text-cyan-400">🎓 Academy</a>
            <a href="#contacto" className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-xl">Cotizar</a>
          </nav>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-cyan-400 text-lg font-bold">☰</button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="max-w-6xl mx-auto px-4 py-12 text-center flex flex-col items-center">
        <span className="bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-cyan-500/20 mb-4">
          ✨ Sistema en la Nube con Supabase y Súper Rendimiento
        </span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
          Modernización Tecnológica, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Consultoría</span> y <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Capacitación</span>
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mb-8">
          Soluciones corporativas con Quantika POS, arquitectura de bases de datos de misión crítica, hardening de seguridad y formación técnica especializada.
        </p>
      </section>

      {/* TEASER PUBLICITARIO ANIMADO CON VOZ Y PAUSA AJUSTADA */}
      <section id="teaser" className="max-w-5xl mx-auto w-full px-4 py-8">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3.5 py-1.5 rounded-full border border-cyan-500/20">
            🎬 Spot Publicitario Web con Narración
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-3">Quantika POS </h2>
        </div>

        <div className="relative bg-[#0b0f19] border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl p-4 sm:p-6 backdrop-blur-xl">
          <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${teaserPlaying ? 'bg-red-500 animate-pulse' : 'bg-amber-500'}`}></span>
              <span className="font-mono text-slate-300 font-bold uppercase tracking-wider">
                {teaserPlaying ? '● SPOT EN VIVO' : '⏸ PAUSADO'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all border ${isMuted ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'}`}
                title={isMuted ? "Activar Narración de Voz" : "Silenciar Narración"}
              >
                {isMuted ? '🔇 Silenciado' : '🔊 Con Voz'}
              </button>

              <button onClick={() => setTeaserPlaying(!teaserPlaying)} className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-xl font-bold">
                {teaserPlaying ? 'Pausar ⏸' : 'Reproducir ▶'}
              </button>
              
              <button onClick={() => { setTeaserScene(0); setTeaserProgress(0); }} className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-xl font-bold">
                Reiniciar ↺
              </button>
            </div>
          </div>

          <div className="relative min-h-[380px] bg-gradient-to-br from-[#111827] to-[#070b12] rounded-2xl border border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden transition-all duration-700">
            <div className={`absolute inset-0 bg-gradient-to-r ${teaserScenesList[teaserScene].accent} opacity-40 blur-3xl pointer-events-none transition-all duration-700`}></div>

            <div className="w-full md:w-1/2 space-y-4 relative z-10 text-left">
              <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-cyan-400">
                [{teaserScenesList[teaserScene].tag}] — Escena {teaserScene + 1} de {teaserScenesList.length}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {teaserScenesList[teaserScene].title}
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {teaserScenesList[teaserScene].desc}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-4">
                {teaserScenesList.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => { 
                      setTeaserScene(idx); 
                      setTeaserProgress(0); 
                      speakText(teaserScenesList[idx].desc);
                    }}
                    className={`h-2 rounded-full transition-all ${teaserScene === idx ? 'w-8 bg-cyan-400' : 'w-2 bg-slate-700 hover:bg-slate-600'}`}
                  />
                ))}
              </div>
            </div>

            <div className="w-full md:w-1/2 relative z-10 flex items-center justify-center">
              <div 
                className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 shadow-2xl group max-w-md aspect-[4/3] w-full flex items-center justify-center p-2 cursor-pointer"
                onClick={() => setModalImage({ title: teaserScenesList[teaserScene].title, image: teaserScenesList[teaserScene].image })}
              >
                <img src={teaserScenesList[teaserScene].image} alt={teaserScenesList[teaserScene].title} className="w-full h-full object-cover object-top rounded-xl transform group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                  🔍 Clic para ampliar
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 flex items-center gap-4">
            <span className="text-[10px] font-mono text-slate-400">Escena {teaserScene + 1}</span>
            <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-100 ease-linear" style={{ width: `${teaserProgress}%` }}></div>
            </div>
            <span className="text-[10px] font-mono text-slate-400">8s</span>
          </div>
        </div>
      </section>

      {/* GALERÍA DE PANTALLAS REALES */}
      <section id="galeria" className="max-w-7xl mx-auto w-full px-4 py-12 border-t border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">Galería Interactiva</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">Explora Todas las Pantallas de Quantika POS</h2>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {posScreens.map((screen, idx) => (
            <button
              key={idx}
              onClick={() => setActiveScreen(idx)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${activeScreen === idx ? 'bg-cyan-600 text-white border-cyan-400 shadow-lg' : 'bg-[#111827] text-slate-300 border-slate-800'}`}
            >
              {screen.title}
            </button>
          ))}
        </div>

        <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 md:p-8 max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 shadow-2xl">
          <div className="w-full md:w-1/2 space-y-3">
            <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-2.5 py-1 rounded font-bold uppercase">Módulo #{activeScreen + 1}</span>
            <h3 className="text-xl font-black text-white">{posScreens[activeScreen].title}</h3>
            <p className="text-slate-300 text-xs leading-relaxed">{posScreens[activeScreen].desc}</p>
            <button onClick={() => setModalImage({ title: posScreens[activeScreen].title, image: posScreens[activeScreen].image })} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs uppercase transition-colors shadow">
              🔍 Ver Imagen en Grande
            </button>
          </div>
          <div className="w-full md:w-1/2 bg-[#070b12] border border-slate-800 rounded-2xl p-2 aspect-[4/3] flex items-center justify-center overflow-hidden cursor-pointer group relative" onClick={() => setModalImage({ title: posScreens[activeScreen].title, image: posScreens[activeScreen].image })}>
            <img src={posScreens[activeScreen].image} alt={posScreens[activeScreen].title} className="w-full h-full object-cover object-top rounded-xl group-hover:scale-105 transition-transform" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
              🔍 Ampliar Imagen
            </div>
          </div>
        </div>
      </section>

      {/* MODAL / LIGHTBOX */}
      {modalImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4" onClick={() => setModalImage(null)}>
          <div className="relative max-w-5xl w-full bg-[#111827] border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="bg-[#070b12] px-6 py-4 border-b border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-widest block">Quantika POS • Vista Detallada</span>
                <h3 className="text-sm sm:text-lg font-black text-white">{modalImage.title}</h3>
              </div>
              <button onClick={() => setModalImage(null)} className="bg-slate-800 hover:bg-slate-700 text-white w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm">✕</button>
            </div>
            <div className="p-4 bg-black/60 flex items-center justify-center max-h-[75vh] overflow-auto">
              <img src={modalImage.image} alt={modalImage.title} className="max-w-full max-h-[70vh] object-contain rounded-xl border border-slate-800 shadow-2xl" />
            </div>
            <div className="bg-[#070b12] px-6 py-3 border-t border-slate-800 flex justify-end">
              <button onClick={() => setModalImage(null)} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-4 py-2 rounded-xl text-xs uppercase">Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* CARACTERÍSTICAS PRINCIPALES */}
      <section id="caracteristicas" className="max-w-7xl mx-auto w-full px-4 py-12 border-t border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl font-extrabold text-white">Características Principales</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuresList.map((f, idx) => (
            <div key={idx} className="bg-[#111827] border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-2xl mb-3 block p-2 bg-slate-900 w-max rounded-xl border border-slate-800">{f.icon}</span>
                <h3 className="font-bold text-sm text-white mb-1.5">{f.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONSULTORÍA TI */}
      <section id="consultoria" className="max-w-7xl mx-auto w-full px-4 py-16 border-t border-slate-800">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20 inline-block mb-3">Catálogo de Servicios Ejecutivos</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">Consultoría TI y Asesorías Tecnológicas de Alto Impacto</h2>
          <p className="text-slate-400 text-xs sm:text-sm">Soluciones integrales orientadas a blindar, escalar y transformar la infraestructura digital de tu organización.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {consultingCatalog.map((item, idx) => (
            <div key={idx} className="bg-[#111827] border border-slate-800 hover:border-blue-500/40 p-6 sm:p-8 rounded-3xl shadow-xl transition-all flex flex-col justify-between group">
              <div>
                <span className="text-3xl mb-4 block p-3.5 bg-slate-900/90 w-max rounded-2xl border border-slate-800 group-hover:scale-110 transition-transform shadow-inner">{item.icon}</span>
                <h3 className="font-extrabold text-base text-white mb-2.5">{item.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Consultoría TI</span>
                <a href="#contacto" className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors">Solicitar →</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CODENEXA ACADEMY */}
      <section id="academia" className="max-w-7xl mx-auto w-full px-4 py-16 border-t border-slate-800">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="bg-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border border-purple-500/20 mb-4 inline-block shadow-sm">
            🎓 CodeNexa Academy • Formación Especializada
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white mt-3 mb-4">
            Especialización Progresiva en Bases de Datos
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Formamos profesionales en tecnología con un enfoque práctico y orientado al mundo laboral real, desde fundamentos hasta nivel avanzado.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-[#111827] border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between">
            <div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-3.5 py-1 rounded-full font-bold uppercase border border-emerald-500/30 mb-4 inline-block">Abierto / Próximo Inicio</span>
              <h3 className="text-xl font-black text-white mb-1">Nivel Básico</h3>
              <p className="text-emerald-400 text-xs font-bold mb-4">Fundamentos y SQL Esencial</p>
              <ul className="space-y-2.5 text-xs text-slate-300 border-t border-slate-800 pt-4">
                <li>✔ Conceptos de bases de datos relacionales</li>
                <li>✔ Configuración de SQL Server y SSMS</li>
                <li>✔ Consultas SQL esenciales (SELECT, INSERT, UPDATE)</li>
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-800">
              <a href="#contacto" className="block text-center bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider">Inscribirme al Nivel Básico</a>
            </div>
          </div>

          <div className="bg-[#111827] border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between">
            <div>
              <span className="text-[10px] bg-amber-500/10 text-amber-400 px-3.5 py-1 rounded-full font-bold uppercase border border-amber-500/30 mb-4 inline-block">Próximamente</span>
              <h3 className="text-xl font-black text-white mb-1">Nivel Intermedio</h3>
              <p className="text-amber-400 text-xs font-bold mb-4">Diseño y Consultas Avanzadas</p>
              <ul className="space-y-2.5 text-xs text-slate-300 border-t border-slate-800 pt-4">
                <li>✔ Normalización y modelado de datos</li>
                <li>✔ JOIN avanzados y subconsultas complejas</li>
                <li>✔ Vistas, índices y transacciones</li>
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-800">
              <a href="#contacto" className="block text-center bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 rounded-xl text-xs uppercase tracking-wider border border-slate-700">Más Información</a>
            </div>
          </div>

          <div className="bg-[#111827] border border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between">
            <div>
              <span className="text-[10px] bg-purple-500/10 text-purple-400 px-3.5 py-1 rounded-full font-bold uppercase border border-purple-500/30 mb-4 inline-block">Próximamente</span>
              <h3 className="text-xl font-black text-white mb-1">Nivel Avanzado</h3>
              <p className="text-purple-400 text-xs font-bold mb-4">Optimización y Entorno Empresarial</p>
              <ul className="space-y-2.5 text-xs text-slate-300 border-t border-slate-800 pt-4">
                <li>✔ Optimización de rendimiento y planes de ejecución</li>
                <li>✔ Seguridad, permisos y roles empresariales</li>
                <li>✔ Backups, recuperación y proyecto final</li>
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-800">
              <a href="#contacto" className="block text-center bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 rounded-xl text-xs uppercase tracking-wider border border-slate-700">Más Información</a>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN DE CONTACTO GENERAL */}
      <section id="contacto" className="max-w-xl mx-auto w-full px-4 py-16 border-t border-slate-800">
        <div className="bg-[#111827] border border-slate-800 p-8 rounded-3xl shadow-2xl">
          <h2 className="text-xl font-extrabold text-white mb-2 text-center">Inicia un Proyecto o Inscríbete a la Academia</h2>
          {sent ? (
            <div className="bg-cyan-500/10 text-cyan-400 p-4 rounded-xl text-center text-xs font-bold">¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 text-xs mt-4">
              <input type="text" required placeholder="Nombre completo" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#070b12] border border-slate-700 rounded-xl px-4 py-3 text-white outline-none" />
              <input type="email" required placeholder="Correo electrónico" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-[#070b12] border border-slate-700 rounded-xl px-4 py-3 text-white outline-none" />
              <select value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})} className="w-full bg-[#070b12] border border-slate-700 rounded-xl px-4 py-3 text-white outline-none">
                <option value="Quantika POS">Quantika POS (Sistema de Ventas)</option>
                <option value="Consultoria TI">Consultoría TI / Ciberseguridad / Arquitectura</option>
                <option value="CodeNexa Academy - SQL Server Básico">CodeNexa Academy - SQL Server Básico (Q800)</option>
              </select>
              <textarea rows={3} required placeholder="Mensaje..." value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full bg-[#070b12] border border-slate-700 rounded-xl p-4 text-white outline-none resize-none"></textarea>
              <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold py-3 rounded-xl uppercase tracking-wider">Enviar Solicitud</button>
            </form>
          )}
        </div>
      </section>

      {/* CHAT FLOTANTE CON IA */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {!chatOpen && (
          <button onClick={() => setChatOpen(true)} className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-4 rounded-full shadow-2xl text-2xl w-14 h-14 flex items-center justify-center animate-bounce">🤖</button>
        )}
        {chatOpen && (
          <div className="bg-[#111827] border border-slate-700 w-80 sm:w-96 h-[440px] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            <div className="bg-[#070b12] p-3.5 border-b border-slate-800 flex justify-between items-center text-xs">
              <span className="font-extrabold text-white">Asistente CodeNexa</span>
              <button onClick={() => setChatOpen(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>
            <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl ${m.sender === 'user' ? 'bg-cyan-600 text-white' : 'bg-[#070b12] border border-slate-800 text-slate-200'}`}>{m.text}</div>
                </div>
              ))}
              {loadingChat && <div className="text-[10px] text-slate-400 animate-pulse">CodeNexaBot está escribiendo...</div>}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-2.5 bg-[#070b12] border-t border-slate-800 flex gap-2">
              <input type="text" placeholder="Escribe tu duda..." value={inputMessage} onChange={e => setInputMessage(e.target.value)} className="flex-1 bg-[#111827] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none" />
              <button type="submit" className="bg-cyan-600 text-white px-3 py-2 rounded-xl text-xs font-bold">Enviar</button>
            </form>
          </div>
        )}
      </div>

      <footer className="mt-auto py-8 border-t border-slate-800 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} CodeNexa — Modernización Tecnológica, Infraestructura y Educación Especializada.</p>
      </footer>

    </div>
  )
}