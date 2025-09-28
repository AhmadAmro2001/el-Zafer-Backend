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
    const socket = new net.Socket();
    socket.setTimeout(5000);
    socket.once('error', err => res.status(500).json({ ok: false, error: String(err) }));
    socket.once('timeout', () => { socket.destroy(); res.status(500).json({ ok: false, error: 'connect timeout' }); });
    socket.connect(PORT, HOST, () => { socket.destroy(); res.json({ ok: true, host: HOST, port: PORT }); });
  };
  