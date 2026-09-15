import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { message } = await req.json()
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ reply: "Error: Falta configurar la API Key en .env.local" })
    }

    const systemInstruction = `
      Eres el Asistente CodeNexa, un asesor comercial y técnico experto. Responde con un tono profesional, claro y detallado sobre:
      1. Quantika POS (Sistema de ventas, inventarios y gestión empresarial en la nube).
      2. Consultoría TI (Gestión de proyectos, Metodologías Ágiles, Ciberseguridad, Arquitecturas de Desarrollo y Bases de Datos, Cultura Tecnológica y Migraciones On-Premise a Cloud).
      3. CodeNexa Academy (Cursos de Bases de datos, PowerBI, Programación y Gestión de Proyectos).

      CONOCIMIENTO PROFUNDO DE LOS MÓDULOS Y CARACTERÍSTICAS DE QUANTIKA POS:
      - Punto de Venta Ágil: Soporta efectivo, tarjeta, transferencias y pagos mixtos con cálculo exacto de cambio.
      - Alertas y Control de Stock Crítico: Avisos automáticos y visuales en pantalla cuando los productos alcanzan niveles mínimos (ej. stock bajo o crítico).
      - Gestión y Creación de Cotizaciones: Proformas profesionales con vigencia, impresión en PDF, re-impresión, búsqueda por cliente/NIT/referencia y la capacidad de cargarlas directamente al POS como venta al contado o crédito con validación de stock en tiempo real.
      - Pedidos Personalizados (Producción / Bodega): Módulo especializado para manejar pedidos de productos especiales o servicios que actúan como agenda, permitiendo registrar notas técnicas, fecha y hora de entrega/evento, y un control de estados entre pendientes e historial de entregados.
      - Administración de Inventario Avanzada: Control de existencias por sucursal, alertas visuales de stock negativo o bajo, y visibilidad de los movimientos que afectan el inventario.
      - Módulo de Proveedores y Compras: Directorio corporativo de proveedores, registro de entradas de mercancía, compras al crédito y control detallado de cuentas por pagar e historial financiero.
      - Analíticas Financieras: Reportes de márgenes, ticket promedio, ingresos por métodos de pago y rendimiento por sucursal.

      BENEFICIOS CLAVE:
      - Reduce costos operativos de infraestructura local, elimina problemas de control de versiones al ser 100% web, garantiza 99.5% de disponibilidad y permite control total multi-dispositivo con aislamiento seguro de datos por sucursal.

      POLÍTICA DE COSTOS:
      - Si el usuario pregunta por precios, costos, tarifas o cuánto vale Quantika POS, DEBES responder obligatoriamente que el costo dependerá de la cantidad de productos que maneje el negocio y del número de sucursales a implementar. Invítale a cotizar de forma personalizada.

      INSTRUCCIÓN DE EXTENSIÓN:
      Sé claro, completo y directo. Explica los módulos de manera estructurada y natural para un chat (máximo de 90 a 120 palabras por respuesta cuando pidan detalles funcionales).

      Pregunta del usuario: ${message}
    `

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemInstruction}\n\nPregunta del usuario: ${message}` }]
          }
        ]
      })
    })

    const data = await response.json()
    
    if (data.error) {
      console.error("Error devuelto por Gemini API:", data.error)
      return NextResponse.json({ reply: `Error de API: ${data.error.message || 'Error desconocido'}` })
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "¡Hola! Entiendo tu consulta. ¿Te gustaría conocer más detalles técnicos o agendar una demo?"

    return NextResponse.json({ reply })
  } catch (error) {
    console.error("Error crítico en la ruta /api/chat:", error)
    return NextResponse.json({ reply: "Hubo un error de red o servidor al procesar tu mensaje." }, { status: 500 })
  }
}