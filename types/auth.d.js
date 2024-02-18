declare module 'auth' {
    export const auth: {
        isLoggedIn: boolean
        token: string
        subscribe: (run: (value: { isLoggedIn: boolean, token: string }) => void, invalidate?: any) => () => void
        set: (value: { isLoggedIn: boolean, token: string }) => void
        update: (updater: (value: { isLoggedIn: boolean, token: string }) => { loggedIn: boolean, token: string }) => void
    }
}