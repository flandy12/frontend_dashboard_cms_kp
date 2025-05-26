<script setup>
import { ref, computed } from 'vue';
import MasterLayout from '../MasterLayout.vue';
import Modal from '@Components/Modal.vue';

const props = defineProps({
  url: String,
});
const products = ref([
  {
    id: 1,
    name: 'Apple MacBook Pro 17"',
    color: 'Silver',
    category: 'Laptop',
    accessories: 'Yes',
    available: 'Yes',
    price: '$2999',
    weight: '3.0 lb.'
  },
  {
    id: 2,
    name: 'Microsoft Surface Pro',
    color: 'White',
    category: 'Laptop PC',
    accessories: 'No',
    available: 'Yes',
    price: '$1999',
    weight: '1.0 lb.'
  },
  // ... tambahkan produk lainnya
]);

const searchQuery = ref('');
const isModalOpen = ref(false);

const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value;
  return products.value.filter(product =>
    product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    product.color.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

function exportCSV() {
  // contoh sederhana export CSV
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += 'Product Name,Color,Category,Accessories,Available,Price,Weight\n';
  products.value.forEach(p => {
    const row = [p.name, p.color, p.category, p.accessories, p.available, p.price, p.weight].join(",");
    csvContent += row + "\n";
  });
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "products.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

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
    <div class="container mx-auto w-full">
      <div class="flex justify-between mb-5 items-center">
        <h1 class="text-2xl font-bold">Product</h1>
        <button
          @click="openNewProductModal"
          class="bg-gray-600 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded"
        >
          New Product
        </button>
      </div>

      <div class="pb-4 flex justify-between">
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
              class="w-52 block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "
              placeholder="Search for product"
            />
          </div>
        </div>

        <div class="flex items-center justify-end gap-5">
          
          <button
            @click="applyFilters"
            class="bg-gray-600 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded"
          >
            Filters
          </button>
          
        </div>
      </div>

<div class="relative w-full">
  <p class="text-end mb-4 pr-4">Select All</p>

  <!-- Scrollable Table Wrapper -->
  <div class="w-full overflow-x-auto">
    <table class="min-w-max w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0 z-10 border-b">
        <tr>
          <th class="p-4">
            <div class="flex items-center">
              <input
                id="checkbox-all-search"
                type="checkbox"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm"
                @change="e => {
                  const checked = e.target.checked;
                  filteredProducts.value.forEach(p => p.checked = checked);
                }"
              />
              <label for="checkbox-all-search" class="sr-only">checkbox</label>
            </div>
          </th>
          <th class="px-6 py-3">Image</th>
          <th class="px-6 py-3">Category</th>
          <th class="px-6 py-3">Product Name</th>
          <th class="px-6 py-3">Color</th>
          <th class="px-6 py-3">Stock</th>
          <th class="px-6 py-3">Price</th>
          <th class="px-6 py-3">Description</th>
          <th class="px-6 py-3">Action</th>
        </tr>
      </thead>

      <tbody class="text-gray-600 bg-zinc-100">
        <tr
          v-for="product in filteredProducts"
          :key="product.id"
          class="bg-white border-b hover:bg-gray-50"
        >
          <td class="w-4 p-4">
            <div class="flex items-center">
              <input
                type="checkbox"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm"
                v-model="product.checked"
              />
            </div>
          </td>
          <td class="px-6 py-4 font-medium whitespace-nowrap">ascsacsa</td>
          <td class="px-6 py-4">{{ product.category }}</td>
          <td class="px-6 py-4 font-medium whitespace-nowrap">{{ product.name }}</td>
          <td class="px-6 py-4">{{ product.color }}</td>
          <td class="px-6 py-4">{{ product.accessories }}</td>
          <td class="px-6 py-4">{{ product.price }}</td>
          <td class="px-6 py-4">{{ product.weight }}</td>
          <td class="px-6 py-4 flex items-center space-x-3">
            <a href="#" class="font-medium text-blue-600 hover:underline dark:text-blue-500">Edit</a>
            <a href="#" class="font-medium text-red-600 hover:underline dark:text-red-500">Remove</a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
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
                        <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
                            <h3 class="text-xl font-semibold text-gray-900 ">
                                New Product
                            </h3>
                            <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center cursor-pointer dark:hover:text-white" data-modal-hide="default-modal" @click="isModalOpen = false">
                                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                </svg>
                                <span class="sr-only">Close modal</span>
                            </button>
                        </div>
                        <!-- Modal body -->
                        <div class="p-4 md:p-5 space-y-4">
                              <form class="mx-auto h-[400px] overflow-y-scroll px-4"  @submit.prevent="createSub">

                                 <div class="mb-5">
                                    <label for="default-input" class="block mb-2 text-sm font-medium text-gray-900">
                                    Name
                                    </label>

                                    <input type="text" id="default-input" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    >
                                    <!-- Display sub_title errors -->
                                    <ul v-if="errors" class="text-red-500 text-sm mt-1">
                                        <li v-for="(error, index) in errors.link">{{ error }}</li>
                                    </ul>
                                </div>

                                 <div class="mb-5">
                                    <label for="default-input" class="block mb-2 text-sm font-medium text-gray-900">
                                    Category
                                    </label>

                                    <input type="text" id="default-input" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    >
                                    <!-- Display sub_title errors -->
                                    <ul v-if="errors" class="text-red-500 text-sm mt-1">
                                        <li v-for="(error, index) in errors.link">{{ error }}</li>
                                    </ul>
                                </div>

                                 <div class="mb-5">
                                    <label class="block my-5 text-sm font-medium text-gray-900">
                                    Image
                                    </label>
                                    <input class="block p-5 w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                                    type="file"
                                    />
                                    <p class="mt-1 text-sm text-gray-500">
                                    SVG, PNG, JPG, MP4, or GIF (MAX. 800x400px).
                                    </p>  
                                    <!-- Display sub_title errors -->
                                    <ul v-if="errors" class="text-red-500 text-sm mt-1">
                                        <li v-for="(error, index) in errors.image">{{ error }}</li>
                                    </ul>
                                </div>

                                  <div class="mb-5">
                                  
                                </div>

                                <div class="mb-5 flex justify-between gap-5">
                                  <div class="w-full">
                                       <label for="default-input" class="block mb-2 text-sm font-medium text-gray-900">
                                        Color
                                        </label>

                                        <input type="text" id="default-input" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        >
                                        <!-- Display sub_title errors -->
                                        <ul v-if="errors" class="text-red-500 text-sm mt-1">
                                            <li v-for="(error, index) in errors.link">{{ error }}</li>
                                        </ul>
                                   </div>

                                  <div class="w-full">
                                      <label for="default-input" class="block mb-2 text-sm font-medium text-gray-900">
                                      Size
                                      </label>

                                      <input type="text" id="default-input" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                      >
                                      <!-- Display sub_title errors -->
                                      <ul v-if="errors" class="text-red-500 text-sm mt-1">
                                          <li v-for="(error, index) in errors.link">{{ error }}</li>
                                      </ul>
                                  </div>
                                   

                                    <div class="w-full">
                                       <label for="default-input" class="block mb-2 text-sm font-medium text-gray-900">
                                        Stock
                                        </label>

                                        <input type="text" id="default-input" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        >
                                        <!-- Display sub_title errors -->
                                        <ul v-if="errors" class="text-red-500 text-sm mt-1">
                                            <li v-for="(error, index) in errors.link">{{ error }}</li>
                                        </ul>
                                   </div>
                                </div>

                                
                                <div class="mb-5">
                                       <label for="default-input" class="block mb-2 text-sm font-medium text-gray-900">
                                        Price
                                        </label>

                                        <input type="text" id="default-input" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        >
                                        <!-- Display sub_title errors -->
                                        <ul v-if="errors" class="text-red-500 text-sm mt-1">
                                            <li v-for="(error, index) in errors.link">{{ error }}</li>
                                        </ul>
                                   </div>

                               

                               
                                 <!-- Modal footer -->
                                <div class="flex items-center pt-6 border-t ">
                                    <button data-modal-hide="default-modal" type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                                   
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
      </Modal>
    </div>
  </MasterLayout>
</template>
