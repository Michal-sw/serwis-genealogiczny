import { MongooseError } from "mongoose";
import User, { IUser } from "../config/models/User";
import { LoginDT } from "../types/LoginDT";
import neoDriver from "../config/neo4jClient";
import { Neo4jError, Node, Record, Result } from "neo4j-driver";

const getCorrectObject = (result: any) => ({ result, statusCode: 200 })
const getErrorObject = (statusCode: number, message?: string) => ({ statusCode, result: message })

export const getUsers = async () => {
    const result = await User
        .find()
        .then((users: [IUser] | any) => getCorrectObject(users))
        .catch((err: MongooseError) => getErrorObject(500, err.message));

    return result;
}

export const getUsersByTreeMembers = async (treeMembers: string[]) => {
    const treeMembersString = 
        "[" + 
            treeMembers
            .map(member => `'${member}'`)
            .toString()
         + "]";
    
    const userIds = await getUserIdsByTreeMembers(treeMembersString)
    if (userIds.statusCode !== 200) return userIds;

    const result = await User
        .find({
            '_id': { $in: userIds.result}
        })
        .then((users: [IUser] | any) => getCorrectObject(users))
        .catch((err: MongooseError) => getErrorObject(500, err.message));
    
    return result;
}


const getUserIdsByTreeMembers = async (treeMembers: string) => {
    const session = neoDriver.session();
    const result = await neoDriver.session()
        .executeRead(tx =>
                tx.run(`
                    WITH ${treeMembers} AS members
                    MATCH (userTree:UserTree)<-[:IS_PART_OF]-(m:TreeMember)
                    WHERE m.name IN members
                    WITH members, userTree, count(m) AS matches
                    WHERE matches = size(members)
                    RETURN userTree;
                `))
            .then(res => {
                const mongoIds: string[] = res.records
                    .map((record: Record) => record.get('userTree'))
                    .map((node: Node) => node.properties.mongoID);
                return getCorrectObject(mongoIds);
            })
            .catch((err: Neo4jError) => getErrorObject(500, err.message))
            .finally(() => session.close());
    
    return result;
}

export const getUserIfPasswordMatches = async ({ login, password }: LoginDT) => {
    const user: IUser | null = await User
        .findOne({ login })

    return (user && user.password === password) 
        ? user
        : null;
}

export const addUser = async ({ login, password }: LoginDT) => {
    if (!login || !password) {
        return getErrorObject(400);
    }

    const mongoResult = await User.create({
        login,
        password
    })
    .then((user: IUser) => getCorrectObject(user))
    .catch((err: MongooseError) => getErrorObject(400, err.message));
    
    if (mongoResult.statusCode !== 200) return mongoResult;
    
    const neoResult = await neo4jAddUser(mongoResult.result._id.toString())
    if (neoResult.statusCode !== 200) return neoResult;

    return mongoResult;
};

const neo4jAddUser = async (mongoID: string) => {
    const session = neoDriver.session();
    const result = await neoDriver.session()
        .executeWrite(tx => {
            console.log("Adding neo user");
                return tx.run(`
                    MERGE (userTree: UserTree {
                        mongoID: "${mongoID}"
                    })
                `)
            })
        .then(res => getCorrectObject(res))
        .catch((err: Neo4jError) => getErrorObject(500, err.message))
        .finally(() => session.close())

    return result;
};

export const getUserById = async (id: string) => {
    const user = await User.findById(id);
    if (!user) {
        return getErrorObject(404);
    }
    return getCorrectObject(user);
};

export const getUserTreeMembersById = async (mongoId: string) => {
    const session = neoDriver.session();
    const result = await neoDriver.session()
        .executeWrite(tx => {
                return tx.run(`
                    MATCH (tree:UserTree) 
                    WHERE tree.mongoID = "${mongoId}"
                    WITH tree 
                    MATCH (tree)<-[:IS_PART_OF]-(member:TreeMember)
                    RETURN member
                `)
            })
        .then(res => {
            const members: {name: String, id: String}[] = res.records
                .map((record: Record) => record.get('member'))
                .map((node: Node) => ({
                    name: node.properties.name,
                    id: node.identity.toString()
                }));
            return getCorrectObject(members);
        })
        .catch((err: Neo4jError) => getErrorObject(500, err.message))
        .finally(() => session.close())
    
    return result;
};


export const replaceUser = async ({ id, ...body }: {id:string}) => {
    const user = await User.findOneAndReplace({id}, body);
    
    return getCorrectObject(user);
};

export const deleteUser = async (id: string) => {
    await User.findOneAndDelete({ id })
        .then((user: IUser | null) => {
            return getCorrectObject(user);
        }).catch((err: MongooseError) => {
            return getErrorObject(400, err.message);
        });
};

export const editUser = async ({ id, ...body }: {id:string}) => {
    const user = await User.findOneAndUpdate({id}, body);
    
    return getCorrectObject(user);
};

