import userModel from "../../../DB/models/user.model.js";
import { verifyToken } from "../../../utils/token/token.js";

export const graphQlAuth = (resolver)=>{
   return async(parent,arg,context)=>{
    const {authorization} = context
    if(!authorization || !authorization.startsWith("Bearer")) return new Error(`Token is required`,{cause:403})
        const token = authorization.split(" ")[1];
    const decoded = verifyToken({token})
    const user = await userModel.findById(decoded.id).select('-attemptCount -password').lean()
    if(!user) return new Error(`user is not found`,{cause:404})
        if(parseInt((user.changeCredentialTime?.getTime() ||  0 )  / 1000 ) > decoded.iat )  return new Error(` Expired Credentials  `,{cause:400})
        context.user = user
    return resolver(parent,arg,context)
   }
}


export default graphQlAuth;