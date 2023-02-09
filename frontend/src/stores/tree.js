import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useTreeStore = defineStore('tree', () => {

    const rootMember = ref({});
    const parentMap = ref({});
    const childrenMap = ref({});
    const rootChildren = ref([]);

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
    
    return { parentMap, rootChildren, rootMember, createChildrenMap, createParentMap, changeRoot  };
})
