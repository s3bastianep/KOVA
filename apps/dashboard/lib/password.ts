/**
 * Política de contraseñas compartida (registro + cambio de contraseña).
 *
 * Sigue la línea de NIST 800-63B: longitud mínima + lista de contraseñas
 * comunes, sin reglas de composición arbitrarias (mayúscula/símbolo obligatorio)
 * que solo producen "Password1!". El hash es siempre bcrypt factor 12; este
 * módulo solo decide qué contraseñas se aceptan ANTES de hashear.
 */

const MIN_LENGTH = 8;
const MAX_LENGTH = 128;

/** Contraseñas más usadas (universales + hispanas + derivadas de la marca). */
const COMMON_PASSWORDS = new Set([
  '12345678', '123456789', '1234567890', '87654321', '11111111', '00000000',
  'password', 'password1', 'password123', 'passw0rd', 'p4ssword',
  'contraseña', 'contrasena', 'contrasena1', 'clave1234',
  'qwerty123', 'qwertyuiop', 'asdfghjk', 'asdfghjkl', 'zxcvbnm1',
  'abc12345', 'abcd1234', 'a1b2c3d4', '1q2w3e4r', '1qaz2wsx',
  'iloveyou', 'sunshine', 'football', 'superman', 'whatever',
  'colombia', 'colombia1', 'bogota123', 'medellin',
  'kova2026', 'kova1234', 'kovakova',
  'litthunter', 'litthunter1', 'litthunter2026',
  'welcome1', 'letmein1', 'admin123', 'admin1234', 'usuario1',
]);

/**
 * Devuelve un mensaje de error listo para el usuario, o null si la contraseña
 * es aceptable. `context` permite rechazar contraseñas iguales al correo o
 * al nombre de quien se registra.
 */
export function passwordPolicyError(
  password: string,
  context: { email?: string; nombre?: string } = {},
): string | null {
  if (password.length < MIN_LENGTH) {
    return 'La contraseña debe tener al menos 8 caracteres';
  }
  if (password.length > MAX_LENGTH) {
    return 'La contraseña es demasiado larga (máximo 128 caracteres)';
  }

  const normalized = password.toLowerCase();

  if (COMMON_PASSWORDS.has(normalized)) {
    return 'Esa contraseña es demasiado común. Elige una más difícil de adivinar.';
  }

  // Un solo carácter repetido ("aaaaaaaa") o secuencia trivial del teclado.
  if (/^(.)\1+$/.test(password)) {
    return 'La contraseña no puede ser un solo carácter repetido.';
  }

  const email = context.email?.trim().toLowerCase();
  if (email) {
    const localPart = email.split('@')[0];
    if (normalized === email || (localPart.length >= MIN_LENGTH && normalized === localPart)) {
      return 'La contraseña no puede ser igual a tu correo.';
    }
  }

  const nombre = context.nombre?.trim().toLowerCase();
  if (nombre && nombre.length >= MIN_LENGTH && normalized === nombre.replace(/\s+/g, '')) {
    return 'La contraseña no puede ser igual a tu nombre.';
  }

  return null;
}
