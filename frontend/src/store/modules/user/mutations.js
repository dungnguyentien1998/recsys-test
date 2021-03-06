export default {
    // Change status
    submit: state => {
        state.status = 'SUBMIT'
    },
    // Reset status
    resetStatus: state => {
        state.status = ''
    },
    // Save token and user
    login: (state, payload) => {
        let success = payload.data.success
        if (success) {
            localStorage.setItem('token', payload.data.token)
            state.token = payload.data.token
            state.user = payload.data.user
            state.status = ''
        } else {
            state.status = 'FAILED'
            state.code = payload.data.statusCode
        }
    },
    forgotPassword: (state, payload) => {
        let success = payload.data.success
        if (success) {
            state.status = ''
            // state.email = payload.data.user.email
        } else {
            state.status = 'FAILED'
        }
    },
    // Create new user
    register: (state, payload) => {
        let success = payload.data.success
        if (success) {
            state.status = ''
        } else {
            state.status = 'FAILED'
        }
    },
    // Clear storage
    logout: () => {
        let lang = localStorage.getItem("language")
        localStorage.clear()
        localStorage.setItem("language", lang)
    },
    // Save user
    account: (state, payload) => {
        let success = payload.data.success
        if (success) {
            state.status = ''
            state.user = payload.data.user
        } else {
            state.status = 'FAILED'
        }
    },
    // Save user list
    users: (state, payload) => {
        state.users = payload.data.users
        state.count = payload.data.count
    },
    updateUser: (state, payload) => {
        if (payload.data.success) {
            let user = payload.data.user
            let index = state.users.findIndex(item => item.uuid === user.uuid)
            state.users = [
                ...state.users.slice(0, index),
                user,
                ...state.users.slice(index + 1)
            ]
        } else {
            state.status = 'FAILED'
        }
    },
    setEmail: (state, payload) => {
        state.email = payload
    },
    setRole: (state, payload) => {
        state.role = payload
    },
    setName: (state, payload) => {
        state.name = payload
    },
    setEmailSearch: (state, payload) => {
        state.email_search = payload
    },
    setIsSearch: (state, payload) => {
        state.is_search = payload
    },
    setPage: (state, payload) => {
        state.page = payload
    },
}
