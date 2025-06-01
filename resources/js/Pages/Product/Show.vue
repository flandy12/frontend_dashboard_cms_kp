<script setup>
import { ref, computed, onMounted, reactive } from "vue";
import MasterLayout from "../MasterLayout.vue";
import Modal from "@/Components/Modal.vue";
import BaseTable from "@/Components/BaseTable.vue";
import apiRequest from "../API/main";
import sendTelegramNotification from "@/Telegram/telegramAPI.js";
import { getCookie, hasPermission } from '@/Pages/API/main.js'

// Check Permission
const permission = ref({});

const props = defineProps({
    url: String,
});

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
const isSubmitting = ref(false);

const selectedCategory = ref("");
const selectedSize = ref("");
const categories = ref([]);
const products = ref([]);

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

const filteredProducts = computed(() => {
    if (!searchQuery.value) return products.value;
    return products.value.filter(
        (product) =>
            product.name
                .toLowerCase()
                .includes(searchQuery.value.toLowerCase()) ||
            product.color
                .toLowerCase()
                .includes(searchQuery.value.toLowerCase()) ||
            product.category
                .toLowerCase()
                .includes(searchQuery.value.toLowerCase())
    );
});

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

function applyFilters() {
    // Add your filter logic here
    console.log("Filter button clicked");
}

function handleImageUpload(event) {
    const file = event.target.files[0];

    if (file) {
        currentData.image = file;
        currentData.imageUrl = "";
    }
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
            // console.log(response.data.data);
        }
    } catch (err) {
        console.error("Gagal mengambil produk:", err);
    }
};

