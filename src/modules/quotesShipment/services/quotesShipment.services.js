import { exportQuotesModel, importQuotesModel, quotesClearnessModel } from "../../../DB/models/index.js";
import { clearanceQuoteSchema, exportQuoteSchema, importQuoteSchema, transporter } from "../../../utils/email-handler.utils.js";

// for import quotes
// export const addQuoteForImport = async(req,res)=>{
//     const {portOfLoading , portOfDischarge , termsAndCondition , numberOfPcs , expectedRate , emailOrPhone ,emailTo } = req.body;
//     const data = importQuotesModel.build({
//         portOfLoading,
//         portOfDischarge,
//         termsAndCondition,
//         numberOfPcs,
//         expectedRate,
//         emailOrPhone
//     });
//     const validate = importQuoteSchema.safeParse(req.body);
//     if(!validate.success){
//         return res.status(400).json({message:'Invalid data',validate})
//     }
//     const html = `
//     <h1>New Import Quote</h1>
//     <p>Port of Loading: ${portOfLoading}</p>
//     <p>Port of Discharge: ${portOfDischarge}</p>
//     <p>Terms and Condition: ${termsAndCondition?termsAndCondition:'N/A'}</p>
//     <p>Number of Pcs: ${numberOfPcs?numberOfPcs:'N/A'}</p>
//     <p>Expected Rate: ${expectedRate?expectedRate:'N/A'}</p>
//     <p>Email or Phone: ${emailOrPhone}</p>
//     `
//     const html_air = `
//     <h1>New Import Quote</h1>
//     <p>Port of Loading: ${portOfLoading}</p>
//     <p>Port of Discharge: ${portOfDischarge}</p>
//     <p>Terms and Condition: ${termsAndCondition?termsAndCondition:'N/A'}</p>
//     <p>Expected Rate: ${expectedRate?expectedRate:'N/A'}</p>
//     <p>Email or Phone: ${emailOrPhone}</p>
//     `
//     if(portOfDischarge.toLowerCase() === 'dammam'){
//          transporter.sendMail({
//             from: process.env.SMTP_USER,
//             to:process.env.SMTP_DAMMAM,
//             cc:[
//                 process.env.SMTP_MESSAGES_WAEL,
//                 process.env.SMTP_MESSAGES_ADEL,
//                 process.env.SMTP_MESSAGES_MAHMOUD
//             ],
//             subject:'Import Quote For Dammam Branch',
//             html
//         })
//     }
//     if(portOfDischarge?.toLowerCase() === 'riyadh'){
//          transporter.sendMail({
//             from: process.env.SMTP_USER,
//             to:process.env.SMTP_RIHADH,
//             cc:[
//                 process.env.SMTP_MESSAGES_WAEL,
//                 process.env.SMTP_MESSAGES_ADEL,
//                 process.env.SMTP_MESSAGES_MAHMOUD
//             ],
//             subject:'Import Quote For Riyadh Branch',
//             html
//         })
//     }
//     if(emailTo?.toLowerCase() === 'import_fcl' && portOfDischarge?.toLowerCase() !== 'dammam' && portOfDischarge?.toLowerCase() !== 'riyadh'){
//          transporter.sendMail({
//             from: process.env.SMTP_USER,
//             to:process.env.SMTP_IMPORT_1,
//             cc:[
//                 process.env.SMTP_MESSAGES_WAEL,
//                 process.env.SMTP_MESSAGES_MAHMOUD
//             ],
//             subject:'Import Quote FCL',
//             html
//         })
//     }
//     if( emailTo.toLowerCase() === 'import_lcl'  && portOfDischarge.toLowerCase() !== 'dammam' && portOfDischarge.toLowerCase() !== 'riyadh'){
//          transporter.sendMail({
//             from: process.env.SMTP_USER,
//             to:process.env.SMTP_IMPORT_1,
//             cc:[
//                 process.env.SMTP_MESSAGES_WAEL,
//                 process.env.SMTP_MESSAGES_MAHMOUD
//             ],
//             subject:'Import Quote LCL',
//             html
//         })
//     }
//     if( emailTo.toLowerCase() === 'import_air'  && portOfDischarge.toLowerCase() !== 'dammam' && portOfDischarge.toLowerCase() !== 'riyadh'){
//         transporter.sendMail({
//             from: process.env.SMTP_USER,
//             to:process.env.SMTP_IMPORT_1,
//             cc:[
//                 process.env.SMTP_MESSAGES_WAEL,
//                 process.env.SMTP_MESSAGES_MAHMOUD
//             ],
//             subject:'Import Quote Air Freight',
//             html:html_air
//         })
//     }
     
//     await data.save();
//     return res.status(201).json({message:'Quote added successfully',data})    
// }

