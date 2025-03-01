import userModel from "../../DB/models/user.model.js";
import { verifyToken } from "../../utils/token/token.js";


const socketAuth = async(socket,next)=>{
    
        const authorization =  socket.handshake.auth.authorization
        if(!authorization || !authorization.startsWith("Bearer")) return next(new Error(`Token is required`,))
            const token = authorization.split(" ")[1];
        const decoded = verifyToken({token})
        const user = await userModel.findById(decoded.id).select('-attemptCount -password').lean()
        if(!user) return next(new Error(`user is not found`))
            socket.user = user
            socket.id = user._id
        return next()
}


export default socketAuth;
