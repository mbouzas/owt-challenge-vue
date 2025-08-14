import { defineStore } from 'pinia';

import { fetchWrapper } from '@/helpers';
import { useAuthStore } from '@/stores';
import { useAlertStore } from '@/stores';

const baseUrl = `${import.meta.env.VITE_API_URL}`;

export const useBoatsStore = defineStore({
    id: 'boats',
    state: () => ({
        boats: {},
        boat: {}
    }),
    actions: {
        async register(boat) {
            await fetchWrapper.post(`${baseUrl}/boats`, boat);
        },
        async getAll() {
            this.boats = { loading: true };
            try {
                const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : '';
                if (!token) {
                    throw new Error('User not authenticated');
                }
                // fetch all boats
                const response = await fetch(`${baseUrl}/boats`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                this.boats = await response.json();  
            } catch (error) {
                this.boats = { error };
            }
        },
        async getById(id) {
            this.boat = { loading: true };
            try {
                this.boat = await fetchWrapper.get(`${baseUrl}/boats/${id}`);
            } catch (error) {
                this.boat = { error };
            }
        },
        async update(id, params) {
            await fetchWrapper.put(`${baseUrl}/boats/${id}`, params);

            // update stored user if the logged in user updated their own record
            const authStore = useAuthStore();
            if (id === authStore.user?.id) {
                // update local storage
                const user = { ...authStore.user, ...params };
                localStorage.setItem('user', JSON.stringify(user));

                // update auth user in pinia state
                authStore.user = user;
            }
        },
        async delete(id) {
            const alertStore = useAlertStore();

            // add isDeleting prop to boat being deleted
            this.boats.find(x => x.id === id).isDeleting = true;

            await fetchWrapper.delete(`${baseUrl}/boats/${id}`);

            // remove boat from list after deleted
            this.boats = this.boats.filter(x => x.id !== id);
            alertStore.success("Boat deleted successfully");

            // auto logout if the logged in user deleted their own record (unlikely for boats, but left as safeguard)
            const authStore = useAuthStore();
            if (id === authStore.user?.id) {
                authStore.logout();
            }
        }
    }
});
