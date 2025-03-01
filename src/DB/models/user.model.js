import { Schema, Types, model } from "mongoose";
import { hash } from "../../utils/hash/hashing.js";
import { decrypt, encrypt } from "../../utils/encryption/encryption.js";

export const providers = {
  system: "system",
  google: "google",
};

export const genders = {
  male: "male",
  female: "female",
};

export const roles = {
  admin: "admin",
  user: "user",
};

export const otpTypes = {
  confirmEmail: "confirmEmail",
  forgotPassword:"forgotPassword"
};

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: [3, `first name must be at least 3 chars`],
    },
    lastName: {
      type: String,
      required: true,
      minlength: [3, `last name must be at least 3 chars`],
    },
    email: {
      type: String,
      unique: [true, `email must be unique`],
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, `email must be valid`],
      required:true
    },
    password: {
      type: String,
      required: function () {
        return this.provider == providers.system  ? true: false;
      },
    },
    provider: {
      type: String,
      enum: Object.values(providers),
      default: providers.system,
    },
    gender: {
      type: String,
      enum: Object.values(genders),
      default:genders.male
    },
    DOB:  {
      type: Date,
      required:  function () {
        return this.provider == providers.system  ? true: false;
      },
      validate: {
        validator: function (value) {
          // Check if the date is in the correct format (YYYY-MM-DD)
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (!dateRegex.test(value.toISOString().split('T')[0])) {
            return false;
          }
  
          // Check if the date is in the past
          const currentDate = new Date();
          if (value >= currentDate) {
            return false;
          }
  
          // Check if the user is at least 18 years old
          const age = calculateAge(value);
          return age >= 18;
        },
        message: 'Date of birth must be in the format YYYY-MM-DD, in the past, and the user must be at least 18 years old.',
      },
    },
    phoneNumber: {
      type: String,
      required: function () {
        return this.provider == providers.system ? true: false;
       },
    },
    role: {
      type: String,
      enum: Object.values(roles),
      default: roles.user,
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
    bannedAt: { type: Date },
    updatedBy: { type: Types.ObjectId, ref: "User" },
    changeCredentialTime: { type: Date },
    profilePicture: {
      secure_url: {type:String,default:"https://res.cloudinary.com/dttgwrr55/image/upload/v1740264470/vecteezy_default-male-avatar-profile-icon-social-media-chatting_25337669_faagmc.jpg"},
      public_id: {type:String,default:"vecteezy_default-male-avatar-profile-icon-social-media-chatting_25337669_faagmc"},
    },
    coverPicture: {
      secure_url: String,
      public_id: String,
    },
    OTP: [
      {
        code: String,
        codeType: String,
        expireIn: Date,
      },
    ],

  },
  { timestamps: true }
);

userSchema.virtual('username').get(function() {
  return `${this.firstName} ${this.lastName}`;
});


userSchema.pre("save",function(next){
  if(this.provider == providers.google){
    return next()
  }
  const hashPassword = hash({plainText:this.password})
  const encryptPhone = encrypt({plainText:this.phoneNumber})
  this.password = hashPassword
  this.phoneNumber = encryptPhone
   return next()
})

function calculateAge(dob) {
  const currentDate = new Date();
  let age = currentDate.getFullYear() - dob.getFullYear();
  const monthDiff = currentDate.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < dob.getDate())) {
    age--;
  }

  return age;
}





userSchema.post('findOne', function(doc) {
  if ( doc && doc.provider !== providers.google) {
  doc.phoneNumber = decrypt({ cypherText: doc.phoneNumber });
  }

});



const userModel = model("User", userSchema);

export default userModel;
