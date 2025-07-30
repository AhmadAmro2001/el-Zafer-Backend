import { compareSync, hashSync } from "bcrypt";
import {adminModel, blacklistTokensModel} from "../../../DB/models/index.js";
import jwt from "jsonwebtoken";


// adding an admin
export const addAdmin = async (req,res)=>{
    
        const { name , email , password} = req.body;
        const checkEmail = await adminModel.findOne({where:{email}})
        if(checkEmail){
            return res.status(400).json({message:'Email already exists'})
        }
        const hashedPassword = await hashSync(password,+process.env.SALT) 
        const data = adminModel.build({
            name,
            email,
            password:hashedPassword
        });
        await data.save();
        return res.status(201).json({message:'Admin created successfully'})
    
}

// login admin
export const loginAdmin = async (req,res)=>{
    
        const { email , password} = req.body;
        const checkEmail = await adminModel.findOne({where:{email}})
        if(!checkEmail){
            return res.status(400).json({message:'Email does not exist'})
        }
        const isMatch = compareSync(password,checkEmail.password)
        if(!isMatch){
            return res.status(400).json({message:'Invalid password'})
        }
        const token = jwt.sign({id:checkEmail.id},process.env.JWT_SECRET_LOGIN,{
            expiresIn:'1h'
        })

        return res.status(200).json({message:'Admin logged in successfully',token})
    
}

// logout api
export const logOutService = async (req,res)=>{
    const {accesstoken} = req.headers;
    const decodedData = jwt.verify(accesstoken,process.env.JWT_SECRET_LOGIN);
    const checkIfExist = await blacklistTokensModel.findOne({where:{tokenId:accesstoken}})
    if(checkIfExist){
        return res.status(400).json({message:'Admin already logged out'})
    }
    const revokedToken = blacklistTokensModel.build({
        tokenId:accesstoken,
        expiryDate:decodedData.exp
    })
    await revokedToken.save();
    return res.status(200).json({message:'Admin logged out successfully'})   
}   
