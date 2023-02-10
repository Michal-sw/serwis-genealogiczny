import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getUserTreeById } from '../services/axiosService';
import { useNotificationStore } from './notifications';

export const useTreeStore = defineStore('tree', () => {
    const treeOwnerId = ref("");
    const rootMember = ref({});
    const realRootMember = ref({});
    const parentMap = ref({});
    const childrenMap = ref({});
    const rootChildren = ref([]);

    function getAndSetTree(id) {
        getUserTreeById(id)
            .then(res => {
                const root = res.data.find(v => v.props.root);
                createChildrenMap(res.data);
                createParentMap(res.data);
                changeRoot(root);
                setRealRoot(root);
                setTreeOwnerId(id);
            })
            .catch(_err => useNotificationStore().addError("Could not get user tree!"));
    }

    function refreshTree() {
        getUserTreeById(treeOwnerId.value)
            .then(res => {
                createChildrenMap(res.data);
                createParentMap(res.data);
                changeRoot(rootMember.value);
            })
            .catch(_err => useNotificationStore().addError("Could not get user tree!"));
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

    function setTreeOwnerId(id) {
        treeOwnerId.value = id;
    }

    return { getAndSetTree, parentMap, rootChildren, rootMember, realRootMember, treeOwnerId, createChildrenMap, createParentMap, changeRoot, setRealRoot, setTreeOwnerId, refreshTree };
})
