<script setup>
import { ref, reactive, onMounted } from "vue";
import MasterLayout from "../MasterLayout.vue";
import Modal from "@/Components/Modal.vue";
import apiRequest from "../API/main";

const props = defineProps({
    url: String,
});

const data = ref([]);
const errors = ref([]);

const currentData = reactive({ id: null, name: "" });
const isEditing = ref(false);
const isModalOpen = ref(false);

function openNewProductModal(id = null) {
    if (id) {
        isEditing.value = true;
        getPermissionById(id);
    } else {
        isEditing.value = false;
        currentData.id = null;
        currentData.name = "";
    }
    isModalOpen.value = true;
}

function applyFilters() {
    // Add your filter logic here
    console.log("Filter button clicked");
}

const submitForm = async () => {
    const formData = {
        ...currentData,
    };

    try {
        if (isEditing.value && currentData.id) {
            await apiRequest({
                url: `permissions/${currentData.id}`,
                method: "put",
                data: formData,
            });
        } else {
            await apiRequest({
                url: "permissions",
                method: "post",
                data: formData,
            });
        }

        location.reload();
    } catch (err) {
        errors.value = err.response.data.errors;
    }
};

const getPermission = async () => {
    try {
        const response = await apiRequest({
            url: "permissions",
            method: "get",
        });

        if (response.status == 200) {
            data.value = response.data;
            console.log(response);
        }
    } catch (err) {
        console.log("Gagal mengambil role", err);
    }
};

function closeModal() {
    isModalOpen.value = false;
    currentData.name = "";
    errors.value = "";
}

const getPermissionById = async (id) => {
    try {
        const response = await apiRequest({
            url: `permissions/${id}`,
            method: "get"
        });

        if (response.status == 200) {
            const permission = response.data;
            currentData.id = permission.id;
            currentData.name = permission.name;
            console.log(permission);
        }
    } catch (err) {
        console.log("Gagal mengambil permission", err);
    }
};

const deletePermission = async (id) => {
    const confirmDelete = confirm(
        "Are you sure you want to delete this permission?"
    );
    if (!confirmDelete) return;

    try {
        await apiRequest({
            url: `permissions/${id}`,
            method: "delete",
        });

        getPermission();
    } catch (err) {
        console.error("Gagal menghapus permission", err);
        alert("Gagal menghapus permission.");
    }
};

onMounted(() => {
    getPermission();
});

</script>
<template>
    <MasterLayout :url="props.url">
        <div class="container mx-auto">
            <div class="flex justify-between mb-5 items-center">
                <h1 class="text-2xl font-bold">Permission</h1>
                <button
                    @click="openNewProductModal(null)"
                    class="bg-gray-600 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded"
                >
                    New Permission
                </button>
            </div>
            <!-- Add your main content here -->
            <div class="relative overflow-x-auto">
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
                                    placeholder="Search for permission"
                                />
                            </div>
                        </div>

                        <div>
                            <button>Select All</button>
                        </div>
                    </div>

                    <table
                        class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
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
                                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"
                                        />
                                        <label
                                            for="checkbox-all-search"
                                            class="sr-only"
                                            >checkbox</label
                                        >
                                    </div>
                                </th>
                                <th scope="col" class="px-6 py-3">Name</th>
                                <th scope="col" class="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody class="text-gray-600">
                            <tr
                                class="bg-white border-b border-gray-200 hover:bg-gray-50"
                                v-for="item in data"
                                :key="item.id"
                            >
                                <td class="w-4 p-4">
                                    <div class="flex items-center">
                                        <input
                                            id="checkbox-table-search-1"
                                            type="checkbox"
                                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600"
                                        />
                                        <label
                                            for="checkbox-table-search-1"
                                            class="sr-only"
                                            >checkbox</label
                                        >
                                    </div>
                                </td>
                                <th
                                    scope="row"
                                    class="px-6 py-4 font-medium whitespace-nowrap"
                                >
                                    {{ item.name }}
                                </th>

                                <td class="flex items-center px-6 py-4">
                                    <a
                                        href="#"
                                        class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                    >
                                        <button
                                            @click="
                                                openNewProductModal(item.id)
                                            "
                                        >
                                            Edit
                                        </button></a
                                    >
                                    <a
                                        href="#"
                                        class="font-medium text-red-600 dark:text-red-500 hover:underline ms-3"
                                    >
                                        <button
                                            @click="deletePermission(item.id)"
                                        >
                                            Remove
                                        </button></a
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
            <span class="text-sm text-gray-700">
                Showing <span class="font-semibold text-gray-900">1</span> to
                <span class="font-semibold text-gray-900">10</span> of
                <span class="font-semibold text-gray-900">100</span> Entries
            </span>
            <!-- Buttons -->
            <div class="inline-flex mt-2 xs:mt-0">
                <button
                    class="flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-gray-600 rounded-s hover:bg-gray-900"
                >
                    Prev
                </button>
                <button
                    class="flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-gray-600 border-0 border-s border-gray-700 rounded-e hover:bg-gray-900"
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
                                {{
                                    isEditing
                                        ? "Edit Permission"
                                        : "New Permission"
                                }}
                            </h3>
                            <button
                                type="button"
                                class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
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
                        <form class="" @submit.prevent="submitForm">
                            <div class="mb-5">
                                <label for="base-input" class="block mb-2 text-sm font-medium text-gray-900 ">Name</label>
                                <input type="text" id="base-input" v-model="currentData.name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ">
                                <ul
                                    v-if="errors"
                                    class="text-red-500 text-sm mt-1"
                                >
                                    <li
                                        v-for="(
                                            error
                                        ) in errors.name"
                                    >
                                        {{ error }}
                                    </li>
                                </ul>
                            </div>

                                <button
                                    data-modal-hide="default-modal"
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
        </Modal>
    </MasterLayout>
</template>
