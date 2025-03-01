import joi from "joi";
import { isValidObjectId } from "../../middlewares/validation.middleware.js";

export const addCompany = joi.object({
    companyName:joi.string().required(),
    description:joi.string().required(),
    industry:joi.string().required(),
    address:joi.string().required(),
    numberOfEmployees: joi.string()
    .pattern(/^\d+-\d+$/)
    .required()
    .messages({
      'string.pattern.base': 'Number of employees must be in the format "min-max" (e.g., 11-20)',
      'any.required': 'Number of employees is required',
    }),
    companyEmail:joi.string().email().required(),
}).required()


export const addHr = joi.object({
    companyId:joi.custom(isValidObjectId).required(),
    userId:joi.custom(isValidObjectId).required(),
}).required()

export const getCompanyByName = joi.object({
    companyName:joi.string().required(),

}).required()

export const getCompanyJobs = joi.object({
    companyId:joi.custom(isValidObjectId).required()
}).required()


export const updateCompany = joi.object({
    companyId:joi.custom(isValidObjectId).required(),
    companyName:joi.string().required(),
    description:joi.string().required(),
    industry:joi.string().required(),
    address:joi.string().required(),
    numberOfEmployees: joi.string()
    .pattern(/^\d+-\d+$/)
    .required()
    .messages({
      'string.pattern.base': 'Number of employees must be in the format "min-max" (e.g., 11-20)',
      'any.required': 'Number of employees is required',
    }),
    companyEmail:joi.string().email().required()
}).required()

export const softDeleteCompany = joi.object({
    companyId:joi.custom(isValidObjectId).required()
}).required()

export const uploadLogo = joi.object({
    companyId:joi.custom(isValidObjectId).required(),
    file:joi.object({
            fieldname:joi.string().required(),
                originalname:joi.string().required(),
                encoding:joi.string().required(),
                mimetype:joi.string().valid("image/png","image/jpeg").required(), 
                size:joi.number().required(),
                destination:joi.string().required(),
                filename:joi.string().required(),
                path:joi.string().required()
        })
}).required()


export const deleteLogo = joi.object({
    companyId:joi.custom(isValidObjectId).required()
}).required()

