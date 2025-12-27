import { userModel, blacklistTokensModel, adminModel } from "../../../DB/models/index.js";
import { compareSync } from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { hashSync } from "bcrypt";
import { sendSimpleEmail } from "../../../utils/email-handler.utils.js";
import { where } from "sequelize";

export const signInUser = async (req, res) => {
  const { email, password } = req.body;
  // check if the email exists
  const checkEmail = await userModel.findOne({ where: { email } });
  if (!checkEmail) {
    return res.status(400).json({ message: "Email does not exist" });
  }
  const isMatch = compareSync(password, checkEmail.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid password" });
  }
  const jti = uuidv4(); // ✅ generate unique token ID

  const token = jwt.sign(
    {
      id: checkEmail.id,
      jti, // ✅ include jti
    },
    process.env.JWT_SECRET_LOGIN,
    {
      expiresIn: "1h",
    }
  );
  return res.status(200).json({
    message: "User logged in successfully",
    userName: checkEmail.userName,
    token,
  });
};

// signup
export const signUpUser = async (req, res) => {
  const { userName, email, password, phoneNumber } = req.body;
  // check if the email exists
  const checkEmail = await userModel.findOne({ where: { email } });
  if (checkEmail) {
    return res.status(400).json({ message: "Email already exists" });
  }
  const hashedPassword = hashSync(password, +process.env.SALT);
  const data = userModel.build({
    userName,
    email,
    password: hashedPassword,
    phoneNumber,
  });
  await data.save();
  return res.status(201).json({ message: "User created successfully", data });
};

// logout
export const logOutUser = async (req, res) => {
  const { accesstoken } = req.headers;
  const decodedData = jwt.verify(accesstoken, process.env.JWT_SECRET_LOGIN);
  const checkIfExist = await blacklistTokensModel.findOne({
    where: { tokenId: accesstoken },
  });
  if (checkIfExist) {
    return res.status(400).json({ message: "User already logged out" });
  }
  const revokedToken = blacklistTokensModel.build({
    tokenId: accesstoken,
    expiryDate: decodedData.exp,
  });
  await revokedToken.save();
  return res.status(200).json({ message: "User logged out successfully" });
};

// notification
export const notifyUser = async (req, res) => {
  return res.status(200).json({ message: "Notification sent successfully" });
};

// delete account

export const deleteUser = async (req, res) => {
  const { email } = req.body;
  const checkEmail = await userModel.findOne({ where: { email } });
  if (!checkEmail) {
    return res.status(400).json({ message: "Email does not exist" });
  }
  await userModel.destroy({ where: { email } });
  return res.status(200).json({ message: "User deleted successfully" });
};
// forgot password
export const changePassword = async (req, res) => {
  const { email } = req.body;
  const user = await userModel.findOne({ where: {email} });
  if (!user) {
    return res.status(400).json({ message: "Email does not exist" });
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = hashSync(otp , +process.env.SALT);
  const html = `
    <h1>request to change password</h1>
    <p>OTP: ${otp}</p>
    <p>Please don't share this otp with anyone !</p>
    `;
  await sendSimpleEmail({
    to: email,
    subject: "forget the password",
    html,
  });

  await userModel.update(
    { OTP:hashedOtp },
    { where: { email } } // or just { where: { email } }
  );

  return res.status(200).json({ message: "otp sent successfully" });
};

// reseting password
export const resetPassword = async (req,res)=>{
    const {email,otp,newPassword}=req.body;
    const checkUser = await userModel.findOne({where:{email}})
    if(!checkUser){
        return res.status(401).json({message:"this email is not available"});
    }
    const isOtpMatched = compareSync(otp, checkUser.OTP) ;
    if(!isOtpMatched){
        return res.status(401).json({message:"invalid otp"});
    }

    const newHashedPass = hashSync(newPassword,+process.env.SALT);

    await userModel.update(
    { password:newHashedPass },
    { where: { email } } // or just { where: { email } }
  );

  return res.status(200).json({message:"password updated successfully"});
}

// changing phone number
export const changePhone = async (req,res)=>{
    const {id} = req.loggedInUser;
    const {oldPhoneNumber , newPhoneNumber} = req.body;
    const user =  await userModel.findOne({where:id});
    if(!user){
        return res.status(401).json({message:"user is not logged in"});
    }
    if(user.phoneNumber !== oldPhoneNumber ){
        return res.status(401).json({message:"user's old phone number is not correct!"});
    }

    await userModel.update(
        {phoneNumber:newPhoneNumber},
        {where:{id}}
    )

    return res.status(200).json({message:"phone number changed successfully"});
}

// hit false true
export const hitMobile = async (req,res)=>{
   const {toggleIos , toggleAnd} = req.body;

   const test = await adminModel.findOne({where:{id:1}});

   test.name = toggleIos;
   test.email = toggleAnd;
   await test.save();
   return res.status(200).json({IOS:test.name , ANDRIOD:test.email})
   

   
}

export const getMobile = async (req,res)=>{
   const test = await adminModel.findOne({where:{id:1}});
   

   return res.status(200).json({Ios:test.name , Andriod:test.email})
}