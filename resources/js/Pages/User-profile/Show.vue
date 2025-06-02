<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import MasterLayout from "../MasterLayout.vue";
import apiRequest from "../API/main";

const props = defineProps({
    url: String,
});

const user = ref({});
const isEditing = ref(false);
const showPassword = ref(false);
const errors = ref([]);

const isEditMode = ref(false);

const currentUser = reactive({
    id: null,
    name: "",
    email: "",
    password: null,
    profile_url: "",
});

function getCookie(name) {
    const match = document.cookie.match(
        new RegExp("(^| )" + name + "=([^;]+)")
    );
    if (match) return decodeURIComponent(match[2]);
    return null;
}

function deleteCookie(name) {
    document.cookie = `${name}=; Max-Age=0; path=/`;
}

const toggleEdit = () => {
    isEditMode.value = !isEditMode.value;

    if (isEditMode.value) {
        Object.assign(currentUser, user.value);
    }
};

const onSubmit = async (id) => {
    isEditing.value = true;
    const formData = {
        name: currentUser.name,
        email: currentUser.email,
        _method: "PUT", //
    };

    const isPasswordChanged =
        currentUser.password && currentUser.password.trim() !== "";

    if (isPasswordChanged) {
        formData.password = currentUser.password;
    }

    if (isEditing.value) {
        const response = await apiRequest({
            url: `users/${id}`,
            method: "POST",
            data: formData,
        });

        console.log(response);
        isEditMode.value = false;
        await getUserById(id);
    }

    if (isPasswordChanged) {
        deleteCookie("user_data");
        deleteCookie("token");

        window.location.href = "/login";
    }
};

const getUserById = async (id) => {
    try {
        const response = await apiRequest({
            url: `/users/${id}`,
            method: "get",
        });
        if (response.status == 200) {
            user.value = response.data;
            // console.log(user.value);
            // currentUser.value = response.data;
            currentUser.name = response.data.name;
            currentUser.email = response.data.email;
        }
    } catch (err) {
        console.log("Gagal mengambil users", err);
    }
};

onMounted(() => {
    const userData = getCookie("user_data");
    const parsedUsers = JSON.parse(userData);
    getUserById(parsedUsers.id);
});
</script>

<template>
    <MasterLayout :url="props.url">
        <div class="p-4">
            <div class="container mx-auto">
                <!-- Add your main content here -->
                <div class="overflow-x-auto">
                    <div
                        class="relative overflow-x-auto shadow-md sm:rounded-lg"
                    >
                        <div class="grid grid-cols-5 gap-4">
                            <div
                                class="col-span-2 bg-white border border-gray-200 rounded-lg shadow-sm max-h-max"
                            >
                                <a href="#">
                                    <div class="flex justify-center">
                                        <img
                                            :src="user.profile_url"
                                            class="w-20 h-full object-cover"
                                            alt="User Image"
                                        />
                                    </div>
                                </a>
                                <div class="py-5 px-5">
                                    <a href="#">
                                        <h5
                                            class="mb-2 text-2xl font-bold tracking-tight text-gray-900"
                                        >
                                            {{ user.name }}
                                        </h5>
                                    </a>
                                    <p
                                        class="mb-3 font-normal text-gray-700 dark:text-gray-400"
                                    >
                                        {{ user.role }}
                                    </p>
                                </div>
                            </div>
                            <div
                                class="col-span-3 bg-white border border-gray-200 rounded-lg shadow-sm"
                            >
                                <div class="py-5 px-5">
                                    <div class="flex justify-between">
                                        <h5
                                            class="mb-2 text-2xl font-bold tracking-tight text-gray-900"
                                        >
                                            User Information
                                        </h5>
                                        <a
                                            href="#"
                                            @click.prevent="toggleEdit"
                                            :class="` w-[80px] inline-flex justify-center items-center px-3 py-2 text-sm font-medium text-center text-white rounded ${
                                                isEditMode
                                                    ? 'bg-red-600 hover:bg-red-700'
                                                    : 'bg-blue-700 hover:bg-blue-800'
                                            }`"
                                        >
                                            {{ isEditMode ? "Cancel" : "Edit" }}
                                        </a>
                                    </div>
                                    <div class="p-4 md:p-5 space-y-4">
                                        <form
                                            @submit.prevent="onSubmit(user.id)"
                                        >
                                            <div class="mb-5">
                                                <label
                                                    for="name"
                                                    class="block mb-2 text-sm font-medium text-gray-900"
                                                >
                                                    {{
                                                        isEditMode
                                                            ? "New Name"
                                                            : "Name"
                                                    }}</label
                                                >
                                                <input
                                                    type="text"
                                                    id="name"
                                                    v-model="currentUser.name"
                                                    :readonly="!isEditMode"
                                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                                />
                                                <ul
                                                    v-if="errors"
                                                    class="text-red-500 text-sm mt-1"
                                                >
                                                    <li
                                                        v-for="error in errors.name"
                                                    >
                                                        {{ error }}
                                                    </li>
                                                </ul>
                                            </div>
                                            <div class="mb-5">
                                                <label
                                                    for="email"
                                                    class="block mb-2 text-sm font-medium text-gray-900"
                                                >
                                                    {{
                                                        isEditMode
                                                            ? "New Email"
                                                            : "Email"
                                                    }}</label
                                                >
                                                <input
                                                    type="text"
                                                    id="email"
                                                    v-model="currentUser.email"
                                                    :readonly="!isEditMode"
                                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                                />
                                                <ul
                                                    v-if="errors"
                                                    class="text-red-500 text-sm mt-1"
                                                >
                                                    <li
                                                        v-for="error in errors.email"
                                                    >
                                                        {{ error }}
                                                    </li>
                                                </ul>
                                            </div>
                                            <div class="mb-5 relative">
                                                <label
                                                    for="password"
                                                    class="block mb-2 text-sm font-medium text-gray-900"
                                                >
                                                    {{
                                                        isEditMode
                                                            ? "New Password"
                                                            : "Password"
                                                    }}
                                                </label>
                                                <input
                                                    :type="
                                                        showPassword
                                                            ? 'text'
                                                            : 'password'
                                                    "
                                                    id="password"
                                                    v-model="
                                                        currentUser.password
                                                    "
                                                    :readonly="!isEditMode"
                                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 mt-6"
                                                    @click="
                                                        showPassword =
                                                            !showPassword
                                                    "
                                                >
                                                    <svg
                                                        v-if="!showPassword"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        class="w-5 h-5"
                                                    >
                                                        <path
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                        />
                                                        <path
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.262.841-.652 1.625-1.158 2.324M15 12a3 3 0 00-6 0m6 0a3 3 0 01-6 0"
                                                        />
                                                    </svg>
                                                    <svg
                                                        v-else
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        class="w-5 h-5"
                                                    >
                                                        <path
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.269-2.943-9.543-7a10.056 10.056 0 012.375-3.682M9.88 9.88a3 3 0 014.24 4.24M3 3l18 18"
                                                        />
                                                    </svg>
                                                </button>

                                                <ul
                                                    v-if="errors"
                                                    class="text-red-500 text-sm mt-1"
                                                >
                                                    <li
                                                        v-for="error in errors.password"
                                                    >
                                                        {{ error }}
                                                    </li>
                                                </ul>
                                            </div>

                                            <button
                                                v-if="isEditMode"
                                                type="submit"
                                                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                            >
                                                Submit
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </MasterLayout>
</template>
