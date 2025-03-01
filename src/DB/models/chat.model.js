
import { Schema,model,Types } from "mongoose";


const chatSchema = new Schema({
   senderId:{type:Types.ObjectId,
    ref:"User"
   },
   receiverId:{
    type:Types.ObjectId,
    ref:"User"
   },
   messages:[{messages:{type:String}}]

},{timestamps:true})


const chatModel = model("Chat",chatSchema)

export default chatModel ;



