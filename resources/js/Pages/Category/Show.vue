<script setup>
import { ref, reactive, onMounted, computed, watch } from "vue";
import MasterLayout from "../MasterLayout.vue";
import apiRequest from "../API/main";
import Modal from "@/Components/Modal.vue";
import BaseTable from "@/Components/BaseTable.vue";
import { getCookie, hasPermission } from "@/Pages/API/main.js";

// Check Permission
const permission = ref({});

const props = defineProps({
    url: String,
});

const currentPage = ref(1);
const perpage = ref(6);
const paginatedCategories = computed(() => {
    const start = (currentPage.value - 1) * perpage.value;
    const end = start + perpage.value;
    return filteredCategory.value.slice(start, end);
});

const totalPages = computed(() => {
    return Math.ceil(filteredCategory.value.length / perpage.value);
});

const categories = ref([]);
const columns = [{ label: "Name", key: "name" }];
const errors = ref([]);

const currentCategory = reactive({ id: null, name: "" });
const isEditing = ref(false);
const isModalOpen = ref(false);
const searchQuery = ref("");

const filteredCategory = computed(() => {
    if (!searchQuery.value) return categories.value;
    return categories.value.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

function openModal(category) {
    isEditing.value = !!category;
    Object.assign(currentCategory, {
        id: category?.id ?? null,
        name: category?.name ?? "",
    });
    isModalOpen.value = true;
}
function applyFilters() {
    // Add your filter logic here
    console.log("Filter button clicked");
}

const submitForm = async () => {
    try {
        if (isEditing.value) {
            await apiRequest({
                url: `categories/${currentCategory.id}`,
                method: "put",
                data: { name: currentCategory.name },
            });
        } else {
            await apiRequest({
                url: "categories",
                method: "post",
                data: { name: currentCategory.name },
            });
        }
        isModalOpen.value = false;
        getCategories();

        // location.reload();
    } catch (err) {
        errors.value = err.response.data.errors;
    }
};

const getCategories = async () => {
    try {
        const response = await apiRequest({
            url: "categories",
            method: "get",
        });
        if (response.status == 200) {
            categories.value = response.data.data;
            console.log(response.data.data);
        }
    } catch (err) {
        console.log("Gagal mengambil category", err);
    }
};

const deleteCategory = async (id) => {
    const confirmDelete = confirm(
        "Are you sure you want to delete this category?"
    );
    if (!confirmDelete) return;

    try {
        await apiRequest({
            url: `categories/${id}`,
            method: "delete",
        });

        getCategories();
    } catch (err) {
        console.error("Gagal menghapus category", err);
        alert("Gagal menghapus category.");
    }
};

onMounted(() => {
    const userData = getCookie("user_data");
    try {
        permission.value = JSON.parse(userData || "{}");
    } catch {
        permission.value = {};
    }
    getCategories();
});

watch(searchQuery, () => {
    currentPage.value = 1;
});
</script>

<template>
    <MasterLayout :url="props.url">
        <div class="container mx-auto">
            <div class="flex justify-between mb-5 items-center">
                <h1 class="text-2xl font-bold">Category</h1>
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
                                    v-model="searchQuery"
                                    type="text"
                                    id="table-search"
                                    class="w-52 block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Search for categories"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                @click="openModal(null)"
                                v-if="
                                    hasPermission(permission, 'category create')
                                "
                                class="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded"
                            >
                                New Category
                            </button>
                        </div>
                    </div>
                    <BaseTable :data="paginatedCategories" :columns="columns">
                        <template #actions="{ item }">
                            <button
                                v-if="
                                    hasPermission(permission, 'category edit')
                                "
                                @click="openModal(item)"
                                class="text-blue-600 hover:underline mr-2"
                            >
                                Edit
                            </button>
                            <button
                                v-if="
                                    hasPermission(permission, 'category remove')
                                "
                                @click="deleteCategory(item.id)"
                                class="text-red-600 hover:underline"
                            >
                                Remove
                            </button>
                        </template>
                    </BaseTable>
                </div>
            </div>
        </div>

        <div class="flex flex-col items-center mt-5">
            <span class="text-sm text-gray-700">
                Page {{ currentPage }} of {{ totalPages }}
            </span>
            <!-- Buttons -->
            <div class="inline-flex mt-5 xs:mt-0 space-x-2">
                <button
                    :disabled="currentPage === 1"
                    @click="currentPage--"
                    class="px-4 h-10 bg-gray-800 text-white rounded disabled:opacity-50"
                >
                    Prev
                </button>

                <button
                    :disabled="currentPage === totalPages"
                    @click="currentPage++"
                    class="px-4 h-10 bg-gray-800 text-white rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>

        <Modal :show="isModalOpen" @close="isModalOpen = false">
            <div class="relative p-4 w-full max-w-2xl max-h-full">
                <div class="relative rounded-lg shadow-sm">
                    <div
                        class="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200"
                    >
                        <h3 class="text-xl font-semibold text-gray-900">
                            {{ isEditing ? "Edit Category" : "New Category" }}
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
        </Modal>
    </MasterLayout>
</template>
