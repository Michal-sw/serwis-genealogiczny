<script setup>
import { reactive } from 'vue';
import router from '../router/index';
import { login } from '../services/axiosService';
import { useAuthStore } from '../stores/auth';
import { useNotificationStore } from '../stores/notifications';

const form = reactive({
    login: "",
    password: ""
});

function onLogin(_event) {
    _event.preventDefault();

    login({ login: form.login, password: form.password})
        .then(res => {
            const token = res.data.token;
            useAuthStore().setToken(token);
            useNotificationStore().addNotification("Successfully logged in!");
            router.push('/');
        })
        .catch(err => {
            console.log(err)
            useNotificationStore().addError("Invalid credentials!");
        })
}

</script>

<template>
    <h2>Login page</h2>
    <form>
        <div class="formField">
            <label>Login</label>
            <input v-model="form.login" type="text" id="login"/>
        </div>
        <div class="formField">
            <label>Password</label>
            <input v-model="form.password" type="text" id="password"/>
        </div>
        <button @click="onLogin">Log in</button>
    </form>
</template>

<style scoped>
    form {
        border-radius: 30px;
        background-color: grey;
        color: black;
        padding: 50px;
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .formField {
        width: 300px;
        display: flex;
        justify-content: space-between;
    }

</style>
