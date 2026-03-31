import { Redis } from '@upstash/redis';

export default async function handler(req, res) {
  const hasUrl = !!process.env.KV_REST_API_URL;
  const hasToken = !!process.env.KV_REST_API_TOKEN;

  if (!hasUrl || !hasToken) {
    return res.status(200).json({
      status: 'missing_env_vars',
      KV_REST_API_URL: hasUrl,
      KV_REST_API_TOKEN: hasToken,
    });
  }

  const redis = new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  });

  // POST — import leads
  if (req.method === 'POST') {
    try {
      const { leads } = req.body || {};
      if (!Array.isArray(leads) || leads.length === 0) {
        return res.status(400).json({ error: 'Provide a "leads" array' });
      }
      for (const lead of leads) {
        await redis.lpush('wheel_leads', JSON.stringify(lead));
        if (lead.email) {
          await redis.set(`wheel_email:${lead.email.toLowerCase().trim()}`, lead.prize || 'imported');
        }
      }
      return res.status(200).json({ status: 'ok', imported: leads.length });
    } catch (err) {
      return res.status(500).json({ status: 'error', message: err.message });
    }
  }

  // GET ?format=csv — download as CSV
  if (req.query.format === 'csv') {
    try {
      const all = await getAllLeads(redis);
      const header = 'Name,Email,Phone,Company,Prize,Notes,Timestamp';
      const rows = all.map((l) => {
        const row = [l.name, l.email, l.phone, l.company, l.prize, l.notes, l.timestamp];
        return row.map((v) => `"${(v || '').replace(/"/g, '""')}"`).join(',');
      });
      const csv = [header, ...rows].join('\n');
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename=marbella-leads-${new Date().toISOString().slice(0,10)}.csv`);
      return res.status(200).send(csv);
    } catch (err) {
      return res.status(500).json({ status: 'error', message: err.message });
    }
  }

  // GET — serve dashboard HTML
  try {
    const all = await getAllLeads(redis);
    const html = buildDashboard(all);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
}

async function getAllLeads(redis) {
  const count = await redis.llen('wheel_leads');
  if (count === 0) return [];
  const raw = await redis.lrange('wheel_leads', 0, count - 1);
  return raw.map((entry) => {
    if (typeof entry === 'string') {
      try { return JSON.parse(entry); } catch { return { notes: entry }; }
    }
    return entry;
  });
}

function buildDashboard(leads) {
  const total = leads.length;
  const today = new Date().toISOString().slice(0, 10);
  const todayCount = leads.filter((l) => l.timestamp && l.timestamp.startsWith(today)).length;

  const rows = leads.map((l, i) => `
    <tr>
      <td>${total - i}</td>
      <td>${esc(l.name)}</td>
      <td><a href="mailto:${esc(l.email)}">${esc(l.email)}</a></td>
      <td>${esc(l.phone)}</td>
      <td>${esc(l.company)}</td>
      <td><span class="prize-tag">${esc(l.prize)}</span></td>
      <td>${esc(l.notes)}</td>
      <td>${formatDate(l.timestamp)}</td>
    </tr>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Marbella Leads Dashboard</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #f7f6f4;
      color: #222;
      min-height: 100vh;
    }
    .header {
      background: #222;
      color: #f7f6f4;
      padding: 32px 40px;
    }
    .header h1 {
      font-family: 'Montserrat', sans-serif;
      font-size: 1.3rem;
      font-weight: 600;
      letter-spacing: 1px;
      margin-bottom: 4px;
    }
    .header p {
      font-size: 0.75rem;
      opacity: 0.5;
      font-weight: 300;
    }
    .stats {
      display: flex;
      gap: 16px;
      padding: 24px 40px;
    }
    .stat-card {
      background: #fff;
      border: 1px solid #e8e6e2;
      border-radius: 12px;
      padding: 20px 24px;
      min-width: 140px;
    }
    .stat-card .num {
      font-size: 1.8rem;
      font-weight: 700;
      color: #222;
    }
    .stat-card .label {
      font-size: 0.7rem;
      color: #6b6560;
      font-weight: 400;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-top: 4px;
    }
    .actions {
      padding: 0 40px 24px;
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 18px;
      border: 1px solid #e8e6e2;
      border-radius: 8px;
      background: #fff;
      color: #222;
      font-family: inherit;
      font-size: 0.78rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s;
      text-decoration: none;
    }
    .btn:hover { border-color: #222; }
    .btn-primary {
      background: #222;
      color: #f7f6f4;
      border-color: #222;
    }
    .btn-primary:hover { opacity: 0.85; }
    .table-wrap {
      padding: 0 40px 40px;
      overflow-x: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      background: #fff;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #e8e6e2;
      font-size: 0.8rem;
    }
    th {
      background: #fafaf8;
      padding: 12px 16px;
      text-align: left;
      font-size: 0.68rem;
      font-weight: 600;
      color: #6b6560;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      border-bottom: 1px solid #e8e6e2;
      white-space: nowrap;
    }
    td {
      padding: 11px 16px;
      border-bottom: 1px solid #f0efed;
      vertical-align: middle;
    }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: #fafaf8; }
    td a {
      color: #c25b41;
      text-decoration: none;
    }
    td a:hover { text-decoration: underline; }
    .prize-tag {
      display: inline-block;
      padding: 3px 10px;
      background: #f0efed;
      border-radius: 20px;
      font-size: 0.72rem;
      font-weight: 500;
      white-space: nowrap;
    }
    .empty {
      text-align: center;
      padding: 60px 20px;
      color: #6b6560;
      font-size: 0.85rem;
    }
    /* Import modal */
    .modal-bg {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.4);
      backdrop-filter: blur(4px);
      z-index: 100;
      align-items: center;
      justify-content: center;
    }
    .modal-bg.open { display: flex; }
    .modal-box {
      background: #fff;
      border-radius: 16px;
      padding: 32px;
      width: 90%;
      max-width: 520px;
    }
    .modal-box h2 {
      font-size: 1rem;
      margin-bottom: 8px;
    }
    .modal-box p {
      font-size: 0.75rem;
      color: #6b6560;
      margin-bottom: 16px;
    }
    .modal-box textarea {
      width: 100%;
      height: 160px;
      border: 1px solid #e8e6e2;
      border-radius: 8px;
      padding: 12px;
      font-family: 'Courier New', monospace;
      font-size: 0.75rem;
      resize: vertical;
      outline: none;
    }
    .modal-box textarea:focus { border-color: #222; }
    .modal-actions {
      display: flex;
      gap: 8px;
      margin-top: 16px;
      justify-content: flex-end;
    }
    .status-msg {
      padding: 10px 16px;
      border-radius: 8px;
      font-size: 0.78rem;
      margin-bottom: 16px;
      display: none;
    }
    .status-msg.success { display: block; background: #e8f5e9; color: #2e7d32; }
    .status-msg.error { display: block; background: #fce4ec; color: #c62828; }
    @media (max-width: 768px) {
      .header, .stats, .actions, .table-wrap { padding-left: 20px; padding-right: 20px; }
      .stats { flex-direction: column; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Marbella Leads</h1>
    <p>Wheel of Fortune — collected contacts</p>
  </div>

  <div class="stats">
    <div class="stat-card">
      <div class="num">${total}</div>
      <div class="label">Total Leads</div>
    </div>
    <div class="stat-card">
      <div class="num">${todayCount}</div>
      <div class="label">Today</div>
    </div>
  </div>

  <div id="statusMsg" class="status-msg" style="margin: 0 40px 16px;"></div>

  <div class="actions">
    <a href="/api/leads?format=csv" class="btn btn-primary" download>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      Download CSV
    </a>
    <button class="btn" onclick="document.getElementById('importModal').classList.add('open')">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
      Import CSV
    </button>
    <button class="btn" onclick="location.reload()">Refresh</button>
  </div>

  <div class="table-wrap">
    ${total === 0
      ? '<div class="empty">No leads yet. Spin the wheel to collect contacts!</div>'
      : `<table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Company</th>
            <th>Prize</th>
            <th>Notes</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`
    }
  </div>

  <!-- Import Modal -->
  <div id="importModal" class="modal-bg" onclick="if(event.target===this)this.classList.remove('open')">
    <div class="modal-box">
      <h2>Import Leads</h2>
      <p>Paste CSV data with headers: Name, Email, Phone, Company, Notes<br>One lead per line.</p>
      <textarea id="csvInput" placeholder="Name,Email,Phone,Company,Notes
John Doe,john@example.com,+359888123456,Acme Inc,10% off"></textarea>
      <div class="modal-actions">
        <button class="btn" onclick="document.getElementById('importModal').classList.remove('open')">Cancel</button>
        <button class="btn btn-primary" onclick="importCSV()">Import</button>
      </div>
    </div>
  </div>

  <script>
    async function importCSV() {
      const raw = document.getElementById('csvInput').value.trim();
      if (!raw) return;

      const lines = raw.split('\\n').filter(l => l.trim());
      if (lines.length < 2) {
        showStatus('Need at least a header row and one data row', 'error');
        return;
      }

      // Parse header
      const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().trim());
      const leads = [];

      for (let i = 1; i < lines.length; i++) {
        const vals = parseCSVLine(lines[i]);
        const lead = { timestamp: new Date().toISOString() };
        headers.forEach((h, idx) => {
          const v = (vals[idx] || '').trim();
          if (h === 'name') lead.name = v;
          else if (h === 'email') lead.email = v;
          else if (h === 'phone') lead.phone = v;
          else if (h === 'company') lead.company = v;
          else if (h === 'notes' || h === 'prize') lead.notes = lead.notes ? lead.notes + ' ' + v : v;
        });
        if (lead.name || lead.email) leads.push(lead);
      }

      if (leads.length === 0) {
        showStatus('No valid leads found', 'error');
        return;
      }

      try {
        const resp = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ leads }),
        });
        const data = await resp.json();
        if (data.status === 'ok') {
          document.getElementById('importModal').classList.remove('open');
          showStatus('Imported ' + data.imported + ' leads successfully!', 'success');
          setTimeout(() => location.reload(), 1500);
        } else {
          showStatus('Error: ' + (data.error || data.message), 'error');
        }
      } catch (err) {
        showStatus('Network error: ' + err.message, 'error');
      }
    }

    function parseCSVLine(line) {
      const result = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
          if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
          else inQuotes = !inQuotes;
        } else if (ch === ',' && !inQuotes) {
          result.push(current); current = '';
        } else {
          current += ch;
        }
      }
      result.push(current);
      return result;
    }

    function showStatus(msg, type) {
      const el = document.getElementById('statusMsg');
      el.textContent = msg;
      el.className = 'status-msg ' + type;
    }
  </script>
</body>
</html>`;
}

function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formatDate(ts) {
  if (!ts) return '';
  try {
    const d = new Date(ts);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) +
      ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  } catch { return ts; }
}
