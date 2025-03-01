
const invalidApi = (req,res,next)=>{
    next(new Error(`IN-VALID APi `,{cause:404}))

}

export default invalidApi