<script setup>
import { ref, watch } from "vue";

const props = defineProps({
    show: Boolean,
    columns: {
        type: Array,
        default: () => [],
    },
    modelValue: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(["update:modelValue", "submit", "close"]);
const dialog = ref();

watch(
    () => props.show,
    (val) => {
        if (val) {
            document.body.style.overflow = "hidden";
            dialog.value?.showModal();
        } else {
            document.body.style.overflow = null;
            dialog.value?.close();
        }
    }
);

const updateField = (key, value) => {
    emit("update:modelValue", { ...props.modelValue, [key]: value });
};

const handleSubmit = () => {
    emit("submit");
};

const close = () => {
    emit("close");
};
</script>

<template>
    <dialog
        ref="dialog"
        class="z-50 m-0 min-h-full min-w-full overflow-y-auto bg-transparent backdrop:bg-transparent"
        @click.self="close"
    >
        <div class="fixed inset-0 overflow-y-auto px-4 py-6 sm:px-0 z-50">
            <div class="fixed inset-0 bg-gray-500 opacity-75" />

            <div
                class="relative z-50 mx-auto sm:max-w-2xl bg-white rounded-lg shadow-xl w-full p-6"
            >
                <!-- Header -->
                <div
                    class="flex justify-between items-center mb-4 border-b pb-2"
                >
                    <h2 class="text-lg font-semibold">
                        <slot name="title">Form</slot>
                    </h2>
                    <button
                        class="text-gray-400 hover:text-gray-600"
                        @click="close"
                    >
                        ✕
                    </button>
                </div>

                <!-- Form -->
                <form @submit.prevent="handleSubmit">
                    <div v-for="field in columns" :key="field.key" class="mb-4">
                        <label class="block text-sm font-medium text-gray-700">
                            {{ field.label }}
                        </label>
                        <input
                            :type="field.type || 'text'"
                            :value="modelValue[field.key]"
                            @input="
                                (e) => updateField(field.key, e.target.value)
                            "
                            class="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>

                    <div class="flex justify-end">
                        <button
                            type="submit"
                            class="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </dialog>
</template>
