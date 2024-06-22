import { ApolloServer } from 'apollo-server'
import {gql} from 'apollo-server'
import apiResolvers from "./apiResolver";

const fs=require('fs');

async function serverStarter(){
    //Read Schema File
    const typeDefs=gql(fs.readFileSync('my-graphql-schema.graphql','utf-8'));
    
    //Create Apollo Server Instance
    const server=new ApolloServer({typeDefs,resolvers:apiResolvers});

    //Listen port 8081
    const {url}=await server.listen({port:8081});

    console.log('Server ready at ', {url});
}

serverStarter().catch(error=>{
    console.error('Server failed to Start:',error);
})
