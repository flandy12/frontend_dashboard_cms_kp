<script setup>
import { ref, computed, onMounted, reactive } from "vue";
import MasterLayout from "../MasterLayout.vue";
import Modal from "@/Components/Modal.vue";
import BaseTable from "@/Components/BaseTable.vue";
import apiRequest from "../API/main";

const props = defineProps({
    id: String,
});

const menu = ref('');

const columns = [
    { label: "Image", key: "image" },
    { label: "Category", key: "category" },
    { label: "Product Name", key: "name" },
    { label: "Color", key: "color" },
    { label: "Stock", key: "stock" },
    { label: "Price", key: "price" },
    { label: "Size", key: "size" },
];

const searchQuery = ref("");
const isModalOpen = ref(false);
const isEditing = ref(false);
const basePrice = ref(0);

const selectedCategory = ref("");
const selectedSize = ref("");
const categories = ref([]);
const products = ref([]);
const selectedPayment = ref('');

const currentData = reactive({
    name: "",
    category: "",
    image: null,
    imageUrl: "",
    color: "",
    size: "",
    stock: "",
    price: "",
});

const errors = ref([]);
const count =  ref(1);

const openModal = async (product) => {
    isEditing.value = !!product;
    Object.assign(currentData, {
        id: product?.id ?? null,
        name: product?.name ?? "",
        category: product?.category ?? "",
        image: null,
        imageUrl: product?.image ?? "",
        color: product?.color ?? "",
        size: product?.size ?? "",
        stock: product?.stock ?? "",
        price: product?.price ?? "",
    });
    selectedSize.value = product?.size ?? "";
    const matchedCategory = categories.value.find(
        (item) => item.name === product?.category
    );
    selectedCategory.value = matchedCategory?.id ?? "";

    isModalOpen.value = true;
};

