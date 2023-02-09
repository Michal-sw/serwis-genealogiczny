import { Neo4jError, Record, Node } from "neo4j-driver";
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
        .executeWrite(tx =>
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

export const getUserTreeMembersById = async (mongoId: string) => {
    const session = neoDriver.session();
    const result = await neoDriver.session()
        .executeRead(tx => {
                return tx.run(`
                    MATCH (tree:UserTree) WHERE tree.mongoID = "${mongoId}"
                    WITH tree
                    OPTIONAL MATCH (tree)<-[:IS_PART_OF]-(p: TreeMember)
                    OPTIONAL MATCH (p)-[:FATHER|MOTHER]->(p2:TreeMember)
                    WITH p2, collect(p) AS parents
                    OPTIONAL MATCH (p2)-[:FATHER|MOTHER]->(p3:TreeMember)
                    WITH p2, parents, COLLECT(p3) AS children
                    RETURN { node: p2, parents: parents, children:children } AS result
                `)
            })
        .then(res => {
            const members: any[] = res.records
                .map((record: Record) => record.get("result"))
                .map((result: { node: Node, parents: Node[], children: Node[]}) => {
                    return result.node ? ({
                        id: result.node.identity.toString(),
                        props: {...result.node.properties},
                        parents: result.parents.map(parent => ({
                            id: parent.identity.toString(),
                            props: {...parent.properties}
                        })),
                        children: result.children.map(child => ({
                            id: child.identity.toString(),
                            props: {...child.properties}
                        }))
                    }) : null
                }).filter(v => v !== null);

            console.log(members);
            return getCorrectObject(members);
        })
        .catch((err: Neo4jError) => getErrorObject(500, err.message))
        .finally(() => session.close())
    
    return result;
};
