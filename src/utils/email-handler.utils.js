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
    termsAndCondition: z.string().min(1, "Terms and condition must be at least 3 characters long"),
    numberOfPcs: z.string().min(1, "Number of packages must be at least 3 characters long"),
    expectedRate: z.string().min(1, "Expected rate must be at least 3 characters long"),
    emailOrPhone: z.string().min(1, "Email or phone must be at least 3 characters long"),
});

export const exportQuoteSchema = z.object({
    portOfLoading: z.string().min(1, "Port of loading must be at least 3 characters long"),
    portOfDischarge: z.string().min(1, "Port of discharge must be at least 3 characters long"),
    numberOfContainers: z.string().min(1, "Number of containers must be at least 3 characters long"),
    numberOfPcs: z.string().min(1, "Number of packages must be at least 3 characters long"),
    expectedRate: z.string().min(1, "Expected rate must be at least 3 characters long"),
    emailOrPhone: z.string().min(1, "Email or phone must be at least 3 characters long"),
});

export const clearanceQuoteSchema = z.object({
    portOfDestination: z.string().min(3, "Port of destination must be at least 3 characters long"),
    typeOfCargo: z.string().min(3, "Type of cargo must be at least 3 characters long"),
    emailOrPhone: z.string().min(3, "Email or phone must be at least 3 characters long"),
   
});


export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    tls: { ciphers: "TLSv1.2" } 
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