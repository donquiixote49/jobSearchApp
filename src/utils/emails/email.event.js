import {EventEmitter} from 'events'
import {generateToken} from '../token/token.js'
import sendEmail, { subjects } from './sendEmail.js'
import { accepted, confirmEmail, forgotPassword, rejected } from './generateHtml.js';


export const emailEmitter = new EventEmitter();

emailEmitter.on('sendEmail', async (email,otp)=>{
    const token = generateToken({payload:{email}})
    await sendEmail({
        to:email,
        subject:subjects.register,
        html:confirmEmail(otp)
    })
})
emailEmitter.on('forgotPassword', async (email,otp)=>{
    const token = generateToken({payload:{email}})
    await sendEmail({
        to:email,
        subject:subjects.forgotPassword,
        html:forgotPassword(otp)
    })
})



emailEmitter.on('accepted', async (email)=>{
    const token = generateToken({payload:{email}})
    await sendEmail({
        to:email,
        subject:subjects.jobCompany,
        html:accepted()
    })
})


emailEmitter.on('rejected', async (email)=>{
    const token = generateToken({payload:{email}})
    await sendEmail({
        to:email,
        subject:subjects.jobCompany,
        html:rejected()
    })
})