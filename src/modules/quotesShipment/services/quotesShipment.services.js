import { exportQuotesModel, importQuotesModel, quotesClearnessModel } from "../../../DB/models/index.js";
import { clearanceQuoteSchema, exportQuoteSchema, importQuoteSchema, transporter } from "../../../utils/email-handler.utils.js";

// for import quotes
export const addQuoteForImport = async(req,res)=>{
    const {portOfLoading , portOfDischarge , termsAndCondition , numberOfPcs , expectedRate , emailOrPhone ,emailTo } = req.body;
    const data = importQuotesModel.build({
        portOfLoading,
        portOfDischarge,
        termsAndCondition,
        numberOfPcs,
        expectedRate,
        emailOrPhone
    });
    const validate = importQuoteSchema.safeParse(req.body);
    if(!validate.success){
        return res.status(400).json({message:'Invalid data',validate})
    }
    const html = `
    <h1>New Import Quote</h1>
    <p>Port of Loading: ${portOfLoading}</p>
    <p>Port of Discharge: ${portOfDischarge}</p>
    <p>Terms and Condition: ${termsAndCondition}</p>
    <p>Number of Pcs: ${numberOfPcs}</p>
    <p>Expected Rate: ${expectedRate}</p>
    <p>Email or Phone: ${emailOrPhone}</p>
    `
    if(portOfDischarge.toLowerCase() === 'dammam'){
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to:process.env.SMTP_DAMMAM,
            cc:[
                process.env.SMTP_MESSAGES_WAEL,
                process.env.SMTP_MESSAGES_ADEL,
                process.env.SMTP_MESSAGES_MAHMOUD
            ],
            subject:'Import Quote',
            html
        })
    }
    if(portOfDischarge.toLowerCase() === 'riyadh'){
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to:process.env.SMTP_RIHADH,
            cc:[
                process.env.SMTP_MESSAGES_WAEL,
                process.env.SMTP_MESSAGES_ADEL,
                process.env.SMTP_MESSAGES_MAHMOUD
            ],
            subject:'Import Quote',
            html
        })
    }
    if(emailTo.toLowerCase() === 'option1' && portOfDischarge.toLowerCase() !== 'dammam' && portOfDischarge.toLowerCase() !== 'riyadh'){
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to:process.env.SMTP_IMPORT_1,
            cc:[
                process.env.SMTP_MESSAGES_WAEL,
                process.env.SMTP_MESSAGES_ADEL,
                process.env.SMTP_MESSAGES_MAHMOUD
            ],
            subject:'Import Quote',
            html
        })
    }

    if(emailTo.toLowerCase() === 'option2' && portOfDischarge.toLowerCase() !== 'dammam' && portOfDischarge.toLowerCase() !== 'riyadh'){
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to:process.env.SMTP_IMPORT_2,
            cc:[
                process.env.SMTP_MESSAGES_WAEL,
                process.env.SMTP_MESSAGES_ADEL,
                process.env.SMTP_MESSAGES_MAHMOUD
            ],
            subject:'Import Quote',
        html
    })
    } 
     
    await data.save();
    return res.status(201).json({message:'Quote added successfully',data})    
}