function closeModal() {
    isModalOpen.value = false;
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

const getProduct = async (id) => {
    try {
        const response = await apiRequest({
            url: `products/scan/${id}`,
            method: "get",
        });

        if (response.status === 200) {
            products.value = response.data.data;
            isModalOpen.value = true;

            currentData.name = response.data.name;
            currentData.image = response.data.image;
            currentData.size = response.data.size;
            currentData.color = response.data.color;
            currentData.stock = response.data.stock;

            currentData.price = formatRupiah(response.data.price);
            basePrice.value = response.data.price; // simpan angka aslinya
        }
    } catch (err) {
        console.error("Gagal mengambil produk:", err);
    }
};

const submitForm = async () => {
    const formData = {
        ...currentData,
        category: selectedCategory.value,
        size: selectedSize.value,
    };
    console.log(formData);
    try {
        if (isEditing.value) {
            const updatedData = {
                ...currentData,
                category: selectedCategory.value,
                size: selectedSize.value,
                imageUrl: null,
                stock: String(currentData.stock),
            };
            console.log(formData);
            console.log(typeof String(currentData.stock));
            await apiRequest({
                url: `products/${currentData.id}`,
                method: "put",
                data: updatedData,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        } else {
            const response = await apiRequest({
                url: "products",
                method: "post",
                data: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
        }
        closeModal();
        // location.reload();
    } catch (err) {
        console.error("Gagal mengambil produk:", err);
        errors.value = err.response.data.errors;
    }
};

const barcodeQR = async (id) => {
    if (!id) {
      console.error("Invalid product ID");
      return;
    }

    try {
      const response = await apiRequest({
        url: `products/${id}/barcode`,
        method: "get",
      });

      if (response.status === 200 && response.data && response.data.data) {
        const barcodePath = response.data.data;
         window.open(barcodePath, '_blank'); // Buka di tab baru
      } else {
        console.error("Barcode data not found in response");
      }

    } catch (err) {
      console.error("Failed to fetch barcode:", err);

      if (err.response && err.response.data && err.response.data.errors) {
        errors.value = err.response.data.errors;
      } else {
        errors.value = ["Unknown error occurred"];
      }
    }
};

const deleteProduct = async (id) => {
    const confirmDelete = confirm(
        "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
        await apiRequest({
            url: `products/${id}`,
            method: "delete",
        });

        getProduct();
    } catch (err) {
        console.error("Gagal menghapus product", err);
        alert("Gagal menghapus product.");
    }
};

const imagePreview = computed(() => {
    if (currentData.image instanceof File) {
        return URL.createObjectURL(currentData.image);
    } else if (currentData.imageUrl) {
        return currentData.imageUrl;
    }
    return null;
});

const stockOutModalOpen = ref(false);
const stockOutQuantity = ref(1);

const openModalMaster = (data) => {
    stockOutQuantity.value = 1;
    stockOutModalOpen.value = true;
    menu.value = data;
    console.log(menu.value);
};

const closeStockOutModal = () => {
    stockOutModalOpen.value = false;
};

const submit = async (data) => {
    if (stockOutQuantity.value <= 0 || stockOutQuantity.value > currentData.stock) {
        alert("Invalid quantity");
        return;
    }

    if(menu == 'Checkout') {
         try {
            const response = await apiRequest({
                url: `stockmovements/stockin`,
                method: "post",
                data: {
                    product_id : currentData.id,
                    quantity: stockOutQuantity.value,
                },
            });

            // Refresh product info
            await getProduct(currentData.id);
            closeStockOutModal();
            alert("Stock updated successfully");
        } catch (err) {
            console.error("Stock out failed:", err);
            alert("Failed to update stock.");
        }
    } else {
         try {
            const response = await apiRequest({
                url: `stockmovements/stockin`,
                method: "post",
                data: {
                    product_id : currentData.id,
                    quantity: stockOutQuantity.value,
                },
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
  const total = basePrice.value * count.value;
  currentData.price = formatRupiah(total);
}

function decrement() {
   if (count.value > 1) {
        count.value--;
        const total = basePrice.value * count.value;
        currentData.price = formatRupiah(total);
    }
}

function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number)
}


onMounted(() => {
    const path = window.location.pathname; 
    currentData.id = path.split('/').pop();
    getCategories();
    getProduct(path.split('/').pop());
});

</script>

<template>
   <div class="w-full flex justify-center bg-zinc-50 py-20">
   
        <!-- Main modal -->
        <div class="bg-slate-50 rounded-xl w-full max-w-xl shadow-xl p-6  border border-gray-200  ">
            <div class="">
                <!-- Modal content -->
                <div class="relative rounded-lg ">
                    <div class="mb-5">
                        <label  for="default-input" class="block mb-2 text-sm font-medium text-gray-900">
                             Product Name
                        </label>
                        <p class="text-2xl"> {{currentData.name}}</p>
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

                                    <p class="font-bold">{{ currentData.color }}</p>
                                    
                                </div>

                                <div class="w-full">
                                    <label
                                        for="default-input"
                                        class="block mb-2 text-sm font-medium text-gray-900"
                                    >
                                        Size
                                    </label>

                                    <p class="font-bold">{{ currentData.size }}</p>
                                </div>

                                <div class="w-full">
                                    <label
                                        for="default-input"
                                        class="block mb-2 text-sm font-medium text-gray-900"
                                    >
                                        Stock
                                    </label>
                                    <p class="font-bold">{{ currentData.stock }}</p>
                                </div>
                            </div>

                            <!-- Modal footer -->
                            <div class="flex items-center pt-6 border-t"
                                >
                                <div class="w-full">
                                    <label
                                        for="default-input"
                                        class="block mb-2 text-sm font-medium text-gray-900"
                                    >
                                        Price
                                    </label>
                                    <p class="font-bold text-2xl">{{ currentData.price }}</p>
                                </div>
                    
                                <div class="flex items-center space-x-4">
                                    <button
                                    @click="decrement"
                                    class=" bg-zinc-300 text-black px-4 py-2 rounded-lg hover:bg-red-600 transition"
                                    >
                                    -
                                    </button>

                                    <span class="text-xl font-bold w-10 text-center">{{ count }}</span>

                                    <button
                                    @click="increment"
                                    class=" bg-zinc-300 text-black px-4 py-2 rounded-lg hover:bg-green-600 transition"
                                    >
                                    +
                                    </button>
                                </div>
                            </div>
                            
                            <div class="mt-5 grap-5 space-x-5 flex justify-center">
                              <button
                                    @click="openModalMaster('Checkout')"
                                    data-modal-hide="default-modal"
                                    type="submit"
                                    class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                                >
                                    Checkout
                              </button>

                              <button
                                    @click="openModalMaster('Stock In')"
                                    data-modal-hide="default-modal"
                                    type="submit"
                                    class="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
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
            <p class="mb-2">Current stock: <strong>{{ currentData.stock }}</strong></p>
            
            <div v-if="menu == 'Stock In'">
                <label class="block mb-2 text-sm font-medium text-gray-700">Quantity to stock in</label>
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
                <select v-model="selectedPayment" id="payment" class="ms-5 rounded">
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
