<script setup>

import { onMounted, reactive, ref } from "vue";
import MasterLayout from "../MasterLayout.vue";
import Modal from "@Components/Modal.vue";
import { getUsers, postUsers } from "../API/users/apiUsers";
import apiRequest from '../API/main';

const users = ref([]);
const currentUsers = reactive({
    name: "",
    email: "",
    password: "",
});
const isModalOpen = ref(false);
const props = defineProps({
    url: String,
});

function openNewProductModal() {
    isModalOpen.value = true;
}

const onSubmit = async () => {
    const formData = {
        ...currentUsers,
    };
    try {
        await postUsers(formData);
        console.log(formData);
        isModalOpen.value = false;

        fetchUser();
    } catch (err) {
        console.log("Gagal menyimpan users", err);
    }
};

const fetchUser = async () => {
    try {
        const response = await apiRequest({
            url: "users",
            method: "get"
        });
        if (response.status == 200) {
            users.value = response.data;
            console.log(response.data);
        } else {
            console.log("Gagal mengambil users", response.message);
        }
    } catch (err) {
        console.log("Gagal mengambil users", err);
    }
};

onMounted(() => {
    fetchUser();
});
</script>
<template>
    <MasterLayout :url="props.url">
        <div class="container mx-auto">
            <div class="flex justify-between mb-5 items-center">
                <h1 class="text-2xl font-bold">User</h1>
                <button
                    @click="openNewProductModal"
                    class="bg-gray-600 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded"
                >
                    New User
                </button>
            </div>
            <!-- Add your main content here -->
            <div class="overflow-x-auto">
                <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <div class="pb-4 flex justify-between items-center">
                        <div>
                            <label for="table-search" class="sr-only"
                                >Search</label
                            >
                            <div class="relative mt-1">
                                <div
                                    class="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none"
                                >
                                    <svg
                                        class="w-4 h-4 text-gray-500 dark:text-gray-400"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            stroke="currentColor"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                        />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    id="table-search"
                                    class="w-52 block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Search for users"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <button>Select All</button>
                    </div>
                    <table
                        class="w-full text-sm text-left rtl:text-right text-gray-500 border bg-slate-800"
                    >
                        <thead
                            class="text-xs text-gray-700 uppercase bg-gray-50 border"
                        >
                            <tr>
                                <th scope="col" class="p-4">
                                    <div class="flex items-center">
                                        <input
                                            id="checkbox-all-search"
                                            type="checkbox"
                                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-gray-400 lue-500 dark:focus:ring-blue-600"
                                        />
                                        <label
                                            for="checkbox-all-search"
                                            class="sr-only"
                                            >checkbox</label
                                        >
                                    </div>
                                </th>
                                <th scope="col" class="px-6 py-3">Profile</th>
                                <th scope="col" class="px-6 py-3">Name</th>
                                <th scope="col" class="px-6 py-3">Email</th>
                                <th scope="col" class="px-6 py-3">
                                    Created At
                                </th>

                                <th scope="col" class="px-6 py-3 text-center">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody class="w-full">
                            <tr
                                class="bg-white border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                                v-for="user in users"
                                :key="user.id"
                            >
                                <td class="w-4 p-4">
                                    <div class="flex items-center">
                                        <input
                                            id="checkbox-table-search-2"
                                            type="checkbox"
                                            class="w-4 h-4 text-gray-900 bg-gray-100 border-gray-300 rounded-sm focus:ring-gray-400 lue-500"
                                        />
                                        <label
                                            for="checkbox-table-search-2"
                                            class="sr-only"
                                            >checkbox</label
                                        >
                                    </div>
                                </td>
                                <th
                                    scope="row"
                                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                                >
                                    <img
                                        src="/asset/img/asset1.jpg"
                                        class="w-10 h-10 object-cover rounded-full"
                                        alt="User Image"
                                    />
                                </th>
                                <td class="px-6 py-4">{{ user.name }}</td>
                                <td class="px-6 py-4">{{ user.email }}</td>
                                <td class="px-6 py-4">{{ user.created_at }}</td>

                                <td
                                    class="flex items-center px-6 py-4 justify-center"
                                >
                                    <a
                                        href="#"
                                        class="font-medium text-green-900 hover:underline bg-green-300 rounded px-6 py-2"
                                        >Edit</a
                                    >
                                    <a
                                        href="#"
                                        class="font-medium text-red-600 bg-red-200 rounded px-6 py-2 hover:underline ms-3"
                                        >Remove</a
                                    >
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>

        <div class="flex flex-col items-center mt-5">
            <!-- Help text -->
            <span class="text-sm text-gray-700 dark:text-gray-400">
                Showing <span class="font-semibold text-gray-900">1</span> to
                <span class="font-semibold text-gray-900">10</span> of
                <span class="font-semibold text-gray-900">100</span> Entries
            </span>
            <!-- Buttons -->
            <div class="inline-flex mt-5 xs:mt-0">
                <button
                    class="flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-gray-800 rounded-s hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                    Prev
                </button>
                <button
                    class="flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-gray-800 border-0 border-s border-gray-700 rounded-e hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                    Next
                </button>
            </div>
        </div>

        <Modal :show="isModalOpen" @close="isModalOpen = false">
            <!-- Main modal -->
            <div id="">
                <div class="relative p-4 w-full max-w-2xl max-h-full">
                    <!-- Modal content -->
                    <div class="relative rounded-lg shadow-sm">
                        <!-- Modal header -->
                        <div
                            class="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200"
                        >
                            <h3 class="text-xl font-semibold text-gray-900">
                                New User
                            </h3>
                            <button
                                type="button"
                                class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center cursor-pointer dark:hover:text-white"
                                data-modal-hide="default-modal"
                                @click="isModalOpen = false"
                            >
                                <svg
                                    class="w-3 h-3"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 14 14"
                                >
                                    <path
                                        stroke="currentColor"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                    />
                                </svg>
                                <span class="sr-only">Close modal</span>
                            </button>
                        </div>
                        <!-- Modal body -->
                        <div class="p-4 md:p-5 space-y-4">
                            <form class="mx-auto" @submit.prevent="onSubmit">
                                <div class="mb-5">
                                    <label
                                        for="default-input"
                                        class="block mb-2 text-sm font-medium text-gray-900"
                                    >
                                        Name
                                    </label>

                                    <input
                                        type="text"
                                        id="default-input"
                                        v-model="currentUsers.name"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    />
                                    <!-- Display sub_title errors -->
                                    <ul
                                        v-if="errors"
                                        class="text-red-500 text-sm mt-1"
                                    >
                                        <li
                                            v-for="(
                                                error, index
                                            ) in errors.link"
                                        >
                                            {{ error }}
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <label
                                        for="default-input"
                                        class="block mb-2 text-sm font-medium text-gray-900"
                                    >
                                        Email
                                    </label>

                                    <input
                                        type="text"
                                        id="default-input"
                                        v-model="currentUsers.email"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    />
                                    <!-- Display sub_title errors -->
                                    <ul
                                        v-if="errors"
                                        class="text-red-500 text-sm mt-1"
                                    >
                                        <li
                                            v-for="(
                                                error, index
                                            ) in errors.link"
                                        >
                                            {{ error }}
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <label
                                        for="default-input"
                                        class="block mb-2 text-sm font-medium text-gray-900"
                                    >
                                        Password
                                    </label>

                                    <input
                                        type="password"
                                        id="default-input"
                                        v-model="currentUsers.password"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    />
                                    <!-- Display sub_title errors -->
                                    <ul
                                        v-if="errors"
                                        class="text-red-500 text-sm mt-1"
                                    >
                                        <li
                                            v-for="(
                                                error, index
                                            ) in errors.link"
                                        >
                                            {{ error }}
                                        </li>
                                    </ul>
                                </div>
                                <!-- Modal footer -->
                                <div class="flex items-center pt-6 border-t">
                                    <button
                                        data-modal-hide="default-modal"
                                        type="submit"
                                        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    </MasterLayout>
</template>
