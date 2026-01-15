import { compareSync, hashSync } from "bcrypt";
import {adminModel, blacklistTokensModel, dashboardModel, newsModel} from "../../../DB/models/index.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import { nanoid } from "nanoid";
import { cloudinary } from "../../../config/cloudinary.config.js";


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

  
  
 

    if (!ids) {
      return res.status(400).json({ message: "No valid ids provided" });
    }

    const deletedCount = await dashboardModel.destroy({
      where: { id: ids },
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

// news section
// adding new posts
export const addNewsPost = async(req , res)=>{
  const {id} = req.loggedInUser
  const { title , content } = req.body;

  const data = {
    title,
    content
  }

  if(req.files?.length){
        const folderId = nanoid(4)
        let images = {
            URLS :[],
            folderId
        }
        for (const file of req.files) {
            const {secure_url, public_id} =await cloudinary().uploader.upload(file.path,{
                folder : `${process.env.CLOUD_FOLDER}/posts/${folderId}`
            })
            images.URLS.push({secure_url,public_id});
        }
        data.images = images
    }
  
    const post = await newsModel.create(data);
    return res.status(201).json({message:"Post added successfully !" , data})
}



// listing all posts
export const listPosts = async(req,res)=>{
  const data = await newsModel.findAll({
  order: [["created_at", "DESC"]],
});
  return res.status(200).json({message:'Posts listed successfully',data})
}


// delete post
export const deletePost = async(req,res)=>{
  const {ids} = req.body;


  if (!ids) {
      return res.status(400).json({ message: "No valid ids provided" });
    }
    const selectedPost = await newsModel.findOne({ where: { id: ids } })

    const deletedPostImages = selectedPost.images.URLS.map((image) => image.public_id);

    await cloudinary().api.delete_resources(deletedPostImages);
    await cloudinary().api.delete_folder(`${process.env.CLOUD_FOLDER}/posts/${selectedPost.images.folderId}`);

    const deletedPost = await newsModel.destroy({
      where: { id: ids },
    });

    


    

    return res.json({
      message: "Deleted successfully",
      deletedPost,
    });
}