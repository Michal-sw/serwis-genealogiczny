import { Neo4jError, Record, Node } from "neo4j-driver";
import neoDriver from "../config/neo4jClient";

const getCorrectObject = (result: any) => ({ result, statusCode: 200 })
const getErrorObject = (statusCode: number, message?: string) => ({ statusCode, result: message })

interface addTreeMemberParams {
    mergeToId: String;
    newMember: {
        name: String,
        birthDate: Date 
    };
    relationType: String;
}

export const addParent = async (userId: string, {mergeToId, newMember, relationType}: addTreeMemberParams) => {
    const session = neoDriver.session();
    const result = await neoDriver.session()
        .executeWrite(tx =>
                tx.run(`
                    MATCH (tree:UserTree) 
                    WHERE tree.mongoID = "${userId}"
                    WITH tree
                    MATCH (tree)<-[:IS_PART_OF]-(mergeTo:TreeMember)
                    WHERE id(mergeTo) = ${mergeToId}
                    WITH tree, mergeTo
                    MERGE (mergeTo)<-[:${relationType}]-(newMember:TreeMember {name: "${newMember.name}", birthDate: datetime("${newMember.birthDate}")})-[:IS_PART_OF]->(tree)
                `))
            .then(res => {
                return getCorrectObject(res);
            })
            .catch((err: Neo4jError) => getErrorObject(500, err.message))
            .finally(() => session.close());
    
    return result;
} 

export const addChild = async (userId: string, isNewRoot: boolean, {mergeToId, newMember, relationType}: addTreeMemberParams) => {
    if (isNewRoot) {
        await removeRoot(userId);
    }
    const session = neoDriver.session();
    const result = await neoDriver.session()
        .executeWrite(tx =>
                tx.run(`
                    MATCH (tree:UserTree) 
                    WHERE tree.mongoID = "${userId}"
                    WITH tree
                    MATCH (tree)<-[:IS_PART_OF]-(mergeTo:TreeMember)
                    WHERE id(mergeTo) = ${mergeToId}
                    WITH tree, mergeTo
                    MERGE (mergeTo)-[:${relationType}]->(newMember:TreeMember { root: ${isNewRoot}, name: "${newMember.name}", birthDate: datetime("${newMember.birthDate}")})-[:IS_PART_OF]->(tree)
                `))
            .then(res => {
                return getCorrectObject(res);
            })
            .catch((err: Neo4jError) => getErrorObject(500, err.message))
            .finally(() => session.close());
    
    return result;
} 

export const addRoot = async (userId: string, newRoot: {name:String, birthDate:String}) => {
    const session = neoDriver.session();
    const result = await neoDriver.session()
        .executeWrite(tx =>
                tx.run(`
                    MATCH (tree:UserTree) 
                    WHERE tree.mongoID = "${userId}"
                    WITH tree
                    MERGE (tree)<-[:IS_PART_OF]-(newRoot:TreeMember { name: ${newRoot.name}, birthDate: datetime("${newRoot.birthDate}", isRoot: true)})
                `))
            .then(res => {
                return getCorrectObject(res);
            })
            .catch((err: Neo4jError) => getErrorObject(500, err.message))
            .finally(() => session.close());
    
    return result;
} 

const removeRoot = async (userId: String) => {
    const session = neoDriver.session();
    const result = await neoDriver.session()
        .executeWrite(tx =>
            tx.run(`
                MATCH (tree:UserTree) 
                WHERE tree.mongoID = "${userId}"
                WITH tree
                MATCH (tree)<-[:IS_PART_OF]-(mergeTo:TreeMember)
                WHERE mergeTo.root = true
                SET mergeTo.root = false
            `))
            .then(res => {
                return getCorrectObject(res);
            })
            .catch((err: Neo4jError) => getErrorObject(500, err.message))
            .finally(() => session.close());
    return result
}

export const deleteTreeMember = async (userId:String, memberId: String) => {
    const session = neoDriver.session();
    const result = await neoDriver.session()
        .executeWrite(tx =>
            tx.run(`
                MATCH (tree:UserTree) 
                WHERE tree.mongoID = "${userId}"
                WITH tree
                MATCH (tree)<-[:IS_PART_OF]-(member:TreeMember)
                WHERE id(member) = ${memberId}
                DETACH DELETE member
            `))
            .then(res => {
                return getCorrectObject(res);
            })
            .catch((err: Neo4jError) => getErrorObject(500, err.message))
            .finally(() => session.close());
    return result   
}

export const getUserTreeMembersById = async (mongoId: string) => {
    const session = neoDriver.session();
    const result = await neoDriver.session()
        .executeRead(tx => {
                return tx.run(`
                    MATCH (tree:UserTree) WHERE tree.mongoID = "${mongoId}"
                    WITH tree
                    MATCH (tree)<-[:IS_PART_OF]-(p: TreeMember)
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

            return getCorrectObject(members);
        })
        .catch((err: Neo4jError) => getErrorObject(500, err.message))
        .finally(() => session.close())
    
    return result;
};