// for export quotes
export const addQuoteForImport = async (req, res) => {
    const {
      portOfLoading,
      portOfDischarge,
      termsAndCondition,
      numberOfPcs,
      expectedRate,
      emailOrPhone,
      emailTo,
    } = req.body;
  
    // Validate first (so errors go to your error middleware)
    const validate = importQuoteSchema.safeParse(req.body);
    if (!validate.success) {
      res.status(400).json({ message: 'Invalid data', validate });
      return;
    }
  
    // Safe normalize
    const discharge = (portOfDischarge ?? '').toString().trim().toLowerCase();
    const channel   = (emailTo ?? '').toString().trim().toLowerCase();
  
    // Common HTML bodies
    const html = `
      <h1>New Import Quote</h1>
      <p>Port of Loading: ${portOfLoading}</p>
      <p>Port of Discharge: ${portOfDischarge}</p>
      <p>Terms and Condition: ${termsAndCondition || 'N/A'}</p>
      <p>Number of Pcs: ${numberOfPcs || 'N/A'}</p>
      <p>Expected Rate: ${expectedRate || 'N/A'}</p>
      <p>Email or Phone: ${emailOrPhone}</p>
    `;
    const html_air = `
      <h1>New Import Quote</h1>
      <p>Port of Loading: ${portOfLoading}</p>
      <p>Port of Discharge: ${portOfDischarge}</p>
      <p>Terms and Condition: ${termsAndCondition || 'N/A'}</p>
      <p>Expected Rate: ${expectedRate || 'N/A'}</p>
      <p>Email or Phone: ${emailOrPhone}</p>
    `;
  
    // Per-message timeout that REJECTS (so it reaches your error middleware)
    const sendMailOrTimeout = (mail, ms = 15000) =>
      Promise.race([
        transporter.sendMail(mail), // will throw on failure
        new Promise((_, reject) => setTimeout(() => reject(new Error('Email send timeout')), ms)),
      ]);
  
    // CC lists (filter falsy to avoid Nodemailer errors)
    const CC_ALL = [
      process.env.SMTP_MESSAGES_WAEL,
      process.env.SMTP_MESSAGES_ADEL,
      process.env.SMTP_MESSAGES_MAHMOUD,
    ].filter(Boolean);
    const CC_NO_ADEL = [
      process.env.SMTP_MESSAGES_WAEL,
      process.env.SMTP_MESSAGES_MAHMOUD,
    ].filter(Boolean);
  
    // Decide recipient + subject
    if (discharge === 'dammam') {
      const to = process.env.SMTP_DAMMAM;
      if (!to) throw new Error('SMTP_DAMMAM is not set');
      await sendMailOrTimeout({
        from: process.env.SMTP_USER,
        to,
        cc: CC_ALL,
        subject: 'Import Quote For Dammam Branch',
        html,
      });
    } else if (discharge === 'riyadh') {
      const to = process.env.SMTP_RIHADH; // your exact env key
      if (!to) throw new Error('SMTP_RIHADH is not set');
      await sendMailOrTimeout({
        from: process.env.SMTP_USER,
        to,
        cc: CC_ALL,
        subject: 'Import Quote For Riyadh Branch',
        html,
      });
    } else {
      const to = process.env.SMTP_IMPORT_1;
      if (!to) throw new Error('SMTP_IMPORT_1 is not set');
  
      if (channel === 'import_fcl') {
        await sendMailOrTimeout({
          from: process.env.SMTP_USER,
          to,
          cc: CC_NO_ADEL,
          subject: 'Import Quote FCL',
          html,
        });
      } else if (channel === 'import_lcl') {
        await sendMailOrTimeout({
          from: process.env.SMTP_USER,
          to,
          cc: CC_NO_ADEL,
          subject: 'Import Quote LCL',
          html,
        });
      } else if (channel === 'import_air') {
        await sendMailOrTimeout({
          from: process.env.SMTP_USER,
          to,
          cc: CC_NO_ADEL,
          subject: 'Import Quote Air Freight',
          html: html_air,
        });
      } else {
        throw new Error(`Invalid emailTo value: "${channel}"`);
      }
    }
  
    // Save to DB (await so DB errors reach your middleware)
    const data = await importQuotesModel.create({
      portOfLoading,
      portOfDischarge,
      termsAndCondition,
      numberOfPcs,
      expectedRate,
      emailOrPhone,
    });
  
    res.status(201).json({ message: 'Quote added successfully', data });
  };
  


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
    <p>Number of Containers: ${numberOfContainers?numberOfContainers:"N/A"}</p>
    <p>Number of Pcs: ${numberOfPcs?numberOfPcs:"N/A"}</p>
    <p>Expected Rate: ${expectedRate?expectedRate:"N/A"}</p>
    <p>Email or Phone: ${emailOrPhone}</p>
    `
    const html_air = `
    <h1>New Export Quote</h1>
    <p>Port of Loading: ${portOfLoading}</p>
    <p>Port of Discharge: ${portOfDischarge}</p>
    <p>Number of Pcs: ${numberOfPcs?numberOfPcs:"N/A"}</p>
    <p>Expected Rate: ${expectedRate?expectedRate:"N/A"}</p>
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
            subject:'Export Quote For Dammam Branch',
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
            subject:'Export Quote For Riyadh Branch',
            html
        })
    }
    if(emailTo.toLowerCase() === 'export_fcl' && portOfLoading.toLowerCase() !== 'dammam' && portOfLoading.toLowerCase() !== 'riyadh'){
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to:process.env.SMTP_EXPORT_1,
            cc:[
                process.env.SMTP_MESSAGES_WAEL,
                process.env.SMTP_MESSAGES_MAHMOUD
            ],
            subject:'Export Quote FCL',
            html
        })
    }
    if(emailTo.toLowerCase() === 'export_lcl' && portOfLoading.toLowerCase() !== 'dammam' && portOfLoading.toLowerCase() !== 'riyadh'){
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to:process.env.SMTP_EXPORT_1,
            cc:[
                process.env.SMTP_MESSAGES_WAEL,
                process.env.SMTP_MESSAGES_MAHMOUD
            ],
            subject:'Export Quote LCL',
            html
        })
    }
    if(emailTo.toLowerCase() === 'export_air' && portOfLoading.toLowerCase() !== 'dammam' && portOfLoading.toLowerCase() !== 'riyadh'){
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to:process.env.SMTP_EXPORT_2,
            cc:[
                process.env.SMTP_MESSAGES_WAEL,
                process.env.SMTP_MESSAGES_MAHMOUD
            ],
            subject:'Export Quote Air Freight',
            html:html_air
        })
    }    
    await data.save();
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
    <h1>New Clearance Quote</h1>
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
        subject:'Customs Clearance Quote',
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
