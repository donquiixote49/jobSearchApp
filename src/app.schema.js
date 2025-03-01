import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { adminQuery } from "./modules/admin/graphql/admin.query.js";
import { adminMutation } from "./modules/admin/graphql/admin.mutation.js";

export const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name:"mainQuery",
        fields:{
            ...adminQuery
        }
    }),
    mutation:new GraphQLObjectType({
        name:"mainMutation",
        fields:{
            ...adminMutation
        }
    })
})

