<script setup>
import { ref, onMounted, computed } from "vue";
import MasterLayout from "../MasterLayout.vue";
import { hasPermission, apiRequest, formatRupiah } from "@/Pages/API/main.js";

const props = defineProps({
    url: String,
});

const currentPage = ref(1);
const perpage = ref(6);
const paginatedReport = computed(() => {
    const start = (currentPage.value - 1) * perpage.value;
    const end = start + perpage.value;
    return data.value.slice(start, end);
});

const totalPages = computed(() => {
    return Math.ceil(data.value.length / perpage.value);
});

const data = ref([]);
const permission = ref({});
const isLoading = ref(false);

const sinkronData = () => {
    isLoading.value = true;
    setTimeout(() => {
        isLoading.value = false;
        getProductBestSeller();
    }, 1500);
};

const getProductBestSeller = async () => {
    try {
        const response = await apiRequest("checkout/bestseller", {}, "GET");
        data.value = response.data;
    } catch (err) {
        console.log(err);
        console.error("Gagal mengambil produk:", err);
    }
};

onMounted(() => {
    getProductBestSeller();
});
</script>

<template>
    <MasterLayout :url="props.url">
        <div class="container mx-auto">
            <!-- Add your main content here -->

            <div class="pb-4 flex justify-between">
                <div class="flex justify-between mb-5 items-center">
                    <h1 class="text-2xl font-bold">Report</h1>
                </div>
                <div class="mb-4 flex justify-end gap-5">
                    <button
                        v-if="hasPermission(permission, 'report export')"
                        @click="exportCSV"
                        class="border text-black text-sm px-4 py-2 rounded border-gray-800"
                    >
                        Export
                    </button>
                    <button
                        @click="sinkronData"
                        class="relative flex justify-center items-center bg-gray-600 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded w-[140px]"
                    >
                        <span v-if="!isLoading"> Sinkronisasi Data </span>
                        <svg
                            v-if="isLoading"
                            class="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                class="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                stroke-width="4"
                            />
                            <path
                                class="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                        </svg>
                    </button>
                </div>
            </div>
            <div class="relative overflow-x-auto">
                <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <div class="overflow-x-auto p-4">
<<<<<<< HEAD
                    <h2 class="text-xl font-bold mb-4">Laporan Produk Terlaris - Juni 2025</h2>
                    <table class="min-w-full bg-white border border-gray-200 rounded-xl shadow">
                        <thead>
                        <tr class="bg-gray-100 text-gray-700 text-left text-sm">
                            <th class="px-4 py-2 border-b">No</th>
                            <th class="px-4 py-2 border-b">Nama Produk</th>
                            <th class="px-4 py-2 border-b">Terjual</th>
                            <th class="px-4 py-2 border-b">Total Penjualan</th>
                        </tr>
                        </thead>
                        <tbody class="text-sm text-gray-800">
                        <tr class="hover:bg-gray-50" v-for="(item, key) in data">
                            <td class="px-4 py-2 border-b">{{key+1}}</td>
                            <td class="px-4 py-2 border-b">{{item.nama}}</td>
                            <td class="px-4 py-2 border-b">{{item.total_terjual}}</td>
                            <td class="px-4 py-2 border-b">{{formatRupiah(item.total_pendapatan)}}</td>
                        </tr>
                        <!-- Tambah baris sesuai kebutuhan -->
                        </tbody>
                    </table>
=======
                        <h2 class="text-xl font-bold mb-4">
                            Laporan Produk Terlaris - Juni 2025
                        </h2>
                        <table
                            class="min-w-full bg-white border border-gray-200 rounded-xl shadow"
                        >
                            <thead>
                                <tr
                                    class="bg-gray-100 text-gray-700 text-left text-sm"
                                >
                                    <th class="px-4 py-2 border-b">#</th>
                                    <th class="px-4 py-2 border-b">
                                        Nama Produk
                                    </th>
                                    <th class="px-4 py-2 border-b">Terjual</th>
                                    <th class="px-4 py-2 border-b">
                                        Total Penjualan
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="text-sm text-gray-800">
                                <tr
                                    class="hover:bg-gray-50"
                                    v-for="(item, key) in paginatedReport"
                                >
                                    <td class="px-4 py-2 border-b">
                                        {{ key + 1 }}
                                    </td>
                                    <td class="px-4 py-2 border-b">
                                        {{ item.nama }}
                                    </td>
                                    <td class="px-4 py-2 border-b">
                                        {{ item.total_terjual }}
                                    </td>
                                    <td class="px-4 py-2 border-b">
                                        {{
                                            formatRupiah(item.total_pendapatan)
                                        }}
                                    </td>
                                </tr>
                                <!-- Tambah baris sesuai kebutuhan -->
                            </tbody>
                        </table>
>>>>>>> dash
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
        </div>
    </MasterLayout>
</template>
