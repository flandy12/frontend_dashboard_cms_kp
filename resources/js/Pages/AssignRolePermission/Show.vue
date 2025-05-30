<script setup>
  import { ref, computed, onMounted, reactive } from 'vue';
  import MasterLayout from '../MasterLayout.vue';
  import Modal from '@/Components/Modal.vue';
  import apiRequest from '../API/main.js'
  const props = defineProps({ 
  url: String,
  });


    const searchQuery = ref('');
    const isModalOpen = ref(false);
    const isModalOpenGiveRole = ref(false);

    let dataPermission = ref([]);
    let dataRole = ref([]);
    const selectedRole = ref('');
    const selectedPermissions = ref([]);
    const currentData = reactive({ id: null, name: "", email:"", role:"" });
    const data = ref([]);

    const filteredUsers = computed(() => {
      if (!searchQuery.value) return data.value;
      return data.value.filter(item =>
        item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.value.toLowerCase()) 
      );
    });

    function openNewProductModal() {
      isModalOpen.value = true;
    }

    function openNewProductModalGiveRole() {
      isModalOpenGiveRole.value = true;
    }

    function closeModal() {
      isModalOpen.value = false;
    }

    function applyFilters() {
      // Add your filter logic here
      console.log('Filter button clicked');
    }

    const getData = async() => {
      try {
            const response = await apiRequest({
                url: "users/roles-permissions",
                method: "get"
            });

            console.log(response);
            if (response.status == 200) {
                data.value = response.data;
                console.log(response);
            } 
      } catch (err) {
        console.log("Gagal mengambil role", err);
      }
    }

    const actionClickEdit = async (id) => {
      openNewProductModalGiveRole();

      try {
        if (id) {

          const response = await apiRequest({
            url: `users/${id}/roles-permissions`, // Panggil user spesifik
            method: "get",
          });

          if (response.status === 200) {
            const userData = response.data;

            currentData.id = userData.id;
            currentData.name = userData.name;
            currentData.email = userData.email;
            currentData.roles = userData.roles;
            selectedRole.value = userData.roles;

          }
        } else {
          currentData.id = null;
          currentData.name = "";
          currentData.email = "";
          currentData.roles = [];

          console.log(id);
        }
      } catch (err) {
        console.error("Gagal mengambil role", err);
      }
    };

  const submitFormGiveRole = async () => {
   if (!selectedRole.value) return;
    const isRoleExist = !!currentData.roles; // Misalnya currentData berisi informasi role sebelumnya

    const url = isRoleExist
        ? `users/${currentData.id}/update-role`
        : `users/${currentData.id}/assign-role`;

    const method = isRoleExist ? "put" : "post"; // sesuai RESTful

    try {
        await apiRequest({
            url,
            method,
            data: {
                role: selectedRole.value, // 'admin', 'editor', dll
            },
        });

        location.reload();
    } catch (err) {
        console.error("Failed to update/assign role", err);
        // Tambahkan error handling sesuai kebutuhan
    }
};



   onMounted(async () => {
        await getData();

        try {
          const permission = await apiRequest({
            url: "permissions",
            method: "get",
          });

          if (permission.status === 200) {
            dataPermission.value = permission.data;
            console.log("Permissions:", permission.data);
          }

          const role = await apiRequest({
            url: "roles",
            method: "get",
          });

          if (role.status === 200) {
            dataRole.value = role.data;
            console.log("Roles:", role.data);
          }
        } catch (err) {
          console.error("Gagal mengambil permissions/roles:", err);
        }
      });


</script>

<template>
  <MasterLayout :url="props.url">
    <div class="container mx-auto">
      <div class="flex justify-between mb-5 items-center">
        <h1 class="text-2xl font-bold">User Role And Permission</h1>
      </div>

      <div class="pb-4">
          <div class="flex justify-end mb-5 items-center">
            
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
                    placeholder="Search for users"
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
              <th class="px-6 py-3">Name</th>
              <th class="px-6 py-3">Email</th>
              <th class="px-6 py-3">Role</th>
              <th class="px-6 py-3">Permission</th>
              <th class="px-6 py-3">Action</th>

            </tr>
          </thead>
          <tbody class="text-gray-600  h-[400px]">
            <tr
              v-for="(user,key) in filteredUsers"
              :key="key"
              class="bg-white border-b  border-gray-200 hover:bg-gray-50"
            >
              <td class="w-4 p-4">
                {{ key + 1 }}
              </td>
              <td class="px-6 py-4 capitalize">{{ user.name }}</td>
              <td class="px-6 py-4">{{ user.email }}</td>
             <td class="px-6 py-4">
              <span v-if="user.roles && user.roles.length > 0">{{ user.roles.join(', ') }}</span>
              <span v-else>-</span>
            </td>

             <td class="px-6 py-4">
                <span v-if="user.permissions && user.permissions.length > 0">{{ user.permissions.join(', ') }}</span>
                <span v-else>-</span>
              </td>

              <td class="px-6 py-4">
               <button @click=actionClickEdit(user.id) class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
               </td>
              
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
                                <input v-model="currentData.email" type="email" id="base-input" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                            </div>

                            <div class="mb-5">
                              <label for="roles" class="block mb-2 text-sm font-medium text-gray-900">Select A Role</label>
                              <select
                                id="roles"
                                v-model="selectedRole"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                              >
                                <option disabled value="">Choose</option>
                                <option v-for="item in dataRole" :key="item.id" :value="item.name">{{ item.name }}</option>
                              </select>
                            </div>
                              <button data-modal-hide="default-modal" type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">Submit</button>
                        </form>
                        </div>
                    </div>
                </div>
            </div>
      </Modal>

      <Modal :show="isModalOpenGiveRole" @close="isModalOpenGiveRole = false">
            <!-- Main modal -->
            <div id="">
                <div class="relative p-4 w-full max-w-2xl max-h-full">
                    <!-- Modal content -->
                    <div class="relative rounded-lg shadow-sm ">
                        <!-- Modal header -->
                        <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t  border-gray-200">
                            <h3 class="text-xl font-semibold text-gray-900 ">
                                Give Role
                            </h3>
                            <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center " data-modal-hide="default-modal" @click="isModalOpenGiveRole = false">
                                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                </svg>
                                <span class="sr-only">Close modal</span>
                            </button>
                        </div>
                        <!-- Modal body -->
                        <div class="p-4 md:p-5 space-y-4">
                        <form class="" @submit.prevent="submitFormGiveRole">
                            <div class="mb-5">
                                <label for="base-input" class="block mb-2 text-sm font-medium text-gray-900 ">Email</label>
                                <input v-model="currentData.email" type="email" id="base-input" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                            </div>

                            <div class="mb-5">
                              <label for="roles" class="block mb-2 text-sm font-medium text-gray-900">Select A Role</label>
                              <select
                                id="roles"
                                v-model="selectedRole"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                              >
                                <option disabled value="">Choose</option>
                                <option v-for="item in dataRole" :key="item.id" :value="item.name">{{ item.name }}</option>
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
