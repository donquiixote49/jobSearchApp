import companyModel from "../../DB/models/company.model.js"
import jobModel from "../../DB/models/job.model.js"
import applicationModel, { applicationStatus } from '../../DB/models/application.model.js'
import cloudinary from "../../utils/fileUploading/cloudinary.config.js"
import { accessSocket } from "../../socket/index.js";
import userModel from "../../DB/models/user.model.js";
import { emailEmitter } from "../../utils/emails/email.event.js";
import XlSX from 'xlsx'


export const addJob = async (req , res , next)=>{
    const {user} = req 
    const {companyId} = req.params 
    const checkCompany = await companyModel.findById(companyId)
    if(!checkCompany) return next(new Error(`company is not found`,{cause:404}))
        if(checkCompany.isDeleted) return next(new Error(`your company is temporary banned u cant post any job offers`))
        //! check if the logged in user is the owner or company's HR 
    const checkHr = checkCompany.HRs.includes(user._id)
    if(user._id.toString() == checkCompany.createdBy.toString() || checkHr == true ){
        const job = await  jobModel.create({...req.body,addBy:user._id,companyId:checkCompany._id})
        return res.json({success:true,message:`job request added  successfully`,result:{job}})
    }else{return next(new Error(`you are not authorized to add a job request`,{cause:400}))}

}



export const updateJob = async(req,res,next)=>{
    const {user} = req
    const {jobId} = req.params
    const checkJob = await jobModel.findById(jobId)
    if(!checkJob) return next(new Error(`job request is not found`,{cause:404}))
        //! check if the logged in user  is the owner or not 
    const company = await companyModel.findById(checkJob.companyId)
    if(!company) return next(new Error(`company is not found`))
        if(company.createdBy.toString() !== user._id.toString()) return next(new Error('you are not authorized to update'))
            
        
            const updated = await jobModel.updateOne({_id:jobId},{...req.body},{new:true,runValidators:true})
        return res.json({success:true,message:`job request updated successfully`,result:{updated}})

}


export const deleteJob = async(req,res,next)=>{
    const {user} = req
    const {jobId} = req.params
    const job = await jobModel.findById(jobId)
    if(!job) return next(new Error(`job request is not found`,{cause:404}))
    //! check if the company hr related to the job company
    const company = await companyModel.findById(job.companyId)
    if(!company) return next(new Error(`company is not found`,{cause:404}))
        const checkHr = company.HRs.includes(user._id)
        if(!checkHr) return next(new Error(`you are not authorized`))
            await job.deleteOne()
        return res.json({success:true,message:`job request deleted successfully`})

}



export const getJobOrJobsForSpecificCompany =async(req,res,next)=>{
    const {jobId , companyId} = req.params
    const {page , companyName} = req.query
    const limit = 2
    const skip = limit * (page - 1)
    //! return a specific job for a specific company
    if(jobId && companyId){
        const job =  await jobModel.findOne({_id:jobId,companyId:companyId,closed:false})
        if(!job) return next(new Error(`job is not found`,{cause:404}))
            return res.json({success:true,result:{job}})
        //! return all jobs for a specific company
    }else if(companyId){
        const jobs = await jobModel.find({companyId:companyId,closed:false}).skip(skip).limit(limit).sort("createdAt")
        if(!jobs) return next(new Error(`no jobs were found`,{cause:404}))
            const totalCount = await jobModel.countDocuments({companyId:companyId})
            return res.json({success:true,result:{jobs,totalCount:totalCount,page:page}})
            //! return company's Name and address
    }else if(companyName){
        const company = await companyModel.findOne({companyName:companyName}).select("companyName address -_id ")
        if(!company) return next(new Error(`company is not found`,{cause:404}))
            return res.json({success:true,result:{company}})
    }
    
}


