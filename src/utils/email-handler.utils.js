import z from "zod";
import nodemailer from "nodemailer";



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


export const transporter = nodemailer.createTransport({
    host: HOST,
    port: PORT,
    secure: PORT === 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    // requireTLS: PORT === 587,
    // connectionTimeout: 10000,       // 10s connect timeout
    // greetingTimeout: 10000,         // wait for 220 banner
    // socketTimeout: 15000, 
    tls: { ciphers: "TLSv1.2" ,servername: HOST} ,
    logger: true,
    debug: true
});

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