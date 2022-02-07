<template> 
    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-12 col-md-7 col-xl-6">
                <div class="card shadow border-0 mb-4">
                    <div class="card-header py-1 border-0 bg-secondary">
                        <p class="my-auto py-1 text-light">Change Password</p>
                    </div>
                    <div class="card-body">
                        <form action="#" method="post" @submit.prevent="passwordReset">
                            <div class="mb-4">
                                <label for="password" class="form-label">Enter your new Password</label>
                                <div class="input-group">
                                    <span class="input-group-text border-0" id="password-addon">
                                        <span class="fas fa-lock"></span>
                                    </span>
                                    <input type="text" id="password" class="form-control ip-1 bg-light border-0" v-model="user.password">
                                </div>
                            </div>
                            <div class="row justify-content-center">
                                <div class="col-7 col-md-5">
                                    <div class="d-grid gap-2">
                                        <button class="btn btn-sm btn-primary" type="submit">
                                            Change Password
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
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
export default {
    name: "PasswordReset",
    setup() {
        // Input user information
        const user = reactive({
            password: '',
            error: '',
            loading: false
        })

        const router = useRouter()
        const route = useRoute()
        const token = route.params.token

        // reset
        const passwordReset = async() => {
            user.error = ''
            user.loading = true
            const userPassword = { password: user.password }
            try {
                const { data } = await axios.put("/oauth/password/reset", userPassword, {
                    headers: {
                        'Authorization': token
                    }
                })
                user.loading = false
                user.password = ''
                console.log(data.message)
                router.push({ name: 'Login' })
            } catch (error) {
                user.loading = false
                user.error = error.response? error.response.data.message :error.message
            }
        }

        return { user, passwordReset }
    }
}
</script>