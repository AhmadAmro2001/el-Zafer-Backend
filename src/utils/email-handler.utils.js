import z from "zod";
import nodemailer from "nodemailer";
import axios from 'axios';



export const messageSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().min(8, "Phone number must be at least 10 characters long"),
    message: z.string().min(1, "Message must be at least 10 characters long"),
});

export const importQuoteSchema = z.object({
    portOfLoading: z.string().min(1, "Port of loading must be at least 3 characters long"),
    portOfDischarge: z.string().min(1, "Port of discharge must be at least 3 characters long"),
    emailOrPhone: z.string().min(1, "Email or phone must be at least 3 characters long"),
});

export const exportQuoteSchema = z.object({
    portOfLoading: z.string().min(1, "Port of loading must be at least 3 characters long"),
    portOfDischarge: z.string().min(1, "Port of discharge must be at least 3 characters long"),
    emailOrPhone: z.string().min(1, "Email or phone must be at least 3 characters long"),
});

export const clearanceQuoteSchema = z.object({
    portOfDestination: z.string().min(3, "Port of destination must be at least 3 characters long"),
    typeOfCargo: z.string().min(3, "Type of cargo must be at least 3 characters long"),
    emailOrPhone: z.string().min(3, "Email or phone must be at least 3 characters long"),
   
});

const PORT = Number(process.env.SMTP_PORT || 587);
const HOST = process.env.SMTP_HOST;


// export const transporter = nodemailer.createTransport({
//     host: HOST,
//     port: PORT,
//     secure: PORT === 465,
//     auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS
//     },
//     // requireTLS: PORT === 587,
//     // connectionTimeout: 10000,       // 10s connect timeout
//     // greetingTimeout: 10000,         // wait for 220 banner
//     // socketTimeout: 15000, 
//     tls: { ciphers: "TLSv1.2" ,servername: HOST} ,
//     logger: true,
//     debug: true
// });

// export const transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,                
//     port: Number(process.env.SMTP_PORT || 465),  
//     secure: Number(process.env.SMTP_PORT || 465) === 465, 
//     auth: {
//         user: process.env.SMTP_USER,            
//         pass: process.env.SMTP_PASS             
//     }
// });



// send grid

import sg from '@sendgrid/mail';
sg.setApiKey(process.env.RESEND_KEY);

export async function sendMail({ to, cc = [], subject, html }) {
  if (!process.env.RESEND_KEY) throw new Error('RESEND_KEY missing');
  if (!process.env.SMTP_USER) throw new Error('SMTP_USER missing');

  const msg = {
    from: process.env.SMTP_USER,
    to: Array.isArray(to) ? to : [to],
    cc: cc.filter(Boolean),
    subject,
    html,
  };
  const [resp] = await sg.send(msg);   // 202 expected
  return { status: resp.statusCode };
}

// add CNAME of the domain don't forget
// smtp2go

const SMTP2GO_API_URL = 'https://api.smtp2go.com/v3/email/send';
const SMTP2GO_API_KEY = 'api-FEBE6A79EDBD49AAA60741AE57B357FA'; // put your api-xxxx here


export async function sendSimpleEmail({ to, html, text,subject }) {
  const payload = {
    sender: 'Al-Zafer <web-inquiry@alzafercargo.com>', // must be a verified sender
    to: [to],
    subject: subject,
    html_body: html,
    text_body: text,
  };

  const { data } = await axios.post(SMTP2GO_API_URL, payload, {
    headers: {
      'Content-Type': 'application/json',
      'X-Smtp2go-Api-Key': SMTP2GO_API_KEY,
    },
  });

  return data; // contains succeeded/failed + email_id, like SendGrid's response
}