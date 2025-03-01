import joi from 'joi'
import {  isValidObjectId } from '../../middlewares/validation.middleware.js'


// const fileMimeType = {
//     png:"image/png",
//     jpeg:"image/jpeg"
// }

export const updateProfile = joi.object({
    phoneNumber:joi.string(),
    DOB:joi.date().required(),
    firstName:joi.string(),
    lastName:joi.string(),
    gender:joi.string()
}).or("phoneNumber" ,"DOB","firstName","lastName","gender" ).required()



export const getUserData = joi.object({
    userId:joi.custom(isValidObjectId)
}).required()



export const updatePassword = joi.object({
    oldPassword:joi.string().required(),
    newPassword:joi.string().not(joi.ref("oldPassword")).required(),
    confirmNewPassword:joi.string().valid(joi.ref("newPassword")).required()
}).required()


export const updateProfilePicture = joi.object({
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