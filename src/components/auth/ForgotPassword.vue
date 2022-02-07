<template> 
    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-12 col-md-7 col-xl-6">
                <div class="card shadow border-0 mb-4">
                    <div class="card-header py-1 border-0 bg-secondary">
                        <h1 class="my-auto h5 py-2 text-light">Forgot Password</h1>
                    </div>
                    <div class="card-body">
                        <form action="#" method="post" @submit.prevent="sendPasswordResetEmail">
                            <div class="mb-4">
                                <label for="email" class="form-label">Enter your email address</label>
                                <div class="input-group">
                                    <span class="input-group-text border-0" id="email-addon">
                                        <span class="fa fa-envelope"></span>
                                    </span>
                                    <input type="text" id="email" class="form-control ip-1 bg-light border-0" v-model="user.email" placeholder="eg: user@mail.com">
                                </div>
                            </div>
                            <div class="row justify-content-center">
                                <div class="col-7 col-md-5">
                                    <div class="d-grid gap-2">
                                        <button class="btn btn-sm btn-danger" type="submit">
                                            Request Email
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
            <div class="col-12 col-md-7 col-xl-6 mt-3">
                <p class="my-0 text-center">
                    Don't have an account yet?
                    <router-link :to="{ name: 'Register' }" class="text-decoration-none"> Create new account </router-link>
                    or 
                    <router-link :to="{ name: 'Login' }" class="text-decoration-none"> Login </router-link>
                </p>
            </div>
        </div>
    </div>
</template>
<script>
import { reactive } from 'vue'
import axios from 'axios'
export default {
    name: "ForgotPassword",
    setup() {
        // Input user information
        const user = reactive({
            email: '',
            error: '',
            loading: false
        })

        // send email to back-end to be verified then open your email for passwword reset
        const sendPasswordResetEmail = async() => {
            if (!user.email) return user.error = 'Please enter your valid email address'
            user.error = ''
            user.loading = true
            const userData = { email: user.email }
            try {
                const { data } = await axios.post("/oauth/password/forgot", userData)
                user.loading = false
                user.email = ''
                console.log(data)
            } catch (error) {
                user.loading = false
                user.error = error.response? error.response.data.message :error.message
            }
        }

        return { user, sendPasswordResetEmail }
    }
}
</script>