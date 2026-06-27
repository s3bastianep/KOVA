export async function submitEarlyAccess(form) {
  const apiUrl = import.meta.env.VITE_EARLY_ACCESS_API_URL;

  if (!apiUrl) {
    throw new Error('El formulario aún no está conectado a un backend. Configura VITE_EARLY_ACCESS_API_URL.');
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });

  if (!response.ok) {
    throw new Error('No pudimos enviar tu solicitud. Intenta de nuevo en unos minutos.');
  }
}
