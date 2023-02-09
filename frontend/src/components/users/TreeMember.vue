<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    id: String,
    parents: Array,
    props: {
        birthDate: Object,
        name: String
    },
    parentMap: Object,
    branchLevel: Number
});

const parents = computed(() => {
    return props?.parentMap[props.id]
})

const isAddMenuVisible = ref(false);

const vChangeAddMenuVisibility = {
    mounted: (element) => {
        element.clickOutsideEvent = (event) => {
            isAddMenuVisible.value = element == event.target || element.contains(event.target) ? true : false;
        };
        document.body.addEventListener('click', element.clickOutsideEvent)
    },
    unmounted: (element) => {
        document.body.removeEventListener('click', element.clickOutsideEvent)
    }
};

function addMember(relationType) {
    console.log(relationType);
    console.log(props);
}

</script>

<template>
    <span
        v-changeAddMenuVisibility
        class="tree-member label"
    >
        Member {{ props?.props?.name }}
        <div
            v-if="isAddMenuVisible" 
            id="add-menu-container"
        >
            <button @click="(() => addMember('parent'))">Add parent</button>
            <button @click="(() => addMember('sibling'))">Add sibling</button>
            <button @click="(() => addMember('child'))">Add child</button>
        </div>
    </span>

    <div
        v-bind:class="`branch lv${props.branchLevel}`"
    >
        <div
            v-bind:key="parent.id"
            v-for="parent in parents"
            class="entry"
        >
            <TreeMember
                :key="parent.id"
                :id="parent.id"
                :props="{name: parent.props.name, birthDate: parent.props.birthdate}"
                :parentMap="props.parentMap"
                :branchLevel="props.branchLevel+1"
            />
        </div>
    </div>

</template>

<style scoped>
    #add-menu-container {
        position: absolute;
        margin-left: auto;
        margin-right: auto;
        display: flex;
        flex-direction: column;
        z-index: 5;
    }
</style>