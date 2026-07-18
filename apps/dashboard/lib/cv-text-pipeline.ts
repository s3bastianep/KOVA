/** Normalización y conversión de texto crudo de HV (sin dependencias de Node). */

const BULLET_CHARS = /^[\s•●▪▫◦‣⁃\-–—*·■□▪︎]+\s*/;

const INLINE_BULLET_SPLIT = /[\u25A0\u25AA\u25AB\u25CF\u25E6\u2022\u2023\u2043●▪▫◦‣⁃■□]+/g;

const SPANISH_MONTHS: Record<string, string> = {
  enero: '01',
  ene: '01',
  febrero: '02',
  feb: '02',
  marzo: '03',
  mar: '03',
  abril: '04',
  abr: '04',
  mayo: '05',
  may: '05',
  junio: '06',
  jun: '06',
  julio: '07',
  jul: '07',
  agosto: '08',
  ago: '08',
  septiembre: '09',
  setiembre: '09',
  sep: '09',
  sept: '09',
  octubre: '10',
  oct: '10',
  noviembre: '11',
  nov: '11',
  diciembre: '12',
  dic: '12',
};

export function htmlToStructuredText(html: string): string {
  const withBreaks = html
    .replace(/<\/p>\s*/gi, '\n\n')
    .replace(/<\/h[1-6]>\s*/gi, '\n\n')
    .replace(/<\/tr>\s*/gi, '\n')
    .replace(/<\/li>\s*/gi, '\n')
    .replace(/<br\s*\/?>\s*/gi, '\n')
    .replace(/<\/div>\s*/gi, '\n');

  const stripped = withBreaks
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));

  return normalizeCvText(stripped);
}

export function normalizeCvText(raw: string): string {
  let text = raw
    .replace(/\r\n/g, '\n')
    .replace(/\u00a0/g, ' ')
    // Convert any bullet glyph into a real line break — never keep ■ / • inside the text.
    .replace(INLINE_BULLET_SPLIT, '\n')
    .replace(/\u2013|\u2014/g, '-')
    .replace(/[\t\f\v]+/g, ' ');

  // Une palabras partidas por guión al final de línea (común en PDF).
  text = text.replace(/([A-Za-zÁÉÍÓÚáéíóúñÑ])-\n([a-záéíóúñ])/g, '$1$2');

  const lines = text.split('\n').map((line) => line.replace(BULLET_CHARS, '').trim());

  const merged: string[] = [];
  for (const line of lines) {
    if (!line) {
      if (merged.length > 0 && merged[merged.length - 1] !== '') merged.push('');
      continue;
    }

    const prev = merged[merged.length - 1];
    // Never glue a name/header line onto contact rows (email, phone, urls) or section titles —
    // PDFs often put the name on its own line and the email right below in lowercase.
    const looksLikeContactOrSection =
      /@|https?:\/\//i.test(line) ||
      /\d{3,}[\s.-]?\d{3,}/.test(line) ||
      /^(experiencia|formaci[oó]n|educaci[oó]n|idiomas?|habilidades|perfil|resumen|contacto|datos)\b/i.test(
        line,
      );
    const continues =
      prev &&
      prev !== '' &&
      !/[.!?:;]$/.test(prev) &&
      line.length < 90 &&
      /^[a-záéíóúñ(]/.test(line) &&
      !looksLikeContactOrSection &&
      !/^\d{4}/.test(line) &&
      !/^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)\b/i.test(
        line,
      );

    if (continues) {
      merged[merged.length - 1] = `${prev} ${line}`;
    } else {
      merged.push(line);
    }
  }

  return merged
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function toLineArray(text: string): string[] {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
}

/**
 * Limpia descripciones de experiencia: sin iconos/viñetas, una idea por línea,
 * legible en el textarea del candidato.
 */
export function formatWorkDescription(raw: string, maxLen = 1200): string {
  if (!raw?.trim()) return '';

  const cleaned = raw
    .replace(/\r\n/g, '\n')
    .replace(INLINE_BULLET_SPLIT, '\n')
    .replace(/^[ \t]*[-–—*·]+[ \t]*/gm, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const lines = cleaned
    .split(/\n+/)
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter((line) => line.length > 1);

  // If everything was one long paragraph without breaks, split on sentence ends
  // that look like consecutive achievements (". " + capital letter).
  const expanded =
    lines.length <= 1 && cleaned.length > 180
      ? cleaned
          .split(/(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÑ¡¿])/)
          .map((s) => s.trim())
          .filter(Boolean)
      : lines;

  return expanded.join('\n\n').slice(0, maxLen).trim();
}

export function parseSpanishMonthToken(token: string): string | null {
  const key = token.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return SPANISH_MONTHS[key] ?? null;
}

export function isCurrentDateToken(token: string): boolean {
  return /^(actual(?:idad)?|presente?|hoy|current|now|al\s+presente)$/i.test(token.trim());
}
