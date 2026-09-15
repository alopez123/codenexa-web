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
    { title: "Punto de Venta Móvil", desc: "Interfaz táctil optimizada para cobros rápidos, categorías y control de stock.", image: "/image_8acd3d.jpg" },
    { title: "Pantalla de Acceso Seguro", desc: "Autenticación cifrada para usuarios y roles autorizados por sucursal.", image: "/image_8ac8c8.png" },
    { title: "Panel Principal del Negocio", desc: "Acceso directo a la administración de sucursales, personal, categorías y módulos de cuentas.", image: "/image_8acc6b.png" },
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
    { title: "Módulo de Clientes", desc: "Directorio completo de clientes, datos de contacto, historial de compras y saldos activos.", image: "/modulo_clientes.png" },
    { title: "Módulo de Caja y Turnos", desc: "Control estricto de apertura, arqueo, ingresos, retiros y cierre de turnos de caja.", image: "/modulo_caja.png" },
    { title: "Inventario en Red y Módulo de Traslados", desc: "Consulta en tiempo real de existencias en otras tiendas y gestión unificada de traslados.", image: "/modulo_traslados.png" }
  ]

  const faqs = [
    {
      q: "¿Cómo funciona el aislamiento de datos por sucursal en Quantika POS?",
      steps: [
        "Cada sucursal opera bajo un identificador único de negocio y branch_id vinculado en Supabase.",
        "Los cajeros y administradores solo visualizan el inventario y las ventas correspondientes a su tienda asignada.",
        "El panel gerencial permite alternar o consolidar la información de todas las sucursales de forma segura."
      ]
    },
    {
      q: "¿Cómo se procesan los métodos de pago y pagos mixtos en el punto de venta?",
      steps: [
        "Al finalizar una venta, el módulo de cobro permite elegir entre efectivo, tarjeta o transferencias bancarias.",
        "Soporta pagos 'Mixtos', permitiendo dividir el monto total en distintas formas de pago según requiera el cliente.",
        "El sistema calcula automáticamente los cambios y actualiza el reporte de ingresos en el gráfico de pastel gerencial."
      ]
    },
    {
      q: "¿Cómo funcionan las alertas de stock crítico y mínimo?",
      steps: [
        "El sistema detecta automáticamente cuando un producto baja del límite establecido.",
        "Muestra una ventana emergente de advertencia para que puedas reabastecer a tiempo y evitar quiebres de inventario."
      ]
    },
    {
      q: "¿Cómo se gestionan las cotizaciones y su carga directa al POS?",
      steps: [
        "Permite crear proformas profesionales con datos del cliente, NIT y dirección.",
        "Cuenta con historial para buscar por referencia y re-imprimir en PDF.",
        "Permite cargar la cotización directamente al carrito del POS como venta al contado o crédito."
      ]
    },
    {
      q: "¿Cómo opera el módulo de pedidos especiales y agenda?",
      steps: [
        "Ideal para productos personalizados o servicios que requieren programación anticipada.",
        "Registra notas técnicas específicas y asigna fecha y hora de entrega o evento.",
        "Funciona como agenda permitiendo cambiar el estado entre pendiente e historial entregados."
      ]
    },
    {
      q: "¿Cómo se gestiona el inventario, compras y cuentas por pagar?",
      steps: [
        "Monitorea en tiempo real los niveles de existencia y alerta sobre stock crítico.",
        "Incluye el módulo de proveedores para registrar entradas de mercancía y compras al crédito.",
        "Lleva el control financiero de las cuentas por pagar a proveedores y el impacto en existencias."
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-[#070b12] text-white flex flex-col font-sans notranslate selection:bg-cyan-500 selection:text-white" translate="no">
      
      {/* NAVBAR MODERNO */}
      <header className="max-w-7xl mx-auto w-full p-4 md:px-8 flex flex-col border-b border-slate-800/80 sticky top-0 bg-[#070b12]/95 backdrop-blur-md z-50">
        <div className="flex justify-between items-center w-full">
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-3 cursor-pointer focus:outline-none group text-left"
          >
            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-cyan-500/40 group-hover:border-cyan-400 shadow-lg shadow-cyan-500/20 transition-all bg-[#0f172a]">
              <img src="/CodeNexa Logo.webp" alt="CodeNexa Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-lg md:text-xl font-black tracking-wider text-white group-hover:opacity-90 transition-opacity">
                CODE<span className="text-cyan-400">NEXA</span>
              </span>
              <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded font-bold border border-cyan-500/30 ml-1.5">
                .NET
              </span>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300 relative">
            <div className="relative group" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-1 hover:text-cyan-400 transition-colors py-2">
                Quantika POS <span className="text-[10px]">▼</span>
              </button>
              {dropdownOpen && (
                <div className="absolute top-full left-0 w-48 bg-[#111827] border border-slate-700/80 rounded-xl shadow-2xl py-2 flex flex-col z-50 backdrop-blur">
                  <a href="#caracteristicas" className="px-4 py-2 hover:bg-slate-800 hover:text-cyan-400 text-xs transition-colors">⚡ Características</a>
                  <a href="#ventajas" className="px-4 py-2 hover:bg-slate-800 hover:text-cyan-400 text-xs transition-colors">🎯 Ventajas</a>
                  <a href="#galeria" className="px-4 py-2 hover:bg-slate-800 hover:text-cyan-400 text-xs transition-colors">📱 Pantallas Reales</a>
                  <a href="#ayuda" className="px-4 py-2 hover:bg-slate-800 hover:text-cyan-400 text-xs transition-colors">📖 Guía Operativa</a>
                </div>
              )}
            </div>
            <a href="#consultoria" className="hover:text-cyan-400 transition-colors">Consultoría TI</a>
            <a href="#academia" className="hover:text-cyan-400 transition-colors">CodeNexa Academy</a>
            <a href="#contacto" className="hover:text-cyan-400 transition-colors">Contacto</a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a href="#contacto" className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-lg shadow-cyan-600/25 transition-all transform hover:scale-105">
              Cotizar Servicio
            </a>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg bg-slate-900 text-cyan-400 border border-slate-800 text-lg font-bold" aria-label="Menú">
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-[#111827] border-t border-slate-800/80 mt-3 pt-3 pb-2 flex flex-col space-y-3 text-xs font-bold animate-fadeIn w-full">
            <div className="text-cyan-400 font-extrabold pb-1 border-b border-slate-800">Quantika POS</div>
            <a href="#caracteristicas" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-cyan-400 pl-3 py-1">⚡ Características</a>
            <a href="#ventajas" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-cyan-400 pl-3 py-1">🎯 Ventajas</a>
            <a href="#galeria" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-cyan-400 pl-3 py-1">📱 Pantallas Reales</a>
            <a href="#ayuda" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-cyan-400 pl-3 py-1">📖 Guía Operativa</a>
            <div className="pt-2 border-t border-slate-800 space-y-3">
              <a href="#consultoria" onClick={() => setMobileMenuOpen(false)} className="text-slate-200 hover:text-cyan-400 block py-1">🛡️ Consultoría TI</a>
              <a href="#academia" onClick={() => setMobileMenuOpen(false)} className="text-slate-200 hover:text-cyan-400 block py-1">🎓 CodeNexa Academy</a>
              <a href="#contacto" onClick={() => setMobileMenuOpen(false)} className="text-slate-200 hover:text-cyan-400 block py-1">✉️ Contacto</a>
              <a href="#contacto" onClick={() => setMobileMenuOpen(false)} className="bg-cyan-600 text-white text-center block py-2.5 rounded-xl shadow mt-2">Cotizar Servicio</a>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative max-w-6xl mx-auto w-full px-4 sm:px-6 py-12 md:py-16 text-center flex flex-col items-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[700px] md:h-[700px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative mb-6 group">
          <div className="absolute -inset-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl blur-2xl opacity-50 group-hover:opacity-80 transition duration-1000"></div>
          <div className="relative w-36 h-36 md:w-48 md:h-48 bg-[#0f172a] border border-cyan-500/40 rounded-3xl overflow-hidden shadow-2xl p-2.5">
            <img src="/CodeNexa Logo.webp" alt="CodeNexa Isotype" className="w-full h-full object-cover rounded-2xl" />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6 relative z-10 max-w-4xl">
          <span className="bg-cyan-500/10 text-cyan-400 text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-lg backdrop-blur-sm">
            🛠️ Herramientas
          </span>
          <span className="bg-blue-500/10 text-blue-400 text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-lg backdrop-blur-sm">
            💼 Consultorías
          </span>
          <span className="bg-purple-500/10 text-purple-400 text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-lg backdrop-blur-sm">
            🎓 Capacitaciones
          </span>
          <span className="bg-emerald-500/10 text-emerald-400 text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-lg backdrop-blur-sm">
            🛡️ Ciberseguridad
          </span>
          <span className="bg-amber-500/10 text-amber-400 text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-lg backdrop-blur-sm">
            💻 Modernizaciones Tecnológicas
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight max-w-5xl mb-4 relative z-10">
          Modernización Tecnológica, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Consultoría</span> y <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Capacitación</span> de Alto Rendimiento
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm md:text-base max-w-2xl md:max-w-3xl mb-8 leading-relaxed px-2 relative z-10">
          Soluciones tecnológicas corporativas con Quantika POS, arquitectura de bases de datos de misión crítica, hardening de seguridad y formación técnica especializada.
        </p>

        <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-4 relative z-10">
          <div className="relative rounded-3xl overflow-hidden border border-cyan-500/40 bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 p-8 md:p-12 shadow-2xl text-left">
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-extrabold uppercase px-3.5 py-1.5 rounded-full mb-4">
                  <span>⭐</span> Herramienta Estrella Cloud
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-3">
                  Potencia tu Negocio con <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Quantika POS</span>
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                  Control total de inventarios, aislamiento multi-sucursal, arqueos de caja y analíticas financieras en tiempo real. La solución definitiva para escalar tus ventas.
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <a href="#galeria" className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider shadow-lg transition-all transform hover:scale-105">
                    Ver Pantallas Reales
                  </a>
                  <a href="#contacto" className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-all">
                    Solicitar Demo
                  </a>
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-700/80 p-6 rounded-2xl shadow-2xl text-center md:text-right shrink-0 backdrop-blur">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-1">Tecnología de Vanguardia</span>
                <div className="text-xl sm:text-2xl font-black text-white mb-2">Supabase + Next.js</div>
                <span className="text-xs text-cyan-400 font-semibold">⚡ 99.5% de Disponibilidad Garantizada</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 1: PRODUCTOS (QUANTIKA POS EN IPHONE SIMULATOR) */}
      <section id="productos" className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-16 md:py-24 border-t border-slate-800/80">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 md:gap-14 bg-gradient-to-br from-[#111827] to-[#0f172a] border border-slate-700/80 rounded-3xl p-6 sm:p-10 md:p-14 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="max-w-xl w-full relative z-10">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">Plataforma Estrella</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mt-4 mb-4">Quantika POS</h2>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed mb-6">
              El sistema definitivo de punto de venta y gestión empresarial. Controla inventarios críticos, múltiples sucursales con aislamiento seguro, cajas, pedidos y analíticas financieras en tiempo real.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-300 mb-8">
              <li className="flex items-center gap-2 text-cyan-300">✔ Ventas ágiles (Efectivo, Tarjeta, Transferencia, Mixto)</li>
              <li className="flex items-center gap-2 text-cyan-300">✔ Panel gerencial con márgenes y ticket promedio</li>
              <li className="flex items-center gap-2 text-cyan-300">✔ Gestión avanzada de cuentas por cobrar y por pagar</li>
            </ul>
            <div className="flex flex-wrap gap-3">
              <a href="#caracteristicas" className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-6 py-3 rounded-xl text-xs shadow-lg shadow-cyan-600/20 transition-all text-center">Características</a>
              <a href="#galeria" className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-bold px-6 py-3 rounded-xl text-xs transition-all text-center">Ver Galería Real</a>
            </div>
          </div>
          
          <div className="w-full lg:w-auto flex justify-center relative z-10">
            <div className="relative w-[280px] sm:w-[310px] h-[580px] bg-[#1e293b] rounded-[45px] p-3 shadow-2xl border-4 border-slate-700 ring-8 ring-slate-900/50">
              <div className="absolute -left-[7px] top-24 w-[3px] h-10 bg-slate-600 rounded-l"></div>
              <div className="absolute -left-[7px] top-38 w-[3px] h-12 bg-slate-600 rounded-l"></div>
              <div className="absolute -right-[7px] top-28 w-[3px] h-14 bg-slate-600 rounded-r"></div>

              <div className="w-full h-full bg-[#070b12] rounded-[35px] overflow-hidden flex flex-col border border-slate-800 relative shadow-inner">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-30 flex items-center justify-center">
                  <div className="w-3 h-3 bg-slate-900 rounded-full mr-3 border border-slate-800"></div>
                  <div className="w-2 h-2 bg-blue-950 rounded-full"></div>
                </div>

                <div className="pt-3 px-6 flex justify-between items-center text-[10px] font-bold text-slate-300 bg-[#070b12] z-20">
                  <span>9:41</span>
                  <div className="flex items-center gap-1.5">
                    <span>5G</span>
                    <div className="w-4 h-2 border border-slate-300 rounded-sm p-0.5 flex items-center">
                      <div className="w-full h-full bg-slate-300"></div>
                    </div>
                  </div>
                </div>

                <div 
                  className="flex-1 overflow-hidden relative bg-black flex items-center justify-center cursor-pointer group"
                  onClick={() => setModalImage({ title: posScreens[activeScreen].title, image: posScreens[activeScreen].image })}
                  title="Haz clic para ver en grande"
                >
                  <img src={posScreens[activeScreen].image} alt={posScreens[activeScreen].title} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                    🔍 Ampliar Pantalla
                  </div>
                </div>

                <div className="h-5 bg-[#070b12] flex items-center justify-center pb-1">
                  <div className="w-24 h-1 bg-slate-700 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN INTERACTIVA: GALERÍA DE PANTALLAS REALES */}
      <section id="galeria" className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-16 md:py-24 border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-4 py-1.5 rounded-full border border-cyan-500/20 inline-block mb-3">Interfaces Reales</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">Explora el Sistema por Dentro</h2>
          <p className="text-slate-400 text-xs sm:text-sm">Haz clic en cada módulo o sobre la imagen para abrirla en grande y visualizar todos los detalles de operación.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {posScreens.map((screen, idx) => (
            <button
              key={idx}
              onClick={() => setActiveScreen(idx)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${activeScreen === idx ? 'bg-cyan-600 text-white border-cyan-400 shadow-lg shadow-cyan-600/30' : 'bg-[#111827] text-slate-300 border-slate-800 hover:border-slate-700'}`}
            >
              {screen.title}
            </button>
          ))}
        </div>

        <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/2 text-left space-y-4">
            <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full font-extrabold uppercase border border-cyan-500/30">Módulo #{activeScreen + 1}</span>
            <h3 className="text-xl sm:text-2xl font-black text-white">{posScreens[activeScreen].title}</h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{posScreens[activeScreen].desc}</p>
            <div className="pt-4 flex flex-wrap gap-3">
              <button 
                onClick={() => setModalImage({ title: posScreens[activeScreen].title, image: posScreens[activeScreen].image })}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-wider shadow-lg transition-all flex items-center gap-2"
              >
                🔍 Ver Imagen en Grande
              </button>
              <a href="#contacto" className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-wider transition-all">
                Solicitar Demo
              </a>
            </div>
          </div>

          <div 
            className="w-full md:w-1/2 bg-[#070b12] border border-slate-700/80 rounded-2xl p-3 shadow-2xl overflow-hidden group cursor-pointer relative"
            onClick={() => setModalImage({ title: posScreens[activeScreen].title, image: posScreens[activeScreen].image })}
            title="Haz clic para ampliar"
          >
            <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900 aspect-[4/3] relative flex items-center justify-center">
              <img src={posScreens[activeScreen].image} alt={posScreens[activeScreen].title} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white font-bold text-xs gap-1">
                <span className="text-2xl">🔍</span>
                <span>Ampliar Pantalla</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL / LIGHTBOX PARA VER IMAGEN EN GRANDE */}
      {modalImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6 animate-fadeIn"
          onClick={() => setModalImage(null)}
        >
          <div 
            className="relative max-w-5xl w-full bg-[#111827] border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-[#070b12] px-6 py-4 border-b border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-widest block">Quantika POS • Vista Detallada</span>
                <h3 className="text-sm sm:text-lg font-black text-white">{modalImage.title}</h3>
              </div>
              <button 
                onClick={() => setModalImage(null)}
                className="bg-slate-800 hover:bg-slate-700 text-white w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-colors"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            <div className="p-2 sm:p-4 bg-black/60 flex items-center justify-center max-h-[75vh] overflow-auto">
              <img 
                src={modalImage.image} 
                alt={modalImage.title} 
                className="max-w-full max-h-[70vh] object-contain rounded-xl border border-slate-800 shadow-2xl" 
              />
            </div>

            <div className="bg-[#070b12] px-6 py-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
              <span>Haz clic fuera de la ventana o en el botón para cerrar.</span>
              <button 
                onClick={() => setModalImage(null)}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-4 py-2 rounded-xl text-xs uppercase"
              >
                Cerrar Ventana
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECCIÓN: CARACTERÍSTICAS PRINCIPALES */}
      <section id="caracteristicas" className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-16 md:py-24 border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3.5 py-1.5 rounded-full border border-cyan-500/20">Potencia Operativa</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mt-4 mb-3">Características Principales de Quantika POS</h2>
          <p className="text-slate-400 text-xs md:text-sm">Diseñado para ofrecer máxima velocidad, control financiero y seguridad en cada sucursal.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuresList.map((feat, idx) => (
            <div key={idx} className="bg-[#111827] border border-slate-800 hover:border-cyan-500/40 p-6 rounded-2xl shadow-xl transition-all flex flex-col justify-between group">
              <div>
                <span className="text-3xl mb-4 block p-3 bg-slate-900/80 w-max rounded-xl border border-slate-800 group-hover:scale-110 transition-transform">{feat.icon}</span>
                <h3 className="font-bold text-sm text-white mb-2">{feat.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{feat.desc}</p>
              </div>
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider mt-6 pt-3 border-t border-slate-800">Módulo Integrado</span>
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN: VENTAJAS DE QUANTIKA POS */}
      <section id="ventajas" className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-16 md:py-24 border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3.5 py-1.5 rounded-full border border-cyan-500/20">Optimización Cloud</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mt-4 mb-3">Ventajas Competitivas</h2>
          <p className="text-slate-400 text-xs md:text-sm">Por qué elegir Quantika POS transforma la rentabilidad y eficiencia de tu negocio.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ventajasList.map((v, idx) => (
            <div key={idx} className="bg-[#111827] border border-slate-800 hover:border-cyan-500/40 p-6 rounded-2xl shadow-xl transition-all flex flex-col justify-between group">
              <div>
                <span className="text-cyan-400 font-black text-lg mb-3 block font-mono">[{v.num}]</span>
                <h3 className="font-bold text-sm text-white mb-2">{v.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{v.desc}</p>
              </div>
              <span className="text-[9px] bg-cyan-500/10 text-cyan-400 py-1.5 px-3 rounded-full font-bold uppercase tracking-wider mt-6 w-max border border-cyan-500/20">Ventaja Cloud</span>
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN: GUÍA OPERATIVA */}
      <section id="ayuda" className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-16 md:py-24 border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3.5 py-1.5 rounded-full border border-cyan-500/20">Base de Conocimiento</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mt-4 mb-3">Guía y Preguntas Frecuentes de Quantika POS</h2>
          <p className="text-slate-400 text-xs md:text-sm">Todo lo que necesitas saber sobre la operación, sucursales, cobros y analíticas de tu sistema de ventas.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index
            return (
              <div key={index} className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden transition-all shadow-xl">
                <button onClick={() => setOpenFaq(isOpen ? null : index)} className="w-full p-5 sm:p-6 text-left flex justify-between items-center gap-4 text-xs sm:text-sm font-bold text-slate-200 hover:text-cyan-400 transition-colors">
                  <span className="flex items-center gap-3.5">
                    <span className="w-7 h-7 rounded-full bg-cyan-500/15 text-cyan-400 text-xs flex items-center justify-center font-bold border border-cyan-500/30">?</span>
                    {faq.q}
                  </span>
                  <span className="text-cyan-400 text-lg font-mono">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-2 border-t border-slate-800 bg-[#0d1322] text-xs text-slate-300 space-y-3 animate-fadeIn">
                    <p className="font-bold text-cyan-400 uppercase tracking-wider text-[10px] mb-2">Funcionamiento en Quantika POS:</p>
                    {faq.steps.map((step, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5 border border-cyan-500/20">{sIdx + 1}</span>
                        <span className="leading-relaxed">{step}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* SECCIÓN 3: CATÁLOGO DE CONSULTORÍAS TI */}
      <section id="consultoria" className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-16 md:py-24 border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-16">
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

      {/* SECCIÓN NUEVA: CODENEXA ACADEMY */}
      <section id="academia" className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-16 md:py-28 border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="bg-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border border-purple-500/20 mb-4 inline-block shadow-sm">
            🎓 CodeNexa Academy • Formación Especializada
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mt-3 mb-4 leading-tight">
            Especialización Progresiva en Bases de Datos
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Formamos profesionales en tecnología con un enfoque práctico y orientado al mundo laboral real, permitiendo avanzar paso a paso desde fundamentos hasta un nivel avanzado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 bg-gradient-to-br from-[#111827] to-[#0f172a] border border-slate-700/80 p-6 sm:p-10 rounded-3xl shadow-2xl">
          <div>
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              📅 Modalidad del Programa
            </h3>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-center gap-2.5">💻 <strong>Modalidad:</strong> 100% Virtual (en vivo)</li>
              <li className="flex items-center gap-2.5">📅 <strong>Frecuencia:</strong> 1 clase por semana</li>
              <li className="flex items-center gap-2.5">⏱️ <strong>Duración por clase:</strong> 2 horas (Sábados 8:00 AM – 10:00 AM)</li>
              <li className="flex items-center gap-2.5">⏳ <strong>Duración por nivel:</strong> 6 semanas</li>
              <li className="flex items-center gap-2.5">🎓 <strong>Certificación:</strong> Digital al finalizar cada nivel</li>
            </ul>
          </div>
          <div className="border-t md:border-t-0 md:border-l border-slate-700/80 pt-6 md:pt-0 md:pl-8">
            <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              💳 Forma de Inversión y Cupos
            </h3>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-center gap-2.5">💰 <strong>Inversión por nivel:</strong> Q800 (Pago único)</li>
              <li className="flex items-center gap-2.5">📌 <strong>Próximo inicio:</strong> Sábado 6 de junio de 2026</li>
              <li className="flex items-center gap-2.5">👥 <strong>Cupo limitado:</strong> Grupos reducidos de 15 a 20 estudiantes</li>
              <li className="flex items-center gap-2.5">✨ <strong>Proceso:</strong> Solicita info, realiza tu pago y recibe acceso inmediato</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-[#111827] border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between group hover:border-emerald-400 transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-3.5 py-1 rounded-full font-bold uppercase border border-emerald-500/30">Abierto / Próximo Inicio</span>
              </div>
              <h3 className="text-xl font-black text-white mb-1">Nivel Básico</h3>
              <p className="text-emerald-400 text-xs font-bold mb-4">Fundamentos y SQL Esencial</p>
              
              <ul className="space-y-2.5 text-xs text-slate-300 border-t border-slate-800 pt-4">
                <li className="flex items-center gap-2">✔ Conceptos de bases de datos</li>
                <li className="flex items-center gap-2">✔ Tipos de Datos y Modelo relacional</li>
                <li className="flex items-center gap-2">✔ Instalación y configuración de SQL Server</li>
                <li className="flex items-center gap-2">✔ SQL Server Management Studio (SSMS)</li>
                <li className="flex items-center gap-2">✔ Consultas SQL (SELECT, INSERT, UPDATE)</li>
                <li className="flex items-center gap-2">✔ Funciones básicas y filtrado avanzado</li>
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-800">
              <a href="#contacto" className="block text-center bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-lg shadow-emerald-600/20">
                Inscribirme al Nivel Básico
              </a>
            </div>
          </div>

          <div className="bg-[#111827] border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between group hover:border-amber-400 transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                <span className="text-[10px] bg-amber-500/10 text-amber-400 px-3.5 py-1 rounded-full font-bold uppercase border border-amber-500/30">Próximamente</span>
              </div>
              <h3 className="text-xl font-black text-white mb-1">Nivel Intermedio</h3>
              <p className="text-amber-400 text-xs font-bold mb-4">Diseño y Consultas Avanzadas</p>
              
              <ul className="space-y-2.5 text-xs text-slate-300 border-t border-slate-800 pt-4">
                <li className="flex items-center gap-2">✔ Diseño y consultas avanzadas</li>
                <li className="flex items-center gap-2">✔ Normalización y modelado correcto</li>
                <li className="flex items-center gap-2">✔ Creación de consultas complejas</li>
                <li className="flex items-center gap-2">✔ JOIN avanzados y subconsultas</li>
                <li className="flex items-center gap-2">✔ Vistas e índices de rendimiento</li>
                <li className="flex items-center gap-2">✔ Transacciones y proyecto intermedio</li>
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-800">
              <a href="#contacto" className="block text-center bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-colors border border-slate-700">
                Más Información
              </a>
            </div>
          </div>

          <div className="bg-[#111827] border border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between group hover:border-purple-400 transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-3 h-3 rounded-full bg-purple-400"></span>
                <span className="text-[10px] bg-purple-500/10 text-purple-400 px-3.5 py-1 rounded-full font-bold uppercase border border-purple-500/30">Próximamente</span>
              </div>
              <h3 className="text-xl font-black text-white mb-1">Nivel Avanzado</h3>
              <p className="text-purple-400 text-xs font-bold mb-4">Optimización y Entorno Empresarial</p>
              
              <ul className="space-y-2.5 text-xs text-slate-300 border-t border-slate-800 pt-4">
                <li className="flex items-center gap-2">✔ Administración en escenarios reales</li>
                <li className="flex items-center gap-2">✔ Optimización de rendimiento y seguridad</li>
                <li className="flex items-center gap-2">✔ Análisis de planes de ejecución</li>
                <li className="flex items-center gap-2">✔ Seguridad, permisos y roles</li>
                <li className="flex items-center gap-2">✔ Backups y recuperación de datos</li>
                <li className="flex items-center gap-2">✔ Proyecto final empresarial</li>
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-800">
              <a href="#contacto" className="block text-center bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-colors border border-slate-700">
                Más Información
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#0d1322] border border-slate-800 p-6 sm:p-10 rounded-3xl shadow-xl">
          <div>
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3 flex items-center gap-2">👨‍🏫 Sobre el Instructor</h3>
            <p className="text-slate-300 text-xs leading-relaxed mb-4">
              Ingeniero en Sistemas y especialista en administración de bases de datos en el sector financiero. Durante años he trabajado con entornos reales de alta demanda, manejando información crítica, optimización de consultas SQL y estructuras corporativas.
            </p>
            <p className="text-slate-400 text-xs italic bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
              "Aquí no aprenderás solo teoría... aprenderás cómo trabajar profesionalmente con bases de datos desde cero hasta un nivel aplicado de industria."
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3 flex items-center gap-2">🎯 ¿A quién va dirigido?</h3>
            <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
              <li className="flex items-center gap-2">✔ Personas que quieren iniciar en tecnología desde cero.</li>
              <li className="flex items-center gap-2">✔ Estudiantes universitarios buscando experiencia práctica real.</li>
              <li className="flex items-center gap-2">✔ Profesionales que desean especializarse en bases de datos SQL Server.</li>
            </ul>
            <div className="pt-2">
              <a href="#contacto" className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold px-7 py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-purple-600/25 transition-all">
                Inscríbete o Solicita Información
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN DE CONTACTO GENERAL */}
      <section id="contacto" className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-16 md:py-24">
        <div className="bg-[#111827] border border-slate-800 p-6 sm:p-10 md:p-14 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="text-center max-w-xl mx-auto mb-10 relative z-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">Inicia un Proyecto o Inscríbete a la Academia</h2>
            <p className="text-slate-400 text-xs md:text-sm">¿Interesado en Quantika POS, consultoría técnica o en el Nivel Básico de SQL Server? Escríbenos.</p>
          </div>

          {sent ? (
            <div className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 p-6 rounded-2xl text-center text-sm font-bold relative z-10">
              ¡Mensaje enviado con éxito! Nos pondremos en contacto contigo a la brevedad posible.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto relative z-10">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Nombre Completo</label>
                <input 
                  type="text" 
                  required
                  placeholder="Tu nombre"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-[#070b12] border border-slate-700 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Correo Electrónico</label>
                <input 
                  type="email" 
                  required
                  placeholder="tucorreo@empresa.com"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-[#070b12] border border-slate-700 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Servicio o Curso de Interés</label>
                <select 
                  value={formData.service}
                  onChange={e => setFormData({...formData, service: e.target.value})}
                  className="w-full bg-[#070b12] border border-slate-700 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-cyan-500 transition-colors"
                >
                  <option value="Quantika POS">Quantika POS (Sistema de Ventas)</option>
                  <option value="Consultoria TI">Consultoría TI / Ciberseguridad / Arquitectura</option>
                  <option value="CodeNexa Academy - SQL Server Básico">CodeNexa Academy - SQL Server Nivel Básico (Q800)</option>
                  <option value="Cursos Especializados">Otro Curso o Consultoría General</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Mensaje o Requerimiento</label>
                <textarea 
                  rows={3}
                  required
                  placeholder="Cuéntanos tus dudas o indícanos que deseas inscribirte..."
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-[#070b12] border border-slate-700 rounded-xl p-4 text-xs text-white outline-none focus:border-cyan-500 resize-none transition-colors"
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-cyan-600/25 transition-all mt-3"
              >
                Enviar Solicitud
              </button>
            </form>
          )}
        </div>
      </section>

      {/* BOTÓN FLOTANTE WHATSAPP + CHAT */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <a 
          href="https://wa.me/50248069299?text=Hola%20CodeNexa,%20estoy%20interesado%20en%20sus%20servicios%20y%20en%20CodeNexa%20Academy."
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-500 hover:bg-emerald-400 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all transform hover:scale-110 text-2xl w-14 h-14"
          aria-label="Abrir WhatsApp"
        >
          💬
        </a>

        {!chatOpen && (
          <button 
            onClick={() => setChatOpen(true)}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all transform hover:scale-110 text-2xl w-16 h-16 border-2 border-white/20 animate-bounce"
            aria-label="Abrir Asistente CodeNexa"
          >
            🤖
          </button>
        )}

        {chatOpen && (
          <div className="bg-[#111827] border border-slate-700 w-80 sm:w-96 h-[480px] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
            <div className="bg-[#070b12] p-4 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></span>
                <span className="font-extrabold text-xs text-white uppercase tracking-wider">Asistente CodeNexa</span>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-slate-400 hover:text-white font-bold text-sm bg-slate-800 w-7 h-7 rounded-full flex items-center justify-center">
                ✕
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${m.sender === 'user' ? 'bg-cyan-600 text-white rounded-br-none shadow' : 'bg-[#070b12] border border-slate-800 text-slate-200 rounded-bl-none shadow'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {loadingChat && (
                <div className="flex justify-start">
                  <div className="bg-[#070b12] border border-slate-800 text-slate-400 p-3 rounded-xl text-[10px] animate-pulse">
                    CodeNexaBot está escribiendo...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-3 bg-[#070b12] border-t border-slate-800 flex gap-2">
              <input 
                type="text"
                placeholder="Pregunta sobre Quantika, cursos, etc..."
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                className="flex-1 bg-[#111827] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-500"
              />
              <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors shadow">
                Enviar
              </button>
            </form>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="mt-auto py-8 border-t border-slate-800/80 text-center text-xs text-slate-500 px-4">
        <p>© {new Date().getFullYear()} CodeNexa — Modernización Tecnológica, Infraestructura y Educación Especializada.</p>
      </footer>

    </div>
  )
}