import companyModel from "../../DB/models/company.model.js"
import userModel from "../../DB/models/user.model.js"
import { nanoid } from "nanoid"
import cloudinary from "../../utils/fileUploading/cloudinary.config.js"


export const addCompany = async(req ,res , next)=>{
    const {user} = req 
    const checkCompany = await companyModel.findOne({companyName:req.body.companyName , companyEmail:req.body.companyEmail})
    if(checkCompany) return next(new Error(`this company already exist`,{cause:400}))
        const company = await companyModel.create({...req.body,createdBy:user._id})
        // user.isOwner={status:true,companyId:company._id} = user
        
        return res.json({success:true,message:`your company is added successfully`,result:{company}})
}



export const addHr = async(req,res,next)=>{
    const {user} = req;
    const {userId,companyId} = req.params
    const checkCompany = await companyModel.findById(companyId)
    //! check if the company exist
    if(!checkCompany) return next(new Error('this company does not exist',{cause:404}))
        //! check if the logged in  user is the owner of the company
        if(checkCompany.createdBy.toString() !== user._id.toString()) return next(new Error(`you are not authorized `,{cause:400}))
            //! check if the user exists before adding to hr 
    const checkUser = await userModel.findById(userId).lean()
    if(!checkUser) return next(new Error('this user does not exist',{cause:404}))
        //! check if the user is already in hr or not 
        const checkHrExist = checkCompany.HRs.includes(userId)
    if(checkHrExist) return next(new Error('this user already added to hr before '))
        //! adding the user to hr 
        checkCompany.HRs.push(checkUser._id)
            checkCompany.save()
        return res.json({success:true,message:`user add to Hrs successfully`})
        
    
}



export const updateCompany = async(req,res,next)=>{
    const {user} = req  
    const {companyId} = req.params
    const checkCompany = await companyModel.findById(companyId)
    if(!checkCompany) return next(new Error(`company is not found`))
        if(checkCompany.createdBy.toString() == user._id.toString() ) {
            const updated = await companyModel.findByIdAndUpdate(companyId,{...req.body},{new:true,runValidators:true})
            return res.json({success:true,message:`company's data updated successfully`,result:{updated}})
        }else{return next(new Error(`you are not authorized only company's owner  can update company's data`,{cause:400}))}
}


export const softDeleteCompany = async(req,res,next)=>{
    const {user} = req
    const {companyId} = req.params
    const checkCompany = await companyModel.findById(companyId)
    //! check if the company exist
    if(!checkCompany) return next(new Error('this company does not exist',{cause:404}))
        //! check if the user is the owner of the company
        if(checkCompany.createdBy.toString() !== user._id.toString()) return next(new Error(`you r not authorized `,{cause:400}))
            checkCompany.deletedAt = Date.now()
        checkCompany.isDeleted = true
        checkCompany.save()
        return res.json({success:true,message:`company is soft deleted successfully`})
}


export const getSpecificCompanyJobs = async(req,res,next)=>{
    const {user} = req
    const {companyId} = req.params
    const company = await companyModel.findById(companyId).select("companyName industry description address jobs HRs createdBy ").populate("jobs")
     if(!company) return next(new Error(`company is not found`,{cause:404}))
        if(!company.jobs.length) return next(new Error(` this company ${company.companyName} has no job offers`))
    const checkHr = company.HRs.includes(user._id)
    if(company.createdBy.toString() == user._id.toString() || checkHr == true ){
        return res.json({success:true,result:{company}})
    }else{
        return next(new Error(`you are not authorized`,{cause:400}))
    }
}



export const uploadLogo = async(req,res,next)=>{
    const {user} = req;
    const {companyId} = req.params
    const checkCompany = await companyModel.findById(companyId)
    if(checkCompany.createdBy.toString() !== user._id.toString()) return next(new Error(`you r not authorized `,{cause:400}))
    let image ;
    if(!req.file) return next(new Error(`you have to import an image to update your company's logo`))
        const {secure_url , public_id} = await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.CLOUD_FOLDER_NAME}/companies/${checkCompany._id}/companyPictures/logoPictures`});
    image = {secure_url,public_id}
    const updated = await companyModel.updateOne({_id:companyId},{companyLogo:image})
    return res.json({success:true,message:`company logo is updated successfully`})

}



export const uploadCover = async(req,res,next)=>{
    const {user} = req;
    const {companyId} = req.params
    const checkCompany = await companyModel.findById(companyId)
    if(checkCompany.createdBy.toString() !== user._id.toString()) return next(new Error(`you r not authorized `,{cause:400}))
    let image ;
    if(!req.file) return next(new Error(`you have to import an image to update your company's cover pic`))
        const {secure_url , public_id} = await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.CLOUD_FOLDER_NAME}/companies/${checkCompany._id}/companyPictures/coverPicture`});
    image = {secure_url,public_id}
    const updated = await companyModel.updateOne({_id:companyId},{coverPicture:image})
    return res.json({success:true,message:`compony cover picture is updated successfully`})

}



export const getCompanyByName = async(req,res,next)=>{
    const {user} = req
    const {companyName} = req.query
    const checkCompany = await companyModel.findOne({companyName:companyName}).lean()
    if(!checkCompany) return next(new Error(`company is not found`))
        return res.json({success:true,result:{checkCompany}})
}



export const deleteLogo = async(req,res,next)=>{
    const {user} = req;
    const {companyId} = req.params
    const checkCompany = await companyModel.findById(companyId)
    if(checkCompany.createdBy.toString() !== user._id.toString()) return next(new Error(`you r not authorized `,{cause:400}))
     await cloudinary.uploader.destroy(checkCompany.companyLogo.public_id)
     await companyModel.updateOne({_id:checkCompany._id},{companyLogo:null})
      return res.json({success:true,message:`company logo is deleted successfully`})
}


export const deleteCover = async(req,res,next)=>{
    const {user} = req;
    const {companyId} = req.params
    const checkCompany = await companyModel.findById(companyId)
    if(checkCompany.createdBy.toString() !== user._id.toString()) return next(new Error(`you r not authorized `,{cause:400}))
     await cloudinary.uploader.destroy(checkCompany.coverPicture.public_id)
     await companyModel.updateOne({_id:checkCompany._id},{coverPicture:null})
     return res.json({success:true,message:`company cover is deleted successfully`})
}






