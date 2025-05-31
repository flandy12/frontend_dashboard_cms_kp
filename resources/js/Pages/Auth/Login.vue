<script setup>
import { Head, Link, useForm } from '@inertiajs/vue3';
import AuthenticationCard from '@/Components/AuthenticationCard.vue';
import AuthenticationCardLogo from '@/Components/AuthenticationCardLogo.vue';
import Checkbox from '@/Components/Checkbox.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import {apiRequest} from '../API/main.js';

defineProps({
    canResetPassword: Boolean,
    status: String,
});

const form = useForm({
    email: '',
    password: '',
    remember: false,
});

// const submit = () => {
//     form.transform(data => ({
//         ...data,
//         remember: form.remember ? 'on' : '',
//     })).post(route(''), {
//         onFinish: () => form.reset('password'),
//     });
// };
function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + d.toUTCString();

  // secure dan samesite bisa ditambahkan di sini
  document.cookie = `${name}=${value}; ${expires}; path=/`;
}

// Fungsi simpan data user ke localStorage
function saveUserDataToCookie(user, days) {
   const jsonStr = JSON.stringify(user);
   setCookie('user_data', jsonStr, days);
}

const submit = async () => {
    try {
        const response = await apiRequest('/login', {
            email: form.email,
            password: form.password,
            remember: form.remember,
        });

        console.log(response);

        // Simpan token ke cookie jika login berhasil
        setCookie('token', response.access_token, 1);
        // Simpan data user ke cookie
        saveUserDataToCookie(response.data, 1);


        // Redirect ke dashboard
        window.location.href = '/dashboard';
    } catch (error) {
        if (error.response && error.response.status === 422) {
            form.setErrors(error.response.data.errors);
        } else {
            console.error(error);
            alert('Login gagal. Cek email dan password.');
        }
    } finally {
        form.reset('password');
    }
};


</script>

<template>
    <Head title="Log in" />

    <AuthenticationCard>
        <template #logo>
            <AuthenticationCardLogo />
        </template>

        <div v-if="status" class="mb-4 font-medium text-sm text-green-600">
            {{ status }}
        </div>

        <form @submit.prevent="submit">
            <div>
                <InputLabel for="email" value="Email" />
                <TextInput
                    id="email"
                    v-model="form.email"
                    type="email"
                    class="mt-1 block w-full"
                    required
                    autofocus
                    autocomplete="username"
                />
                <InputError class="mt-2" :message="form.errors.email" />
            </div>

            <div class="mt-4">
                <InputLabel for="password" value="Password" />
                <TextInput
                    id="password"
                    v-model="form.password"
                    type="password"
                    class="mt-1 block w-full"
                    required
                    autocomplete="current-password"
                />
                <InputError class="mt-2" :message="form.errors.password" />
            </div>

            <div class="block mt-4">
                <label class="flex items-center">
                    <Checkbox v-model:checked="form.remember" name="remember" />
                    <span class="ms-2 text-sm text-gray-600">Remember me</span>
                </label>
            </div>

            <div class="flex items-center justify-end mt-4">
                <Link v-if="canResetPassword" :href="route('password.request')" class="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Forgot your password?
                </Link>

                <PrimaryButton class="ms-4" :class="{ 'opacity-25': form.processing }" :disabled="form.processing">
                    Log in
                </PrimaryButton>
            </div>
        </form>
    </AuthenticationCard>
</template>
