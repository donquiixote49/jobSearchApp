import connectDB from "./DB/connection.js";
import invalidApi from "./utils/errorHandling/invalidApi.js";
import globalErrorHandler from "./utils/errorHandling/errorHandler.js";
import companyRouter from './modules/company/company.controller.js'
import jobRouter from './modules/job/job.controller.js'
import authRouter from './modules/auth/auth.controller.js'
import userRouter from './modules/user/user.controller.js'
import cors from "cors";
import { createHandler } from "graphql-http/lib/use/express";
import { schema } from "./app.schema.js";
import rateLimit from "express-rate-limit";


const limiter = rateLimit({
  limit:5,
  windowMs:60*1000,
  handler:(req,res,next)=>{
    return next(new Error(`too many request please try again within a minute`,{cause:429}))

  },
  
})

export const bootStrap = async (app, express) => {
  app.use(cors());
  app.use(limiter)
  app.use("/graphql",createHandler({schema , context:(req)=>{
        const {authorization} = req.headers
        return {authorization}
  },formatError:(err)=>{
      return {
        success:false,
        message:err.originalError?.message,
        cause:err.originalError?.cause || 500
      }
  }}))

  app.use(express.json());
  app.get("/", (req, res, next) => {
    return res.json({
      message: `welcome to job search app `,
    });
  });
  await connectDB();
  app.use("/auth",authRouter)
  app.use("/user",userRouter)
  app.use("/company",companyRouter)
  app.use("/job",jobRouter)
  app.all("*", invalidApi);
  app.use(globalErrorHandler);
};
 
export default bootStrap;
