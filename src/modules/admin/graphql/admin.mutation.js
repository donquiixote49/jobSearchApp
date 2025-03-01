import { GraphQLID, GraphQLNonNull } from "graphql";
import graphQlAuth from "./graphql.auth.js";
import { ResponseType } from "./types/admin.type,response.js";
import {  approveCompany, unBanOrBanCompanyReq, unBanOrBanUserReq } from "./types/admin.types.request.js";
import * as adminService from './admin.graphql.service.js'


export const adminMutation = {
    unBanOrBanUser:{
        type:ResponseType,
        args:unBanOrBanUserReq,
        resolve:graphQlAuth(adminService.unBanOrBanUser)
    },
    
    unBanOrBanCompany:{
        type:ResponseType,
        args:unBanOrBanCompanyReq,
        resolve:graphQlAuth(adminService.unBanOrBanCompany)
    },
    approveCompany:{
        type:ResponseType,
        args:approveCompany,
        resolve:graphQlAuth(adminService.approveCompany)
    }

} 


