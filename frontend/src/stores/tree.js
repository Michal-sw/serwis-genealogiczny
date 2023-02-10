import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getUserTreeById } from '../services/axiosService';

export const useTreeStore = defineStore('tree', () => {
    const treeOwnerId = ref("");
    const memberToCopy = ref({});
    const rootMember = ref({});
    const realRootMember = ref({});
    const parentMap = ref({});
    const childrenMap = ref({});
    const rootChildren = ref([]);

    function getAndSetTree(id) {
        getUserTreeById(id)
            .then(res => {
                const root = res.data.find(v => v.props.root || v.props.isRoot);
                createChildrenMap(res.data);
                createParentMap(res.data);
                changeRoot(root);
                setRealRoot(root);
                setTreeOwnerId(id);
            })
            .catch(err => console.log(err));
    }

    function performCopy(nodeId) {
        const values = {
            source: {...memberToCopy.value},
            target: {
                nodeId
            }
        }
        console.log(values);
    }

    function refreshTree() {
        getUserTreeById(treeOwnerId.value)
            .then(res => {
                createChildrenMap(res.data);
                createParentMap(res.data);
                changeRoot(rootMember.value);
            })
            .catch(err => console.log(err));
    }

    function createChildrenMap(data) {
        childrenMap.value = data.reduce((prev, curr) => {
            return {
                ...prev,
                [curr.id]: curr.children
            }
        }, {});
    }
    
    function createParentMap(data) {
        parentMap.value = data.reduce((prev, curr) => {
            return {
                ...prev,
                [curr.id]: curr.parents
            }
        }, {});
    }
    
    function changeRoot(newRootMember) {
        rootMember.value = newRootMember;
        rootChildren.value = childrenMap.value[newRootMember.id];
    }

    function setRealRoot(newRootMember) {
        realRootMember.value = newRootMember;
    }

    function setMemberToCopy(member) {
        memberToCopy.value = member;
    }

    function setTreeOwnerId(id) {
        treeOwnerId.value = id;
    }

    return { getAndSetTree, setMemberToCopy, performCopy, memberToCopy, parentMap, rootChildren, rootMember, realRootMember, treeOwnerId, createChildrenMap, createParentMap, changeRoot, setRealRoot, setTreeOwnerId, refreshTree };
})
