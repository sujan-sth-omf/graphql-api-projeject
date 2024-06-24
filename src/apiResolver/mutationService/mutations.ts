import { PrismaClient } from '@prisma/client';
import { ApolloError,UserInputError } from "apollo-server";

const prisma = new PrismaClient();

export const mutations=
{
    createRole: async(_:any,{roleName}:{roleName:string})=>{
        if(!roleName){
            throw new UserInputError("Role Name Cannot be Null or Empty");
        }
        try{
            return await prisma.role.create({data:{roleName}});
        }catch(error){
            throw new ApolloError("Error Creating Roles: "+error);
        }
    },
    editRole: async(_:any,{id,roleName}:{id:string,roleName:string})=>{
        if(!id){
            throw new UserInputError("Role Id is Required.")
        }
        try{
            const roleId=parseInt(id,10);
            const roleData=await prisma.role.findUnique({where:{id:roleId}});
            if(!roleData){
                throw new UserInputError('Role Data Not Found for ID: '+id);
            }
            return await prisma.role.update({where:{id:roleId},data:{roleName} });
        }catch(error){
            throw new ApolloError("Error Editing Roles: "+error);
        }    
    },
    deleteRole:async(_:any,{id}:{id:string})=>{
        if(!id){
            throw new UserInputError("Role Id is Required.")
        }
        try{
            const roleId=parseInt(id,10);
            const roleData=await prisma.role.findUnique({where:{id:roleId}});
            if(!roleData){
                throw new UserInputError('Role Data Not Found for ID: '+id);
            }
            await prisma.role.delete({where:{id:roleId}});
            return "Successfully Deleted Role";
        }catch(error){
            throw new ApolloError("Error Deleting Roles: "+error);
        }    
    }, 
    editUserInformation: async(_:any,{id, email,name,qualification,jobPeriod,roleId}:
        {id:string, email:string,name:string,qualification:string,jobPeriod:number,roleId:number})=>{
        if(!id){
            throw new UserInputError("User Id is Required.")
        }
        try{
            const userId=parseInt(id,10);
            const userData=await prisma.user.findUnique({where:{id:userId}});
            if(!userData){
                throw new UserInputError('User Data Not Found for ID: '+id);
            }
            return await prisma.user.update({
                where:{id:userId},
                data:{email,name,qualification,jobPeriod,roleId}
            });
        }catch(error){
            throw new ApolloError("Error Editing User Information: "+error);
        }  
    },
    createSessionWithUser: async(_:any,{email,name,qualification,jobPeriod,roleId}:{email:string,name:string,qualification:string,jobPeriod:number,roleId:number})=>{
        if(!email||!name||!qualification||!jobPeriod||!roleId){
            throw new UserInputError("Email, Name, Qualification, JobPeriod and RoleId all Field are Required for Session Creation.")
        }
        try{
            const userData= await prisma.user.create({
                data:{
                    email, name,qualification,jobPeriod,roleId
                }
            });
            return await prisma.session.create({
                data:{
                    userId:userData.id,
                    token:Math.random().toString(36).substring(3,15)
                }
            });
        }catch(error){
            throw new ApolloError("Session Creation Failed: "+ error);
        }
        
    },
    deleteSession: async(_:any,{sessionId}:{sessionId:string})=>{
        if(!sessionId){
            throw new UserInputError("Session Id is Required.")
        }
        try{
            const id=parseInt(sessionId,10);
            const sessionData=await prisma.session.findUnique({where:{sessionId:id}, include:{user:true}});
            if(!sessionData){
                throw new UserInputError('Session Data Not Found');
            }
            await prisma.session.delete({where:{sessionId:id}});
            await prisma.user.delete({where:{id:sessionData.user.id}});
            return "Successfully Deleted Session";
        }catch(error){
            throw new ApolloError("Deletion of Session and User Unsuccessful..");
        }
    }         
} 