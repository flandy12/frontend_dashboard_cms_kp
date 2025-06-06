<script setup>
import { ref, computed, onMounted } from "vue";
import MasterLayout from "../MasterLayout.vue";
import Modal from "@/Components/Modal.vue";
import { getCookie } from "@/Pages/API/main.js";
import apiRequest from "@/Pages/API/main.js";
import { formatRupiah } from "@/Pages/API/main.js";
import { sendTelegramCSV } from "@/Telegram/telegramAPI";

const props = defineProps({
    url: String,
});

const currentPage = ref(1);
const perpage = ref(10);
const paginatedTransaction = computed(() => {
    const start = (currentPage.value - 1) * perpage.value;
    const end = start + perpage.value;
    return data.value.slice(start, end);
});

const totalPages = computed(() => {
    return Math.ceil(data.value.length / perpage.value);
});

const data = ref([]);
const permission = ref({});

const searchQuery = ref("");
const exportCSV = async () => {
    const header =
        "Product Name,Category,Color,Size,Quantity,Harga Satuan,Harga Total, Tanggal Checkout\n";

    const rows = [];

    data.value.forEach((checkout) => {
        // const checkoutDate = new Date(checkout.created_at).toLocaleString();
        const checkoutDate = new Date(checkout.created_at)
            .toISOString()
            .split("T")[0];
        checkout.items.forEach((item) => {
            const p = item.product;
            const row = [
                `"${p.name}"`,
                p.category?.name || "",
                p.color,
                p.size,
                item.quantity,
                parseFloat(p.price).toLocaleString("id-ID"),
                (parseFloat(p.price) * item.quantity).toLocaleString("id-ID"),
                checkoutDate,
            ].join(",");
            rows.push(row);
        });
    });

    const csvContent = header + rows.join("\n");

    const encodedUri =
        "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "products.csv");
    document.body.appendChild(link);
    link.click();

    await sendTelegramCSV(csvContent, "laporan penjualan hari ini.csv");
};

const filteredProducts = computed(() => {
    if (!searchQuery.value) return data.value;
    return data.value.filter(
        (product) =>
            product.name
                .toLowerCase()
                .includes(searchQuery.value.toLowerCase()) ||
            product.color
                .toLowerCase()
                .includes(searchQuery.value.toLowerCase()) ||
            product.category
                .toLowerCase()
                .includes(searchQuery.value.toLowerCase())
    );
});

function applyFilters() {
    // Add your filter logic here
    console.log("Filter button clicked");
}

const getData = async () => {
    try {
        const response = await apiRequest({
            url: "checkout",
            method: "get",
        });

        if (response.status === 200) {
            data.value = response.data;
            console.log(response.data);
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
</script>

<template>
    <MasterLayout :url="props.url">
        <div class="container mx-auto">
            <!-- Add your main content here -->

            <div class="pb-4 flex justify-between items-center">
                <div class="flex justify-between mb-5 items-center">
                    <h1 class="text-2xl font-bold">Transaction</h1>
                </div>
                <div class="mb-4 flex justify-end gap-5">
                    <!-- <button
                        @click="applyFilters"
                        class="bg-gray-600 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded"
                    >
                        Sinkroninasi Data
                    </button> -->
                    <button
                        @click="exportCSV"
                        class="border text-black border-gray-600 text-sm px-4 py-2 rounded"
                    >
                        Export
                    </button>
                </div>
            </div>
            <div class="relative overflow-x-auto">
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
                                <th class="px-6 py-3">Price</th>
                                <th class="px-6 py-3">Qty</th>
                                <th class="px-6 py-3">Total Price</th>
                                <th class="px-6 py-3">Payment Type</th>
                                <th class="px-6 py-3 text-center">Date</th>
                            </tr>
                        </thead>
                        <tbody class="text-gray-600">
                            <tr
                                v-for="(product, key) in paginatedTransaction"
                                :key="product.id"
                                class="bg-white border-b border-gray-200 hover:bg-gray-50"
                            >
                                <td class="w-4 p-4">
                                    {{ key + 1 }}
                                </td>
                                <td class="space-y-4">
                                    <tr
                                        class="px-6 py-4 font-medium whitespace-nowrap"
                                        scope="row"
                                        v-for="(data, key) in product.items"
                                    >
                                        {{
                                            data.product.name
                                        }}
                                    </tr>
                                </td>
                                <td>
                                    <tr
                                        class="px-6 py-4 font-medium whitespace-nowrap"
                                        scope="row"
                                        v-for="(data, key) in product.items"
                                    >
                                        {{
                                            data.product.color
                                        }}
                                    </tr>
                                </td>
                                <td>
                                    <tr
                                        class="px-6 py-4 font-medium whitespace-nowrap"
                                        scope="row"
                                        v-for="(data, key) in product.items"
                                    >
                                        {{
                                            formatRupiah(data.product.price)
                                        }}
                                    </tr>
                                </td>
                                <td>
                                    <tr
                                        class="px-6 py-4 font-medium whitespace-nowrap"
                                        scope="row"
                                        v-for="(data, key) in product.items"
                                    >
                                        {{
                                            data.quantity
                                        }}
                                    </tr>
                                </td>
                                <td class="px-6 py-4">
                                    {{ formatRupiah(product.total_price) }}
                                </td>
                                <td class="px-6 py-4 capitalize">
                                    {{ product.payment_method }}
                                </td>
                                <td class="px-6 py-4">
                                    {{ product.created_at }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
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
            <!-- Main modal -->
            <div id="">
                <div class="relative p-4 w-full max-w-2xl max-h-full">
                    <!-- Modal content -->
                    <div class="relative rounded-lg shadow-sm dark:bg-gray-700">
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
                                With less than a month to go before the European
                                Union enacts new consumer privacy laws for its
                                citizens, companies around the world are
                                updating their terms of service agreements to
                                comply.
                            </p>
                            <p
                                class="text-base leading-relaxed text-gray-500 dark:text-gray-400"
                            >
                                The European Union’s General Data Protection
                                Regulation (G.D.P.R.) goes into effect on May 25
                                and is meant to ensure a common set of data
                                rights in the European Union. It requires
                                organizations to notify users as soon as
                                possible of high-risk data breaches that could
                                personally affect them.
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
    </MasterLayout>
</template>
