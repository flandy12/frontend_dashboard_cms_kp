<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import MasterLayout from "../MasterLayout.vue";
import { useApiRequest } from "@/Helper/api.js";
import TablePage from "../Category/Partials/TablePage.vue";
import apiRequest from "../API/main";
import Modal from "@/Components/Modal.vue";

const props = defineProps({
    url: String,
});

const data = ref([]);
const errors = ref([]);
const currentCategory = reactive({ name: "" });

const submitForm = async (id) => {
    if (!id) {
        const formData = {
            ...currentCategory,
        };
        try {
            const response = await apiRequest({
                url: "categories",
                method: "post",
                data: formData,
            });

            location.reload();
        } catch (err) {
            errors.value = err.response.data.errors;
        }
    } else {
        try {
            const response = await apiRequest({
                url: `/categories/${id}`,
                method: "get",
            });
            console.log(response);
        } catch (err) {
            console.log("Gagal mengambil category", err);
        }
    }
};

const isModalOpen = ref(false);
function openNewProductModal() {
    isModalOpen.value = true;
}

function closeModal() {
    isModalOpen.value = false;
}

function applyFilters() {
    // Add your filter logic here
    console.log("Filter button clicked");
}

const getCategory = async () => {
    try {
        const response = await apiRequest({
            url: "/categories",
            method: "get",
        });
        if (response.status == 200) {
            data.value = response.data;
            console.log(response.data);
        }
    } catch (err) {
        console.log("Gagal mengambil category", err);
    }
};

onMounted(async () => {
    await getCategory();
});
</script>

<template>
    <MasterLayout :url="props.url">
        <div class="container mx-auto">
            <div class="flex justify-between mb-5 items-center">
                <h1 class="text-2xl font-bold">Category</h1>
                <button
                    @click="openNewProductModal"
                    class="bg-gray-600 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded"
                >
                    New Category
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
                                    placeholder="Search for categories"
                                />
                            </div>
                        </div>

                        <div>
                            <button>Select All</button>
                        </div>
                    </div>
                    <TablePage :categori="data" />
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

        <Modal :show="isModalOpen" @close="closeModal">
            <div class="relative p-4 w-full max-w-2xl max-h-full">
                <div class="relative rounded-lg shadow-sm">
                    <div
                        class="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200"
                    >
                        <h3 class="text-xl font-semibold text-gray-900">
                            New Category
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
                                    v-model="currentCategory.name"
                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                />
                                <ul
                                    v-if="errors"
                                    class="text-red-500 text-sm mt-1"
                                >
                                    <li v-for="error in errors.name">
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
        </Modal>
    </MasterLayout>
</template>