export const getJobsByFilters = async(req,res,next)=>{
    const {workingTime , jobLocation , seniorityLevel ,  jobTitle , technicalSkills , page } = req.query
    const limit = 2
    const skip = limit * (page - 1)
    //! filter by working Times 
    if(workingTime){
        const jobs = await jobModel.find({workingTime:new RegExp(workingTime,"i"),closed:false}).skip(skip).limit(limit).sort("createdAt")
        const totalCount = await jobModel.countDocuments({workingTime:new RegExp(workingTime,"i"),closed:false})
        if(!jobs) return next(new Error(`no jobs were found`,{cause:404}))
            return res.json({success:true,result:{jobs,totalCount,page:page}})
        
        //! filter by job location
    }else if(jobLocation){
        const jobs = await jobModel.find({jobLocation:new RegExp(jobLocation,"i"),closed:false}).skip(skip).limit(limit).sort("createdAt")
        const totalCount = await jobModel.countDocuments({jobLocation:new RegExp(jobLocation,"i"),closed:false})
        if(!jobs) return next(new Error(`no jobs were found`,{cause:404}))
            return res.json({success:true,result:{jobs,totalCount,page}})

        //! filter by seniorityLevel
    }else if(seniorityLevel){
        const jobs = await jobModel.find({seniorityLevel:new RegExp(seniorityLevel,"i"),closed:false}).skip(skip).limit(limit).sort("createdAt")
        const totalCount = await jobModel.countDocuments({seniorityLevel:new RegExp(seniorityLevel,"i"),closed:false})
        if(!jobs) return next(new Error(`no jobs were found`,{cause:404}))
            return res.json({success:true,result:{jobs,totalCount,page}})

        //! filter by jobTitle
    }if(jobTitle){
        const jobs = await jobModel.find({jobTitle:new RegExp(jobTitle,"i"),closed:false}).skip(skip).limit(limit).sort("createdAt")
        const totalCount = await jobModel.countDocuments({jobTitle:new RegExp(jobTitle,"i"),closed:false})
        if(!jobs) return next(new Error(`no jobs were found`,{cause:404}))
            return res.json({success:true,result:{jobs,totalCount,page}})

        //! filter by technicalSkills
    }else if(technicalSkills){
        const jobs = await jobModel.find({technicalSkills:{ $in: [new RegExp(technicalSkills, 'i')] },closed:false}).skip(skip).limit(limit).sort("createdAt")
        const totalCount = await jobModel.countDocuments({technicalSkills:{ $in: [new RegExp(technicalSkills, 'i')] },closed:false})
        if(!jobs) return next(new Error(`no jobs were found`,{cause:404}))
            return res.json({success:true,result:{jobs,totalCount,page}})
        //! if no filter return all jobs if it's closed == false
    }else{
        const jobs = await jobModel.find({closed:false}).skip(skip).limit(limit).sort("createdAt")
        if(!jobs) return next(new Error(`no jobs were found`))
            const totalCount = await jobModel.countDocuments({closed:false})
            return res.json({success:true,result:{jobs,totalCount,page}})
    }

}


export const applyForJob = async(req,res,next)=>{
    const {user} = req;
    const {jobId} = req.params
    const io = accessSocket()
    const job = await jobModel.findById(jobId)
    if(!job) return next(new Error(`job is not found`,{cause:404})) 
        let pdf ;
    
        if(!req.file) return next(new Error(` you have yo upload your cv to apply to this job`))
        const {secure_url , public_id} = await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.CLOUD_FOLDER_NAME}/users/${user._id}/Cvs`})
        pdf = {secure_url,public_id}
        const application = await applicationModel.create({jobId:jobId,companyId:job.companyId,userId:user._id,userCV:pdf})
        io.emit("notifyHr",{message:`a new application has been submitted`,userData:application})
        return res.json({success:true,message:`you applied to the job successfully`,result:{application}})
        
        
        
}


export const acceptOrReject = async(req,res,next)=>{
    const {user} = req
    const {action} = req.query
    const {applicationId} = req.params
    const application = await applicationModel.findById(applicationId)
    const applicant = await userModel.findById(application.userId) 
    if(!applicant) return next(new Error(`user is not found`,{cause:404}))
    //! check for application
    if(!application) return next(new Error(`application is not found`,{cause:404}))
        //! check if the logged in user is hr related to the company that the Applicant applied at 
    const job = await jobModel.findById(application.jobId)
    if(!job) return next(new Error(`job is not found`,{cause:404}))
        const company = await companyModel.findById(job.companyId)
    if(!company) return next(new Error(`company is not found`,{cause:404}))
        const checkHr = company.HRs.includes(user._id)
    if(!checkHr) return next(new Error(`you are not authorized`,{cause:400}))
    //! check if the action coming from req.query is  accepted or rejected
    if(!action) return next(new Error(`action is required`))
        if(action == applicationStatus.accepted){
                application.status = applicationStatus.accepted
                await application.save()
                emailEmitter.emit("accepted",applicant.email)
                return res.json({success:true,message:`you accepted an application`})
        }else if(action == applicationStatus.rejected){
            application.status = applicationStatus.rejected
            await application.save()
            emailEmitter.emit("rejected",applicant.email)
            return res.json({success:true,message:`you reject an application`})

        }
    
}


export const getExcelFile =  async(req,res,next)=>{
    const {date , companyId} = req.params

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0); 
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999)


    const apps = await applicationModel.find({companyId ,createdAt:{ $gte: startOfDay, $lte: endOfDay } }).populate("userId","firstName email ").populate("jobId","jobTitle ")
    if(!applicationModel.length) return next(new Error(` no applications were found `))
        const workBook =XlSX.utils.book_new()
    const worksheetData = apps.map(app => ({
        UserName:app.userId.firstName , 
        UserEmail:app.userId.email,
        JobTitle:app.jobId.jobTitle,
        ApplicationDate: app.createdAt.toISOString().split('T')[0],
        Status: app.status
    }));
    const workSheet = XlSX.utils.json_to_sheet(worksheetData);
    XlSX.utils.book_append_sheet(workBook,workSheet,"Applications")
    const filePath = `./applications_${companyId}_${date}.xlsx`
    XlSX.writeFile(workBook,filePath)
    res.json({success:true,message:`your applications excel files is created successfully and here's the filePath ==>${filePath}`})
          
}

 