<script setup>
import { onMounted, ref } from 'vue';
import SidebarItem from '@Components/SitebarItem.vue';
import { useRoute } from 'vue-router';

const props = defineProps({
  url: String,
});

onMounted(() => {
  const el = document.getElementById('pagination-table')
  if (el && typeof DataTable !== 'undefined') {
    new DataTable(el, {
      paging: true,
      perPage: 5,
      perPageSelect: [5, 10, 15, 20, 25],
      sortable: false
    });
  }

  // Hanya path (tanpa domain)  
  getRoute();
  
});

const getRoute = () => {
  const path = window.location.pathname;
  const segments = path.split('/').filter(Boolean); // Menghapus elemen kosong
  const lastSegment = segments[segments.length - 1];
  route.value = lastSegment;
};

console.log(props.url);

</script>

<template>
  <div class="flex bg-zinc-100">
    <aside class="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col justify-between">
      <!-- Top (Brand & Menu) -->
      <div>
        <!-- Brand -->
        <div class="p-4 font-bold text-lg border-b border-gray-200">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-green-500 rounded-full"></div>
            <span>Body Shop</span>
          </div>
          <p class="text-sm text-gray-500">Nicole (Admin)</p>
        </div>

        <!-- Menu -->
        <nav class="mt-6 space-y-1">
          <div class="w-64 border-r bg-white min-h-screen">
             <a href="/dashboard">
    <SidebarItem
      icon="📊"
      title="Dashboard"
      to="/"
      :active="props.url === '/'"
    />
  </a>

  <a href="/dashboard/user">
    <SidebarItem
      icon="📊"
      title="Users"
      to="/dashboard/user"
      :active="props.url === 'user'"
    />
  </a>

  <a href="/dashboard/product">
    <SidebarItem
      icon="📦"
      title="Products"
      to="/dashboard/product"
      :active="props.url === 'product'"
    />
  </a>

  <a href="/dashboard/category">
    <SidebarItem
      icon="📁"
      title="Categories"
      to="/dashboard/category"
      :active="props.url === 'category'"
    />
  </a>

  <a href="/dashboard/role">
    <SidebarItem
      icon="👤"
      title="Roles"
      to="/dashboard/role"
      :active="props.url === 'role'"
    />
  </a>

  <a href="/dashboard/permission">
    <SidebarItem
      icon="🔐"
      title="Permissions"
      to="/dashboard/permission"
      :active="props.url === 'permission'"
    />
  </a>

  <a href="/dashboard/report">
    <SidebarItem
      icon="📈"
      title="Reports"
      to="/dashboard/report"
      :active="props.url === 'report'"
    />
  </a>

  <a href="/dashboard/stock-in">
    <SidebarItem
      icon="📥"
      title="Stock In"
      to="/dashboard/stock-in"
      :active="props.url === 'stock-in'"
    />
  </a>

  <a href="/dashboard/stock-out">
    <SidebarItem
      icon="📤"
      title="Stock Out"
      to="/dashboard/stock-out"
      :active="props.url === 'stock-out'"
    />
  </a>

  <a href="/dashboard/transaction">
    <SidebarItem
      icon="💳"
      title="Transactions"
      to="/dashboard/transaction"
      :active="props.url === 'transaction'"
    />
  </a>
          </div>
        </nav>
      </div>
    </aside>

    <main class="flex-1 p-6">
      <slot />
    </main>
  </div>
</template>
