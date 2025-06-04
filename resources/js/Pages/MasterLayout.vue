<script setup>
import { onMounted, ref, watch, computed } from "vue";
import SidebarItem from "@/Components/SitebarItem.vue";
import { hasPermission, getCookie } from "@/Pages/API/main.js";

const props = defineProps({
    url: String,
});

const isCollapsed = ref(false);
const currentUrl = ref(props.url);
const user = ref({});

// Logout function
const actionLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
        "user_data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/login";
};

// Route handler
const getRoute = () => {
    const path = window.location.pathname;
    const segments = path.split("/").filter(Boolean);
    currentUrl.value = segments[segments.length - 1] || "/";
};

onMounted(() => {
    const userData = getCookie("user_data");
    try {
        user.value = JSON.parse(userData || "{}");
    } catch {
        user.value = {};
    }

    getRoute();

    // DataTable init
    const el = document.getElementById("pagination-table");
    if (el && typeof DataTable !== "undefined") {
        new DataTable(el, {
            paging: true,
            perPage: 5,
            perPageSelect: [5, 10, 15, 20, 25],
            sortable: false,
        });
    }
});

watch(
    () => props.url,
    (newVal) => {
        currentUrl.value = newVal;
    }
);
</script>
<template>
    <div class="flex w-full">
        <aside
            :class="`
            ${isCollapsed ? 'w-24' : 'w-64'}
            'min-h-screen bg-white border-r border-gray-200 flex flex-col justify-between transition-all duration-300 ease-in-out'`"
        >
            <div class="relative">
                <!-- Hamburger Button -->
                <button
                    @click="isCollapsed = !isCollapsed"
                    class="max-h-max absolute -right-5 top-16 z-10 bg-white border-4 border-gray-100 rounded-full px-4 py-2"
                >
                    <span v-if="isCollapsed">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-5 h-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M13 5l7 7-7 7M6 5l7 7-7 7"
                            />
                        </svg>
                    </span>
                    <span v-else>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-5 h-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M11 19l-7-7 7-7M18 19l-7-7 7-7"
                            />
                        </svg>
                    </span>
                </button>
                <!-- Profile -->
                <div class="p-4 font-bold text-lg border-b border-gray-200">
                    <div class="p-2 w-full">
                        <a href="/dashboard/user-profile">
                            <div
                                class="relative flex items-center justify-center h-16 w-full"
                            >
                                <img
                                    :src="user.profile_url"
                                    :class="[
                                        isCollapsed && 'absolute w-12 h-12',
                                        'object-cover  transition-all duration-300 ease-in-out',
                                    ]"
                                    alt="User Image"
                                />
                                <span v-if="!isCollapsed" class="ml-2 uppercase"
                                    >Inventory App</span
                                >
                            </div>
                            <p
                                v-if="!isCollapsed"
                                class="text-sm mt-5 text-gray-500"
                            >
                                {{ user.name }} • {{ user.role }}
                            </p>
                        </a>
                    </div>
                </div>

                <!-- Sidebar Menu -->
                <nav class="mt-6 space-y-1">
                    <div
                        :class="[
                            isCollapsed ? 'w-24' : 'w-64',
                            ' transition-all duration-300 ease-in-out',
                        ]"
                    >
                        <a
                            v-if="hasPermission(user, 'dashboard')"
                            href="/dashboard"
                        >
                            <SidebarItem
                                icon="📊"
                                title="Dashboard"
                                to="/dashboard"
                                :active="props.url === 'dashboard'"
                                :isCollapsed="isCollapsed"
                            />
                        </a>

                        <a
                            v-if="hasPermission(user, 'user view')"
                            href="/dashboard/user"
                        >
                            <SidebarItem
                                icon="👤"
                                title="User"
                                to="/dashboard/user"
                                :active="props.url === 'user'"
                                :isCollapsed="isCollapsed"
                            />
                        </a>

                        <a
                            v-if="hasPermission(user, 'product view')"
                            href="/dashboard/product"
                        >
                            <SidebarItem
                                icon="📦"
                                title="Product"
                                to="/dashboard/product"
                                :active="props.url === 'product'"
                                :isCollapsed="isCollapsed"
                            />
                        </a>

                        <a
                            v-if="hasPermission(user, 'category view')"
                            href="/dashboard/category"
                        >
                            <SidebarItem
                                icon="📁"
                                title="Category"
                                to="/dashboard/category"
                                :active="props.url === 'category'"
                                :isCollapsed="isCollapsed"
                            />
                        </a>

                        <a
                            v-if="hasPermission(user, 'assign_role view')"
                            href="/dashboard/role-permission"
                        >
                            <SidebarItem
                                icon="⚙️"
                                title="Assign Role & Permission"
                                to="/dashboard/role-permission"
                                :active="props.url === 'role-permission'"
                                :isCollapsed="isCollapsed"
                            />
                        </a>

                        <a
                            v-if="hasPermission(user, 'role view')"
                            href="/dashboard/role"
                        >
                            <SidebarItem
                                icon="🛡️"
                                title="Role"
                                :active="props.url === 'role'"
                                :isCollapsed="isCollapsed"
                            />
                        </a>

                        <a
                            v-if="hasPermission(user, 'permission view')"
                            href="/dashboard/permission"
                        >
                            <SidebarItem
                                icon="🔐"
                                title="Permission"
                                to="/dashboard/permission"
                                :active="props.url === 'permission'"
                                :isCollapsed="isCollapsed"
                            />
                        </a>

                        <a
                            v-if="hasPermission(user, 'report view')"
                            href="/dashboard/report"
                        >
                            <SidebarItem
                                icon="📈"
                                title="Report"
                                to="/dashboard/report"
                                :active="props.url === 'report'"
                                :isCollapsed="isCollapsed"
                            />
                        </a>

                        <a
                            v-if="hasPermission(user, 'stock_in view')"
                            href="/dashboard/stock-in"
                        >
                            <SidebarItem
                                icon="📥"
                                title="Stock In"
                                to="/dashboard/stock-in"
                                :active="props.url === 'stock-in'"
                                :isCollapsed="isCollapsed"
                            />
                        </a>

                        <a
                            v-if="hasPermission(user, 'stock_out view')"
                            href="/dashboard/stock-out"
                        >
                            <SidebarItem
                                icon="📤"
                                title="Stock Out"
                                to="/dashboard/stock-out"
                                :active="props.url === 'stock-out'"
                                :isCollapsed="isCollapsed"
                            />
                        </a>

                        <a
                            v-if="hasPermission(user, 'transaction view')"
                            href="/dashboard/transaction"
                        >
                            <SidebarItem
                                icon="💳"
                                title="Transaction"
                                to="/dashboard/transaction"
                                :active="props.url === 'transaction'"
                                :isCollapsed="isCollapsed"
                            />
                        </a>

                        <a
                            @click="actionLogout"
                            class="bg-red-300 cursor-pointer block"
                        >
                            <SidebarItem
                                icon="🚪"
                                title="Logout"
                                :isCollapsed="isCollapsed"
                            />
                        </a>
                    </div>
                </nav>
            </div>
        </aside>

        <main class="flex-1 p-6 bg-zinc-100 overflow-hidden">
            <slot />
        </main>
    </div>
</template>
