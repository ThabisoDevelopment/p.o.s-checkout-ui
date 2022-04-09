<template>
    <!-- Admin Navigationr Bar -->
    <navigation-bar />

    <div class="container-fluid">
        <div class="row">
            <!-- Setup Side menu bar for nav -->
            <side-menu-bar />

            <!-- Every thing else goes hear  -->
            <div class="col py-2">
                <ul class="nav mb-2">
                    <li class="nav-item">
                        <router-link class="nav-link d-flex text-dark fw-bold px-0" :to="{ name: 'Users' }">
                            <div class="dropdown">
                                <button class="btn btn-outline-secondary text-capitalize px-4 border-w-3 dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                    {{ users.filter_by }}
                                </button>
                                <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton1">
                                    <li><button class="dropdown-item" @click="get_users('all')">All</button></li>
                                    <li><button class="dropdown-item" @click="get_users('admin')">Manager / Admin</button></li>
                                    <li><button class="dropdown-item" @click="get_users('cashier')">Cashier</button></li>
                                    <li><button class="dropdown-item" @click="get_users('active')">Active Accounts</button></li>
                                    <li><button class="dropdown-item" @click="get_users('deactive')">Deactive Accounts</button></li>
                                </ul>
                            </div>
                            <p class="my-auto px-3 h4 fw-bold">Store Users</p>
                        </router-link>
                    </li>
                </ul>

                <div class="row">
                    <div class="col-12" v-for="user in users.data" :key="user.id">
                        <div class="card border-0 mb-3">
                            <div class="card-body">
                                <p class="card-title my-1 fw-bold"> <span class="fa fa-user pe-2"></span>{{ user.name }}</p>
                                <p class="card-text my-1"> <span class="fa fa-envelope pe-2"></span>{{ user.email }}</p>
                                <div class="d-flex justify-content-between my-2" v-if="user.active">   
                                    <p class="card-text text-success my-0"><span class="fa fa-unlock pe-2"></span>Acount active</p>
                                    <p class="card-text text-info my-0 fw-bold" v-if="user.is_admin">Manager / Admin</p>
                                    <p class="card-text text-info my-0 fw-bold" v-if="!user.is_admin">Cashier</p>
                                </div>
                                <p class="card-text text-danger my-2" v-if="!user.active"><span class="fa fa-lock pe-2"></span>Account deactive</p>
                                <div class="d-flex justify-content-between mt-3">
                                    <button class="btn card-link btn-sm btn-outline-info" data-bs-toggle="modal" data-bs-target="#userStaticBackdrop" @click="choose_user(user)">account settings</button>
                                    <p class="text-sm my-auto">Last Updated: {{ user.updated_at }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- user settings modal -->
    <div class="modal fade" id="userStaticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="userStaticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header border-0">
                    <h5 class="modal-title fw-bold" id="userStaticBackdropLabel">User Settings</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body border-0 py-1  ">
                    <p class="my-2">Name: <span class="fw-bold">{{ users.current.name }}</span></p>
                    <p class="mt-2 mb-3">Email: <span class="fw-bold">{{ users.current.email }}</span></p>
                    <div class="form-check form-switch mb-2">
                        <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckAdmin" v-model="users.current.is_admin" @input="update_user('is_admin')">
                        <label class="form-check-label" for="flexSwitchCheckAdmin">
                            <span class="ps-2" v-if="users.current.is_admin">Manager / Admin</span>
                            <span class="ps-2" v-if="!users.current.is_admin">Cashier</span>
                        </label>
                    </div>
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckActive" v-model="users.current.active" @input="update_user('active')">
                        <label class="form-check-label" for="flexSwitchCheckActive">
                            <span class="ps-2 text-info" v-if="users.current.active">Account Active</span>
                            <span class="ps-2 text-danger" v-if="!users.current.active">Account Deactive</span>
                        </label>
                    </div>
                </div>
                <div class="modal-footer border-0 pt-1">
                    <button type="button" class="btn btn-sm btn-outline-danger px-3" data-bs-dismiss="modal">
                        <span class="fa fa-times pe-2"></span>
                        close
                    </button>
                </div>
            </div>
        </div>
    </div>

</template>
<script>
import NavigationBar from "@/components/home/NavigationBar.vue"
import SideMenuBar from "@/components/home/SideMenuBar.vue"
import { onMounted, reactive } from '@vue/runtime-core'
import axios from 'axios'
import { notify } from '@kyvg/vue3-notification'
export default {
    components: { NavigationBar, SideMenuBar },
    setup() {

        const users = reactive({
            data: [],
            current: {
                id: '',
                name: 'Thabiso',
                email: 'shabangu@email.com',
                active: 0,
                is_admin: 0
            },
            filter_by: "all"
        })

        const get_users = async(filter='')=> {
            try {
                users.data = []
                users.filter_by = filter
                const { data } = await axios.get(`/admin/users?by=${filter}`)
                data.forEach(user => users.data.push(user))
            } catch (error) {
                notify({
                    title: "Internal Server Error",
                    text: error.message,
                    type: "error"
                })
            }
        }
        onMounted(()=> get_users('all'))

        const choose_user = user => {
            users.current.id = user.id
            users.current.name = user.name
            users.current.email = user.email
            users.current.active = user.active ? true : false
            users.current.is_admin = user.is_admin ? true : false
        }

        const update_user = async(option)=> {
            try {
                const inputData = {
                    active: users.current.active,
                    is_admin: users.current.is_admin
                }
                if (!users.current.id) throw 'sorry something went wrong! try reload the page'
                if (option == 'active') inputData.active = !inputData.active
                if (option == 'is_admin') inputData.is_admin = !inputData.is_admin
                if (!users.current.id) throw 'sorry something went wrong! try reload the page'
                const { data } = await axios.put(`/admin/users/${users.current.id}`, inputData)
                const index = users.data.findIndex(item => item.id == users.current.id)
                users.data[index].active = inputData.active
                users.data[index].is_admin = inputData.is_admin
                notify({
                    title: 'User Updated Successful',
                    text: data.message,
                    type: 'success'
                })
            } catch (error) {
                const errorMessage = error.response? error.response.data.message :error.message
                notify({
                    title: "User Update Error",
                    text: errorMessage,
                    type: 'error'
                })
            }
        }

        return { users, choose_user, update_user, get_users }
    }
}
</script>