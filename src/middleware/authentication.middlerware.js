import {adminModel,blacklistTokensModel, userModel} from "../DB/models/index.js";
import jwt from "jsonwebtoken";


export const authenticationMiddleware = ()=>{
    return async (req , res , next) =>{
        try {
            const {accesstoken} = req.headers;
            if(!accesstoken) return res.status(400).json({message:'not authorized'});
            // verify token
            const decodedData = jwt.verify(accesstoken ,process.env.JWT_SECRET_LOGIN);
            // check if blacklisted
            const isBlackListed = await blacklistTokensModel.findOne({ where: { tokenId: decodedData.jti } });
            if(isBlackListed) return res.status(401).json({message: "please login first" });
            // data from db of admins
            const user = await userModel.findOne({where:{id:decodedData.id}},'-password -__v ');
            if(!user) return res.status(404).json({message: "admin not found" });
            // ADD USER DATA IN THE REQ
            req.loggedInUser = user;
            req.loggedInUser.token = {tokenId : decodedData.jti , expiryDate : decodedData.exp};
            next();
        } catch (error) {
            console.log("this error from authentication middleware" ,error);
            if(error.name === 'jwt expired'){
                return res.status(401).json({message:'token expired, please login again'});
            }
            return res.status(500).json({message:'somthing went wrong'});
        }
    }
}