import { exportQuotesModel, importQuotesModel, quotesClearnessModel } from "../../../DB/models/index.js";

// for import quotes
export const addQuoteForImport = async(req,res)=>{
    const {portOfLoading , portOfDischarge , termsAndCondition , numberOfPcs , expectedRate , emailOrPhone} = req.body;
    const data = importQuotesModel.build({
        portOfLoading,
        portOfDischarge,
        termsAndCondition,
        numberOfPcs,
        expectedRate,
        emailOrPhone
    });
    await data.save();
    return res.status(201).json({message:'Quote added successfully',data})    
}

// for export quotes
export const addQuoteForExport = async(req,res)=>{
    const {portOfLoading , portOfDischarge , numberOfContainers , numberOfPcs , expectedRate , emailOrPhone} = req.body;
    const data = exportQuotesModel.build({
        portOfLoading,
        portOfDischarge,
        numberOfContainers,
        numberOfPcs,    
        expectedRate,
        emailOrPhone
    });
    await data.save();
    return res.status(201).json({message:'Quote added successfully',data})    
}

// for clearness quotes
export const addQuoteForClearness = async(req,res)=>{
    const {portOfDestination , typeOfCargo , emailOrPhone,requiredService} = req.body;
    const data = quotesClearnessModel.build({
        portOfDestination,
        typeOfCargo,
        emailOrPhone,
        requiredService
    });
    await data.save();
    return res.status(201).json({message:'Quote added successfully',data})    
}   
