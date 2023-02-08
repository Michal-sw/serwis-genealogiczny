<script setup>
import { ref } from 'vue';

const props = defineProps({
    name: String
});

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
}

</script>

<template>
    <span
        v-changeAddMenuVisibility
        class="tree-member"
    >
        Member {{ props.name }}
        <div
            v-if="isAddMenuVisible" 
            id="add-menu-container"
        >
            <button @click="(() => addMember('parent'))">Add parent</button>
            <button @click="(() => addMember('sibling'))">Add sibling</button>
            <button @click="(() => addMember('child'))">Add child</button>
        </div>
    </span>

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