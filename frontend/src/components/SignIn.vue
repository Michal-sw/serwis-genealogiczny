<script setup>
import { reactive } from 'vue';
import router from '../router/index';
import { signIn } from '../services/axiosService';
import { useAuthStore } from '../stores/auth';
import { useNotificationStore } from '../stores/notifications';

const form = reactive({
    login: "",
    password: ""
});

function onSignIn(_event) {
    _event.preventDefault();

    signIn({ login: form.login, password: form.password})
        .then(res => {
            const token = res.data.token;
            useAuthStore().setToken(token);
            useNotificationStore().addNotification("Successfully siggned in!");
            router.push('/');
        })
        .catch(err => {
            useNotificationStore().addError("Invalid data!");
        })
}

</script>

<template>
    <h2>Sign In</h2>
    <form>
        <div class="formField">
            <label>Login</label>
            <input v-model="form.login" type="text" id="login"/>
        </div>
        <div class="formField">
            <label>Password</label>
            <input v-model="form.password" type="password" id="password"/>
        </div>
        <button @click="onSignIn">Sign in</button>
    </form>
</template>
