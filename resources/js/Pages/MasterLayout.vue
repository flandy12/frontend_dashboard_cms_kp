<script setup>
  import { onMounted, ref, watch, computed } from 'vue';
  import SidebarItem from '@/Components/SitebarItem.vue';

const props = defineProps({
  url: String,
});



  const isSidebarOpen = ref(false);
  const currentUrl = ref(props.url);

  // Fungsi logout
  const actionLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = '/login';
  }

  const normalizedUrl = computed(() => {
     if (!currentUrl.value) return '';
      const parts = currentUrl.value.split('/').filter(Boolean); // filter untuk buang string kosong
      return parts.length ? parts[parts.length - 1] : '';
  });

  // Watch untuk memantau perubahan props.url
  watch(() => props.url, (newVal) => {
    console.log('URL prop changed:', newVal);
    currentUrl.value = newVal;
  });


  // On mounted (contoh inisialisasi)
  onMounted(() => {
    // Inisialisasi currentUrl
    currentUrl.value = props.url;

    // Inisialisasi DataTable (jika ada)
    const el = document.getElementById('pagination-table');
    if (el && typeof DataTable !== 'undefined') {
      new DataTable(el, {
        paging: true,
        perPage: 5,
        perPageSelect: [5, 10, 15, 20, 25],
        sortable: false,
      });
    }
  });
</script>

<template>
  <div class="flex w-full">
  <!-- Sidebar -->
    <aside
      :class="[
        'fixed z-40 top-0 left-0 w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col justify-between transition-transform duration-300',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'md:translate-x-0'
      ]"
    >
      <!-- Top (Brand & Menu) -->
      <div>
        <!-- Brand -->
        <div class="p-4 font-bold text-lg border-b border-gray-200">
          <div class="flex justify-between">
         
            <div class="block">
                <p>Body Shop</p>
                <p class="text-sm text-gray-500">Nicole (Admin)</p>   
            </div>

            
              <div>
                <button
                      class="text-2xl md:hidden mr-4"
                      @click="isSidebarOpen = !isSidebarOpen"
                    >
                      ☰
                </button> 
              </div>

            </div>

            </div>

        <!-- Menu -->
      <nav class="mt-6 space-y-1 px-2">
        <a href="/dashboard">
          <SidebarItem
            icon="📊"
            title="Dashboard"
            to="/dashboard"
            :active="normalizedUrl === 'dashboard'"
          />
        </a>
        <a href="/dashboard/user">
          <SidebarItem
            icon="📊"
            title="User"
            to="/dashboard/user"
            :active="normalizedUrl === 'user'"
          />
        </a>
        <a href="/dashboard/product">
          <SidebarItem
            icon="📦"
            title="Products"
            to="/dashboard/product"
            :active="normalizedUrl === 'product'"
          />
        </a>
        <a href="/dashboard/category">
          <SidebarItem
            icon="📁"
            title="Category"
            to="/dashboard/category"
            :active="normalizedUrl === 'category'"
          />
        </a>
        <a href="/dashboard/role-permission">
          <SidebarItem
            icon="💳"
            title="Assign Role & Permission"
            to="/dashboard/role-permission"
            :active="normalizedUrl === 'role-permission'"
          />
        </a>
        <a href="/dashboard/role">
          <SidebarItem
            icon="👤"
            title="Roles"
            to="/dashboard/role"
            :active="normalizedUrl === 'role'"
          />
        </a>
        <a href="/dashboard/permission">
          <SidebarItem
            icon="🔐"
            title="Permissions"
            to="/dashboard/permission"
            :active="normalizedUrl === 'permission'"
          />
        </a>
        <a href="/dashboard/report">
          <SidebarItem
            icon="📈"
            title="Reports"
            to="/dashboard/report"
            :active="normalizedUrl === 'report'"
          />
        </a>
        <a href="/dashboard/stock-in">
          <SidebarItem
            icon="📥"
            title="Stock In"
            to="/dashboard/stock-in"
            :active="normalizedUrl === 'stock-in'"
          />
        </a>
        <a href="/dashboard/stock-out">
          <SidebarItem
            icon="📤"
            title="Stock Out"
            to="/dashboard/stock-out"
            :active="normalizedUrl === 'stock-out'"
          />
        </a>
        <a href="/dashboard/transaction">
          <SidebarItem
            icon="💳"
            title="Transactions"
            to="/dashboard/transaction"
            :active="normalizedUrl === 'transaction'"
          />
        </a>
        <button class="w-full text-left bg-red-300" @click="actionLogout">
          <SidebarItem icon="" title="Logout" />
        </button>
      </nav>
      </div>
    </aside>

    <!-- <main class="flex-1 p-6 bg-zinc-100  overflow-hidden">
      <slot />
    </main> -->
    <!-- Main content -->
    <div class="flex-1 md:ml-64 ">
      <!-- Topbar -->
      <header class="bg-gray-100 p-4 flex items-center">
        <!-- Hamburger button -->
        <button
          class="text-2xl md:hidden mr-4"
          @click="isSidebarOpen = !isSidebarOpen"
        >
          ☰
        </button>
        <h1 class="text-xl font-semibold">Dashboard</h1>
      </header>

      <!-- Page content -->
      <main class="p-4">
        <slot />
      </main>

    </div>
  </div>
</template>
