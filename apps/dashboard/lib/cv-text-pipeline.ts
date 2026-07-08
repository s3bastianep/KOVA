/** Normalización y conversión de texto crudo de HV (sin dependencias de Node). */

const BULLET_CHARS = /^[\s•●▪▫◦‣⁃\-–—*·]+\s*/;

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
    .replace(/\u2022/g, '\n• ')
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
    const continues =
      prev &&
      prev !== '' &&
      !/[.!?:;]$/.test(prev) &&
      line.length < 90 &&
      /^[a-záéíóúñ(]/.test(line) &&
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

export function parseSpanishMonthToken(token: string): string | null {
  const key = token.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return SPANISH_MONTHS[key] ?? null;
}

export function isCurrentDateToken(token: string): boolean {
  return /^(actual(?:idad)?|presente?|hoy|current|now|al\s+presente)$/i.test(token.trim());
}
