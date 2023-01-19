<script setup>
import { ref } from 'vue';
import { searchUserByTreeMembers } from '../services/axiosService';
import UserList from './UserList.vue';

const treeMembers = ref([]);
const searchInput = ref('');
const searchResult = ref([]);

function onAdd(_event) {
    const members = treeMembers.value;
    const newMember = searchInput.value;
    if (newMember && !members.find(member => member === newMember)) {
        treeMembers.value = [...members, newMember]
    }
    searchInput.value = "";
}

function removeMember(name) {
    treeMembers.value = treeMembers.value.filter(member => member !== name);
}

function onSearch(_event) {
    searchUserByTreeMembers(treeMembers.value)
        .then(res => {
            const users = res.data;
            searchResult.value = users;
        })
        .catch(err => console.log(err));
    treeMembers.value = [];
}

</script>

<template>
    <div id="search-container">
        <div id="members-search-container">
            <input @keyup.enter="onAdd" type="text" v-model="searchInput">
            <div id="tree-members-container">
                <div
                    v-bind:key="member"
                    v-for="member in treeMembers"
                    @click="() => removeMember(member)"
                    class="tree-member info"
                >
                    {{ member }}
                </div>
            </div>
        </div>
        <button @click="onAdd" class="info">add member</button>
        <button @click="onSearch" class="green">Search</button>
    </div>

    <UserList :users="searchResult"/>
</template>

<style>

    #search-container {
        display: flex;
        flex-direction: row;
        gap: 5px;
    }

    #search-container > button{
        height: fit-content;
    }

    #members-search-container {
        display:flex;
        flex-direction: column;
        gap: 10px;
        max-width: 200px;
    }

    #members-search-container > input {
        align-self:flex-start;
        width: 100%;
        margin-top:2px;
        height:30px;
    }

    #tree-members-container {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 8px;
    }

    .tree-member {
        color: white;

        border: 1px solid white;
        border-radius: 5px;

        padding: 4px;
        align-items: center;
        justify-content: center;
    }

    .tree-member:hover {
        cursor: pointer;
    }

</style>