const submitForm = async () => {
    isSubmitting.value = true;

    const formData = {
        ...currentData,
        category: selectedCategory.value,
        size: selectedSize.value,
    };

    try {
        if (isEditing.value) {
            const updatedData = {
                ...currentData,
                category: selectedCategory.value,
                size: selectedSize.value,
                imageUrl: null,
                stock: String(currentData.stock),
                _method: "put",
            };
            await apiRequest({
                url: `products/${currentData.id}`,
                method: "post",
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
                },
            });

            sendTelegramNotification("Berhasil Membuat Produk");
        }

        closeModal();
        location.reload();
    } catch (err) {
        console.error("Gagal mengambil produk:", err);
        console.log(err.response);
        errors.value = err.response.data.errors;
        isSubmitting.value = false;
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
            window.open(barcodePath, "_blank"); // Buka di tab baru
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

const getProductId =  async(id) => {
      try {
        const response = await apiRequest({
            url: `products/${id}`,
            method: "get",
        });

        if (response.status === 200) {
            openModal(response.data);
        }
    } catch (err) {
        console.error("Gagal mengambil produk:", err);
    }
}

onMounted(() => {
    
    const userData = getCookie("user_data");
    try {
        permission.value = JSON.parse(userData || "{}");
    } catch {
        permission.value = {};
    }

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
                    v-if="hasPermission(permission, 'product create')"
                    @click="openModal(null)"
                    class="bg-gray-600 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded"
                >
                    New Product
                </button>
            </div>
            <input
                v-model="searchQuery"
                type="text"
                id="table-search"
                class="w-72 block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search for product, category, color"
            />
        </div>

        <!-- <div class="flex items-center justify-end gap-5">
          
          <button
            @click="applyFilters"
            class="bg-gray-600 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded"
          >
            Filters
          </button>
          
        </div> -->

        <div class="relative w-full">
            <p class="text-end mb-4 pr-4">Select All</p>

            <!-- Scrollable Table Wrapper -->
            <div class="w-full overflow-x-auto">
                <BaseTable :data="filteredProducts" :columns="columns">
                    <template #actions="{ item }">
                        <button
                            v-if="hasPermission(permission, 'product edit')"
                            @click="getProductId(item.id)"
                            class="text-blue-600 hover:underline mr-2"
                        >
                            Edit
                        </button>
                        <button
                            v-if="hasPermission(permission, 'product delete')"
                            @click="deleteProduct(item.id)"
                            class="text-red-600 hover:underline"
                        >
                            Remove
                        </button>
                        <button
                            v-if="hasPermission(permission, 'product edit')"
                            @click="barcodeQR(item.id)"
                            class="text-green-600 hover:underline"
                        >
                            Barcode
                        </button>
                    </template>
                </BaseTable>

            </div>

            <div class="flex flex-col items-center mt-5">
                <!-- Help text -->
                <span class="text-sm text-gray-700">
                    Showing
                    <span class="font-semibold text-gray-900">1</span> to
                    <span class="font-semibold text-gray-900">10</span> of
                    <span class="font-semibold text-gray-900">100</span> Entries
                </span>
                <!-- Buttons -->
                <div class="inline-flex mt-2 xs:mt-0">
                    <button
                        class="flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-gray-600 rounded-s hover:bg-gray-900"
                    >
                        Prev
                    </button>
                    <button
                        class="flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-gray-600 border-0 border-s border-gray-700 rounded-e hover:bg-gray-900"
                    >
                        Next
                    </button>
                </div>
            </div>

            <Modal :show="isModalOpen" @close="isModalOpen = false">
                <!-- Main modal -->
                <div id="">
                    <div class="relative p-4 w-full max-w-2xl max-h-full">
                        <!-- Modal content -->
                        <div class="relative rounded-lg shadow-sm">
                            <!-- Modal header -->
                            <div
                                class="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200"
                            >
                                <h3 class="text-xl font-semibold text-gray-900">
                                    {{
                                        isEditing
                                            ? "Edit Product"
                                            : "New Product"
                                    }}
                                </h3>
                                <button
                                    type="button"
                                    class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center cursor-pointer dark:hover:text-white"
                                    data-modal-hide="default-modal"
                                    @click="isModalOpen = false"
                                >
                                    <svg
                                        class="w-3 h-3"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 14 14"
                                    >
                                        <path
                                            stroke="currentColor"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                        />
                                    </svg>
                                    <span class="sr-only">Close modal</span>
                                </button>
                            </div>
                            <!-- Modal body -->
                            <div class="p-4 md:p-5 space-y-4">
                                <form
                                    class="mx-auto h-[650px] overflow-y-scroll px-4"
                                    @submit.prevent="submitForm"
                                >
                                    <div class="mb-5">
                                        <label
                                            for="default-input"
                                            class="block mb-2 text-sm font-medium text-gray-900"
                                        >
                                            Name
                                        </label>

                                        <input
                                            type="text"
                                            v-model="currentData.name"
                                            id="default-input"
                                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        />
                                        <!-- Display sub_title errors -->
                                        <ul
                                            v-if="errors"
                                            class="text-red-500 text-sm mt-1"
                                        >
                                            <li
                                                v-for="(
                                                    error, index
                                                ) in errors.name"
                                            >
                                                {{ error }}
                                            </li>
                                        </ul>
                                    </div>

                                    <div class="mb-5">
                                        <label
                                            for="categories"
                                            class="block mb-2 text-sm font-medium text-gray-900"
                                            >Select Kategori</label
                                        >
                                        <select
                                            id="categories"
                                            v-model="selectedCategory"
                                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        >
                                            <option disabled value="">
                                                -- Pilih Kategori --
                                            </option>
                                            <option
                                                v-for="item in categories"
                                                :key="item.id"
                                                :value="item.id"
                                            >
                                                {{ item.name }}
                                            </option>
                                        </select>

                                        <ul
                                            v-if="errors"
                                            class="text-red-500 text-sm mt-1"
                                        >
                                            <li
                                                v-for="(
                                                    error, index
                                                ) in errors.category_id"
                                            >
                                                {{ error }}
                                            </li>
                                        </ul>
                                    </div>

                                    <div class="mb-5">
                                        <label
                                            class="block my-5 text-sm font-medium text-gray-900"
                                        >
                                            Image
                                        </label>
                                        <div
                                            class="flex items-center p-5 w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                                        >
                                            <!-- <div class="mt-2 max-w-xs">
                                                <img
                                                    v-if="currentData.image"
                                                    :src="
                                                        URL.createObjectURL(
                                                            currentData.image
                                                        )
                                                    "
                                                    alt="Preview"
                                                    class="rounded"
                                                />
                                                <img
                                                    v-else-if="
                                                        currentData.imageUrl
                                                    "
                                                    :src="currentData.imageUrl"
                                                    alt="Preview"
                                                    class="rounded"
                                                />
                                                <img
                                                    v-else
                                                    src="/path/to/placeholder-image.png"
                                                    alt="Placeholder"
                                                    class="rounded opacity-50"
                                                />
                                            </div> -->
                                            <div class="mt-2 mr-3 max-w-xs">
                                                <img
                                                    v-if="imagePreview"
                                                    :src="imagePreview"
                                                    alt="Preview"
                                                    class="rounded max-w-full"
                                                />
                                            </div>
                                            <input
                                                type="file"
                                                @change="handleImageUpload"
                                            />
                                        </div>
                                        <p class="mt-1 text-sm text-gray-500">
                                            SVG, PNG, JPG, MP4, or GIF (MAX.
                                            800x400px).
                                        </p>
                                        <!-- Preview gambar -->

                                        <!-- Display sub_title errors -->
                                        <ul
                                            v-if="errors"
                                            class="text-red-500 text-sm mt-1"
                                        >
                                            <li
                                                v-for="(
                                                    error, index
                                                ) in errors.image"
                                            >
                                                {{ error }}
                                            </li>
                                        </ul>
                                    </div>

                                    <div class="mb-5"></div>

                                    <div
                                        class="mb-5 flex justify-between gap-5"
                                    >
                                        <div class="w-full">
                                            <label
                                                for="default-input"
                                                class="block mb-2 text-sm font-medium text-gray-900"
                                            >
                                                Color
                                            </label>

                                            <input
                                                type="text"
                                                v-model="currentData.color"
                                                id="default-input"
                                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                            />
                                            <!-- Display sub_title errors -->
                                            <ul
                                                v-if="errors"
                                                class="text-red-500 text-sm mt-1"
                                            >
                                                <li
                                                    v-for="(
                                                        error, index
                                                    ) in errors.color"
                                                >
                                                    {{ error }}
                                                </li>
                                            </ul>
                                        </div>

                                        <div class="w-full">
                                            <label
                                                for="default-input"
                                                class="block mb-2 text-sm font-medium text-gray-900"
                                            >
                                                Size
                                            </label>

                                            <select
                                                id="size"
                                                v-model="selectedSize"
                                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                            >
                                                <option disabled value="">
                                                    -- Pilih Size --
                                                </option>
                                                <option value="S">S</option>
                                                <option value="M">M</option>
                                                <option value="L">L</option>
                                                <option value="XL">XL</option>
                                                <option value="XXL">XXL</option>
                                            </select>

                                            <!-- Display sub_title errors -->
                                            <ul
                                                v-if="errors"
                                                class="text-red-500 text-sm mt-1"
                                            >
                                                <li
                                                    v-for="(
                                                        error, index
                                                    ) in errors.size"
                                                >
                                                    {{ error }}
                                                </li>
                                            </ul>
                                        </div>

                                        <div class="w-full">
                                            <label
                                                for="default-input"
                                                class="block mb-2 text-sm font-medium text-gray-900"
                                            >
                                                Stock
                                            </label>

                                            <input
                                                type="text"
                                                v-model="currentData.stock"
                                                id="default-input"
                                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                            />
                                            <!-- Display sub_title errors -->
                                            <ul
                                                v-if="errors"
                                                class="text-red-500 text-sm mt-1"
                                            >
                                                <li
                                                    v-for="(
                                                        error, index
                                                    ) in errors.stock"
                                                >
                                                    {{ error }}
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div class="mb-5">
                                        <label
                                            for="default-input"
                                            class="block mb-2 text-sm font-medium text-gray-900"
                                        >
                                            Price
                                        </label>

                                        <input
                                            type="text"
                                            v-model="currentData.price"
                                            id="default-input"
                                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        />
                                        <!-- Display sub_title errors -->
                                        <ul
                                            v-if="errors"
                                            class="text-red-500 text-sm mt-1"
                                        >
                                            <li
                                                v-for="(
                                                    error, index
                                                ) in errors.price"
                                            >
                                                {{ error }}
                                            </li>
                                        </ul>
                                    </div>

                                    <!-- Modal footer -->
                                    <div
                                        class="flex items-center pt-6 border-t"
                                    >
                                        <button
                                            data-modal-hide="default-modal"
                                            type="submit"
                                            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        >
                                            {{ isSubmitting ? 'Submitting...' : 'Submit' }}
                                        </button>
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
