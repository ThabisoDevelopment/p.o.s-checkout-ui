<template>
    <!-- Admin Navigationr Bar -->
    <navigation-bar />

    <div class="container-fluid">
        <div class="row">
            <!-- Setup Side menu bar for nav -->
            <side-menu-bar />

            <!-- Every thing else goes hear  -->
            <div class="col p-0">
                <ul class="nav mb-4 sticky-top bg-navtaps shadow p-2 rounded-bottom">
                     <li class="nav-item my-auto">
                        <router-link class="nav-link text-warning" :to="{ name: 'Users' }">
                            <span class="fa fa-arrow-left"></span>
                            Back
                        </router-link>
                    </li>
                    <li class="nav-item my-auto">
                        <router-link class="nav-link text-light h5 my-auto" :to="{ name: 'Users' }">Admin Users Settings</router-link>
                    </li>
                </ul>

                <div class="row px-3">
                    <div class="col-md-6">
                        <div class="card border-0">
                            <div class="card-header bg-navtaps text-light fw-bold">User Information</div>
                            <div class="card-body">
                                <h4 class="card-title">Name: {{ user.name }}</h4>
                                <p class="card-text my-1">Email: {{ user.email }}</p>
                                <p class="card-text my-1 text-center text-danger" v-if="!user.email_verified">
                                    <span>Email have not been verifid, check your inbox for verification link</span>
                                    <button class="btn btn-link text-decoration-none btn-sm">Resent Verification Link</button>
                                </p>
                                <p class="card-text my-1" v-if="user.active">user {{ user.name }} account is currently <span class="text-success">active</span></p>
                                <p class="card-text my-1" v-if="!user.active">User {{ user.name }} account is <span class="text-danger">not active</span> or <span class="text-danger">deactivated</span></p>
                                <p class="card-text my-1" v-if="user.is_admin">Role: <span class="fw-bold text-success">Manager | Admin</span></p>
                                <p class="card-text my-1" v-if="!user.is_admin">Role: <span class="fw-bold text-info">Cashier</span></p>
                                <div class="d-flex justify-content-between">
                                    <p class="my-auto">Created: {{ user.created_at }}</p>
                                    <p class="my-auto">Last Updated: {{ user.updated_at }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-6">
                        <div class="card border-0">
                            <div class="card-header bg-danger border-0 text-light fw-bold">User Settings | Config</div>
                            <div class="card-body">
                                <p class="card-text my-1">User Have to be assign a role of Manager/Admin or Cashier</p>
                                <p class="card-text my-1">
                                    Current Role:
                                    <span class="fw-bold text-success" v-if="user.is_admin">Manager | Admin</span>
                                    <span class="fw-bold text-info" v-if="!user.is_admin">Cashier</span>
                                </p>
                                <button class="btn btn-sm btn-primary card-link my-2" :disabled="user.btn" @click="update_user('role')">
                                    Change User Role
                                </button>
                                <p class="card-text my-1 text-info text-sm" v-if="user.is_admin">Note: Role Admin access has no restriction</p>
                                <p class="card-text my-1 text-info text-sm" v-if="!user.is_admin">Note: Role cashier can only access checkout</p>

                                <div class="d-flex justify-content-between mt-4">
                                    <p class="my-auto h5" v-if="user.active">User account is currently active</p>
                                    <p class="my-auto h5 text-danger" v-if="!user.active">User account is currently De-activated</p>
                                    <button class="btn btn-sm px-3" :disabled="user.btn" :class="{'btn-danger': user.active, 'btn-success': !user.active }" @click="update_user('active')">
                                        <span v-if="user.active">De-activate Account</span>
                                        <span v-if="!user.active">Activate Account</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import NavigationBar from "@/components/home/NavigationBar.vue"
import SideMenuBar from "@/components/home/SideMenuBar.vue"
import { reactive } from '@vue/reactivity'
import { useRoute } from 'vue-router'
import { onMounted } from '@vue/runtime-core'
import axios from 'axios'
import { notify } from '@kyvg/vue3-notification'
export default {
    components: { NavigationBar, SideMenuBar },
    setup() {
        const user = reactive({
            loading: true,
            id: '',
            name: '',
            email: '',
            email_verified: false,
            active: false,
            is_admin: false,
            created_at: '',
            updated_at: '',
            btn: false
        })

        const route = useRoute()
        onMounted(async() => {
            try {
                const { data } = await axios.get(`/admin/users/${route.params.id}`)
                user.id = route.params.id
                user.name = data.name
                user.email = data.email
                user.email_verified = data.email_verified
                user.active = data.active
                user.is_admin = data.is_admin
                user.created_at = data.created_at
                user.updated_at = data.updated_at
                user.loading = false
            } catch (error) {
                user.loading = false
                notify({
                    title: 'Error Getting user',
                    type: 'error',
                    text: error
                })
            }
        })

        const update_user = async(option) => {
            try {
                user.btn = true
                const user_data = {
                    is_admin: user.is_admin? true: false,
                    active: user.active? true: false
                }
                if(option == 'role') user_data.is_admin = !user.is_admin
                if(option == 'active') user_data.active = !user.active
                const { data } = await axios.put(`/admin/users/${route.params.id}`, user_data)
                user.is_admin = user_data.is_admin
                user.active = user_data.active
                user.btn = false
                notify({
                    title: 'Updating User Successful',
                    type: 'success',
                    text: data.message
                })
            } catch (error) {
                user.btn = false
                notify({
                    title: 'Error Updating User',
                    type: 'error',
                    text: error
                })
            }
        }

        return {
            user,
            update_user
        }
    }
}
</script>