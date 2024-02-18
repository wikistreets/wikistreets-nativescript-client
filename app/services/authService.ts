import { onDestroy } from 'svelte'
import { authStore } from '../stores/auth'

export class AuthService {
  isLoggedIn() {
    // check svelte store for login status
    return authStore.isLoggedIn
  }
}
