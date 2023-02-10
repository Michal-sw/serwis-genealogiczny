<script setup>
import { reactive } from 'vue';
import { useNotificationStore } from '../stores/notifications';
import { addRoot } from '../services/axiosService';
import router from '../router';

const props = defineProps({
    id: String
})

const form = reactive({
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
        birthDate: form.birthDate,
        name: form.name
    }

    const userId = props.id;

    addRoot(userId, values)
        .then(res => {
            router.go(-1);
        })
        .catch(_err => useNotificationStore().addError("Something went wrong..."));
}

</script>

<template>

    <div class="form-wrapper">
        <form>
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