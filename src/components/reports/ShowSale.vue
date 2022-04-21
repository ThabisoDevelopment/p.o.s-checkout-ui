<template>
    <!-- Admin Navigationr Bar -->
    <navigation-bar />

    <div class="container-fluid">
        <div class="row">
            <!-- Setup Side menu bar for nav -->
            <side-menu-bar />

            <!-- Every thing else goes hear  -->
            <div class="col p-3">
                <div class="card border-0 mb-4">
                    <div class="card-header d-flex justify-content-between bg-secondary">
                        <router-link :to="{name: 'Sales', params: {id: sale.id}}" class="text-decoration-none text-warning">
                            <span class="fa fa-arrow-left pe-1"></span> Back
                        </router-link>
                        <p class="my-auto text-light">sale no: {{ sale.id }}</p>
                    </div>
                    <div class="card-body">
                        <h3 class="card-title">Sale No: {{ sale.id }}</h3>
                        <p class="card-text my-1">
                            Payment Method:
                            <span class="px-2 fw-bold text-success" v-if="sale.is_cash">
                                <span class="fa fa-coins pe-1"></span>Cash Money
                            </span>
                            <span class="px-2 fw-bold text-info" v-if="!sale.is_cash">
                                <span class="fa fa-credit-card pe-1"></span>Credit Card
                            </span>
                        </p>
                        <p class="card-text my-1">Item Quantity: <span class="fw-bold">{{ sale.count }}</span></p>
                        <div v-if="sale.is_cash">
                            <p class="card-text my-1">Cash Money: <span class="fw-bold cash-success">R{{ sale.cash }}</span></p>
                            <p class="card-text my-1">Cash Change: <span class="fw-bold text-danger">R{{ sale.cash_change }}</span></p>
                        </div>
                        <p class="card-text my-1">Total Price: <span class="fw-bold text-success">R{{ sale.total_price }}</span></p>

                        <div class="d-flex justify-content-between my-1">
                            <p class="my-auto">Cashier By: {{ sale.name }}</p>
                            <p class="my-auto"><span class="fa fa-envelope pe-2"></span>{{ sale.email }}</p>
                        </div>
                        <div class="d-flex justify-content-between my-1">
                            <p class="my-auto">DateTime: {{ sale.created_at }}</p>
                            <p class="my-auto">Last Updated: {{ sale.updated_at }}</p>
                        </div>
                    </div>
                </div>
                
                <ul class="list-group list-group-flush">
                    <li class="list-group-item fw-bold h5 my-0 py-3">Sale Products List</li>
                    <li class="list-group-item py-3 d-flex justify-content-between" v-for="item in sale.product_list" :key="item.id">
                        <span class="">Qty:<span class="fw-bold px-3">{{ item.quantity }}</span>{{ item.name }} {{ item.type }}</span>
                        <span class="">Total Price: <span class="fw-bold text-success">R{{ item.total_price }}</span></span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import NavigationBar from "@/components/home/NavigationBar.vue"
import SideMenuBar from "@/components/home/SideMenuBar.vue"
import { reactive } from '@vue/reactivity'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { notify } from '@kyvg/vue3-notification'
import { onMounted } from '@vue/runtime-core'
export default {
    components: { NavigationBar, SideMenuBar },
    setup() {
        const route = useRoute()

        const sale = reactive({
            id: route.params.id,
            loading: true,
            is_cash: 1,
            cash: 0,
            cash_change: '',
            count: '',
            total_price: '',
            created_at: '',
            updated_at: '',
            active: '',
            is_admin: '',
            name: '',
            email: '',
            product_list: []
        })

        const get_sale_by_id = async() => {
            try {
                const { data } = await axios.get(`/admin/sales/list/${route.params.id}`)
                sale.loading = data.loading
                sale.is_cash = data.is_cash
                sale.cash = data.cash
                sale.cash_change = data.cash_change
                sale.count = data.count
                sale.total_price = data.total_price
                sale.created_at = data.created_at
                sale.updated_at = data.updated_at
                sale.active = data.active
                sale.is_admin = data.is_admin
                sale.name = data.name
                sale.email = data.email
                data.product_list.forEach(item => sale.product_list.push(item))
                sale.loading = false
            } catch (error) {
                sale.loading = false
                notify({
                    title: 'Error Getting Sale',
                    type: 'error',
                    text: error.message
                })
            }
        }

        onMounted(()=> get_sale_by_id())
        return { sale }
    }
}
</script>