import { Neo4jError } from "neo4j-driver";
import neoDriver from "../config/neo4jClient";

const getCorrectObject = (result: any) => ({ result, statusCode: 200 })
const getErrorObject = (statusCode: number, message?: string) => ({ statusCode, result: message })

interface addTreeMemberParams {
    mergeTo: any;
    newMember: any;
    relationType: any;
}

export const addTreeMember = async (userId: string, {mergeTo, newMember, relationType}: addTreeMemberParams) => {
    const session = neoDriver.session();
    const result = await neoDriver.session()
        .executeRead(tx =>
                tx.run(`
                    MATCH (n:UserTree) 
                    WHERE n.mongoID = "${userId}"
                    WITH n 
                    MATCH (n)<-[:IS_PART_OF]-(member:TreeMember)
                    WHERE member.name = "${mergeTo.name}" AND member.birthDate = datetime(${mergeTo.birthDate})
                    WITH n, member
                    MERGE (member)-[:${relationType}]->(s:TreeMember {name: "${newMember.name}", birthDate: datetime(${newMember.birthDate})})-[:IS_PART_OF]->(n)
                `))
            .then(res => {
                return getCorrectObject(res);
            })
            .catch((err: Neo4jError) => getErrorObject(500, err.message))
            .finally(() => session.close());
    
    return result;
} 
