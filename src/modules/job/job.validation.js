import joi from "joi";
import { isValidObjectId } from "../../middlewares/validation.middleware.js";


export const addJob = joi.object({
    companyId:joi.custom(isValidObjectId).required(),
    jobTitle:joi.string().required(),
    jobLocation:joi.string().required(),
    workingTime:joi.string().required(),
    seniorityLevel:joi.string().required(),
    jobDescription:joi.string().required(),
    technicalSkills:joi.array().items(joi.string()).required(),
    softSkills:joi.array().items(joi.string()).required()
}).required()



export const updateJob = joi.object({
    jobId:joi.custom(isValidObjectId).required(),
    jobLocation:joi.string().required(),
    workingTime:joi.string().required(),
    seniorityLevel:joi.string().required()
}).required()


export const deleteJob = joi.object({
    jobId:joi.custom(isValidObjectId).required()
}).required()


export const getJobOrJobsForSpecificCompany = joi.object({
    jobId:joi.custom(isValidObjectId),
    companyId:joi.custom(isValidObjectId),
    page:joi.number().required()
}).or("jobId ", "companyId").required()


export const getJobsByFilters = joi.object({
    page:joi.number(),
    workingTime:joi.string(),
    jobLocation:joi.string(),
    seniorityLevel:joi.string(),
    jobTitle:joi.string(),
    technicalSkills:joi.string(),
}).required()


export const applyForJob = joi.object({
    jobId:joi.custom(isValidObjectId).required(),
    file:joi.object({
            fieldname:joi.string().required(),
                originalname:joi.string().required(),
                encoding:joi.string().required(),
                mimetype:joi.string().valid("application/pdf").required(), 
                size:joi.number().required(),
                destination:joi.string().required(),
                filename:joi.string().required(),
                path:joi.string().required()
        })
}).required()


export const acceptOrRejectApplication = joi.object({
    applicationId:joi.custom(isValidObjectId).required(),
    action:joi.string().valid("accepted","rejected").required()
}).required()