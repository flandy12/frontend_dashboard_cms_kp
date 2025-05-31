<script setup>
import { useRouter } from 'vue-router'
import { watch } from 'vue'

const router = useRouter()

const props = defineProps({
  icon: String,
  title: String,
  to: String,
  active: Boolean
})

// Navigasi saat di-klik
function navigate() {
  if (props.to) {
    router.push(props.to)
  }
}

// Contoh penggunaan watch untuk memantau perubahan aktif
watch(
  () => props,
  (newVal, oldVal) => {
    console.log(`SidebarItem "${props.title}" aktif:`, newVal)
    // Bisa ditambahkan side effect lainnya di sini
  }
)
</script>

<template>
  <div
    @click="navigate"
    :class="[
      'cursor-pointer flex items-center px-4 py-2 rounded',
      active ? 'bg-green-100 font-bold' : 'hover:bg-gray-100'
    ]"
  >
    <span class="mr-2">{{ icon }}</span>
    <span>{{ title }}</span>
  </div>
</template>
