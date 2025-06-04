<script setup>
import { formatRupiah } from '@/Pages/API/main.js'

defineProps({
  data: Array,
  columns: Array,
})

function isImage(value) {
  if (typeof value !== 'string') return false
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
  const isUrl = value.startsWith('http') || value.startsWith('data:image')
  const isExt = imageExtensions.some((ext) => value.toLowerCase().endsWith(ext))
  return isUrl || isExt
}
</script>

<template>
  <table class="w-full text-sm text-left text-gray-500">
    <thead class="text-xs text-gray-700 uppercase bg-gray-50 border">
      <tr class="text-center">
        <th class="p-4">
          <div class="flex items-center">
            <input
              id="checkbox-all-search"
              type="checkbox"
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"
            />
            <label for="checkbox-all-search" class="sr-only">checkbox</label>
          </div>
        </th>
        <th class="p-4">No</th>
        <th v-for="col in columns" :key="col.key" class="px-6 py-3">
          {{ col.label }}
        </th>
        <th class="px-6 py-3">Action</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(item, key) in data"
        :key="item.id"
        class="bg-white border-b hover:bg-gray-50"
      >
        <td class="w-4 p-4">
          <div class="flex items-center">
            <input
              :id="`checkbox-${key}`"
              type="checkbox"
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500"
            />
            <label :for="`checkbox-${key}`" class="sr-only">checkbox</label>
          </div>
        </td>

        <td class="w-4 p-4 text-center">
          {{ key + 1 }}
        </td>

        <td
          v-for="col in columns"
          :key="col.key"
          class="px-6 py-4 text-center align-middle"
        >
          <template v-if="isImage(item[col.key])">
            <div class="flex justify-center">
              <img
                :src="item[col.key]"
                class="w-20 h-full object-cover"
                alt="Image"
              />
            </div>
          </template>
          <template v-else-if="col.key === 'price'">
            <span>{{ formatRupiah(item[col.key]) }}</span>
          </template>
          <template v-else>
            {{ item[col.key] ?? '-' }}
          </template>
        </td>

        <td class="px-6 py-4 text-center align-middle">
          <slot name="actions" :item="item" />
        </td>
      </tr>
    </tbody>
  </table>
</template>
