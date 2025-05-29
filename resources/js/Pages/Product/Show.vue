<script setup>
import { ref, computed, onMounted, reactive } from 'vue';
import MasterLayout from '../MasterLayout.vue';
import Modal from '@/Components/Modal.vue';
import BaseTable from "@/Components/BaseTable.vue";
import apiRequest from "../API/main";

const props = defineProps({
  url: String,
});

const columns = [
  { label: "Image", key: "image" },
  { label: "Category", key: "category" },
  {label: "Product Name", key: "name" },
  { label: "Color", key: "color" },
  {label: "Stock", key: "stock" },
  {label: "Price", key: "price" },
  {label: "Size", key: "size" }];


const searchQuery = ref('');
const isModalOpen = ref(false);

const selectedCategory = ref('');
const selectedSize = ref('');
const categories = ref([]);
const products = ref([]);
const currentData = reactive({ name: "", category: "", image: "", color:"", size : "",stock : "", price : "" });
const errors = ref([]);

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

function handleImageUpload(event) {
  const file = event.target.files[0];
  currentData.image = file;
}

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

  const getProduct = async () => {
    try {
      const response = await apiRequest({
        url: "products",
        method: "get",
      });

      if (response.status === 200) {
        products.value = response.data.data;
        console.log(response.data.data);
      }
    } catch (err) {
      console.error("Gagal mengambil produk:", err);
    }
  };

  const createProduct = async() => {
      const formData = {
          ...currentData,
          category: selectedCategory.value,
          size: selectedSize.value,
      };

     try {
      const response = await apiRequest({
        url: "products",
        method: "post",
        data : formData, 
         headers: {
            "Content-Type": "multipart/form-data"
          }
      });

      console.log(response);
      closeModal();
      location.reload();
    } catch (err) {
      console.error("Gagal mengambil produk:", err);
       errors.value = err.response.data.errors;
    }
  }

  onMounted(() => {
    getCategories();
    getProduct();
  });

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

          <BaseTable :data="filteredProducts" :columns="columns">
              <template #actions="{ item }">
                  <button
                      @click="openModal(item)"
                      class="text-blue-600 hover:underline mr-2"
                  >
                      Edit
                  </button>
                  <button
                      @click="deleteCategory(item.id)"
                      class="text-red-600 hover:underline"
                  >
                      Remove
                  </button>
              </template>
          </BaseTable>

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
                              <form class="mx-auto h-[650px] overflow-y-scroll px-4"  @submit.prevent="createProduct">

                                 <div class="mb-5">
                                    <label for="default-input" class="block mb-2 text-sm font-medium text-gray-900">
                                    Name
                                    </label>

                                    <input type="text" v-model="currentData.name" id="default-input" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    >
                                    <!-- Display sub_title errors -->
                                    <ul v-if="errors" class="text-red-500 text-sm mt-1">
                                        <li v-for="(error, index) in errors.name">{{ error }}</li>
                                    </ul>
                                </div>

                                <div class="mb-5">
                                    <label for="categories" class="block mb-2 text-sm font-medium text-gray-900">Select Kategori</label>
                                    <select
                                      id="categories"
                                      v-model="selectedCategory"
                                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    >
                                      <option disabled value="">-- Pilih Kategori --</option>
                                      <option v-for="item in categories" :key="item.id" :value="item.id">{{ item.name }}</option>
                                    </select>

                                      <ul v-if="errors" class="text-red-500 text-sm mt-1">
                                        <li v-for="(error, index) in errors.category_id">{{ error }}</li>
                                    </ul>
                                  </div>


                                 <div class="mb-5">
                                    <label class="block my-5 text-sm font-medium text-gray-900">
                                    Image
                                    </label>
                                    <input class="block p-5 w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                                    type="file"
                                    @change="handleImageUpload"
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

                                        <input type="text" v-model="currentData.color" id="default-input" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        >
                                        <!-- Display sub_title errors -->
                                        <ul v-if="errors" class="text-red-500 text-sm mt-1">
                                            <li v-for="(error, index) in errors.color">{{ error }}</li>
                                        </ul>
                                   </div>

                                  <div class="w-full">
                                      <label for="default-input" class="block mb-2 text-sm font-medium text-gray-900">
                                      Size
                                      </label>

                                      <select
                                        id="categories"
                                        v-model="selectedSize"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                      >
                                        <option disabled value="">-- Pilih Size --</option>
                                        <option value="S">S</option>
                                        <option value="M">M</option>
                                        <option value="L">L</option>
                                        <option value="XL">XL</option>
                                        <option value="XXL">XXL</option>
                                    </select>

                                     
                                      <!-- Display sub_title errors -->
                                      <ul v-if="errors" class="text-red-500 text-sm mt-1">
                                          <li v-for="(error, index) in errors.size">{{ error }}</li>
                                      </ul>
                                  </div>
                                   

                                    <div class="w-full">
                                       <label for="default-input" class="block mb-2 text-sm font-medium text-gray-900">
                                        Stock
                                        </label>

                                        <input type="text" v-model="currentData.stock" id="default-input" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        >
                                        <!-- Display sub_title errors -->
                                        <ul v-if="errors" class="text-red-500 text-sm mt-1">
                                            <li v-for="(error, index) in errors.stock">{{ error }}</li>
                                        </ul>
                                   </div>
                                </div>
               
                                <div class="mb-5">
                                       <label for="default-input" class="block mb-2 text-sm font-medium text-gray-900">
                                        Price
                                        </label>

                                        <input type="text" v-model="currentData.price" id="default-input" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        >
                                        <!-- Display sub_title errors -->
                                        <ul v-if="errors" class="text-red-500 text-sm mt-1">
                                            <li v-for="(error, index) in errors.price">{{ error }}</li>
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
