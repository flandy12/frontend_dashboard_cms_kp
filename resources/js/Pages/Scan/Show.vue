<script setup>
import { ref, onMounted, reactive } from "vue";
import Modal from "@/Components/Modal.vue";
import apiRequest from "../API/main";
import { sendTelegramNotification } from "@/Telegram/telegramAPI";

const props = defineProps({
    id: String,
});

const menu = ref("");

const isModalOpen = ref(false);
const basePrice = ref(0);

const categories = ref([]);
const products = ref([]);
const selectedPayment = ref("");

const currentData = reactive({
    name: "",
    category: "",
    image: null,
    imageUrl: "",
    color: "",
    size: "",
    stock: "",
    price: "",
    rawPrice: 0,
});

const errors = ref([]);
const count = ref(0);

const getCategories = async () => {
    try {
        const response = await apiRequest({
            url: "categories",
            method: "get",
        });

        if (response.status === 200) {
            categories.value = response.data.data;
        }
    } catch (err) {
        console.error("Gagal mengambil kategori:", err);
    }
};

const getProduct = async (id) => {
    try {
        const response = await apiRequest({
            url: `products/scan/${id}`,
            method: "get",
        });

        if (response.status === 200) {
            const data = response.data;
            products.value = data.data;
            isModalOpen.value = true;

            Object.assign(currentData, {
                name: data?.name,
                image: data?.image,
                size: data?.size,
                color: data?.color,
                stock: data?.stock,
                price: formatRupiah(data?.price),
            });

            basePrice.value = data.price; // simpan angka aslinya
        }
    } catch (err) {
        console.error("Gagal mengambil produk:", err);
    }
};

const stockOutModalOpen = ref(false);
const stockOutQuantity = ref(0);

const openModalMaster = (data) => {
    stockOutModalOpen.value = true;
    stockOutQuantity.value = count.value;
    menu.value = data;
    // console.log(count.value);
};

const closeStockOutModal = () => {
    stockOutModalOpen.value = false;
};

const submit = async (menu) => {
    if (
        stockOutQuantity.value <= 0 ||
        stockOutQuantity.value > currentData.stock
    ) {
        alert("Invalid quantity");
        return;
    }

    const CheckoutItem = {
        payment_method: selectedPayment.value,
        items: [
            {
                product_id: Number(currentData.id),
                quantity: stockOutQuantity.value,
                price: currentData.rawPrice,
            },
        ],
    };

    if (menu == "Checkout") {
        try {
            const response = await apiRequest({
                url: `checkout`,
                method: "post",
                data: CheckoutItem,
            });

            closeStockOutModal();

            if (response.status == 201) {
                const response = await apiRequest({
                    url: `products/${currentData.id}`,
                    method: "get",
                });

                if (response.data.stock <= 10) {
                    await sendTelegramNotification(
                        `stock sudah menipis yuk restok kembali, saat ini stock tinggal ${response.data.stock}`
                    );
                }
            }
            alert("Stock updated successfully");

            window.location.href = "/dashboard/product";
        } catch (err) {
            console.error("Stock out failed:", err);
            alert("Failed to update stock.");
        }
    } else {
        const stockIn = {
            product_id: currentData.id,
            quantity: stockOutQuantity.value,
        };

        try {
            await apiRequest({
                url: `stockmovements/stockin`,
                method: "post",
                data: stockIn,
            });

            // Refresh product info
            await getProduct(currentData.id);
            closeStockOutModal();
            alert("Stock updated successfully");
        } catch (err) {
            console.error("Stock out failed:", err);
            alert("Failed to update stock.");
        }
    }
};

function increment() {
    count.value++;
    updatePrice();
}

function decrement() {
    if (count.value > 1) {
        count.value--;
        updatePrice();
    }
}

function updatePrice() {
    const total = basePrice.value * count.value;
    currentData.rawPrice = total;
    currentData.price = formatRupiah(total);
}

function formatRupiah(number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number);
}

onMounted(() => {
    const path = window.location.pathname;
    currentData.id = path.split("/").pop();
    getCategories();
    getProduct(path.split("/").pop());
});
</script>

