<script setup>
import { ref, computed, onMounted, watch } from "vue";
import MasterLayout from "../MasterLayout.vue";
import Modal from "@/Components/Modal.vue";
import apiRequest from "@/Pages/API/main.js";
import { getCookie, hasPermission } from "@/Pages/API/main.js";
import { sendTelegramCSV } from "@/Telegram/telegramAPI";

const props = defineProps({
    url: String,
});

const currentPage = ref(1);
const perpage = ref(6);
const paginatedStock = computed(() => {
    const start = (currentPage.value - 1) * perpage.value;
    const end = start + perpage.value;
    return filteredStock.value.slice(start, end);
});

const totalPages = computed(() => {
    return Math.ceil(filteredStock.value.length / perpage.value);
});

const permission = ref({});
const searchQuery = ref("");
const isModalOpen = ref(false);
const data = ref([]);

const filteredStock = computed(() => {
    if (!searchQuery.value) return data.value;
    return data.value.filter(
        (item) =>
            item.product.name
                .toLowerCase()
                .includes(searchQuery.value.toLowerCase()) ||
            item.product.category.name
                .toLowerCase()
                .includes(searchQuery.value.toLowerCase())
    );
});

const exportData = async() =>{
    try {
        const response = await apiRequest({
            url: "export/stockin",
            method: "get",
            responseType: "blob", // <- WAJIB untuk file binary seperti Excel
        });

        if (response.status === 200) {
           const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'stockin.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        }
    } catch (err) {
        console.error("Gagal mengambil produk:", err);
    }
}

function openNewProductModal() {
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
}

function applyFilters() {
  // Add your filter logic here
  console.log('Filter button clicked');
}


const getData = async () => {
    try {
        const response = await apiRequest({
            url: "stockmovements/stockin",
            method: "get",
        });

        if (response.status === 200) {
            data.value = response.data.data;
            console.log(response.data.data);
        }
    } catch (err) {
        console.error("Gagal mengambil produk:", err);
    }
};

onMounted(() => {
    getData();

    const userData = getCookie("user_data");
    try {
        permission.value = JSON.parse(userData || "{}");
    } catch {
        permission.value = {};
    }
});

watch(searchQuery, () => {
    currentPage.value = 1;
});
</script>

<template>
    <MasterLayout :url="props.url">
        <div class="container mx-auto">
            <div class="flex justify-between mb-5 items-center">
                <h1 class="text-2xl font-bold">Stock In</h1>
            </div>

            <div class="pb-4 flex justify-between">
                <div>
                    <label for="table-search" class="sr-only">Search</label>
                    <div class="relative mt-1">
                        <div
                            class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
                        >
                            <svg
                                class="w-4 h-4 text-gray-500 dark:text-gray-400"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20"
                                stroke="currentColor"
                            >
                                <path
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
                            class="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 w-52"
                            placeholder="Search Product Name & Size"
                        />
                    </div>
                </div>

                <div class="mb-4 flex justify-end gap-5">
                    <button
                        @click="exportData"
                        class="border text-black text-sm px-4 py-2 rounded border-gray-800"
                        v-if="hasPermission(permission, 'stock_in export')"
                    >
                        Export
                    </button>
                </div>
            </div>

            <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table
                    class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                >
                    <thead
                        class="text-xs text-gray-700 uppercase bg-gray-50 border"
                    >
                        <tr>
                            <th class="px-6 py-3">No</th>
                            <th class="px-6 py-3">Product name</th>
                            <th class="px-6 py-3">Color</th>
                            <th class="px-6 py-3">Category</th>
                            <th class="px-6 py-3">Size</th>
                            <th class="px-6 py-3">Qty</th>
                            <th class="px-6 py-3">Status</th>
                            <th class="px-6 py-3 text-center">Date</th>
                        </tr>
                    </thead>
                    <tbody class="text-gray-600">
                        <tr
                            v-for="(product, key) in paginatedStock"
                            :key="product.id"
                            class="bg-white border-b border-gray-200 hover:bg-gray-50"
                        >
                            <td class="w-4 p-4">
                                {{ key + 1 }}
                            </td>
                            <th
                                class="px-6 py-4 font-medium whitespace-nowrap"
                                scope="row"
                            >
                                {{ product.product.name }}
                            </th>
                            <td class="px-6 py-4">
                                {{ product.product.color }}
                            </td>
                            <td class="px-6 py-4">
                                {{ product.product.category.name }}
                            </td>
                            <td class="px-6 py-4">
                                {{ product.product.size }}
                            </td>
                            <td class="px-6 py-4">{{ product.quantity }}</td>
                            <td class="px-6 py-4">
                                <span
                                    class="bg-green-300 px-3 py-1 rounded-full"
                                    >Stock In</span
                                >
                            </td>
                            <td class="px-6 py-4">{{ product.created_at }}</td>
                        </tr>
                    </tbody>
                </table>
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
                <!-- Main modal -->
                <div id="">
                    <div class="relative p-4 w-full max-w-2xl max-h-full">
                        <!-- Modal content -->
                        <div
                            class="relative rounded-lg shadow-sm dark:bg-gray-700"
                        >
                            <!-- Modal header -->
                            <div
                                class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200"
                            >
                                <h3
                                    class="text-xl font-semibold text-gray-900 dark:text-white"
                                >
                                    Terms of Service
                                </h3>
                                <button
                                    type="button"
                                    class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
                                <p
                                    class="text-base leading-relaxed text-gray-500 dark:text-gray-400"
                                >
                                    With less than a month to go before the
                                    European Union enacts new consumer privacy
                                    laws for its citizens, companies around the
                                    world are updating their terms of service
                                    agreements to comply.
                                </p>
                                <p
                                    class="text-base leading-relaxed text-gray-500 dark:text-gray-400"
                                >
                                    The European Union’s General Data Protection
                                    Regulation (G.D.P.R.) goes into effect on
                                    May 25 and is meant to ensure a common set
                                    of data rights in the European Union. It
                                    requires organizations to notify users as
                                    soon as possible of high-risk data breaches
                                    that could personally affect them.
                                </p>
                            </div>
                            <!-- Modal footer -->
                            <div
                                class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600"
                            >
                                <button
                                    data-modal-hide="default-modal"
                                    type="button"
                                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                >
                                    I accept
                                </button>
                                <button
                                    data-modal-hide="default-modal"
                                    type="button"
                                    class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                >
                                    Decline
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    </MasterLayout>
</template>
