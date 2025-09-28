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
  
  export const testSmtp = (req, res) => (req, res) => {
    const host = (req.query.host || process.env.SMTP_HOST);
    const port = Number(req.query.port || process.env.SMTP_PORT || 587);
  
    const socket = new net.Socket();
    socket.setTimeout(5000);
  
    socket.once('error', err => res.status(500).json({ ok: false, host, port, error: String(err) }));
    socket.once('timeout', () => { socket.destroy(); res.status(500).json({ ok: false, host, port, error: 'connect timeout' }); });
    socket.connect(port, host, () => { socket.destroy(); res.json({ ok: true, host, port }); });
  }
  