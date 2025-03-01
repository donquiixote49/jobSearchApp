import joi from 'joi'
// import { ageValidation } from '../../middlewares/validation.middleware.js'


export const registerValidation = joi.object({
    firstName:joi.string().min(3).required(),
    lastName:joi.string().min(3).required(),
    email:joi.string().email().required(),
    password:joi.string().required(),
    confirmPassword:joi.string().valid(joi.ref('password')).required(),
    DOB:joi.date().required(),
    phoneNumber:joi.string().required(),
}).required()


export const confirmOtp = joi.object({
    email:joi.string().email().required(),
    otp:joi.string().required()
}).required()



export const loginValidation = joi.object({
    email:joi.string().email().required(),
    password:joi.string().required()
}).required()



export const loginWithGmail= joi.object({
    idToken:joi.string().required()
}).required()

export const forgotPassword = joi.object({
    email:joi.string().email().required()
}).required()
export const resetPassword = joi.object({
    email:joi.string().email().required(),
    otp:joi.string().required(),
    newPassword:joi.string().required(),
    confirmNewPassword:joi.string().valid(joi.ref('newPassword')).required(),
}).required()

export const newAccess =joi.object({
    refreshToken:joi.string().required()
})
