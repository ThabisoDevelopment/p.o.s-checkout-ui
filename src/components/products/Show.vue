<template>
    <!-- Admin Navigationr Bar -->
    <navigation-bar />

    <div class="container-fluid">
        <div class="row">
            <!-- Setup Side menu bar for nav -->
            <side-menu-bar />

            <!-- Every thing else goes hear  -->
            <div class="col p-3" v-if="!product.loading">
                <div class="row">
                    <div class="col-md-12">
                        <div class="card border-0">
                            <div class="card-header bg-secondary d-flex justify-content-between">
                                <router-link :to="{name: 'Products'}" class="text-decoration-none text-warning my-auto">
                                    <span class="fa fa-arrow-left"></span>
                                    Back
                                </router-link>
                                <p class="text-warning my-auto">Id: {{ product.id }}</p>
                            </div>
                            <div class="card-body">
                                <h2 class="card-title">Name: {{ product.name }}</h2>
                                <p class="card-text h4 my-2">Type: {{ product.type }}</p>
                                <p class="card-text my-2">Unit Price: <span class="fw-bold text-success">R{{ product.unit_price }}</span></p>
                                <p class="card-text my-2">
                                    Left in Stock:
                                    <span class="fw-bold text-success" v-if="product.quantity > 0">{{ product.quantity }}</span>
                                    <span class="fw-bold text-danger" v-if="product.quantity < 1">None</span>
                                </p>
                                <button class="card-link btn btn-warning btn-sm my-2 px-5" data-bs-toggle="modal" data-bs-target="#productStaticBackdrop">
                                    <span class="fa fa-pen pe-2"></span>
                                    edit
                                </button>
                                <div class="d-flex justify-content-between mt-2">
                                    <p class="my-1">Created:{{ product.created_at }}</p>
                                    <p class="my-1">Last Updated: {{ product.updated_at }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Loading componenent bar -->
            <Loading v-if="product.loading"/>
        </div>
    </div>

    <!-- Product Modal for Edit-->
    <div class="modal fade" id="productStaticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content border-0 shadow">
                <div class="modal-header bg-info">
                    <h5 class="modal-title h4 text-light" id="staticBackdropLabel">Edit Product</h5>
                    <button type="button" id="editModalDissmiss" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="get_product"></button>
                </div>
                <div class="modal-body">
                    <form action="#" method="post" @submit.prevent="updated_product">
                        <div class="mb-3">
                            <label for="name" class="form-label">Name</label>
                            <input type="text" id="name" class="form-control ip-1 bg-light" v-model="product.name">
                        </div>
                        <div class="mb-3">
                            <label for="type" class="form-label">type</label>
                            <input type="text" id="type" class="form-control ip-1 bg-light" v-model="product.type">
                        </div>
                        <div class="mb-4">
                            <label for="price" class="form-label">Unit Price</label>
                            <div class="input-group">
                                <span class="input-group-text" id="price-addon">
                                    R
                                </span>
                                <input type="text" id="price" class="form-control ip-1 bg-light" v-model="product.unit_price">
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <button class="btn btn-success col-6" type="submit">
                                submit
                                <span class="fa fa-paper-plane ps-2"></span>
                            </button>
                        </div>
                    </form>
                    <p class="text-center text-danger mt-4 mb-0" v-if="product.error">{{ product.error }}</p>
                </div>
            </div>
        </div>
    </div>

</template>
<script>
import NavigationBar from "@/components/home/NavigationBar.vue"
import SideMenuBar from "@/components/home/SideMenuBar.vue"
import Loading from "@/components/Loading.vue"
import { reactive } from '@vue/reactivity'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { notify } from '@kyvg/vue3-notification'
import { onMounted } from '@vue/runtime-core'
export default {
    components: { NavigationBar, SideMenuBar, Loading },
    setup() {

        const product = reactive({
            loading: false,
            id: '',
            name: '',
            type: '',
            unit_price: '',
            quantity: '',
            created_at: '',
            updated_at: '',
            error: ''
        })

        const route = useRoute()
        const get_product = async() => {
            try {
                product.loading = true
                const { data } = await axios.get(`/admin/products/${route.params.id}`)
                product.id = route.params.id
                product.name = data.name
                product.type = data.type
                product.unit_price = data.unit_price
                product.quantity = data.quantity
                product.created_at = data.created_at
                product.updated_at = data.updated_at
                product.loading = false
                product.error = ''
            } catch (error) {
                product.loading = false
                const errorMessage = error.response? error.response.data :error
                notify({
                    title: 'Getting  Product Error',
                    text: errorMessage,
                    type: 'error'
                })
            }
        }
        onMounted(()=> get_product())

        const updated_product = async() => {
            try {
                const product_data = {
                    name: product.name,
                    type: product.type,
                    unit_price: product.unit_price
                }
                const { data } = await axios.put(`/admin/products/${route.params.id}`, product_data)
                product.error = ''
                document.querySelector('#editModalDissmiss').click()
                notify({
                    title: 'Getting  Product Error',
                    text: data.message,
                    type: 'success'
                })
            } catch (error) {
                const errorMessage = error.response? error.response.data :error
                product.error = errorMessage
                notify({
                    title: 'Getting  Product Error',
                    text: errorMessage,
                    type: 'error'
                })
            }
        }
        return {
            product,
            get_product,
            updated_product
        }
    }
}
</script>