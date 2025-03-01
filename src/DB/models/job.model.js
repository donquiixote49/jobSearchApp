import { Schema, model, Types } from "mongoose";
import applicationModel from "./application.model.js";

export const jobLocation = {
  onSite: "onSite",
  remotely: "remotely",
  hybrid: "hybrid",
};

export const seniorityLevel = {
  fresh: "fresh",
  junior: "junior",
  midLevel: "midLevel",
  senior: "senior",
  TeamLeader: "TeamLeader",
  CTO: "CTO",
};

export const workingTime = {
  partTime: "partTime",
  fullTime: "fullTime",
};

const jobSchema = new Schema(
  {
    
    jobTitle: {
      type: String,
      required: true,
    },
    jobLocation: {
      type: String,
      enum: Object.values(jobLocation),
      required: true,
    },
    workingTime: {
      type: String,
      enum: Object.values(workingTime),
      required: true,
    },
    seniorityLevel: {
      type: String,
      enum: Object.values(seniorityLevel),
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    technicalSkills: {
      type: [{type:String}],
      required: true,
    },
    softSkills: {
      type: [{type:String}],
      required: true,
    },
    addBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    closed: {
      type: Boolean,
      default: false,
    },
    companyId: {
      type: Types.ObjectId,
      ref: "Company",
      required: true,
    },
  },
  { timestamps: true }
);


jobSchema.post('deleteOne', { document: true, query: false }, async function (next) {
  await applicationModel.deleteMany({ jobId: this._id}); 
  // next();
});

const jobModel = model("Job", jobSchema);

export default jobModel;
