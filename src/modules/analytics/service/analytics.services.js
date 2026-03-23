import { visitsModel, trackingLogsModel } from "../../../DB/models/index.js";
import {Op} from 'sequelize'

// this api used for the website
export const  logVisitService = async (req,res)=>{
    const userAgent = req.headers['user-agent']

    const isWebOrMobile = /mobile|android|iphone|ipad/i.test(userAgent);
    await visitsModel.create({
        deviceType:isWebOrMobile ? 'mobile' : 'web',
    });
    return res.status(200).json({message:"visit logged successfully",userAgent})
}

// get all log and tacking done
export const getLogsService = async (req,res)=>{
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const visitsWeb = await visitsModel.findAll({
        where:{
            deviceType:'web',
            createdAt: {
                [Op.gte]: twoDaysAgo
            },
        },
        order:[['createdAt','DESC']]
    });
    const visitsMobile = await visitsModel.findAll({
        where:{
            deviceType:'mobile',
            createdAt: {
                [Op.gte]: twoDaysAgo
            },
        },
        order:[['createdAt','DESC']]
    });

    const trackingLogs = await trackingLogsModel.findAll({
        where:{
            createdAt:{
                [Op.gte]:twoDaysAgo
            }
        },
        order:[['createdAt','DESC']]
    });


    return res.status(200).json({
        message:"logs fetched successfully",
        visitsWeb:visitsWeb.length,
        visitsMobile:visitsMobile.length,
        trackingLogs:trackingLogs.length 
    })
}