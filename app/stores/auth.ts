import { derived, writable, Writable } from 'svelte/store'

const token: Writable<string> = writable('')
const user: Writable<object> = writable({})

const isAuthenticated = derived([token, user], ([$token, $user]) => {
  return !!$token && Object.keys($user).length > 0
})

const createAuthStore = () => {
  const logout = () => {
    token.set('')
    user.set({})
  }

  return {
    token,
    user,
    isAuthenticated,
    logout,
  }
}

// export a singleton
export const authStore = createAuthStore()

// subscribe to token changes and print out a message when changed
token.subscribe(value => {
  console.log('authStore: Token:', value)
})
user.subscribe(value => {
  console.log('authStore: User:', value)
})
isAuthenticated.subscribe(value => {
  console.log('authStore: isAuthenticated:', value)
})
