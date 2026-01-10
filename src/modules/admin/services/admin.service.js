import { compareSync, hashSync } from "bcrypt";
import {adminModel, blacklistTokensModel, dashboardModel} from "../../../DB/models/index.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';


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

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  const checkEmail = await adminModel.findOne({ where: { email } });

  if (!checkEmail) {
    return res.status(400).json({ message: 'Email does not exist' });
  }

  const isMatch = compareSync(password, checkEmail.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid password' });
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
    message: 'Admin logged in successfully',
    token,
  });
};


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


// contact us emails
// adding email and type

export const addEmail = async(req , res)=>{
  const {id} = req.loggedInUser
  const { email , type , place , order} = req.body

  const data = dashboardModel.build({
        email,
        type,
        place,
        order
    });
  
    await data.save();

  return res.status(201).json({message:"email added successfully !" , data})
}

// delete an email
export const deleteEmails = async(req,res)=>{
  const {ids} = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "please select an email to remove !" });
    }
  
  const cleanedIds = ids
      .map((id) => Number(id))
      .filter((id) => Number.isInteger(id) && id > 0);

    if (cleanedIds.length === 0) {
      return res.status(400).json({ message: "No valid ids provided" });
    }

    const deletedCount = await dashboardModel.destroy({
      where: { id: cleanedIds },
    });

    return res.json({
      message: "Deleted successfully",
      deletedCount,
    });
}

// list all emails and types
export const getEmails = async (req, res) => {
  const [jeddahEmails, riyadhEmails, dammamEmails] = await Promise.all([
    dashboardModel.findAll({
      where: { place: "jeddah" },
      order: [["order", "ASC"]],
    }),
    dashboardModel.findAll({
      where: { place: "riyadh" },
      order: [["order", "ASC"]],
    }),
    dashboardModel.findAll({
      where: { place: "dammam" },
      order: [["order", "ASC"]],
    }),
  ]);

  return res.status(200).json({ jeddahEmails, riyadhEmails, dammamEmails });
};
