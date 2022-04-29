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
                        <router-link class="nav-link text-light h5 my-auto" :to="{ name: 'Products' }">Store Products</router-link>
                    </li>
                    <li class="nav-item my-auto">
                        <router-link class="nav-link text-warning" :to="{ name: 'CreateProduct' }">
                            <span class="fa fa-shopping-cart"></span>
                            Create Product
                        </router-link>
                    </li>
                    <li class="nav-item my-auto px-3 ms-auto">
                        <div class="input-group shadow-sm">
                            <span class="input-group-text bg-light border-0" id="addon-wrapping"><span class="fa fa-search"></span></span>
                            <input type="text" aria-label="search" aria-describedby="addon-wrapping" placeholder="search..." class="form-control bg-light border-0 ip-1"
                                v-model="products.search"
                                @input="search_products"
                                @keypress.enter="search_products"
                            >
                        </div>
                    </li>
                </ul>

                <div class="row px-3 py-2 border-bottom border-w-3">
                    <div class="col-1 px-3 fw-bold">#</div>
                    <div class="col-3 px-3 fw-bold">Name</div>
                    <div class="col-3 px-3 fw-bold">Type</div>
                    <div class="col-3 px-3 fw-bold">Unit Price</div>
                    <div class="col-2 px-3 fw-bold">In Stock</div>
                </div>

                <div class="row px-3">
                    <div class="col-12" v-for="product in products.data" :key="product.id">
                        <router-link :to="{ name: 'ShowProduct', params: { id: product.id }}" class="row border-bottom text-decoration-none text-dark">
                            <div class="col-1 px-3 py-3">{{ product.id }}</div>
                            <div class="col-3 px-3 py-3">{{ product.name }}</div>
                            <div class="col-3 px-3 py-3">{{ product.type }}</div>
                            <div class="col-3 px-3 py-3">R{{ product.unit_price }}</div>
                            <div class="col-2 px-3 py-3 fw-bold text-success" v-if="product.quantity > 0">{{ product.quantity }}</div>
                            <div class="col-2 px-3 py-3 fw-bold text-danger" v-if="product.quantity < 1">None</div>
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
import axios from 'axios'
import { reactive } from '@vue/reactivity'
import { notify } from '@kyvg/vue3-notification'
import { onMounted } from '@vue/runtime-core'
export default {
    components: { NavigationBar, SideMenuBar },
    setup() {

        const products = reactive({
            loading: true,
            data: [],
            search: '',
            timeout_search: ''
        })

        const get_products = async() => {
            try {
                products.data = []
                const { data } = await axios.get('/admin/products')
                data.forEach(product => products.data.push(product))
                products.loading = false
            } catch (error) {
                products.loading = false
                const errorMessage = error.response? error.response.data :error
                notify({
                    title: 'Getting  Products Error',
                    text: errorMessage,
                    type: 'error'
                })
            }
        }
        onMounted(()=> get_products())

        const search_products = () => {
            if (!products.search || products.search == null) return get_products()
            clearTimeout(products.timeout_search)
            products.timeout_search = setTimeout(async()=> {
                try {
                    const { data } = await axios.get(`/admin/products?search=${products.search}`)
                    products.data = []
                    data.forEach(product => products.data.push(product))
                    products.loading = false
                } catch (error) {
                    products.loading = false
                    const errorMessage = error.response? error.response.data :error
                    notify({
                        title: 'Searching Products Error',
                        text: errorMessage,
                        type: 'error'
                    })
                }
            }, 2500)
        }

        return {
            products,
            search_products
        }
    }
}
</script>