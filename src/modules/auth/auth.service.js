import userModel, { otpTypes, providers } from "../../DB/models/user.model.js";
import otpGenerator from "otp-generator";
import { emailEmitter } from "../../utils/emails/email.event.js";
import { compareHash, hash } from "../../utils/hash/hashing.js";
import corn from 'node-cron'

import { generateToken, verifyToken } from "../../utils/token/token.js";
import { OAuth2Client } from "google-auth-library";

export const register = async (req, res, next) => {
  const { email } = req.body;
  const checkUser = await userModel.findOne({ email });
  const otp = otpGenerator.generate(7, { specialChars: false });
  const hashOtp = hash({ plainText: otp });
  if (checkUser)
    return next(new Error(`this email already exists`, { cause: 400 }));
  const user = await userModel.create({ ...req.body,OTP:{code:hashOtp,codeType:otpTypes.confirmEmail,expireIn:Date.now() + 10 * 60 * 1000} });
  
  emailEmitter.emit("sendEmail", email, otp);
 
  // user.OTP.push({
  //   code: hashOtp,
  //   codeType: otpTypes.confirmEmail,
  //   expireIn: Date.now() + 10 * 60 * 1000,
  // });
  return res.status(201).json({
    success: true,
    message: `user created successfully, please check your email for confirmation code  `,
    result: { user },
  });
};

export const confirmEmailOtp = async (req, res, next) => {
  const { email, otp } = req.body;
  const user = await userModel.findOne({ email });
  if (!user)
    return next(new Error(`this email does not exist`, { cause: 404 }));
  const checkOtp = user.OTP.find((e) => e.codeType == otpTypes.confirmEmail);
  if (!checkOtp) return next(new Error(`invalid otp type`, { cause: 400 }));
  const match = compareHash({ plainText: otp, hash: checkOtp.code });
  console.log(match);
  
  if (!match) return next(new Error(`in-valid otp`, { cause: 400 }));
  
  
  if (parseInt(checkOtp.expireIn?.getTime()) < parseInt(Date.now()))
    return next(new Error(`this otp is expired`, { cause: 400 }));
  await userModel.updateOne({_id:user._id},{isConfirmed:true})
  return res.json({ success: true, message: `you are ready to login` });
};

export const loginBySystem = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user)
    return next(new Error(`this email does not exist`, { cause: 404 }));
    console.log(password);
    const compare = compareHash({ plainText: password, hash: user.password });
    console.log(compare);
    
  if (!compare) return next(new Error(`in-valid password `, { cause: 400 }));
  if (!user.isConfirmed)
    return next(
      new Error(`please activate your email before  you try to login`, {
        cause: 400,
      })
    );
  if(user.isDeleted){
   await userModel.updateOne({_id:user._id},{isDeleted:false})
  }
  const accessToken = generateToken({
    payload: { id: user._id, isLogged: true },
    options: { expiresIn: process.env.TOKEN},
  });
  const refreshToken = generateToken({
    payload: { id: user._id, isLogged: true },
    options: { expiresIn: process.env.REFRESH_TOKEN },
  });
  return res.json({
    success: true,
    message: `user logged in successfully`,
    accessToken: accessToken,
    refreshToken: refreshToken,
  });
};

export const loginByGmail = async (req, res, next) => {
  const { idToken } = req.body;
  const client = new OAuth2Client();
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
  }

  const userData = await verify();

  const { email_verified, email, given_name, family_name } = userData;

  if (!email_verified) return next(new Error(`in-valid email`, { cause: 404 }));

  const user = await userModel.create({
    email,
    firstName: given_name,
    lastName: family_name,
    isConfirmed: true,
    provider: providers.google,
  });
  const accessToken = generateToken({
    payload: { id: user._id, isLogged: true },
    options: { expiresIn: process.env.TOKEN },
  });
  const refreshToken = generateToken({
    payload: { id: user._id, isLogged: true },
    options: { expiresIn: process.env.REFRESH_TOKEN },
  });

  return res.json({
    success: true,
    message: `logged in successfully`,
    accessToken: accessToken,
    refreshToken: refreshToken,
  });
};

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) return next(new Error(`in-valid email `, { cause: 404 }));
  const otp = otpGenerator.generate(7, { specialChars: false });
  emailEmitter.emit("forgotPassword", email, otp);
  const hashOtp = hash({ plainText: otp });
  user.OTP.push({
    code: hashOtp,
    codeType: otpTypes.forgotPassword,
    expireIn: Date.now() + 10 * 60 * 1000,
  });
  user.save();
  return res.json({
    success: true,
    message: `please check your email for an otp to reset your password`,
  });
};

export const resetPassword = async (req, res, next) => {
  const { email, otp, newPassword, confirmNewPassword } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) return next(new Error(`in-valid email `, { cause: 404 }));

  //! checking OTP
  const checkOtp = user.OTP.filter(
    (e) => e.codeType == otpTypes.forgotPassword
  ).sort((a, b) => b.expireIn - a.expireIn)[0];
  if (!checkOtp) return next(new Error(`invalid otp type`, { cause: 400 }));
  const compare = compareHash({ plainText: otp, hash: checkOtp.code });
  if (!compare) return next(new Error(`in-valid otp`, { cause: 400 }));
  if (parseInt(checkOtp.expireIn?.getTime()) < parseInt(Date.now()))
    return next(new Error(`this otp is expired`, { cause: 400 }));

  //! ResetPassword
  if(newPassword !== confirmNewPassword) return next(new Error(`newPassword must match confirmNewPassword`))
  const hashPassword = hash({ plainText: newPassword });
  await userModel.updateOne(
    { email },
    { password: hashPassword, changeCredentialTime: Date.now() },
    { new: true, runValidators: true }
  );
  return res.json({ success: true, message: `password reset successfully` });
};

export const newAccess = async (req, res, next) => {
  const { refreshToken } = req.body;
  const payload = verifyToken({ token: refreshToken });
  const user = await userModel.findById(payload.id);
  if (!user) return next(new Error(`user is not found`, { cause: 404 }));
  if (
    parseInt((user.changeCredentialTime.getTime() || 0) / 1000) >= payload.iat
  ) {
    return next(new Error(`please log in again`, { cause: 400 }));
  }
  const token = generateToken({
    payload: { id: user._id, email: user.email },
    options: { expiresIn: process.env.TOKEN},
  });
  return res.json({ success: true, results: { token } });
};


corn.schedule('0 */6 * * *', async ()=>{
  console.log('Running CRON job to delete every expired otp in the DB ');
  const currentTime = new Date()
  const result = await userModel.updateMany(
    { 'OTP.expireIn': { $lt: currentTime } }, 
    { $pull: { OTP: { expireIn: { $lt: currentTime } } } } 
  );
  console.log(result.modifiedCount);
  
})