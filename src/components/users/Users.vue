<template>
    <!-- Admin Navigationr Bar -->
    <navigation-bar />

    <div class="container-fluid">
        <div class="row">
            <!-- Setup Side menu bar for nav -->
            <side-menu-bar />

            <!-- Every thing else goes hear  -->
            <div class="col p-0">
                <ul class="nav mb-3 sticky-top bg-navtaps shadow p-2 rounded-bottom">
                    <li class="nav-item my-auto">
                        <router-link class="nav-link text-light h5 my-auto" :to="{ name: 'Users' }">Store Users</router-link>
                    </li>
                    <li class="nav-item my-auto px-3 ms-auto">
                        <div class="input-group shadow-sm">
                            <span class="input-group-text bg-light border-0" id="addon-wrapping"><span class="fa fa-search"></span></span>
                            <input type="text" aria-label="search" aria-describedby="addon-wrapping" placeholder="search..." class="form-control bg-light border-0 ip-1"
                                v-model="users.search"
                                @input="search_users"
                                @keypress.enter="search_users"
                            >
                        </div>
                    </li>
                </ul>

                <!-- Loop through all users data to show users in list order -->
                <div class="row px-3">
                    <div class="col-12" v-for="user in users.data" :key="user.id">
                        <router-link class="card border-0 mb-3 text-decoration-none text-dark" :to="{name: 'UserSettings', params: {id: user.id}}">
                            <div class="card-body">
                                <div class="d-flex justify-content-between">
                                    <p class="card-title my-auto fw-bold"> <span class="fa fa-user pe-2"></span>{{ user.name }}</p>
                                    <span class="my-auto bg-success rounded-circle p-2" v-if="user.active"></span>
                                    <span class="my-auto bg-primary rounded-circle p-2" v-if="!user.active"></span>
                                </div>
                                <p class="card-text my-1"> <span class="fa fa-envelope pe-2"></span>{{ user.email }}</p>
                                <div class="d-flex justify-content-between">
                                    <p class="card-text text-sm my-auto">Last Updated: {{ user.updated_at }}</p>
                                    <p class="my-auto text-sm text-success" v-if="user.is_admin">Manager | Admin</p>
                                    <p class="my-auto text-sm text-muted" v-if="!user.is_admin">Cashier</p>
                                </div>
                            </div>
                        </router-link>
                    </div>
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
            loading: true,
            search: '',
            timesearch: '',
            data: []
        })

        const get_users = async ()=> {
            try {
                users.loading = true
                users.data = []
                const { data } = await axios.get("/admin/users")
                data.forEach(user => users.data.push(user))
                users.loading = false
            } catch (error) {
                users.loading = false
                notify({
                    title: "Internal Server Error",
                    text: error.message,
                    type: "error"
                })
            }
        }
        onMounted(()=> get_users())

        const search_users = () => {
            clearTimeout(users.timesearch)
            users.timesearch = setTimeout(async()=> {
                try {
                    if (!users.search | users.search == null) return get_users()
                    const { data } = await axios.get(`/admin/users?search=${users.search}`)
                    users.data = []
                    data.forEach(user => users.data.push(user))
                    console.log(data)
                    users.loading = false
                } catch (error) {
                    users.loading = false
                    notify({
                        title: "Internal Server Error",
                        text: error,
                        type: "error"
                    })
                }
            },2500)
        }

        return { 
            users,
            search_users
        }
    }
}
</script>