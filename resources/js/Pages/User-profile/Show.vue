<script setup>
import { onMounted, reactive, ref } from "vue";
import MasterLayout from "../MasterLayout.vue";
import apiRequest from "../API/main";

const props = defineProps({
    url: String,
});
function getCookie(name) {
    const match = document.cookie.match(
        new RegExp("(^| )" + name + "=([^;]+)")
    );
    if (match) return decodeURIComponent(match[2]);
    return null;
}

const users = ref([]);
const showPassword = ref([false]);
const errors = ref([]);
const currentUser = reactive({
    name: "",
    email: "",
    password: "",
});

const getUsers = async () => {
    try {
        const response = await apiRequest({
            url: "/users",
            method: "get",
        });
        if (response.status == 200) {
            users.value = response.data;
            console.log(response.data);
        }
    } catch (err) {
        console.log("Gagal mengambil users", err);
    }
};

onMounted(() => {
    const token = getCookie("token");
    console.log(token);
    getUsers();
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
                                    <div class="ro">
                                        <img
                                            src="/asset/img/asset1.jpg"
                                            class=""
                                            alt="User Image"
                                        />
                                    </div>
                                </a>
                                <div class="py-5 px-5">
                                    <a href="#">
                                        <h5
                                            class="mb-2 text-2xl font-bold tracking-tight text-gray-900"
                                        >
                                            Wahyu Rifia Rizki
                                        </h5>
                                    </a>
                                    <p
                                        class="mb-3 font-normal text-gray-700 dark:text-gray-400"
                                    >
                                        Admin
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
                                            class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        >
                                            Edit
                                        </a>
                                    </div>
                                    <div class="p-4 md:p-5 space-y-4">
                                        <form @submit.prevent="submitForm">
                                            <div class="mb-5">
                                                <label
                                                    for="name"
                                                    class="block mb-2 text-sm font-medium text-gray-900"
                                                    >Name</label
                                                >
                                                <input
                                                    type="text"
                                                    id="name"
                                                    v-model="currentUser.name"
                                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                    placeholder="Wahyu Rifia Rizki"
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
                                                    for="name"
                                                    class="block mb-2 text-sm font-medium text-gray-900"
                                                    >Email</label
                                                >
                                                <input
                                                    type="text"
                                                    id="name"
                                                    v-model="currentUser.email"
                                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                    placeholder="unknown@gmail.com"
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
                                                    Password
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
                                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10"
                                                    placeholder="******"
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

                                            <div class="mb-5">
                                                <label
                                                    class="block my-5 text-sm font-medium text-gray-900"
                                                >
                                                    Image
                                                </label>
                                                <div
                                                    class="flex items-center p-5 w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                                                >
                                                    <!-- <div class="mt-2 max-w-xs">
                                                <img
                                                    v-if="currentData.image"
                                                    :src="
                                                        URL.createObjectURL(
                                                            currentData.image
                                                        )
                                                    "
                                                    alt="Preview"
                                                    class="rounded"
                                                />
                                                <img
                                                    v-else-if="
                                                        currentData.imageUrl
                                                    "
                                                    :src="currentData.imageUrl"
                                                    alt="Preview"
                                                    class="rounded"
                                                />
                                                <img
                                                    v-else
                                                    src="/path/to/placeholder-image.png"
                                                    alt="Placeholder"
                                                    class="rounded opacity-50"
                                                />
                                            </div> -->
                                                    <div
                                                        class="mt-2 mr-3 max-w-xs"
                                                    >
                                                        <img
                                                            v-if="imagePreview"
                                                            :src="imagePreview"
                                                            alt="Preview"
                                                            class="rounded max-w-full"
                                                        />
                                                    </div>
                                                    <input
                                                        type="file"
                                                        @change="
                                                            handleImageUpload
                                                        "
                                                    />
                                                </div>
                                                <p
                                                    class="mt-1 text-sm text-gray-500"
                                                >
                                                    SVG, PNG, JPG, MP4, or GIF
                                                    (MAX. 800x400px).
                                                </p>
                                                <!-- Preview gambar -->

                                                <!-- Display sub_title errors -->
                                                <ul
                                                    v-if="errors"
                                                    class="text-red-500 text-sm mt-1"
                                                >
                                                    <li
                                                        v-for="(
                                                            error, index
                                                        ) in errors.image"
                                                    >
                                                        {{ error }}
                                                    </li>
                                                </ul>
                                            </div>
                                            <button
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
