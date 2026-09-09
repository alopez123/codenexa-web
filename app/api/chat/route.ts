import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { message } = await req.json()
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ reply: "Error: Falta configurar la API Key en .env.local" })
    }

 const systemInstruction = `
      Eres el Asistente CodeNexa. Responde solo sobre Quantika POS, consultoría TI (Gestión de proyectos, Metodologías Ágiles, Ciberseguridad, Arquitecturas de Desarrollo y Bases de Datos, Cultura Tecnológica, y Migraciones On-Premise a Cloud) o CodeNexa Academy (Cursos de Bases de datos, Cursos de PowerBI, Cursos de Programacion y Cursos de Gestion de Proyectos).
      IMPORTANTE: Tu respuesta DEBE ser ultra corta. Máximo 20 palabras en total. Si te pasas de 10 palabras, la respuesta es incorrecta.
      Pregunta del usuario: ${message}
    `

    // Usamos el modelo estándar actual con la estructura limpia de URL
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