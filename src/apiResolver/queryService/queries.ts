import { PrismaClient } from '@prisma/client';
import { ApolloError,UserInputError } from "apollo-server";

const prisma = new PrismaClient();
export const queries=
{
    getUsers: async()=>{
        try{
            return prisma.user.findMany();
        }catch(error){
            throw new ApolloError("Error Fetching Users: "+error);
        }
    },
    getRoles:async()=>{
        try{
            return prisma.role.findMany();
        }catch(error){
            throw new ApolloError("Error Fetching Roles: "+error);
        }
    },
    getSessions:async()=>{
        try{
            return prisma.session.findMany();
        }catch(error){
            throw new ApolloError("Error Fetching Sessions: "+error);
        }
    },
    getSessionDataWithoutUser: async(_:any,{sessionId}:{sessionId:string})=>{
        if(!sessionId){
            throw new UserInputError("Session Id is Required.")
        }
        try{
            const id=parseInt(sessionId,10);
            const sessionData=await prisma.session.findUnique({
                where:{sessionId:id},
            });
            if(!sessionData){
                throw new UserInputError('Session Data Not Found for Session ID: '+id);
            }  
            return sessionData;

        }catch(error){
            throw new ApolloError("Error Fetching Session Data Without User: "+error);
        }
    },
    getSessionDataWithUserAndRoles: async(_:any,{sessionId}:{sessionId:string})=>{
        if(!sessionId){
            throw new UserInputError("Session Id is Required.")
        }
        try{
            const id=parseInt(sessionId,10);
            const sessionData= await prisma.session.findUnique({
                where:{sessionId:id},
                include:{
                    user:
                    {
                        include:{
                            role:true
                        }
                    }
                },
            });
            if(!sessionData){
                throw new UserInputError('Session Data Not Found for Session ID: '+sessionId);
            }
            return sessionData;
        }catch(error){
            throw new ApolloError("Error Fetching Session Data With User and Roles: "+error);
        }
    },
}