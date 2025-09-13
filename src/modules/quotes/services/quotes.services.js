import { quotesModel} from "../../../DB/models/index.js";
import { messageSchema , transporter} from "../../../utils/email-handler.utils.js";

// getting quote
export const getQuote = async(req,res)=>{
    const{name , email  , phoneNumber , message}= req.body;
    // save it to quotes table
    const data = quotesModel.build({
        name,
        email,
        phoneNumber,
        message
    });
    const validate = messageSchema.safeParse(req.body);
    if(!validate.success){
        return res.status(400).json({message:'Invalid data',validate})
    }
    const html = `
    <h1>New Message</h1>
    <p>Name: ${name}</p>
    <p>Email: ${email}</p>
    <p>Phone Number: ${phoneNumber}</p>
    <p>Message: ${message}</p>
    `
    
    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to:"gamerteacher12@gmail.com",
        // to: process.env.SMTP_MESSAGES_ADEL,
        // cc:process.env.SMTP_MESSAGES_WAEL,
        subject:'New Message Added',
        html
    });
    
    await data.save();
    return res.status(201).json({message:'Quote added successfully',data})
}

// listing all quotes
export const listQuotes = async(req,res)=>{
    const data = await quotesModel.findAll();
    return res.status(200).json({message:'Quotes listed successfully',data})
}