'use client'

import { useState } from 'react'

export default function CodeNexaHome() {
  const [formData, setFormData] = useState({ name: '', email: '', service: 'Quantika POS', message: '' })
  const [sent, setSent] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  // Estados actualizados para el Asistente CodeNexa con IA
  const [chatOpen, setChatOpen] = useState(false)
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '¡Hola! Soy el Asistente CodeNexa ¿En qué te puedo ayudar hoy? Ya sea sobre Quantika POS, nuestras consultorías en seguridad/bases de datos o los cursos de la academia.' }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [loadingChat, setLoadingChat] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
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
      icon: "💎",
      title: "Top de Artículos y Rentabilidad",
      desc: "Identifica instantáneamente los 5 productos más vendidos por volumen y los 5 artículos que generan mayor margen de ganancia neta para tu negocio."
    },
    {
      icon: "🛡️",
      title: "Seguridad y Roles por Usuario",
      desc: "Gestión de permisos diferenciados para administradores, gerentes y cajeros respaldados por una arquitectura robusta en Supabase."
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
      q: "¿Cómo se calculan las analíticas financieras, márgenes y ticket promedio?",
      steps: [
        "El motor de analíticas procesa en tiempo real las ventas netas excluyendo estados pendientes o cancelados.",
        "Calcula de forma automática el ticket promedio por transacción y el margen bruto estimado del negocio.",
        "Genera una línea de tendencia mensual y desglosa los días de la semana con mayor volumen de ventas."
      ]
    },
    {
      q: "¿Cómo se gestiona el inventario, stock crítico y los artículos más rentables?",
      steps: [
        "El sistema monitorea en tiempo real los niveles de existencia de cada producto por sucursal.",
        "Identifica automáticamente los productos con stock crítico (menor o igual a 3 unidades) para alertar reabastecimientos.",
        "Muestra el Top 5 de artículos más vendidos por cantidad y los 5 con mayor margen de ganancia."
      ]
    },
    {
      q: "¿Cómo maneja Quantika POS las cuentas por cobrar y cuentas por pagar?",
      steps: [
        "Registra de manera automática las ventas a crédito o con saldos pendientes como cuentas por cobrar.",
        "Lleva el control de las compras a proveedores y facturas pendientes en el módulo de cuentas por pagar.",
        "Permite visualizar el estado financiero global de pasivos y créditos directamente desde el dashboard."
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col font-sans notranslate selection:bg-emerald-500 selection:text-white" translate="no">
      
      {/* NAVBAR RESPONSIVE */}
      <header className="max-w-7xl mx-auto w-full p-4 md:px-8 flex justify-between items-center border-b border-slate-800 sticky top-0 bg-[#0f172a]/95 backdrop-blur z-50">
        
        <button 
          onClick={scrollToTop}
          className="flex items-center gap-2 cursor-pointer focus:outline-none group text-left"
        >
          <span className="text-lg md:text-xl font-black tracking-wider text-emerald-400 group-hover:opacity-90 transition-opacity">
            CODE<span className="text-white">NEXA</span>
          </span>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold border border-emerald-500/30">
            .NET
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300 relative">
          
          {/* SUBMENÚ PADRE: QUANTIKA POS */}
          <div className="relative group" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 hover:text-emerald-400 transition-colors py-2"
            >
              Quantika POS <span className="text-[10px]">▼</span>
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 w-48 bg-[#1e293b] border border-slate-700 rounded-xl shadow-xl py-2 flex flex-col z-50">
                <a href="#caracteristicas" className="px-4 py-2 hover:bg-slate-700/60 hover:text-emerald-400 text-xs transition-colors">
                  ⚡ Características
                </a>
                <a href="#ventajas" className="px-4 py-2 hover:bg-slate-700/60 hover:text-emerald-400 text-xs transition-colors">
                  🎯 Ventajas
                </a>
                <a href="#ayuda" className="px-4 py-2 hover:bg-slate-700/60 hover:text-emerald-400 text-xs transition-colors">
                  📖 Guía Operativa
                </a>
              </div>
            )}
          </div>

          <a href="#consultoria" className="hover:text-emerald-400 transition-colors">Consultoría TI</a>
          <a href="#cursos" className="hover:text-emerald-400 transition-colors">Cursos</a>
          <a href="#contacto" className="hover:text-emerald-400 transition-colors">Contacto</a>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a 
            href="#contacto"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-lg text-xs shadow-lg transition-colors"
          >
            Cotizar Servicio
          </a>
        </div>

        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-slate-800 text-emerald-400 border border-slate-700 text-lg font-bold"
          aria-label="Abrir menú"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </header>

      {/* Menú Móvil */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1e293b] border-b border-slate-700 p-5 flex flex-col space-y-3 text-xs font-bold animate-fadeIn z-40">
          <div className="text-emerald-400 font-extrabold pb-1 border-b border-slate-700">Quantika POS</div>
          <a href="#caracteristicas" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-emerald-400 pl-3 py-1">⚡ Características</a>
          <a href="#ventajas" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-emerald-400 pl-3 py-1">🎯 Ventajas</a>
          <a href="#ayuda" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-emerald-400 pl-3 py-1">📖 Guía Operativa</a>
          
          <div className="pt-2 border-t border-slate-700 space-y-3">
            <a href="#consultoria" onClick={() => setMobileMenuOpen(false)} className="text-slate-200 hover:text-emerald-400 block py-1">🛡️ Consultoría TI & Hardening</a>
            <a href="#cursos" onClick={() => setMobileMenuOpen(false)} className="text-slate-200 hover:text-emerald-400 block py-1">📚 Cursos Especializados</a>
            <a href="#contacto" onClick={() => setMobileMenuOpen(false)} className="text-slate-200 hover:text-emerald-400 block py-1">✉️ Contacto</a>
            <a href="#contacto" onClick={() => setMobileMenuOpen(false)} className="bg-emerald-600 text-white text-center block py-2.5 rounded-lg shadow mt-2">Cotizar Servicio</a>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="relative max-w-6xl mx-auto w-full px-4 sm:px-6 py-16 md:py-28 text-center flex flex-col items-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <span className="bg-emerald-500/10 text-emerald-400 text-[11px] sm:text-xs font-bold uppercase tracking-widest px-3 sm:px-3.5 py-1.5 rounded-full border border-emerald-500/20 mb-6 flex items-center gap-2 text-center relative z-10">
          ⚡ Ingeniería, Software y Educación Tecnológica
        </span>
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tight leading-tight max-w-5xl mb-6 relative z-10">
          Impulsamos tu Empresa con <span className="text-emerald-400">Software</span>, <span className="text-blue-400">Consultoría</span> y <span className="text-purple-400">Talento</span>
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm md:text-base max-w-2xl md:max-w-3xl mb-8 md:mb-10 leading-relaxed px-2 relative z-10">
          Soluciones tecnológicas corporativas con Quantika POS, arquitectura de bases de datos de misión crítica, hardening de seguridad y capacitación técnica especializada.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3.5 w-full sm:w-auto px-6 relative z-10">
          <a 
            href="#caracteristicas" 
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-6 md:px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-xl transition-all text-center"
          >
            Ver Características
          </a>
          <a 
            href="#ventajas" 
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-6 md:px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider border border-slate-700 transition-colors text-center"
          >
            Ver Ventajas
          </a>
        </div>
      </section>

      {/* SECCIÓN 1: PRODUCTOS (QUANTIKA POS) */}
      <section id="productos" className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-16 md:py-20 border-t border-slate-800/80">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12 bg-[#1e293b] border border-slate-700/80 rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl">
          <div className="max-w-xl w-full">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Plataforma Estrella</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mt-2 mb-4">Quantika POS</h2>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed mb-6">
              El sistema definitivo de punto de venta y gestión de negocios. Controla inventarios críticos, múltiples sucursales con aislamiento seguro, cajas, pedidos personalizados y analíticas financieras en tiempo real.
            </p>
            <ul className="space-y-2 text-xs text-slate-300 mb-8">
              <li className="flex items-center gap-2">✅ Ventas ágiles (Efectivo, Tarjeta, Transferencia, Mixto)</li>
              <li className="flex items-center gap-2">✅ Panel gerencial con márgenes y ticket promedio</li>
              <li className="flex items-center gap-2">✅ Gestión de cuentas por cobrar y por pagar</li>
            </ul>
            <div className="flex flex-wrap gap-3">
              <a 
                href="#caracteristicas"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-lg transition-colors text-center"
              >
                Características
              </a>
              <a 
                href="#ventajas"
                className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors text-center"
              >
                Ver Ventajas
              </a>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 bg-[#0f172a] border border-slate-700 rounded-2xl p-4 shadow-xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent pointer-events-none"></div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">quantika-pos-dashboard.app</span>
            </div>
            
            <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-900 aspect-video relative flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" 
                alt="Quantika POS Dashboard Preview" 
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-4 text-center">
                <span className="text-xs font-bold text-emerald-400 bg-black/60 px-3 py-1 rounded-full border border-emerald-500/30 mb-1">Interfaz en Tiempo Real</span>
                <p className="text-[11px] text-slate-200">Analíticas de ventas, control de caja e inventarios centralizados.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN: CARACTERÍSTICAS PRINCIPALES */}
      <section id="caracteristicas" className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-16 md:py-20 border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Potencia Operativa</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mt-2 mb-3">Características Principales de Quantika POS</h2>
          <p className="text-slate-400 text-xs md:text-sm">Diseñado para ofrecer máxima velocidad, control financiero y seguridad en cada sucursal.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuresList.map((feat, idx) => (
            <div key={idx} className="bg-[#1e293b] border border-slate-700/80 p-6 rounded-2xl shadow-md hover:border-emerald-500/50 transition-all flex flex-col justify-between">
              <div>
                <span className="text-3xl mb-4 block">{feat.icon}</span>
                <h3 className="font-bold text-sm text-white mb-2">{feat.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{feat.desc}</p>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mt-6 pt-3 border-t border-slate-700/50">Módulo Integrado</span>
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN: VENTAJAS DE QUANTIKA POS */}
      <section id="ventajas" className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-16 md:py-20 border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Optimización Cloud</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mt-2 mb-3">Ventajas Competitivas</h2>
          <p className="text-slate-400 text-xs md:text-sm">Por qué elegir Quantika POS transforma la rentabilidad y eficiencia de tu negocio.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ventajasList.map((v, idx) => (
            <div key={idx} className="bg-[#1e293b] border border-slate-700/80 p-6 rounded-2xl shadow-md hover:border-emerald-500/50 transition-all flex flex-col justify-between">
              <div>
                <span className="text-emerald-400 font-black text-lg mb-3 block font-mono">[{v.num}]</span>
                <h3 className="font-bold text-sm text-white mb-2">{v.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{v.desc}</p>
              </div>
              <span className="text-[9px] bg-emerald-500/10 text-emerald-400 py-1 px-2 rounded font-bold uppercase tracking-wider mt-6 w-max">Ventajas Cloud</span>
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN: GUÍA OPERATIVA */}
      <section id="ayuda" className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-16 md:py-20 border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Base de Conocimiento</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mt-2 mb-3">Guía y Preguntas Frecuentes de Quantika POS</h2>
          <p className="text-slate-400 text-xs md:text-sm">Todo lo que necesitas saber sobre la operación, sucursales, cobros y analíticas de tu sistema de ventas.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index
            return (
              <div 
                key={index} 
                className="bg-[#1e293b] border border-slate-700/80 rounded-2xl overflow-hidden transition-all shadow-md"
              >
                <button 
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-left flex justify-between items-center gap-4 text-xs sm:text-sm font-bold text-slate-200 hover:text-emerald-400 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-bold">?</span>
                    {faq.q}
                  </span>
                  <span className="text-emerald-400 text-base">{isOpen ? '−' : '+'}</span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 border-t border-slate-700/50 bg-[#162032] text-xs text-slate-300 space-y-2.5 animate-fadeIn">
                    <p className="font-bold text-emerald-400 uppercase tracking-wider text-[10px] mb-2">Funcionamiento en Quantika POS:</p>
                    {faq.steps.map((step, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-2.5">
                        <span className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5">{sIdx + 1}</span>
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

      {/* SECCIÓN 3: ASESORÍAS Y CONSULTORÍAS TECNOLÓGICAS */}
      <section id="consultoria" className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-16 md:py-20 border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Expertise Técnico</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mt-2 mb-3">Asesorías y Consultorías de Alto Impacto</h2>
          <p className="text-slate-400 text-xs md:text-sm">Soluciones avanzadas para blindar, escalar y modernizar la infraestructura tecnológica de tu organización.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1e293b] rounded-2xl border border-slate-700 overflow-hidden shadow-md flex flex-col">
            <div className="h-40 overflow-hidden relative">
              <img src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80" alt="Hardening" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b] to-transparent"></div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm text-white mb-2 flex items-center gap-2">🛡️ Hardening & Ciberseguridad</h3>
                <p className="text-slate-400 text-xs leading-relaxed">Auditorías de seguridad, endurecimiento de servidores, pentesting y protección de APIs contra vulnerabilidades críticas.</p>
              </div>
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mt-4">Infraestructura Blindada</span>
            </div>
          </div>

          <div className="bg-[#1e293b] rounded-2xl border border-slate-700 overflow-hidden shadow-md flex flex-col">
            <div className="h-40 overflow-hidden relative">
              <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80" alt="Bases de Datos" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b] to-transparent"></div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm text-white mb-2 flex items-center gap-2">🗄️ Bases de Datos & Data Warehouse</h3>
                <p className="text-slate-400 text-xs leading-relaxed">Optimización de consultas complejas (SQL Server), diseño de arquitectura de datos, migración y analítica de alto rendimiento.</p>
              </div>
              <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider mt-4">Alto Rendimiento</span>
            </div>
          </div>

          <div className="bg-[#1e293b] rounded-2xl border border-slate-700 overflow-hidden shadow-md flex flex-col">
            <div className="h-40 overflow-hidden relative">
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80" alt="Desarrollo" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b] to-transparent"></div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm text-white mb-2 flex items-center gap-2">💻 Modernización & Desarrollo</h3>
                <p className="text-slate-400 text-xs leading-relaxed">Actualización de sistemas legados, arquitecturas de software eficientes y desarrollo de soluciones corporativas escalables.</p>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mt-4">Soluciones a Medida</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 4: CURSOS Y CAPACITACIÓN */}
      <section id="cursos" className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-16 md:py-20 border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">CodeNexa Academy</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mt-2 mb-3">Cursos Especializados</h2>
          <p className="text-slate-400 text-xs md:text-sm">Domina las herramientas y tecnologías más demandadas en el mercado laboral actual con instrucción práctica.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#1e293b] border border-slate-700 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all flex flex-col">
            <div className="h-32 overflow-hidden relative">
              <img src="https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=500&q=80" alt="SQL Server" className="w-full h-full object-cover" />
            </div>
            <div className="p-4 text-center flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-xs text-white mb-1">Bases de Datos & SQL Server</h3>
                <p className="text-[10px] text-slate-400">Administración y optimización avanzada</p>
              </div>
              <span className="text-[9px] bg-purple-500/20 text-purple-400 py-1 px-2 rounded font-bold mt-3">Inscripciones Abiertas</span>
            </div>
          </div>

          <div className="bg-[#1e293b] border border-slate-700 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all flex flex-col">
            <div className="h-32 overflow-hidden relative">
              <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&q=80" alt="Power BI" className="w-full h-full object-cover" />
            </div>
            <div className="p-4 text-center flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-xs text-white mb-1">Power BI & Analítica</h3>
                <p className="text-[10px] text-slate-400">Visualización y Business Intelligence</p>
              </div>
              <span className="text-[9px] bg-purple-500/20 text-purple-400 py-1 px-2 rounded font-bold mt-3">Inscripciones Abiertas</span>
            </div>
          </div>

          <div className="bg-[#1e293b] border border-slate-700 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all flex flex-col">
            <div className="h-32 overflow-hidden relative">
              <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=500&q=80" alt="Full-Stack" className="w-full h-full object-cover" />
            </div>
            <div className="p-4 text-center flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-xs text-white mb-1">Programación Full-Stack</h3>
                <p className="text-[10px] text-slate-400">Desarrollo de aplicaciones modernas</p>
              </div>
              <span className="text-[9px] bg-purple-500/20 text-purple-400 py-1 px-2 rounded font-bold mt-3">Inscripciones Abiertas</span>
            </div>
          </div>

          <div className="bg-[#1e293b] border border-slate-700 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all flex flex-col">
            <div className="h-32 overflow-hidden relative">
              <img src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=500&q=80" alt="Infraestructura" className="w-full h-full object-cover" />
            </div>
            <div className="p-4 text-center flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-xs text-white mb-1">Computación & Infraestructura</h3>
                <p className="text-[10px] text-slate-400">Fundamentos y redes corporativas</p>
              </div>
              <span className="text-[9px] bg-purple-500/20 text-purple-400 py-1 px-2 rounded font-bold mt-3">Inscripciones Abiertas</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN DE CONTACTO GENERAL */}
      <section id="contacto" className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-16 md:py-20">
        <div className="bg-[#1e293b] border border-slate-700 p-6 sm:p-8 md:p-12 rounded-3xl shadow-2xl relative">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">Inicia un Proyecto o Contáctanos</h2>
            <p className="text-slate-400 text-xs md:text-sm">¿Interesado en Quantika POS, consultoría técnica o nuestros cursos? Escríbenos.</p>
          </div>

          {sent ? (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-6 rounded-xl text-center text-sm font-bold">
              ¡Mensaje enviado con éxito! Nos pondremos en contacto contigo a la brevedad posible.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Nombre Completo</label>
                <input 
                  type="text" 
                  required
                  placeholder="Tu nombre"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-[#0f172a] border border-slate-600 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Correo Electrónico</label>
                <input 
                  type="email" 
                  required
                  placeholder="tucorreo@empresa.com"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-[#0f172a] border border-slate-600 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Servicio de Interés</label>
                <select 
                  value={formData.service}
                  onChange={e => setFormData({...formData, service: e.target.value})}
                  className="w-full bg-[#0f172a] border border-slate-600 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-emerald-500"
                >
                  <option value="Quantika POS">Quantika POS (Sistema de Ventas)</option>
                  <option value="Consultoria TI">Consultoría TI / Hardening / Arquitectura</option>
                  <option value="Bases de Datos & DataWarehouse">Bases de Datos & Data Warehouse</option>
                  <option value="Cursos Especializados">Cursos (SQL, Power BI, Programación)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Mensaje o Requerimiento</label>
                <textarea 
                  rows={3}
                  required
                  placeholder="Cuéntanos sobre tu proyecto o duda..."
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-[#0f172a] border border-slate-600 rounded-xl p-4 text-xs text-white outline-none focus:border-emerald-500 resize-none"
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider shadow-lg transition-all mt-2"
              >
                Enviar Solicitud
              </button>
            </form>
          )}
        </div>
      </section>

      {/* BOTÓN FLOTANTE MODERNO (WHATSAPP + ASISTENTE CODENEXA) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Botón rápido de WhatsApp corporativo */}
        <a 
          href="https://wa.me/?text=Hola%20CodeNexa,%20estoy%20interesado%20en%20sus%20servicios%20y%20en%20Quantika%20POS."
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-500 hover:bg-emerald-400 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all transform hover:scale-110 text-2xl w-14 h-14"
          aria-label="Abrir WhatsApp"
        >
          💬
        </a>

        {/* Botón grande y moderno para abrir el Chat IA */}
        {!chatOpen && (
          <button 
            onClick={() => setChatOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all transform hover:scale-110 text-2xl w-16 h-16 border-2 border-white/20 animate-bounce"
            aria-label="Abrir Asistente CodeNexa"
          >
            🤖
          </button>
        )}

        {/* VENTANA DEL CHAT CON IA */}
        {chatOpen && (
          <div className="bg-[#1e293b] border border-slate-700 w-80 sm:w-96 h-[480px] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
            <div className="bg-[#0f172a] p-4 border-b border-slate-700 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-extrabold text-xs text-white uppercase tracking-wider">Asistente CodeNexa</span>
              </div>
              <button 
                onClick={() => setChatOpen(false)}
                className="text-slate-400 hover:text-white font-bold text-sm bg-slate-800 w-7 h-7 rounded-full flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${m.sender === 'user' ? 'bg-emerald-600 text-white rounded-br-none shadow' : 'bg-[#0f172a] border border-slate-700 text-slate-200 rounded-bl-none shadow'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {loadingChat && (
                <div className="flex justify-start">
                  <div className="bg-[#0f172a] border border-slate-700 text-slate-400 p-3 rounded-xl text-[10px] animate-pulse">
                    CodeNexaBot está escribiendo...
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 bg-[#0f172a] border-t border-slate-700 flex gap-2">
              <input 
                type="text"
                placeholder="Pregunta sobre Quantika, cursos, etc..."
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                className="flex-1 bg-[#1e293b] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-emerald-500"
              />
              <button 
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors shadow"
              >
                Enviar
              </button>
            </form>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="mt-auto py-8 border-t border-slate-800 text-center text-xs text-slate-500 px-4">
        <p>© {new Date().getFullYear()} CodeNexa — Innovación, Infraestructura y Educación Tecnológica.</p>
      </footer>

    </div>
  )
}