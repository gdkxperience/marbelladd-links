// Vercel Serverless Function: POST /api/spin
// Stores email + prize and sends coupon email
//
// Required env vars:
//   RESEND_API_KEY     - API key from resend.com (free tier: 100 emails/day)
//   FROM_EMAIL         - Verified sender email (e.g. hello@marbelladd.com)
//
// Optional env vars:
//   GOOGLE_SHEET_WEBHOOK - Google Apps Script web app URL for storing emails

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, company, prize } = req.body || {};

  if (!name || !email || !phone || !prize) {
    return res.status(400).json({ error: 'Name, email, phone, and prize are required' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const timestamp = new Date().toISOString();

  // 1. Store data in Google Sheets (optional)
  // Google Apps Script redirects (302) on POST — we must follow manually keeping POST method
  if (process.env.GOOGLE_SHEET_WEBHOOK) {
    try {
      const payload = JSON.stringify({ name, email, phone, company, prize, timestamp });
      let url = process.env.GOOGLE_SHEET_WEBHOOK;
      for (let i = 0; i < 3; i++) {
        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          redirect: 'manual',
        });
        if (resp.status >= 300 && resp.status < 400) {
          url = resp.headers.get('location');
          continue;
        }
        break;
      }
    } catch {
      // Non-blocking — continue even if sheet storage fails
    }
  }

  // 2. Send coupon email via Resend
  if (process.env.RESEND_API_KEY) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.FROM_EMAIL || 'Marbella Decor & Design <onboarding@resend.dev>',
          to: [email],
          subject: `Your Prize: ${prize} — Marbella Decor & Design`,
          html: buildCouponEmail(prize, email),
        }),
      });
    } catch {
      // Log but don't fail the request
    }
  }

  return res.status(200).json({ success: true, prize });
}

function buildCouponEmail(prize, email) {
  const code = generateCode();
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 30);
  const expiryStr = expiry.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background:#f7f6f4; font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f6f4; padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="max-width:480px; width:100%;">
          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <span style="font-family:'Georgia',serif; font-size:18px; font-weight:bold; color:#222222; letter-spacing:3px;">MARBELLA</span>
              <br>
              <span style="font-family:'Helvetica Neue',sans-serif; font-size:9px; color:#6b6560; letter-spacing:4px;">DESIGN & DECOR</span>
            </td>
          </tr>
          <!-- Coupon Card -->
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#222222; border-radius:16px; overflow:hidden;">
                <!-- Top accent -->
                <tr>
                  <td style="height:4px; background:linear-gradient(90deg,#c25b41,#ede6cf,#c25b41);"></td>
                </tr>
                <!-- Congrats -->
                <tr>
                  <td align="center" style="padding:36px 32px 8px;">
                    <span style="font-family:'Helvetica Neue',sans-serif; font-size:10px; font-weight:500; color:#ede6cf; letter-spacing:4px; text-transform:uppercase;">Congratulations</span>
                  </td>
                </tr>
                <!-- Prize -->
                <tr>
                  <td align="center" style="padding:8px 32px 4px;">
                    <span style="font-family:'Georgia',serif; font-size:32px; font-weight:bold; color:#f7f6f4; letter-spacing:1px;">${prize}</span>
                  </td>
                </tr>
                <!-- Divider -->
                <tr>
                  <td align="center" style="padding:20px 60px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="border-bottom:1px dashed #444444;"></td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- Code -->
                <tr>
                  <td align="center" style="padding:0 32px 8px;">
                    <span style="font-family:'Helvetica Neue',sans-serif; font-size:9px; color:#6b6560; letter-spacing:3px; text-transform:uppercase;">Coupon Code</span>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:0 32px 24px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background:#333333; border:1px dashed #555555; border-radius:8px; padding:12px 28px;">
                          <span style="font-family:'Courier New',monospace; font-size:20px; font-weight:bold; color:#ede6cf; letter-spacing:4px;">${code}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- Expiry -->
                <tr>
                  <td align="center" style="padding:0 32px 32px;">
                    <span style="font-family:'Helvetica Neue',sans-serif; font-size:11px; color:#6b6560;">Valid until ${expiryStr}</span>
                  </td>
                </tr>
                <!-- Bottom accent -->
                <tr>
                  <td style="height:4px; background:linear-gradient(90deg,#c25b41,#ede6cf,#c25b41);"></td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Instructions -->
          <tr>
            <td align="center" style="padding:28px 20px 12px;">
              <span style="font-family:'Helvetica Neue',sans-serif; font-size:13px; color:#222222; font-weight:500;">How to redeem</span>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 20px 32px;">
              <span style="font-family:'Helvetica Neue',sans-serif; font-size:12px; color:#6b6560; line-height:1.7;">
                Print this email or show it on your phone at our store.<br>
                Present the coupon code above at checkout.<br>
                One use per customer.
              </span>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="padding:16px 20px; border-top:1px solid #e8e6e2;">
              <span style="font-family:'Helvetica Neue',sans-serif; font-size:10px; color:#999999;">
                Marbella Decor & Design &bull; Elegant. Natural. Unique.
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'MDD-';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
