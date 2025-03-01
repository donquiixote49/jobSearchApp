import { GraphQLBoolean, GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { DateType } from "./admin.type,response.js";



export const unBanOrBanUserReq = {id:{type:new GraphQLNonNull(GraphQLID)}}

export const unBanOrBanCompanyReq = {id:{type:new GraphQLNonNull(GraphQLID)}}
export const approveCompany = {id:{type:new GraphQLNonNull(GraphQLID)}}