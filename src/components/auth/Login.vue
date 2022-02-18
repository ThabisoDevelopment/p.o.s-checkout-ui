<template> 
    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-12 col-md-7 col-xl-6">
                <div class="card shadow border-0 mb-4">
                    <div class="card-header py-1 border-0 bg-secondary">
                        <h1 class="my-auto h5 py-2 text-light text-center">Welcome to P.O.S</h1>
                    </div>
                    <div class="card-body">
                        <form action="#" method="post" @submit.prevent="login">
                            <div class="mb-4">
                                <label for="email" class="form-label">Email</label>
                                <div class="input-group">
                                    <span class="input-group-text border-0" id="email-addon">
                                        <span class="fa fa-envelope"></span>
                                    </span>
                                    <input type="text" id="email" class="form-control ip-1 bg-light border-0" v-model="user.email" placeholder="eg: user@email.com">
                                </div>
                            </div>
                            <div class="mb-4">
                                <label for="password" class="form-label">Password</label>
                                <div class="input-group">
                                    <span class="input-group-text border-0" id="password-addon">
                                        <span class="fas fa-lock"></span>
                                    </span>
                                    <input type="password" id="password" class="form-control ip-1 bg-light border-0" v-model="user.password" placeholder="eg: user11">
                                </div>
                            </div>
                            <div class="mb-4">
                                <router-link :to="{ name: 'ForgotPassword' }" class="text-decoration-none">Forgot password?</router-link>
                            </div>
                            <div class="row justify-content-center">
                                <div class="col-6 col-md-4">
                                    <div class="d-grid gap-2">
                                        <button class="btn btn-sm btn-success" type="submit">
                                            Login
                                            <span v-if="!user.loading" class="fa fa-paper-plane"></span>
                                            <span v-if="user.loading" class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <p v-if="user.error" class="text-center text-sm text-danger mt-4 mb-2"> {{ user.error }} </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div class="row justify-content-center">
            <div class="col-12 col-md-7 col-xl-6 my-3">
                <p class="my-0 text-center">
                    Don't have an account yet?
                    <router-link :to="{ name: 'Register' }" class="text-decoration-none"> Create new account </router-link>
                </p>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import { reactive } from '@vue/reactivity'
export default {
    name: "Login",
    setup() {
        // Input user information
        const user = reactive({
            email: '',
            password: '',
            error: '',
            loading: false
        })

        // send login data to authenticate
        const login = async() => {
            if (!user.email || !user.password) return user.error = 'Email and Password Is Required'
            user.error = ''
            user.loading = true
            const userData = { email: user.email, password: user.password }
            try {
                const { data } = await axios.post("/oauth/login", userData)
                localStorage.setItem('username', data.user.name)
                localStorage.setItem('token', data.token)
                // if !data.user.email_verified show notificatio
                window.location.href = "/"
            } catch (error) {
                user.password = ''
                user.loading = false
                user.error = error.response? error.response.data.message :error.message
            }
        }

        return { user, login }
    }
}
</script>