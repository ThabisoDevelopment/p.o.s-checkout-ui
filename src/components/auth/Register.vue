<template> 
    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-12 col-md-7 col-xl-6">
                <div class="card shadow border-0 mb-4">
                    <div class="card-header py-1 border-0 bg-secondary">
                        <h1 class="my-auto h5 py-2 text-light">Create a new account</h1>
                    </div>
                    <div class="card-body">
                        <form action="#" method="post" @submit.prevent="register">
                            <div class="mb-4">
                                <label for="name" class="form-label">Name</label>
                                <div class="input-group">
                                    <span class="input-group-text border-0" id="name-addon">
                                        <span class="fa fa-user"></span>
                                    </span>
                                    <input type="text" id="name" class="form-control ip-1 bg-light border-0" v-model="user.name" placeholder="eg: John">
                                </div>
                            </div>
                            <div class="mb-4">
                                <label for="email" class="form-label">Email</label>
                                <div class="input-group">
                                    <span class="input-group-text border-0" id="email-addon">
                                        <span class="fa fa-envelope"></span>
                                    </span>
                                    <input type="text" id="email" class="form-control ip-1 bg-light border-0" v-model="user.email" placeholder="eg: john@mail.com">
                                </div>
                            </div>
                            <div class="mb-4">
                                <label for="password" class="form-label">Password</label>
                                <div class="input-group">
                                    <span class="input-group-text border-0" id="password-addon">
                                        <span class="fas fa-lock"></span>
                                    </span>
                                    <input type="password" id="password" class="form-control ip-1 bg-light border-0" v-model="user.password" placeholder="eg: johnDoe11">
                                </div>
                            </div>
                            <div class="row justify-content-center">
                                <div class="col-6 col-md-4">
                                    <div class="d-grid gap-2">
                                        <button class="btn btn-sm btn-primary" type="submit">
                                            Create Account
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
                <p class="my-0 mb-3">
                    Already have an account?
                    <router-link :to="{ name: 'Login' }" class="text-decoration-none"> Login </router-link>
                </p>
                <p class="text-secondary text-sm text-center">
                    By clicking register you agree to our terms and conditions of using our services.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officiis ab optio expedita asperiores libero
                </p>
            </div>
        </div>
    </div>
</template>
<script>
import { reactive } from 'vue'
import axios from 'axios'
export default {
    name: "Register",
    setup() {
        // Input user information
        const user = reactive({
            name: '',
            email: '',
            password: '',
            error: '',
            loading: false
        })

        // send new user data to register
        const register = async() => {
            if (!user.name || !user.email || !user.password) return user.error = 'All Field are Required'
            user.error = ''
            user.loading = true
            const newUser = {
                name: user.name,
                email: user.email,
                password: user.password
            }
            try {
                const registerUser = await axios.post("/oauth/register", newUser)
                console.log(registerUser.data.message)
                const { data } = await axios.post("/oauth/login", { email: newUser.email, password: newUser.password })
                localStorage.setItem('username', data.user.name)
                localStorage.setItem('user_img', data.user.img)
                localStorage.setItem('token', data.token)
                window.location.href = "/"
            } catch (error) {
                user.password = ''
                user.loading = false
                user.error = error.response? error.response.data.message :error.message
            }
        }

        return { user, register }
    }
}
</script>