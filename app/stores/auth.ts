import { derived, writable, Writable } from 'svelte/store'

class AuthStore {
  constructor(
    public isLoggedIn: Writable<boolean> = writable(false),
    public token: Writable<string> = writable('')
  ) {}
}

// Export a singleton
export const authStore = new AuthStore()

// Allow for multiple stores (good for contexts)
// export const createAuthStore = () => new AuthStore();
