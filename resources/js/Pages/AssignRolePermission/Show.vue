<script setup>
import { ref, computed } from 'vue';
import MasterLayout from '../MasterLayout.vue';
import Modal from '@/Components/Modal.vue';
  
  const props = defineProps({ 
  url: String,
  });


const user = ref([
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    permissions: ['create', 'edit', 'delete'],
    status: 'Active',
    date: '2023-10-01'
  },
  {
    id: 2,
    name: 'Masa',
    email: 'masa@example.com',
    role: 'Admin',
    permissions: ['create', 'edit', 'delete'],
    status: 'Active',
    date: '2023-10-01'
  },
  {
    id: 3,
    name: 'Lia Kartika',
    email: 'lia@example.com',
    role: 'Editor',
    permissions: ['edit'],
    status: 'Inactive',
    date: '2023-11-10'
  },
  {
    id: 4,
    name: 'Rangga Putra',
    email: 'rangga@example.com',
    role: 'Viewer',
    permissions: [],
    status: 'Active',
    date: '2024-01-15'
  },
  {
    id: 5,
    name: 'Citra Ayu',
    email: 'citra@example.com',
    role: 'Moderator',
    permissions: ['edit', 'delete'],
    status: 'Pending',
    date: '2024-03-22'
  },
  {
    id: 6,
    name: 'Dika Yudha',
    email: 'dika@example.com',
    role: 'Admin',
    permissions: ['create', 'edit', 'delete', 'publish'],
    status: 'Active',
    date: '2024-04-12'
  },
  {
    id: 7,
    name: 'Sinta Dewi',
    email: 'sinta@example.com',
    role: 'Editor',
    permissions: ['edit'],
    status: 'Inactive',
    date: '2024-05-01'
  },
  {
    id: 8,
    name: 'Bima Pratama',
    email: 'bima@example.com',
    role: 'Viewer',
    permissions: [],
    status: 'Active',
    date: '2024-06-18'
  },
  {
    id: 9,
    name: 'Nina Aulia',
    email: 'nina@example.com',
    role: 'Admin',
    permissions: ['create', 'edit'],
    status: 'Suspended',
    date: '2024-07-30'
  },
  {
    id: 10,
    name: 'Yoga Permana',
    email: 'yoga@example.com',
    role: 'Moderator',
    permissions: ['delete'],
    status: 'Active',
    date: '2024-08-10'
  }
]);



const searchQuery = ref('');
const isModalOpen = ref(false);

const filteredProducts = computed(() => {
  if (!searchQuery.value) return user.value;
  return user.value.filter(product =>
    product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    product.emai.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    product.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

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
</script>

<template>
  <MasterLayout :url="props.url">
    <div class="container mx-auto">
      <div class="flex justify-between mb-5 items-center">
        <h1 class="text-2xl font-bold">User Role And Permission</h1>
      </div>

      <div class="pb-4">
          <div class="flex justify-between mb-5 items-center">
                <button
                        @click="openNewProductModal"
                        class="bg-gray-600 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded"
                    >
                        Add Role &amp; Permission
                </button>

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
              class="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-52 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search for items"
            />
          </div>
        </div>
            </div>
      </div>

      <div class="w-full h-[400px] overflow-auto relative overflow-x-auto shadow-md sm:rounded-lg mb-10">
        <table
          class="w-full h-[400px] overflow-hidden text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
        >
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 border">
            <tr>
              <th class="px-6 py-3">No</th>
  
              <th class="px-6 py-3">Email</th>
              <th class="px-6 py-3">Role</th>
              <th class="px-6 py-3">Permission</th>
              <th class="px-6 py-3">Status</th>
              <th class="px-6 py-3">Action</th>

            </tr>
          </thead>
          <tbody class="text-gray-600  h-[400px]">
            <tr
              v-for="user in filteredProducts"
              :key="user.id"
              class="bg-white border-b  border-gray-200 hover:bg-gray-50"
            >
              <td class="w-4 p-4">
                {{ user.id }}
              </td>
             
              <td class="px-6 py-4">{{ user.email }}</td>
              <td class="px-6 py-4">{{ user.role }}</td>
             <td class="px-6 py-4">
              <p v-for="(permission, index) in user.permissions" :key="index">
                - {{ permission }}<span v-if="index < user.permissions.length - 1">, </span>
              </p>
            </td>


              <td class="px-6 py-4"><span class="bg-green-300 px-3 py-1 rounded-full">{{ user.status }}</span></td>
              <td class="px-6 py-4">
               <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                                    <a href="#" class="font-medium text-red-600 dark:text-red-500 hover:underline ms-3">Remove</a></td>
              
            </tr>
          </tbody>
        </table>
      </div>


      <div class="flex flex-col items-center mt-5">
            <!-- Help text -->
            <span class="text-sm text-gray-700">
                Showing <span class="font-semibold text-gray-900">1</span> to <span class="font-semibold text-gray-900">10</span> of <span class="font-semibold text-gray-900">100</span> Entries
            </span>
            <!-- Buttons -->
            <div class="inline-flex mt-2 xs:mt-0">
            <button class="flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-gray-600 rounded-s hover:bg-gray-900">
                Prev
            </button>
            <button class="flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-gray-600 border-0 border-s border-gray-700 rounded-e hover:bg-gray-900 ">
                Next
            </button>
            </div>
        </div>

       <Modal :show="isModalOpen" @close="isModalOpen = false">
            <!-- Main modal -->
            <div id="">
                <div class="relative p-4 w-full max-w-2xl max-h-full">
                    <!-- Modal content -->
                    <div class="relative rounded-lg shadow-sm ">
                        <!-- Modal header -->
                        <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t  border-gray-200">
                            <h3 class="text-xl font-semibold text-gray-900 ">
                                Add Role &amp; Permission
                            </h3>
                            <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center " data-modal-hide="default-modal" @click="isModalOpen = false">
                                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                </svg>
                                <span class="sr-only">Close modal</span>
                            </button>
                        </div>
                        <!-- Modal body -->
                        <div class="p-4 md:p-5 space-y-4">
                        <form class="">
                            <div class="mb-5">
                                <label for="base-input" class="block mb-2 text-sm font-medium text-gray-900 ">Email</label>
                                <input type="email" id="base-input" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                            </div>

                           <div class="mb-5">
                            <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 ">Select An Role</label>
                            <select id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                              <option selected>Choose</option>
                              <option value="US">United States</option>
                              <option value="CA">Canada</option>
                              <option value="FR">France</option>
                              <option value="DE">Germany</option>
                            </select>
                            </div>

                            <div class="mb-5">
                              <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 ">Select An Permission</label>
                              <select id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ">
                                <option selected>Choose</option>
                                <option value="US">United States</option>
                                <option value="CA">Canada</option>
                                <option value="FR">France</option>
                                <option value="DE">Germany</option>
                              </select>
                            </div>

                              <button data-modal-hide="default-modal" type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">Submit</button>
                        </form>
                        </div>
                    </div>
                </div>
            </div>
      </Modal>
    </div>
  </MasterLayout>
</template>
