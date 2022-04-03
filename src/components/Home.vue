<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light mb-3">
        <div class="container">
            <router-link class="navbar-brand" :to="{ name: 'Home'}">
                <span class="fw-bold h3 text-dark">P.O.S SYSTEM</span>
                <small class="text-sm px-1">by anestordev</small>
            </router-link>

            <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                <li class="nav-item dropdown">
                    <router-link to="#" class="nav-link dropdown-toggle" id="navbarDropdownMenu" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <span class="fa fa-user"></span>
                        {{ user.name }}
                    </router-link>
                    <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenu">
                        <li>
                            <button class="dropdown-item" @click="logout">
                                <span class="fa fa-sign-out-alt"></span>
                                logout
                            </button>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </nav>

    <div class="container mb-5">
        <div class="row">
            <div class="col-12">
                <p class="text-center mt-3 mb-4 display-6">Hello {{ user.name }}, Welcome Back!</p>
                <!-- <p class="text-center">Hello Motherfucker. Hey, Hi How you do'ern?</p> -->
            </div>
        </div>

        <div class="row justify-content-center">
            <div class="col-md-5">
                <router-link :to="{ name: 'Checkout' }" class="card text-decoration-none text-dark border-0 shadow h-100">
                    <div class="card-body">
                        <h2 class="card-title">Store Checkout</h2>
                        <p class="card-text">This option link you to the checkout point of sale where you can make purchase to product that are in store</p>
                        <p class="card-text text-success">
                            Not Restricted
                            <span class="fa fa-unlock"></span>
                        </p>
                    </div>
                </router-link>
            </div>

            <div class="col-md-5">
                <router-link :to="{ name: 'Admin' }" class="card text-decoration-none text-dark border-0 shadow h-100">
                    <div class="card-body">
                        <h2 class="card-title">Store Management</h2>
                        <p class="card-text">This is a store management link only store managers will be able to access this area</p>
                        <p class="card-text text-secondary" v-if="!user.is_admin">
                            Aceess Restricted
                            <span class="fa fa-lock"></span>
                        </p>
                        <p class="card-text text-success" v-if="user.is_admin">
                            Not Restricted
                            <span class="fa fa-unlock"></span>
                        </p>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>
<script>
import { reactive } from '@vue/reactivity'
import axios from 'axios'
import { onMounted } from '@vue/runtime-core'
import { notify } from '@kyvg/vue3-notification'
export default {
    setup() {
        const user = reactive({
            name: '',
            is_admin: false
        })

        onMounted(async() => {
            try {
                const { data } = await axios.get("/user")
                user.name = data.name
                user.is_admin = data.is_admin
                if (!data.email_verified) notify({
                    title: "Verify Email",
                    text: `Please look into your mail inbox and click the link to verify your email address`,
                    type: 'info'
                })
            } catch (error) {
                notify({
                    title: "Getting User Error",
                    text: error.message,
                    type: 'error'
                })
            }
            
        })

        const logout = ()=> {
            localStorage.removeItem('token')
            localStorage.removeItem('username')
            window.location.href = '/login'
        }
        return { user, logout }
    }
}
</script>