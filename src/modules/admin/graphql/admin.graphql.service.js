import companyModel from "../../../DB/models/company.model.js"
import userModel, { roles } from "../../../DB/models/user.model.js"


export const allUsers =async (parent ,args ,context)=>{
    const {user } = context
    if(user.role != roles.admin) return new Error(`you are not authorized`)
    
        const users = await userModel.find()
        if(!users) return new Error(' no users were found')
        return users
}


export const allCompanies = async(parent,args,context)=>{
    const {user } = context
    if(user.role != roles.admin) return new Error(`you are not authorized`)
    
    const companies = await companyModel.find()
    if(!companies) return new Error(`no companies were found`)
        return companies
}



export const unBanOrBanUser = async(parent ,args,context)=>{
    const {user} = context
    const {id} = args
    if(user.role != roles.admin) return new Error(`you are not authorized`)
        if(!args) return new Error(`user id is required`,{cause:400})
        const checkUser = await userModel.findById(id)
        if(!checkUser) return new Error(`user is not found`,{cause:404})
            if(checkUser.bannedAt != null ) {
                checkUser.bannedAt = null
                await checkUser.save() 
                return {success:true,message:`user is unbanned successfully`,statusCode:200}
            }else{
                checkUser.bannedAt = Date.now()
                checkUser.save()
                return {success:true,message:`user is banned successfully`,statusCode:200}
            }
               

}

export const unBanOrBanCompany = async(parent ,args,context)=>{
    const {user} = context
    const {id} = args
    if(user.role != roles.admin) return new Error(`you are not authorized`)
        const company = await companyModel.findById(id)
        if(!company) return new Error(`company is not found`,{cause:404})
            if(company.bannedAt != null ) {
                company.bannedAt = null
                await company.save() 
                return {success:true,message:`company is unbanned successfully`,statusCode:200}
            }else{
                company.bannedAt = Date.now()
                await company.save()
                return {success:true,message:`company is banned successfully`,statusCode:200}
            }
               

}



export const approveCompany = async(parent,args,context)=>{
        const {user } = context
        const {id} = args
        if(user.role != roles.admin) return new Error(`you are not authorized`)
            const company = await companyModel.findById(id)
        if(!company) return new Error(`company is not found`,{cause:404})
            if(company.approvedByAdmin) return {
                success:false,
                message:`this company is already approved by an admin`,
                statusCode:400
            } 
            company.approvedByAdmin = true,
            await company.save()
            return {
                success:true,
                message:`company is approved successfully`,
                statusCode:200
            }
} 

