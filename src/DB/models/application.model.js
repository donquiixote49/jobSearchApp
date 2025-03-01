import { Schema,model,Types } from "mongoose";

export const applicationStatus = {
    pending:"pending",
    accepted:"accepted",
    viewed:"viewed",
    rejected:"rejected"
}



const applicationSchema = new Schema({
    jobId:{
        type:Types.ObjectId,
        ref:"Job",
        required:true
    },
    userId:{
        type:Types.ObjectId,
        ref:"User",
        required:true
    },
    companyId:{
        type:Types.ObjectId,
        ref:"Company",
        required:true
    },
    userCV:{
        secure_url:String,
        public_id:String,
    },
    status:{
        type:String,
        enum:Object.values(applicationStatus),
        default:applicationStatus.pending
    }
},{timestamps:true})


const applicationModel = model("Application",applicationSchema)

export default applicationModel