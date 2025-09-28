// 1) Nodemailer handshake

import net from 'node:net';
import { transporter } from '../../../utils/email-handler.utils.js';




export const verifySmtp = async (req, res) => {
    try {
      const ok = await transporter.verify(); // EHLO + STARTTLS/SMTPS + AUTH probe
      res.json({ ok });
    } catch (e) {
      res.status(500).json({ ok: false, error: e.message });
    }
  };
  
  // 2) Raw TCP reachability (host/port firewalls)
  
  export const testSmtp = (req, res) => {
    const rawHost = (req.query.host || process.env.SMTP_HOST || '').toString();
    const host = decodeURIComponent(rawHost).trim();
    const port = Number(req.query.port || process.env.SMTP_PORT || 587);
  
    // Basic validation
    if (!host || !Number.isInteger(port) || port <= 0) {
      return res.status(400).json({ ok: false, error: 'Invalid host or port', host, port });
    }
    // (optional) simple host sanity check
    if (!/^[A-Za-z0-9.\-]+$/.test(host)) {
      return res.status(400).json({ ok: false, error: 'Host contains invalid characters', host });
    }
  
    const socket = new net.Socket();
    let replied = false;
    const reply = (status, body) => {
      if (replied) return;
      replied = true;
      try { socket.destroy(); } catch {}
      res.status(status).json(body);
    };
  
    socket.setNoDelay(true);
    socket.setTimeout(5000); // 5s connect timeout
  
    socket.once('connect', () => {
      reply(200, { ok: true, host, port });
    });
  
    socket.once('timeout', () => {
      reply(504, { ok: false, host, port, error: 'connect timeout' });
    });
  
    socket.once('error', (err) => {
      // Common codes: ECONNREFUSED (port closed), ENOTFOUND (DNS), EHOSTUNREACH, ETIMEDOUT
      reply(502, { ok: false, host, port, error: err.code || String(err) });
    });
  
    // Start connect
    socket.connect({ host, port });
  };
  