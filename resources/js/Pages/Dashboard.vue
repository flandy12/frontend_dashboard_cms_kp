<script setup>
import AppLayout from '@/Layouts/AppLayout.vue';
import Welcome from '@/Components/Welcome.vue';

const getUsers = async () => {
    try {
        const response = await apiRequest({
            url: "/users",
            method: "get",
        });
        if (response.status == 200) {
            users.value = response.data;
            console.log(response.data);
        }
    } catch (err) {
        console.log("Gagal mengambil users", err);
    }
};

const deleteUser = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
        await apiRequest({
            url: `users/${id}`,
            method: "delete",
        });

        getUsers();
    } catch (err) {
        console.error("Gagal menghapus user", err);
        alert("Gagal menghapus user.");
    }
};

onMounted(() => {
    getUsers();
});

</script>

<template>
    <AppLayout title="Dashboard">
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                Dashboard
            </h2>
        </template>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                    <Welcome />
                </div>
            </div>
        </div>
    </AppLayout>
</template>
