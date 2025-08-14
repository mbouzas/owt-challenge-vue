import { defineStore } from 'pinia';

import { fetchWrapper } from '@/helpers';
import { router } from '@/router';
import { useAlertStore } from '@/stores';

//const baseUrl = `${import.meta.env.VITE_API_URL}/boats`;

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        user: JSON.parse(localStorage.getItem('user')),
        returnUrl: null
    }),
    actions: {
        async login(username, password) {
            try {
                //const user = await fetchWrapper.post(`http://localhost:8080/api/auth`, { username, password });    
                const basicAuth = btoa(`${username}:${password}`);

                const response = await fetch('http://localhost:8080/api/auth', {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${basicAuth}`,
                    'Content-Type': 'application/json',
                },
                body: null // or '{}' if backend requires a body
                });

                if (!response.ok) {
                    // Invalid credentials or other server-side error
                    // Prefer a clear message specifically for auth failure
                    let message = 'Username or password is incorrect';
                    try {
                        // Attempt to read server-provided error message
                        const errorBody = await response.json();
                        if (errorBody && (errorBody.message || errorBody.error)) {
                            message = errorBody.message || errorBody.error;
                        }
                    } catch (_) {
                        // ignore JSON parse errors, keep default message
                    }
                    throw new Error(message);
                }

                const user = await response.json();

                // update pinia state
                this.user = user;

                // store user details and jwt in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));

                // redirect to previous url or default to home page
                router.push(this.returnUrl || '/');
            } catch (error) {
                const alertStore = useAlertStore();
                alertStore.error(error?.message || 'Login failed');
                // Do not rethrow to prevent unhandled promise rejections in views
            }
        },
        logout() {
            this.user = null;
            localStorage.removeItem('user');
            router.push('/account/login');
        }
    }
});
