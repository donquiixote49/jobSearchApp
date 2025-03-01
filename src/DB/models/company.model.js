import { Schema , model ,Types } from "mongoose";
import jobModel from "./job.model.js";



const companySchema = new Schema({
    companyName:{
        type:String,
        unique:true,
        minlength:[3,`company name muse be at least 3 chars`],
        required:true
    },
    description:{
        type:String,
        required:true,

    },
    industry:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true
    },
    numberOfEmployees:{
        type:String
    },
    companyEmail:{
        type:String,
        unique: [true, `email must be unique`],
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, `email must be valid`],
    },
    createdBy:{
        type:Types.ObjectId,
        ref:"User"
    },
    companyLogo:{
        secure_url:String,
        public_id:String,
    },
    coverPicture:{
        secure_url:String,
        public_id:String,
    },
    HRs:[{
        type:Types.ObjectId,ref:"User"
    }],
    bannedAt:{
        type:Date
    },
    isDeleted:{
        type:Boolean,
        default:false,
    },
    deletedAt:{
        type:Date,
    },
    legalAttachment:{
        secure_url:String,
        public_id:String,
    },
    approvedByAdmin:{
        type:Boolean,
        default:false
    }
    

},{timestamps:true})


companySchema.virtual("jobs",{
    ref:"Job",
    localField:"_id",
    foreignField:"companyId"
})

companySchema.set('toObject', { virtuals: true });
companySchema.set('toJSON', { virtuals: true });


const companyModel = model("Company",companySchema)




export default companyModel