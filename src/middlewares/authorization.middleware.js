
export const isAuthorized = (role)=>{
        return (req,res,next)=>{
            if(req.user.role !== role ) return next(new Error(`you are not authorized`,{cause:401}))
                return next()
        }
    
}