<script setup>
const props = defineProps({
  icon: String,
  title: String,
  to: String,
  active: Boolean,
});

import { useRouter } from 'vue-router';
const router = useRouter();

function navigate() {
  router.push(props.to);
}
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