<template>
    <div class="w-full flex justify-center bg-zinc-50 py-20">
        <!-- Main modal -->
        <div
            class="bg-slate-50 rounded-xl w-full max-w-xl shadow-xl p-6 border border-gray-200"
        >
            <div class="">
                <!-- Modal content -->
                <div class="relative rounded-lg">
                    <div class="mb-5">
                        <label
                            for="default-input"
                            class="block mb-2 text-sm font-medium text-gray-900"
                        >
                            Product Name
                        </label>
                        <p class="text-2xl">{{ currentData.name }}</p>
                    </div>
                    <!-- Modal body -->
                    <div class="space-y-4">
                        <div class="mx-auto">
                            <div class="mb-5">
                                <div
                                    class="flex justify-center items-center p-5 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                                >
                                    <div class="mt-2 m-auto">
                                        <img
                                            :src="currentData.image"
                                            alt="Preview"
                                            class="rounded w-full bg-slate-500 h-56"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div class="mb-5"></div>

                            <div class="mb-5 flex justify-between gap-5">
                                <div class="w-full">
                                    <label
                                        for="default-input"
                                        class="block mb-2 text-sm font-medium text-gray-900"
                                    >
                                        Color
                                    </label>

                                    <p class="font-bold">
                                        {{ currentData.color }}
                                    </p>
                                </div>

                                <div class="w-full">
                                    <label
                                        for="default-input"
                                        class="block mb-2 text-sm font-medium text-gray-900"
                                    >
                                        Size
                                    </label>

                                    <p class="font-bold">
                                        {{ currentData.size }}
                                    </p>
                                </div>

                                <div class="w-full">
                                    <label
                                        for="default-input"
                                        class="block mb-2 text-sm font-medium text-gray-900"
                                    >
                                        Stock
                                    </label>
                                    <p class="font-bold">
                                        {{ currentData.stock }}
                                    </p>
                                </div>
                            </div>

                            <!-- Modal footer -->
                            <div class="flex items-center pt-6 border-t">
                                <div class="w-full">
                                    <label
                                        for="default-input"
                                        class="block mb-2 text-sm font-medium text-gray-900"
                                    >
                                        Price
                                    </label>
                                    <p class="font-bold text-2xl">
                                        {{ currentData.price }}
                                    </p>
                                </div>

                                <div class="flex items-center space-x-4">
                                    <button
                                        @click="decrement"
                                        class="bg-zinc-300 text-black px-4 py-2 rounded-lg hover:bg-red-600 transition"
                                    >
                                        -
                                    </button>

                                    <span
                                        class="text-xl font-bold w-10 text-center"
                                        >{{ count }}</span
                                    >

                                    <button
                                        @click="increment"
                                        class="bg-zinc-300 text-black px-4 py-2 rounded-lg hover:bg-green-600 transition"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div
                                class="mt-5 grap-5 space-x-5 flex justify-center"
                            >
                                <button
                                    @click="openModalMaster('Checkout')"
                                    data-modal-hide="default-modal"
                                    type="submit"
                                    class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                >
                                    Checkout
                                </button>

                                <button
                                    @click="openModalMaster('Stock In')"
                                    data-modal-hide="default-modal"
                                    type="submit"
                                    class="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                >
                                    Stock In
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Stock In Modal -->
    <Modal :show="stockOutModalOpen" @close="closeStockOutModal">
        <div class="p-6 rounded-lg w-full mx-auto">
            <h2 class="text-lg font-bold mb-4 text-gray-800">{{ menu }}</h2>
            <p class="mb-2">
                Current stock: <strong>{{ currentData.stock }}</strong>
            </p>

            <div v-if="menu == 'Stock In'">
                <label class="block mb-2 text-sm font-medium text-gray-700"
                    >Quantity to stock in</label
                >
                <input
                    type="number"
                    v-model="stockOutQuantity"
                    min="1"
                    :max="currentData.stock"
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div v-if="menu == 'Checkout'">
                <label for="payment">Pilih Metode Pembayaran:</label>
                <select
                    v-model="selectedPayment"
                    id="payment"
                    class="ms-5 rounded"
                >
                    <option disabled value="">-- Pilih --</option>
                    <option value="cash">Cash</option>
                    <option value="qr">Trasfer</option>
                </select>
            </div>

            <div class="flex justify-end gap-2 mt-6">
                <button
                    @click="closeStockOutModal"
                    class="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-sm"
                >
                    Cancel
                </button>
                <button
                    @click="submit(menu)"
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                >
                    Confirm
                </button>
            </div>
        </div>
    </Modal>
</template>
