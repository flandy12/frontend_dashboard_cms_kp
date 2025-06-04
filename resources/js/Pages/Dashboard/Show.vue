<script setup>
import MasterLayout from "../MasterLayout.vue";
import { ref, onMounted } from "vue";
import { Clock, CalendarDays, AlertCircle, Zap } from "lucide-vue-next";
import { computed } from "vue";
import apiRequest from "../API/main";
import { getCookie } from "@/Pages/API/main.js";

const props = defineProps({
    url: String,
});

const products = ref([]);

// Hitung persentase dan warna bar
const stockBars = computed(() =>
    products.value
        .filter((product) => product.stock >= 1 && product.stock <= 10)
        .map((product) => {
            const percentage = (product.stock / 10) * 100;
            let color = "bg-green-500";
            if (product.stock >= 0 && product.stock <= 4) {
                color = "bg-red-500";
            } else if (product.stock >= 5 && product.stock <= 8) {
                color = "bg-yellow-400";
            }

            return {
                ...product,
                percentage,
                color,
            };
        })
);
const permission = ref({});
const totalProduct = ref(0);
const totalStockIn = ref(0);
const totalStockOut = ref(0);
const transactions = ref([]);

const tasks = computed(() => [
    {
        title: "Products",
        count: `${totalProduct.value} / 10 Product`,
        icon: Zap,
        iconBg: "bg-green-600",
        bgColor: "bg-green-50",
    },
    {
        title: "StockIn Update",
        count: `${totalStockIn.value} / 10 Stock In`,
        icon: CalendarDays,
        iconBg: "bg-gray-400",
        bgColor: "bg-blue-50",
    },
    {
        title: "StockOut Update",
        count: `${totalStockOut.value} / 10 Stock Out`,
        icon: AlertCircle,
        iconBg: "bg-indigo-600",
        bgColor: "bg-indigo-50",
    },
    // {
    //     title: "Pending Task",
    //     count: "2/34 Task",
    //     icon: Clock,
    //     iconBg: "bg-red-500",
    //     bgColor: "bg-orange-50",
    // },
]);

const summary = ref([
    { label: "Overview", count: 1552, color: "bg-blue-100 text-blue-700" },
    { label: "Campaigns", count: 2847, color: "bg-pink-100 text-pink-700" },
    { label: "Ad Group", count: 1806, color: "bg-purple-100 text-purple-700" },
    { label: "Keywords", count: 3095, color: "bg-yellow-100 text-yellow-700" },
]);

const getProducts = async () => {
    try {
        const response = await apiRequest({
            url: "products",
            method: "get",
        });
        if (response.status === 200) {
            products.value = response.data.data.map((item) => ({
                name: item.name ?? "",
                stock: item.stock ?? "",
            }));

            totalProduct.value = response.data.data.length;
        }
    } catch (err) {
        console.log("Gagal mengambil products", err);
    }
};

const getStockIn = async () => {
    try {
        const response = await apiRequest({
            url: "stockmovements/stockin",
            method: "get",
        });
        if (response.status === 200) {
            totalStockIn.value = response.data.data.length;
        }
    } catch (err) {
        console.log("Gagal mengambil Stock In", err);
    }
};

const getStockOut = async () => {
    try {
        const response = await apiRequest({
            url: "stockmovements/stockout",
            method: "get",
        });
        if (response.status === 200) {
            totalStockOut.value = response.data.data.length;
        }
    } catch (err) {
        console.log("Gagal mengambil Stock Out", err);
    }
};

const getCheckout = async () => {
    try {
        const response = await apiRequest({
            url: "checkout",
            method: "get",
        });
        if (response.status === 200) {
            const sorted = [...response.data].sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at)
            );

            transactions.value = sorted.slice(0, 4);
            console.log(response.data);
        }
    } catch (err) {
        console.log("Gagal mengambil Stock Out", err);
    }
};

const isAllowedRole = computed(() =>
    ["Super Admin", "Owner", "Store Manager"].includes(permission.value.role)
);
onMounted(() => {
    // Fetch data here
    // Example:
    // highestACoS.value = [
    //     { campaign: "B08NYN3MT", spend: 30.25, sales: 149.85, acos: 149.85 },
    //     { campaign: "Campaign - 3", spend: 40.0, sales: 134.0, acos: 134.5 },
    //     { campaign: "Research - Ac", spend: 43.55, sales: 129.75, acos: 125.0 },
    //     { campaign: "B087C75GQJ", spend: 45.85, sales: 113.0, acos: 119.45 },
    //     { campaign: "House Number", spend: 54.0, sales: 99.55, acos: 85.0 },
    // ];

    const userData = getCookie("user_data");
    try {
        permission.value = JSON.parse(userData || "{}");
    } catch {
        permission.value = {};
    }
    getProducts();
    getStockIn();
    getStockOut();
    getCheckout();
});
</script>

