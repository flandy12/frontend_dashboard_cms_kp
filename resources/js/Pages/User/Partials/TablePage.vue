<script setup>
import { reactive, ref, watch } from "vue";
import { useApiRequest } from "@/Helper/api.js";
import Modal from "@/Components/Modal.vue";

// Props
const props = defineProps({
    users: Array,
});

// State
const data = ref(null);
const currentUser = reactive({
    profile_photo_url: "",
    name: "",
    email: "",
    created_at: "",
});
const isModalOpen = ref(false);

const editCategory = async (id) => {
    const response = await useApiRequest(`users/${id}`, "get", null, {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_APP_TOKEN}`,
    });

    if (response.success) {
        data.value = response.data;
        form.name = response.data.name; // isi form dengan data dari API
        openModal();
    } else {
        console.log("Gagal: " + response.message);
    }
};

const deleteCategory = async (id) => {
    const response = await useApiRequest(`users/${id}`, "delete", {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_APP_TOKEN}`,
    });

    if (response.success) {
        data.value = response.data;
        form.name = response.data.name; // isi form dengan data dari API
        openModal();
    } else {
        console.log("Gagal: " + response.message);
    }
};

function openModal() {
    isModalOpen.value = true;
}

function closeModal() {
    isModalOpen.value = false;
}

const submitForm = async (id) => {
    const formData = {
        ...currentUser,
    };

    const response = await useApiRequest(`users/${id}`, "POST", {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_APP_TOKEN}`,
        },
        body: formData,
    });

    if (response.success) {
        data.value = response.data;
        closeModal();
    } else {
        console.log("Gagal: " + response.message);
    }
};

watch(
    () => props.users,
    (newVal) => {
        console.log("User updated:", newVal);
    }
);
</script>

<template>
    <table class="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 border">
            <tr>
                <th scope="col" class="p-4">
                    <div class="flex items-center">
                        <input
                            id="checkbox-all-search"
                            type="checkbox"
                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500"
                        />
                        <label for="checkbox-all-search" class="sr-only"
                            >checkbox</label
                        >
                    </div>
                </th>
                <th scope="col" class="px-6 py-3">Profile</th>
                <th scope="col" class="px-6 py-3">Name</th>
                <th scope="col" class="px-6 py-3">Email</th>
                <th scope="col" class="px-6 py-3">Created_at</th>
                <th scope="col" class="px-6 py-3">Action</th>
            </tr>
        </thead>
        <tbody class="text-gray">
            <tr
                v-for="(items, key) in props.users"
                :key="items.id"
                class="bg-white border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
            >
                <td class="w-4 p-4">
                    <div class="flex items-center">
                        <input
                            type="checkbox"
                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500"
                        />
                        <label class="sr-only">checkbox</label>
                    </div>
                </td>
                <th
                    scope="row"
                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                    <img
                        :src="items.profile_photo_url"
                        class="w-10 h-10 object-cover rounded-full"
                        alt="User Image"
                    />
                </th>
                <!-- <td class="px-6 py-4 whitespace-nowrap">
                    {{ items.profile_photo_url }}
                </td> -->
                <td class="px-6 py-4 whitespace-nowrap">{{ items.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ items.email }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    {{ items.created_at }}
                </td>

                <td class="flex items-center px-6 py-4">
                    <span
                        class="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                        @click="editCategory(items.id)"
                        >Edit</span
                    >
                    <span
                        class="font-medium text-red-600 dark:text-red-500 hover:underline ms-3 cursor-pointer"
                        @click="deleteCategory(items.id)"
                        >Remove</span
                    >
                </td>
            </tr>
        </tbody>
    </table>

    <Modal :show="isModalOpen" @close="closeModal">
        <div class="relative p-4 w-full max-w-2xl max-h-full">
            <div class="relative rounded-lg shadow-sm">
                <div
                    class="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200"
                >
                    <h3 class="text-xl font-semibold text-gray-900">
                        Edit Category
                    </h3>
                    <button
                        type="button"
                        class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                        @click="closeModal"
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
                                v-model="form.name"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            />
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
    </Modal>
</template>
