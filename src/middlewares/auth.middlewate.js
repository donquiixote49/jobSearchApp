import userModel from '../DB/models/user.model.js';
import { verifyToken } from '../utils/token/token.js';

const isAuthenticated = async(req,res,next)=>{
        const {authorization} = req.headers
        if(!authorization || !authorization.startsWith("Bearer")) return next(new Error(`Token is required`,{cause:403}))
            const token = authorization.split(" ")[1];
        const decoded = verifyToken({token})
        const user = await userModel.findById(decoded.id).select('-attemptCount -password').lean()
        if(!user) return next(new Error(`user is not found`,{cause:404}))
            if(parseInt((user.changeCredentialTime?.getTime() ||  0 )  / 1000 ) > decoded.iat )  return next(new Error(` Expired Credentials  `,{cause:400}))
            req.user = user
        return next()
}


export default isAuthenticated;