import nodemailer from 'nodemailer'


const sendEmail = async({to,subject,html})=>{
    // sender 
        const transporter = nodemailer.createTransport({
            host:"smtp.gmail.com",
            port:465,
            auth:{
                user:process.env.EMAIL,
                pass:process.env.PASSWORD
            }
        })

            // Receiver 

            const info = await transporter.sendMail({
                from:`"job search app" <donquiixote49@gmail.com> `,
                to,
                subject,
                html
            })
            return info.rejected.length ? true : false;
}

export const otpType = {
    confirmEmail:"confirmEmail"
}

export const subjects = {
    register:`Activate Your Account`,
    forgotPassword:`Reset Your Password`,
    viewHistory:`here's ur profile view history`,
    twoStepVerification:`Activate two step verification`,
    loginTwoStepVerification:`login two step verification`,
    jobCompany:"the company u applied for "

}

export default sendEmail