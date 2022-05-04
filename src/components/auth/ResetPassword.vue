<template> 
    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-12 col-md-7 col-xl-6">
                <div class="card shadow border-0 mb-4">
                    <div class="card-header py-1 border-0 bg-secondary">
                        <p class="my-auto py-1 h4 text-light">Reset Password</p>
                    </div>
                    <div class="card-body">
                        <form action="#" method="post" @submit.prevent="passwordReset">
                            <div class="my-4">
                                <label for="password" class="form-label">Enter your new Password</label>
                                <div class="input-group">
                                    <span class="input-group-text border-0" id="password-addon">
                                        <span class="fas fa-lock"></span>
                                    </span>
                                    <input type="text" id="password" class="form-control ip-1 bg-light border-0" v-model="user.password">
                                </div>
                            </div>
                            <div class="row justify-content-center mb-3">
                                <div class="col-7 col-md-5">
                                    <div class="d-grid gap-2">
                                        <button class="btn btn-sm btn-primary" type="submit" :disabled="user.loading">
                                            Change Password
                                            <span v-if="!user.loading" class="fa fa-paper-plane ps-2"></span>
                                            <span v-if="user.loading" class="spinner-grow spinner-grow-sm ps-2" role="status" aria-hidden="true"></span>
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
import { onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { notify } from '@kyvg/vue3-notification'
export default {
    setup() {
        // Input user information
        const user = reactive({
            password: '',
            error: '',
            loading: false
        })

        const router = useRouter()
        const route = useRoute()
        const token = route.query.token

        onMounted(() => {
            if (!route.query.token) {
                notify({
                    title: 'User Password Reset Error',
                    type: 'error',
                    text: 'sorrry you dont have access to reset password open your mail inbox for intruction'
                })
                router.push({ name: 'Login' })
            }
        })

        // reset
        const passwordReset = async() => {
            try {
                if (!user.password) throw 'Please enter your new paswword'
                user.error = ''
                user.loading = true
                const userPassword = { password: user.password }
                const { data } = await axios.put("/oauth/reset", userPassword, {
                    headers: {
                        'Authorization': token
                    }
                })
                user.loading = false
                user.password = ''
                notify({
                    title: 'User Password Reset Success',
                    type: 'success',
                    text: data.message
                })
                router.push({ name: 'Login' })
            } catch (error) {
                user.loading = false
                const errorMessage = error.response? error.response.data :error
                user.error = errorMessage
                notify({
                    title: 'User Password Reset Error',
                    type: 'error',
                    text: errorMessage
                })
            }
        }

        return { user, passwordReset }
    }
}
</script>