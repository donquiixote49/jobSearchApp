import userModel from "../../DB/models/user.model.js";
import { decrypt, encrypt } from "../../utils/encryption/encryption.js";
import { compareHash, hash } from "../../utils/hash/hashing.js";
import cloudinary from '../../utils/fileUploading/cloudinary.config.js'

export const updateProfile = async (req, res, next) => {
  const { user } = req;
  if (req.body.email || req.body.password)
    return next(new Error(`not allowed to updated email or password`));
  if (req.body.phoneNumber) {
    req.body.phoneNumber = encrypt({ plainText: req.body.phoneNumber });
  }
  const updatedProfile = await userModel.findByIdAndUpdate(
    user._id,
    { ...req.body },
    { new: true, runValidators: true }
  );
  return res.json({
    success: true,
    message: `profile updated successfully`,
    result: { updatedProfile },
  });
};

export const getLoginUser = async (req, res, next) => {
  const user = await userModel.findById(req.user._id)
  console.log(user.username);
  

  if (!user) return next(new Error("user not found ", { cause: 404 }));
  return res.json({ success: true, result: { user } });
};

export const getUserData = async (req, res, next) => {
  
const {userId} = req.params
const user = await userModel.findById(userId)
if(!user) return next(new Error(`user is not found `,{cause:404}))
  return res.json({ success: true, result: { user  } });
};

export const updatePassword = async (req, res, next) => {
  const { user } = req;
  

  //!user in the auth middleware does not return user password so i had to get the user again

  const getUser = await userModel.findById(user._id);

  const { oldPassword, newPassword, confirmNewPassword } = req.body;
  const compare = compareHash({
    plainText: oldPassword,
    hash: getUser.password,
  });

  if (!compare) return next(new Error(`in-valid old password`, { cause: 400 }));
  if (newPassword !== confirmNewPassword)
    return next(new Error(`newPassword must match confirmNewPassword`));
  const updated = await userModel.updateOne(
    {_id:user._id},
    {
      password: hash({ plainText: newPassword }),
      changeCredentialTime: Date.now(),
    },
    { new: true, runValidators: true }
  );
  return res.json({
    success: true,
    message: `password updated successfully`,
    result: { updated },
  });
};


export const uploadProfilePic = async(req,res,next)=>{
    const {user} = req;
    let image ;
    if(!req.file) return next(new Error(`you have to import an image to update your profile picture`))
        const {secure_url , public_id} = await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.CLOUD_FOLDER_NAME}/users/${user._id}/profilePictures`});
    image = {secure_url,public_id}
    const updated = await userModel.updateOne({_id:user._id},{profilePicture:image})
    return res.json({success:true,message:`profile Picture is updated successfully`})

}




export const uploadCoverPic = async(req,res,next)=>{
    const {user} = req;
    let image ;
    if(!req.file) return next(new Error(`you have to import an image to update your cover picture`))
        const {secure_url , public_id} = await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.CLOUD_FOLDER_NAME}/users/${user._id}/coverPictures`});
    image = {secure_url,public_id}
    const updated = await userModel.updateOne({_id:user._id},{coverPicture:image})
    return res.json({success:true,message:`cover picture is updated successfully`})

}


export const deleteProfilePic = async(req,res,next)=>{
    const {user} = req;
    const defaultPic= {
        secure_url:"https://res.cloudinary.com/dttgwrr55/image/upload/v1740264470/vecteezy_default-male-avatar-profile-icon-social-media-chatting_25337669_faagmc.jpg",
        public_id:"vecteezy_default-male-avatar-profile-icon-social-media-chatting_25337669_faagmc"
    }
     await cloudinary.uploader.destroy(user.profilePicture.public_id)
     await userModel.updateOne({_id:user._id},{profilePicture:defaultPic})
     return res.json({success:true,message:`profile picture is deleted successfully`})
}

export const deleteCoverPic = async(req,res,next)=>{
    const {user} = req;
     await cloudinary.uploader.destroy(user.coverPicture.public_id)
     await userModel.updateOne({_id:user._id},{coverPicture:null})
     return res.json({success:true,message:`cover picture is deleted successfully`})
}




export const deactivateAccount = async(req,res,next)=>{
    const {user} = req 
    const updatedUser = await userModel.findByIdAndUpdate(user._id,{isDeleted:true,deletedAt:Date.now()},{new:true})
    return res.status(200).json({success:true,message:`user deactivated  successfully`,result:{updatedUser}})
}


