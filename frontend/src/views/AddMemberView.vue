<script setup>
import { reactive } from 'vue';
import { useNotificationStore } from '../stores/notifications';
import { useTreeStore } from '../stores/tree';
import { addTreeRelation } from '../services/axiosService'
import router from '../router';


const props = defineProps({
    id: String,
});

const form = reactive({
    isChild: true,
    isFather: true,
    name: "",
    birthDate: null
});

function onSubmit(event) {
    event.preventDefault();
    if (!form.name) {
        useNotificationStore().addError("Provide a name!")
        return;
    }
    if (!form.birthDate) {
        useNotificationStore().addError("Provide a birthDate!")
        return;
    }

    const values = {
        isChild: form.isChild,
        relationType: form.isFather ? "FATHER" : "MOTHER",
        mergeToId: props.id,
        newMember: {
            birthDate: form.birthDate,
            name: form.name
        },
        isNewRoot: useTreeStore().realRootMember?.id === props.id
    }

    const userId = useTreeStore().treeOwnerId;

    console.log(values);
    addTreeRelation(userId, values)
        .then(res => {
            console.log(res);
            router.go(-1);
        })
        .catch(_err => useNotificationStore().addError("Something went wrong..."));
}

</script>

<template>

    <div class="form-wrapper">
        <form>
            <div class="formField">
                <label>Is Child?</label>
                <input v-model="form.isChild" type="checkbox" id="isChild"/>
            </div>
            <div class="formField">
                <label>Connect with father relation?</label>
                <input v-model="form.isFather" type="checkbox" id="isFather"/>
            </div>
            <div class="formField">
                <label>Name</label>
                <input v-model="form.name" type="text" id="name"/>
            </div>
            <div class="formField">
                <label>Birth date</label>
                <input v-model="form.birthDate" type="datetime-local" id="birthDate"/>
            </div>
            <button @click="onSubmit">Create</button>
        </form>
    </div>
</template>

<style scoped lang="scss">
</style>