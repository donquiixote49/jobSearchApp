import { Types } from "mongoose";

const validation = (schema) => {
  return (req, res, next) => {
    const date = {
      ...req.body,
      ...req.params,
      ...req.query,
    };
    if (req.file || req.files?.length) {
      date.file = req.file || req.files;
    }

    const result = schema.validate(date, { abortEarly: false });
    if (result.error) {
      const messageList = result.error.details.map((obj)=> obj.message)
      return next(new Error(messageList, { cause: 400 }));
    }
    return next();
  };
};

export const isValidObjectId = (value, helper) => {
  if (Types.ObjectId.isValid(value)) return true;
  return helper.message(`in-valid objectID`);
};


// export const ageValidation =(value,helper)=>{
//   const currentDate = new Date();
//   const age = currentDate.getFullYear() - value.getFullYear()
//   if(age > 18  && currentDate > value) return true
//   return helper.message(`user must be older than 18 years old`)
// }

export default validation;
