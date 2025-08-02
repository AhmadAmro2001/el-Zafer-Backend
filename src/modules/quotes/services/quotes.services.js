import { quotesModel} from "../../../DB/models/index.js";


// getting quote
export const getQuote = async(req,res)=>{
    const{name , email  , phoneNumber , message}= req.body;
    // save it to quotes table
    const data = quotesModel.build({
        name,
        email,
        // phoneCode:JSON.stringify(phoneCode),
        phoneNumber,
        message
    });
    await data.save();
    return res.status(201).json({message:'Quote added successfully',data})
}

// listing all quotes
export const listQuotes = async(req,res)=>{
    const data = await quotesModel.findAll();
    return res.status(200).json({message:'Quotes listed successfully',data})
}