// for export quotes
export const addQuoteForExport = async(req,res)=>{
    const {portOfLoading , portOfDischarge , numberOfContainers , numberOfPcs , expectedRate , emailOrPhone ,emailTo} = req.body;
    const data = exportQuotesModel.build({
        portOfLoading,
        portOfDischarge,
        numberOfContainers,
        numberOfPcs,    
        expectedRate,
        emailOrPhone
    });
    const validate = exportQuoteSchema.safeParse(req.body);
    if(!validate.success){
        return res.status(400).json({message:'Invalid data',validate})
    }
    const html = `
    <h1>New Export Quote</h1>
    <p>Port of Loading: ${portOfLoading}</p>
    <p>Port of Discharge: ${portOfDischarge}</p>
    <p>Number of Containers: ${numberOfContainers}</p>
    <p>Number of Pcs: ${numberOfPcs}</p>
    <p>Expected Rate: ${expectedRate}</p>
    <p>Email or Phone: ${emailOrPhone}</p>
    `
    if(portOfLoading.toLowerCase() === 'dammam'){
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to:process.env.SMTP_DAMMAM,
            cc:[
                process.env.SMTP_MESSAGES_WAEL,
                process.env.SMTP_MESSAGES_ADEL,
                process.env.SMTP_MESSAGES_MAHMOUD
            ],
            subject:'Import Quote',
            html
        })
    }
    if(portOfLoading.toLowerCase() === 'riyadh'){
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to:process.env.SMTP_RIHADH,
            cc:[
                process.env.SMTP_MESSAGES_WAEL,
                process.env.SMTP_MESSAGES_ADEL,
                process.env.SMTP_MESSAGES_MAHMOUD
            ],
            subject:'Import Quote',
            html
        })
    }
    if(emailTo.toLowerCase() === 'option1' && portOfLoading.toLowerCase() !== 'dammam' && portOfLoading.toLowerCase() !== 'riyadh'){
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to:process.env.SMTP_EXPORT_1,
            cc:[
                process.env.SMTP_MESSAGES_WAEL,
                process.env.SMTP_MESSAGES_ADEL,
                process.env.SMTP_MESSAGES_MAHMOUD
            ],
            subject:'Export Quote',
            html
        })
    }
    if(emailTo.toLowerCase() === 'option2' && portOfLoading.toLowerCase() !== 'dammam' && portOfLoading.toLowerCase() !== 'riyadh'){
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to:process.env.SMTP_EXPORT_2,
            cc:[
                process.env.SMTP_MESSAGES_WAEL,
                process.env.SMTP_MESSAGES_ADEL,
                process.env.SMTP_MESSAGES_MAHMOUD
            ],
            subject:'Export Quote',
            html
        })
    }    await data.save();
    return res.status(201).json({message:'Quote added successfully',data})    
}

// for clearness quotes
export const addQuoteForClearness = async(req,res)=>{
    const {portOfDestination , typeOfCargo , emailOrPhone,requiredService} = req.body;
    const service = requiredService.join(' , ');
    const data = quotesClearnessModel.build({
        portOfDestination,
        typeOfCargo,
        emailOrPhone,
        requiredService:service
    });
    
    const validate = clearanceQuoteSchema.safeParse(req.body);
    if(!validate.success){
        return res.status(400).json({message:'Invalid data',validate})
    }
    const html = `
    <h1>New Clearness Quote</h1>
    <p>Port of Destination: ${portOfDestination}</p>
    <p>Type of Cargo: ${typeOfCargo}</p>
    <p>Email or Phone: ${emailOrPhone}</p>
    <p>Required Service: ${service}</p>
    `
    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.SMTP_CLEARANCE,
        cc:[
            process.env.SMTP_MESSAGES_WAEL,
            process.env.SMTP_MESSAGES_ADEL,
            process.env.SMTP_MESSAGES_MAHMOUD
        ],
        subject:'Clearness Quote',
        html
    })
    
    await data.save();
    return res.status(201).json({message:'Quote added successfully',data})    
}   

// listing all import quotes
export const listImportQuotes = async(req,res)=>{
    const data = await importQuotesModel.findAll();
    return res.status(200).json({message:'Quotes listed successfully',data})
}

// listing all export quotes
export const listExportQuotes = async(req,res)=>{
    const data = await exportQuotesModel.findAll();
    return res.status(200).json({message:'Quotes listed successfully',data})
}

// listing all clearness quotes
export const listClearnessQuotes = async(req,res)=>{
    const data = await quotesClearnessModel.findAll();
    return res.status(200).json({message:'Quotes listed successfully',data})
}
