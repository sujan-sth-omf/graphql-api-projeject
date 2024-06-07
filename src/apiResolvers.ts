import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const apiResolvers={
    Query:{
        getUsers: async()=>{return prisma.user.findMany();},
        getRoles:async()=>{return prisma.role.findMany();},
        getSessions:async()=>{return prisma.session.findMany();},
        getSessionDataWithoutUser: async(_:any,{sessionId}:{sessionId:number})=>{
            return await prisma.session.findUnique({
                where:{sessionId},
            });
        },
        getSessionDataWithUserAndRoles: async(_:any,{sessionId}:{sessionId:number})=>{
            const sessionData= await prisma.session.findUnique({
                where:{sessionId},
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
                console.log('No Sessions Found for session Id', sessionId)
                return null;
            }
            return sessionData;
        },
    },
    Mutation:{
        createRole: async(_:any,{roleName}:{roleName:string})=>{
            return await prisma.role.create({data:{roleName}});
        },
        editRole: async(_:any,{id,roleName}:{id:number,roleName:string})=>{
            return await prisma.role.update({where:{id},data:{roleName} });
        },
        deleteRole:async(_:any,{id}:{id:number})=>{
            return await prisma.role.delete({where:{id}});
        },
        editUserInformation: async(_:any,{userId, email,name,qualification,jobPeriod,roleId}:
            {userId:number, email:string,name:string,qualification:string,jobPeriod:number,roleId:number})=>{
            return await prisma.user.update({
                where:{id:userId},
                data:{email,name,qualification,jobPeriod,roleId}
            });
        },
        createSessionWithUser: async(_:any,{email,name,qualification,jobPeriod,roleId}:{email:string,name:string,qualification:string,jobPeriod:number,roleId:number})=>{
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
        },
        deleteSession: async(_:any,{sessionId}:{sessionId:number})=>{
            try{
                const sessionData=await prisma.session.findUnique({where:{sessionId}});
                if(!sessionData){
                    throw new Error('Session Data Not Found');
                }
                await prisma.session.delete({where:{sessionId}});
                await prisma.user.delete({where:{id:sessionData.userId}});
                return "Successfully Deleted Session";
            }catch(error){
                console.error("Error Deleting Session and User",error);
                throw new Error("Deletion of Session and User Unsuccessful..");
            }
        }         
    } 
};
export default apiResolvers;