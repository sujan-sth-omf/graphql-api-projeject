import {mutations} from './mutationService/mutations';
import {queries} from './queryService/queries'
export const apiResolvers={
    Mutation:mutations,
    Query:queries
}
export default apiResolvers;