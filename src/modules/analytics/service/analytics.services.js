import { visitsModel } from "../../../DB/models/index.js";


// this api used for the website
export const  logVisitService = async (req,res)=>{
    const userAgent = req.headers['user-agent']

    const isWebOrMobile = /mobile|android|iphone|ipad/i.test(userAgent);
    await visitsModel.create({
        deviceType:isWebOrMobile ? 'mobile' : 'web',
    });
    return res.status(200).json({message:"visit logged successfully",userAgent})
}