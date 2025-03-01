import jwt from "jsonwebtoken";

export const generateToken = ({payload,signature = process.env.TOKEN_KEY,options = {}})=>{
  return jwt.sign(payload,signature,options)
}

export const verifyToken = ({token,signature = process.env.TOKEN_KEY,options = {}})=>{
  return jwt.verify(token,signature,options)
}