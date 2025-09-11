import { userModel,blacklistTokensModel } from "../../../DB/models/index.js";
import { compareSync } from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import jwt from "jsonwebtoken";
import { hashSync } from "bcrypt";

export const signInUser = async(req,res)=>{
    const {email,password} = req.body;
    // check if the email exists
    const checkEmail = await userModel.findOne({where:{email}})
    if(!checkEmail){
        return res.status(400).json({message:'Email does not exist'})
    }
    const isMatch = compareSync(password, checkEmail.password);
    if(!isMatch){
        return res.status(400).json({message:'Invalid password'})
    }
    const jti = uuidv4(); // ✅ generate unique token ID

    const token = jwt.sign(
        {
            id: checkEmail.id,
            jti, // ✅ include jti
        },
        process.env.JWT_SECRET_LOGIN,
        {
            expiresIn: '1h',
        }
    );
    return res.status(200).json({
        message: 'User logged in successfully',
        userName:checkEmail.userName,
        token,
    });
}

// signup
export const signUpUser = async(req,res)=>{
    const {userName,email,password , phoneNumber} = req.body;
    // check if the email exists
    const checkEmail = await userModel.findOne({where:{email}})
    if(checkEmail){
        return res.status(400).json({message:'Email already exists'})
    }
    const hashedPassword = hashSync(password,+process.env.SALT) 
    const data = userModel.build({
        userName,
        email,
        password:hashedPassword,
        phoneNumber
    });
    await data.save();
    return res.status(201).json({message:'User created successfully',data})
}

// logout
export const logOutUser = async(req,res)=>{
    const {accesstoken} = req.headers;
    const decodedData = jwt.verify(accesstoken,process.env.JWT_SECRET_LOGIN);
    const checkIfExist = await blacklistTokensModel.findOne({where:{tokenId:accesstoken}})
    if(checkIfExist){
        return res.status(400).json({message:'User already logged out'})
    }
    const revokedToken = blacklistTokensModel.build({
        tokenId:accesstoken,
        expiryDate:decodedData.exp
    })
    await revokedToken.save();
    return res.status(200).json({message:'User logged out successfully'})   
}

// notification
export const notifyUser = async(req,res)=>{
    

    return res.status(200).json({message:'Notification sent successfully'})
}

// delete account

export const deleteUser = async(req,res)=>{
    const {email} = req.params;
    await userModel.destroy({where:{email}});
    return res.status(200).json({message:'User deleted successfully'})
}

