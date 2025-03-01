import { GraphQLBoolean, GraphQLID, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql"
import { allCompanies, allUsers } from "./admin.graphql.service.js"
import { allCompaniesResponse, allUsersResponse } from "./types/admin.type,response.js"
import * as adminService from './admin.graphql.service.js'
import graphQlAuth from "./graphql.auth.js"


export const adminQuery ={
    allUser:{
        type:allUsersResponse,
        resolve:graphQlAuth(adminService.allUsers),
    },
    allCompany:{
        type:allCompaniesResponse,
        resolve:graphQlAuth(adminService.allCompanies)
    },
    
}