<template>
    <MasterLayout :url="props.url">
        <div class="container mx-auto">
            <!-- Add your main content here -->

            <div class="pb-4 flex justify-between items-center">
                <div class="flex justify-between mb-5 items-center">
                    <h1 class="text-2xl font-bold">Dashboard</h1>
                </div>
            </div>
            <div v-if="isAllowedRole" class="space-y-4">
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div
                        v-for="(task, index) in tasks"
                        :key="index"
                        :class="[
                            'p-4 rounded-xl shadow-sm w-full',
                            task.bgColor,
                        ]"
                    >
                        <div class="flex items-center space-x-3">
                            <div
                                :class="[
                                    'rounded-full w-8 h-8 flex items-center justify-center text-white',
                                    task.iconBg,
                                ]"
                            >
                                <component :is="task.icon" class="w-4 h-4" />
                            </div>
                            <div class="text-sm text-gray-600">
                                {{ task.title }}
                            </div>
                        </div>
                        <div class="mt-2 text-xl font-bold text-black">
                            {{ task.count }}
                        </div>
                    </div>
                </div>

                <div
                    class="grid grid-cols-1 sm:grid-cols-2 auto-rows-max gap-6 p-4 rounded-xl"
                >
                    <!-- Summary Card -->
                    <div class="bg-white rounded-xl shadow p-5">
                        <h2 class="text-lg font-bold mb-4">Best Seller</h2>
                        <ul>
                            <li
                                v-for="item in summary"
                                :key="item.label"
                                class="flex justify-between items-center mb-2 p-2 rounded-lg"
                                :class="item.color"
                            >
                                <span>{{ item.label }}</span>
                                <span class="font-semibold">{{
                                    item.count.toLocaleString()
                                }}</span>
                            </li>
                        </ul>
                    </div>
                    <div class="bg-white rounded-xl p-4 shadow-sm row-span-2">
                        <h3 class="text-md font-semibold mb-4">
                            Stock Urgenty
                        </h3>
                        <div class="space-y-3">
                            <div v-for="(item, idx) in stockBars" :key="idx">
                                <div class="text-sm mb-1 text-gray-700">
                                    {{ item.name }}
                                </div>
                                <div
                                    class="w-full bg-gray-200 rounded-full h-3"
                                >
                                    <div
                                        class="h-3 rounded-full transition-all duration-300"
                                        :class="item.color"
                                        :style="{
                                            width: item.percentage + '%',
                                        }"
                                    ></div>
                                </div>
                            </div>
                        </div>
                        <div
                            class="flex justify-between text-xs text-gray-400 mt-3"
                        >
                            <span>0%</span>
                            <span>50%</span>
                            <span>100%</span>
                        </div>
                    </div>

                    <!-- Table: Highest ACoS Campaigns -->
                    <div class="bg-white rounded-xl shadow p-5 overflow-auto">
                        <h2 class="text-lg font-bold mb-4">Transactions</h2>
                        <table class="min-w-full text-sm">
                            <thead class="text-left text-gray-500 border-b">
                                <tr>
                                    <th class="py-2 pr-4">Product Name</th>
                                    <th class="py-2 pr-4">Total Price</th>
                                    <th class="py-2">Payment Method</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="item in transactions"
                                    :key="item.id"
                                    class="border-t hover:bg-gray-50"
                                >
                                    <!-- <td class="py-2 pr-4">
                                        {{ item.id }}
                                    </td> -->
                                    <td class="py-2 pr-4">
                                        <ul>
                                            <li
                                                v-for="(
                                                    productItem, idx
                                                ) in item.items"
                                                :key="idx"
                                            >
                                                {{ productItem.product.name }}
                                            </li>
                                        </ul>
                                    </td>
                                    <td class="py-2 pr-4">
                                        Rp{{
                                            Number(
                                                item.total_price
                                            ).toLocaleString("id-ID")
                                        }}
                                    </td>
                                    <td class="py-2 pr-4">
                                        {{ item.payment_method }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Bar Chart Placeholder -->
                </div>
            </div>
            <div v-if="!isAllowedRole">Welcome homie!</div>
        </div>
    </MasterLayout>
</template>

<style scoped>
/* .grid {
    background: #e0f2fe;
    border-radius: 16px;
} */
</style>
