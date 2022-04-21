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
                        <router-link class="nav-link text-warning" :to="{ name: 'Reports' }">
                            <span class="fa fa-arrow-left"></span>
                            Back
                        </router-link>
                    </li>
                    <li class="nav-item my-auto">
                        <router-link class="nav-link text-light h4 my-auto" :to="{ name: 'Sales' }">All Sales Reports</router-link>
                    </li>
                </ul>

                <div class="row px-3">
                    <div class="col-md-6 mb-4" v-for="sale in sales.data" :key="sale.id">
                        <router-link :to="{ name: 'ShowSale', params: {id: sale.id }}" class="card h-100 border-0 text-decoration-none text-dark">
                            <div class="card-body">
                                <div class="d-flex justify-content-between mb-2">
                                    <h4 class="card-title my-auto">Sale No: {{ sale.id }}</h4>
                                    <p class="text-success fw-bold h5 my-auto" v-if="sale.is_cash">
                                        <span class="fa fa-coins pe-1"></span>CASH
                                    </p>
                                    <p class="text-info fw-bold h5 my-auto" v-if="!sale.is_cash">
                                        <span class="fa fa-credit-card pe-1"></span>CARD
                                    </p>
                                </div>
                                <div class="d-flex justify-content-between mb-1">
                                    <p class="card-text my-auto">Total Items: <span class="fw-bold text-dark">{{ sale.count }}</span></p>
                                    <p class="card-text my-auto" v-if="sale.is_cash">Cash Money: <span class="fw-bold text-primary">R{{ sale.cash }}</span></p>
                                </div>
                                <div class="d-flex justify-content-between mb-2">
                                    <p class="card-text my-auto">Total Price: <span class="fw-bold text-success">R{{ sale.total_price }}</span></p>
                                    <p class="card-text my-auto" v-if="sale.is_cash">Change: <span class="fw-bold text-danger">R{{ sale.cash_change }}</span></p>
                                </div>
                                <!-- <p class="card-text my-1">Cashier: {{ sale.name }}</p> -->
                                <div class="d-flex justify-content-between">
                                    <p class="my-0">Date: {{ sale.created_at }}</p>
                                    <p class="my-0">Updated: {{ sale.updated_at }}</p>
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
import { reactive } from '@vue/reactivity'
import axios from 'axios'
import { notify } from '@kyvg/vue3-notification'
import { onMounted } from '@vue/runtime-core'
export default {
    components: { NavigationBar, SideMenuBar },
    setup() {

        const sales = reactive({
            loading: false,
            data: []
        })
        
        const get_sales = async() => {
            try {
                sales.loading = true
                const { data } = await axios.get('/admin/sales')
                data.forEach(item => sales.data.push(item))
                sales.loading = false
            } catch (error) {
                notify({
                    title: 'Getting Sales Error',
                    type: 'error',
                    text: error.message
                })
            }
        }

        onMounted(()=> get_sales())
        return {
            sales
        }
    }
}
</script>