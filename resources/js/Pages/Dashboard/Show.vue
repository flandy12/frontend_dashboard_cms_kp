<script setup>
import MasterLayout from "../MasterLayout.vue";
import { ref, onMounted } from "vue";
import { Clock, CalendarDays, AlertCircle, Zap } from "lucide-vue-next";
import { computed } from "vue";

const products = [
    { name: "Project 1", stock: 10 },
    { name: "Project 2", stock: 8 },
    { name: "Project 3", stock: 5 },
    { name: "Project 4", stock: 2 },
    { name: "Project 4", stock: 2 },

    { name: "Project 4", stock: 2 },

    { name: "Project 4", stock: 2 },

    { name: "Project 4", stock: 2 },

    { name: "Project 4", stock: 2 },
];

// Hitung persentase dan warna bar
const stockBars = computed(() =>
    products.map((p) => {
        const percentage = Math.min((p.stock / 10) * 100, 100);
        let color = "bg-green-500";
        if (p.stock <= 5) {
            color = "bg-red-500";
        } else if (p.stock < 10) {
            color = "bg-yellow-400";
        }
        return {
            ...p,
            percentage,
            color,
        };
    })
);

const tasks = [
    {
        title: "Priority Task",
        count: "23/34 Task",
        icon: Zap,
        iconBg: "bg-green-600",
        bgColor: "bg-green-50",
    },
    {
        title: "Upcoming Task",
        count: "3/34 Task",
        icon: CalendarDays,
        iconBg: "bg-gray-400",
        bgColor: "bg-blue-50",
    },
    {
        title: "Overdue Task",
        count: "10/34 Task",
        icon: AlertCircle,
        iconBg: "bg-indigo-600",
        bgColor: "bg-indigo-50",
    },
    {
        title: "Pending Task",
        count: "2/34 Task",
        icon: Clock,
        iconBg: "bg-red-500",
        bgColor: "bg-orange-50",
    },
];

const summary = ref([
    { label: "Overview", count: 1552, color: "bg-blue-100 text-blue-700" },
    { label: "Campaigns", count: 2847, color: "bg-pink-100 text-pink-700" },
    { label: "Ad Group", count: 1806, color: "bg-purple-100 text-purple-700" },
    { label: "Keywords", count: 3095, color: "bg-yellow-100 text-yellow-700" },
]);

const highestACoS = ref([]);

onMounted(async () => {
    // Fetch data here
    // Example:
    highestACoS.value = [
        { campaign: "B08NYN3MT", spend: 30.25, sales: 149.85, acos: 149.85 },
        { campaign: "Campaign - 3", spend: 40.0, sales: 134.0, acos: 134.5 },
        { campaign: "Research - Ac", spend: 43.55, sales: 129.75, acos: 125.0 },
        { campaign: "B087C75GQJ", spend: 45.85, sales: 113.0, acos: 119.45 },
        { campaign: "House Number", spend: 54.0, sales: 99.55, acos: 85.0 },
    ];
});
</script>

<template>
    <MasterLayout>
        <div class="container mx-auto">
            <!-- Add your main content here -->

            <div class="pb-4 flex justify-between items-center">
                <div class="flex justify-between mb-5 items-center">
                    <h1 class="text-2xl font-bold">Dashboard</h1>
                </div>
            </div>
            <div class="space-y-4">
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
                        <h2 class="text-lg font-bold mb-4">Summary</h2>
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
                            Urgently Task
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
                        <h2 class="text-lg font-bold mb-4">
                            Highest ACoS campaigns
                        </h2>
                        <table class="min-w-full text-sm">
                            <thead class="text-left text-gray-500 border-b">
                                <tr>
                                    <th class="py-2 pr-4">Campaign</th>
                                    <th class="py-2 pr-4">Spend</th>
                                    <th class="py-2 pr-4">Sales</th>
                                    <th class="py-2">ACoS</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="item in highestACoS"
                                    :key="item.campaign"
                                    class="border-t hover:bg-gray-50"
                                >
                                    <td class="py-2 pr-4">
                                        {{ item.campaign }}
                                    </td>
                                    <td class="py-2 pr-4">
                                        ${{ item.spend.toFixed(2) }}
                                    </td>
                                    <td class="py-2 pr-4">
                                        ${{ item.sales.toFixed(2) }}
                                    </td>
                                    <td
                                        class="py-2 font-semibold text-purple-600"
                                    >
                                        ${{ item.acos.toFixed(2) }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Bar Chart Placeholder -->
                </div>
            </div>
        </div>
    </MasterLayout>
</template>

<style scoped>
/* .grid {
    background: #e0f2fe;
    border-radius: 16px;
} */
</style>
