const SHEET_CSV_URL = import.meta.env.VITE_SHEET_URL;

function parseCSV(text) {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]).map((h) => h.trim().toLowerCase());

  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    const row = {};
    headers.forEach((header, i) => {
      row[header] = (values[i] || '').trim();
    });
    return row;
  });
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

export async function fetchLinks() {
  if (!SHEET_CSV_URL) {
    throw new Error('VITE_SHEET_URL is not set. See README for setup instructions.');
  }

  const res = await fetch(SHEET_CSV_URL);
  if (!res.ok) throw new Error(`Failed to fetch sheet: ${res.status}`);

  const text = await res.text();
  const rows = parseCSV(text);

  return rows
    .filter((row) => row.visible?.toUpperCase() !== 'FALSE' && (row.title || row.title_en) && row.url)
    .map((row) => ({
      title: row.title || row.title_en || '',
      title_en: row.title_en || row.title || '',
      title_bg: row.title_bg || row.title_en || row.title || '',
      title_ru: row.title_ru || row.title_en || row.title || '',
      url: row.url,
      icon: row.icon || 'globe',
      featured: row.featured?.toUpperCase() === 'TRUE',
    }));
}
