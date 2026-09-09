import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, service, message } = await request.json();

    // Validar campos mínimos
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    // Envío del correo
    const data = await resend.emails.send({
     from: 'CodeNexa Web <onboarding@resend.dev>',
      to: ['codenexaacademy@gmail.com'], // <--- AQUÍ PON TU CORREO PERSONAL DONDE QUIERES RECIBIR LAS ALERTAS
      subject: `Nueva Solicitud de Servicio: ${service} - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
          <h2 style="color: #0082b4;">🚀 Nuevo Lead desde CodeNexa.net</h2>
          <p>Has recibido una nueva solicitud de contacto a través del sitio web:</p>
          <hr style="border: none; border-top: 1px solid #ddd;" />
          <p><strong>👤 Nombre:</strong> ${name}</p>
          <p><strong>📧 Correo:</strong> ${email}</p>
          <p><strong>🛠️ Servicio de Interés:</strong> ${service}</p>
          <p><strong>💬 Mensaje:</strong></p>
          <blockquote style="background: #fff; padding: 10px; border-left: 4px solid #0082b4; margin: 0;">
            ${message}
          </blockquote>
          <hr style="border: none; border-top: 1px solid #ddd;" />
          <p style="font-size: 12px; color: #777;">Este mensaje fue enviado automáticamente desde el formulario de tu sitio web.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: 'Error al enviar el correo' }, { status: 500 });
  }
}