import { GraphQLBoolean, GraphQLID, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLScalarType, GraphQLString } from "graphql";


export const DateType = new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    serialize(value) {
      return value.toISOString(); // Convert Date to ISO string
    },
    parseValue(value) {
      return new Date(value); // Convert ISO string to Date
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return new Date(ast.value); // Convert literal string to Date
      }
      return null;
    },
  });

export const allUsersResponse = new GraphQLList(new GraphQLObjectType({
    name:"allUsersType",
    fields:{
        firstName:{type:GraphQLString},
        lastName:{type:GraphQLString},
        email:{type:GraphQLString},
        password:{type:GraphQLString},
        role:{type:GraphQLString},
        isConfirmed:{type:GraphQLBoolean},
        isDeleted:{type:GraphQLBoolean},
        profilePicture:{type:new GraphQLObjectType({
            name:"profilePicture",
            fields:{
                secure_url:{type:GraphQLString},
                public_id:{type:GraphQLString}
            }
        })},
        coverPicture:{type:new GraphQLObjectType({
            name:"coverPicture",
            fields:{
                secure_url:{type:GraphQLString},
                public_id:{type:GraphQLString}
            }
        })},
        phoneNumber:{type:GraphQLString},
        OTP:{type:new GraphQLList(new GraphQLObjectType({
            name:"otps",
            fields:{
                code:{type:GraphQLString},
                codeType:{type:GraphQLString},
                expireIn:{type:DateType}
            },
            
        }))},
        _id:{type:GraphQLID},
        createdAt:{type:DateType},
        updateAt:{type:DateType},
        changeCredentialTime:{type:DateType},
        DOB:{type:DateType}
        
    }
}))


export const allCompaniesResponse = new GraphQLList(new GraphQLObjectType({
    name:"allCompaniesType",
    fields:{
        companyName:{
                type:GraphQLString,
                
            },
            description:{
                type:GraphQLString,
                
        
            },
            industry:{
                type:GraphQLString,
                
            },
            address:{
                type:GraphQLString,
                
            },
            numberOfEmployees:{
                type:GraphQLString
            },
            companyEmail:{
                type:GraphQLString,
                
            },
            createdBy:{
                type:GraphQLID
            },
            companyLogo:{type:new GraphQLObjectType({
                name:"companyLogo",
                fields:{
                    secure_url:{type:GraphQLString},
                    public_id:{type:GraphQLString}
                }
            })},
            coverPicture:{type:new GraphQLObjectType({
                name:"companyCover",
                fields:{
                    secure_url:{type:GraphQLString},
                    public_id:{type:GraphQLString}
                }
            })},
            
            bannedAt:{
                type:DateType
            },
            isDeleted:{
                type:GraphQLBoolean,
            },
            deletedAt:{
                type:DateType,
            },
            legalAttachment:{type:new GraphQLObjectType({
                name:"legalAttachment",
                fields:{
                    secure_url:{type:GraphQLString},
                    public_id:{type:GraphQLString}
                }
            })},
            approvedByAdmin:{
                type:GraphQLBoolean,
            }
            
    }
}))


export const ResponseType = new GraphQLObjectType({
    name: 'Response',
    fields: {
      success: { type: GraphQLBoolean }, // Indicates if the operation was successful
      message: { type: GraphQLString }, // Success or error message
      statusCode:{type:GraphQLInt}
    },
  });