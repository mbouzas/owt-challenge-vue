<script setup>
import { storeToRefs } from 'pinia';

import { useBoatsStore } from '@/stores';
import { useRouter } from 'vue-router';

const router = useRouter();
const boatsStore = useBoatsStore();
const { boats } = storeToRefs(boatsStore);

boatsStore.getAll();

function goToBoat(boatId) {
    router.push({
        path: `/boats/edit/${boatId}`,
        query: { hideButtons: 'true' }
    });
}
</script>

<template>
    <h1>Boats</h1>
    <router-link to="/boats/add" class="btn btn-sm btn-success mb-2">Add Boat</router-link>
    <table class="table table-striped">
        <thead>
            <tr>
                <th style="width: 20%">Boat Name</th>
                <th style="width: 40%">Description</th>
                <th style="width: 10%"></th>
            </tr>
        </thead>
        <tbody>
            <template v-if="boats.length">
                <tr v-for="boat in boats" :key="boat.id" @click="goToBoat(boat.id)"
                    style="cursor: pointer">
                    <td>{{ boat.name }}</td>
                    <td>{{ boat.description }}</td>
                    <td style="white-space: nowrap" @click.stop>
                        <router-link :to="`/boats/edit/${boat.id}`" class="btn btn-sm btn-primary mr-1">Edit</router-link>
                        <button @click="boatsStore.delete(boat.id)" class="btn btn-sm btn-danger btn-delete-boat" :disabled="boat.isDeleting">
                            <span v-if="boat.isDeleting" class="spinner-border spinner-border-sm"></span>
                            <span v-else>Delete</span>
                        </button>
                    </td>
                </tr>
            </template>
            <tr v-if="boats.loading">
                <td colspan="4" class="text-center">
                    <span class="spinner-border spinner-border-lg align-center"></span>
                </td>
            </tr>
            <tr v-if="boats.error">
                <td colspan="4">
                    <div class="text-danger">Error loading boats: {{boats.error}}</div>
                </td>
            </tr>            
        </tbody>
    </table>
</template>
