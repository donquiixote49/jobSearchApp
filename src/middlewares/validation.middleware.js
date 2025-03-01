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




export default validation;
