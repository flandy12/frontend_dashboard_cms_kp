<script setup>
defineProps({
    data: Array,
    columns: Array,
});

function isImage(value) {
    if (typeof value !== "string") return false;
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
    const isUrl = value.startsWith("http") || value.startsWith("data:image");
    const isExt = imageExtensions.some((ext) =>
        value.toLowerCase().endsWith(ext)
    );
    return isUrl || isExt;
}
</script>

<template>
    <table class="w-full text-sm text-left text-gray-500">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 border">
            <tr>
                <th scope="col" class="p-4">
                    <div class="flex items-center">
                        <input
                            id="checkbox-all-search"
                            type="checkbox"
                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"
                        />
                        <label for="checkbox-all-search" class="sr-only"
                            >checkbox</label
                        >
                    </div>
                </th>
                <th scope="col" class="p-4">
                    No
                </th>
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
                            id="checkbox-table-search-1"
                            type="checkbox"
                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600"
                        />
                        <label for="checkbox-table-search-1" class="sr-only"
                            >checkbox</label
                        >
                    </div>
                </td>

                <td class="w-4 p-4">
                    {{ key + 1 }}
                </td>

                <td v-for="col in columns" :key="col.key" class="px-6 py-4">
                    
                    <template v-if="isImage(item[col.key])">
                        <img
                            :src="item[col.key]"
                            class="w-20 h-full object-cover"
                            alt="Image"
                        />
                    </template>
                    <template v-else>
                        {{ item[col.key] }}
                    </template>
                </td>
                <td class="px-6 py-4">
                    <slot name="actions" :item="item" />
                </td>
            </tr>
        </tbody>
    </table>
</template>
