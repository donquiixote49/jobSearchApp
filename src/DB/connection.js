import chalk from "chalk";
import mongoose from "mongoose";
export const connectDB = async()=>{
    await mongoose.connect(process.env.CONNECTION_URL).then((res)=>{
        console.log(chalk.blue.bgYellow.bold(`DB connected successfully`));
        
    }).catch((err)=>{
        console.log(`failed to connect to DB ===>${err.message} `);
        
    })
}

export default connectDB 

