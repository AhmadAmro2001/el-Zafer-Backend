import { exportQuotesModel, importQuotesModel, quotesClearnessModel } from "../../../DB/models/index.js";
import { clearanceQuoteSchema, exportQuoteSchema, importQuoteSchema, sendSimpleEmail } from "../../../utils/email-handler.utils.js";

// for import quotes
export const addQuoteForImport = async(req,res)=>{
    const {portOfLoading , portOfDischarge , termsAndCondition, shipperAddress , numberOfPcs , expectedRate , emailOrPhone ,emailTo ,phone } = req.body;
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
    <p>Terms and Condition: ${termsAndCondition?termsAndCondition:'N/A'}</p>
    <p>shipper address: ${shipperAddress?shipperAddress:'N/A'}</p>
    <p>Number of Pcs: ${numberOfPcs?numberOfPcs:'N/A'}</p>
    <p>Expected Rate: ${expectedRate?expectedRate:'N/A'}</p>
    <p>Email: ${emailOrPhone}</p>
    <p>phone Number: ${phone}</p>
    `
    const html_air = `
    <h1>New Import Quote</h1>
    <p>Port of Loading: ${portOfLoading}</p>
    <p>Port of Discharge: ${portOfDischarge}</p>
    <p>Terms and Condition: ${termsAndCondition?termsAndCondition:'N/A'}</p>
    <p>Expected Rate: ${expectedRate?expectedRate:'N/A'}</p>
    <p>Email: ${emailOrPhone}</p>
    <p>phone Number: ${phone}</p>
    `
    if(portOfDischarge.toLowerCase() === 'dammam'){
         await sendSimpleEmail({
            // to: "gamerteacher12@gmail.com",
            to: process.env.SMTP_DAMMAM,
            cc: [process.env.SMTP_MESSAGES_WAEL, process.env.SMTP_MESSAGES_ADEL, process.env.SMTP_MESSAGES_MAHMOUD , process.env.SMTP_QOUTES_AHMED].filter(Boolean),
            subject: 'Import Quote For Dammam Branch',
            html
        })
    }
    if(portOfDischarge?.toLowerCase() === 'riyadh'){
        await sendSimpleEmail({
            to: process.env.SMTP_RIYADH,
            cc: [process.env.SMTP_MESSAGES_WAEL, process.env.SMTP_MESSAGES_ADEL, process.env.SMTP_MESSAGES_MAHMOUD, process.env.SMTP_QOUTES_AHMED].filter(Boolean),
            subject: 'Import Quote For Riyadh Branch',
            html
        })
    }
    if(emailTo?.toLowerCase() === 'import_fcl' && portOfDischarge?.toLowerCase() !== 'dammam' && portOfDischarge?.toLowerCase() !== 'riyadh'){
        await sendSimpleEmail({
            to: process.env.SMTP_IMPORT_1,
            cc: [process.env.SMTP_MESSAGES_WAEL, process.env.SMTP_MESSAGES_ADEL, process.env.SMTP_MESSAGES_MAHMOUD, process.env.SMTP_QOUTES_AHMED].filter(Boolean),
            subject: 'Import Quote FCL',
            html
        })
    }
    if( emailTo.toLowerCase() === 'import_lcl'  && portOfDischarge.toLowerCase() !== 'dammam' && portOfDischarge.toLowerCase() !== 'riyadh'){
        await sendSimpleEmail({
            to: process.env.SMTP_IMPORT_1,
            cc: [process.env.SMTP_MESSAGES_WAEL, process.env.SMTP_MESSAGES_ADEL, process.env.SMTP_MESSAGES_MAHMOUD, process.env.SMTP_QOUTES_AHMED].filter(Boolean),
            subject: 'Import Quote LCL',
            html
        })
    }
    if( emailTo.toLowerCase() === 'import_air'  && portOfDischarge.toLowerCase() !== 'dammam' && portOfDischarge.toLowerCase() !== 'riyadh'){
        await sendSimpleEmail({
            to: process.env.SMTP_IMPORT_1,
            cc: [process.env.SMTP_MESSAGES_WAEL, process.env.SMTP_MESSAGES_ADEL, process.env.SMTP_MESSAGES_MAHMOUD, process.env.SMTP_QOUTES_AHMED].filter(Boolean),
            subject: 'Import Quote Air Freight',
            html
        })
    }
     
    await data.save();
    return res.status(201).json({message:'Quote added successfully',data})    
}




export const addQuoteForExport = async(req,res)=>{
    const {portOfLoading , portOfDischarge , numberOfContainers , numberOfPcs , expectedRate , emailOrPhone ,emailTo , phone} = req.body;
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
    <p>Number of Containers: ${numberOfContainers?numberOfContainers:"N/A"}</p>
    <p>Number of Pcs: ${numberOfPcs?numberOfPcs:"N/A"}</p>
    <p>Expected Rate: ${expectedRate?expectedRate:"N/A"}</p>
    <p>Email: ${emailOrPhone}</p>
    <p>phone Number: ${phone}</p>
    `
    const html_air = `
    <h1>New Export Quote</h1>
    <p>Port of Loading: ${portOfLoading}</p>
    <p>Port of Discharge: ${portOfDischarge}</p>
    <p>Number of Pcs: ${numberOfPcs?numberOfPcs:"N/A"}</p>
    <p>Expected Rate: ${expectedRate?expectedRate:"N/A"}</p>
    <p>Email: ${emailOrPhone}</p>
    <p>phone Number: ${phone}</p>
    `
    if(portOfLoading.toLowerCase() === 'dammam'){
        await sendSimpleEmail({
            to: process.env.SMTP_DAMMAM,
            cc: [process.env.SMTP_MESSAGES_WAEL, process.env.SMTP_MESSAGES_ADEL, process.env.SMTP_MESSAGES_MAHMOUD, process.env.SMTP_QOUTES_AHMED].filter(Boolean),
            subject: 'Export Quote For Dammam Branch',
            html
        })
    }
    if(portOfLoading.toLowerCase() === 'riyadh'){
        await sendSimpleEmail({
            to: process.env.SMTP_RIHADH,
            cc: [process.env.SMTP_MESSAGES_WAEL, process.env.SMTP_MESSAGES_ADEL, process.env.SMTP_MESSAGES_MAHMOUD, process.env.SMTP_QOUTES_AHMED].filter(Boolean),
            subject: 'Export Quote For Riyadh Branch',
            html
        })
    }
    if(emailTo.toLowerCase() === 'export_fcl' && portOfLoading.toLowerCase() !== 'dammam' && portOfLoading.toLowerCase() !== 'riyadh'){
        await sendSimpleEmail({
            to: process.env.SMTP_EXPORT_1,
            cc: [process.env.SMTP_MESSAGES_WAEL, process.env.SMTP_MESSAGES_ADEL, process.env.SMTP_MESSAGES_MAHMOUD, process.env.SMTP_QOUTES_AHMED].filter(Boolean),
            subject: 'Export Quote FCL',
            html
        })
    }
    if(emailTo.toLowerCase() === 'export_lcl' && portOfLoading.toLowerCase() !== 'dammam' && portOfLoading.toLowerCase() !== 'riyadh'){
        await sendSimpleEmail({
            to: process.env.SMTP_EXPORT_1,
            cc: [process.env.SMTP_MESSAGES_WAEL, process.env.SMTP_MESSAGES_ADEL, process.env.SMTP_MESSAGES_MAHMOUD, process.env.SMTP_QOUTES_AHMED].filter(Boolean),
            subject: 'Export Quote LCL',
            html
        })
    }
    if(emailTo.toLowerCase() === 'export_air' && portOfLoading.toLowerCase() !== 'dammam' && portOfLoading.toLowerCase() !== 'riyadh'){
        await sendSimpleEmail({
            to: process.env.SMTP_EXPORT_2,
            cc: [process.env.SMTP_MESSAGES_WAEL, process.env.SMTP_MESSAGES_ADEL, process.env.SMTP_MESSAGES_MAHMOUD, process.env.SMTP_QOUTES_AHMED].filter(Boolean),
            subject: 'Export Quote Air Freight',
            html
        })
    }    
    await data.save();
    return res.status(201).json({message:'Quote added successfully',data})    
}

// for clearness quotes
export const addQuoteForClearness = async(req,res)=>{
    const {portOfDestination , typeOfCargo , emailOrPhone,requiredService,phone} = req.body;
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
    <h1>New Clearance Quote</h1>
    <p>Port of Destination: ${portOfDestination}</p>
    <p>Type of Cargo: ${typeOfCargo}</p>
    <p>Email: ${emailOrPhone}</p>
    <p>phone Number: ${phone}</p>
    <p>Required Service: ${service}</p>
    `
    await sendSimpleEmail({
        to: process.env.SMTP_CLEARANCE,
        // to:"gamerteacher12@gmail.com",
        cc: [process.env.SMTP_MESSAGES_WAEL, process.env.SMTP_MESSAGES_ADEL, process.env.SMTP_MESSAGES_MAHMOUD, process.env.SMTP_QOUTES_AHMED].filter(Boolean),
        subject: 'Customs Clearance Quote',
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
