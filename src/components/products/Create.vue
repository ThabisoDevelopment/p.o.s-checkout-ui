<template>
    <!-- Admin Navigationr Bar -->
    <navigation-bar />

    <div class="container-fluid">
        <div class="row">
            <!-- Setup Side menu bar for nav -->
            <side-menu-bar />

            <!-- Every thing else goes hear  -->
            <div class="col p-3">
                <div class="row">
                    <div class="col-md-7">
                        <div class="card border-0">
                            <div class="card-header bg-info d-flex justify-content-between py-3">
                                <router-link :to="{name: 'Products'}" class="text-decoration-none text-warning my-auto">
                                    <span class="fa fa-arrow-left"></span>
                                    Back
                                </router-link>
                                <p class="text-light h4 my-auto">Creating New Product</p>
                            </div>
                            <div class="card-body">
                                <form action="#" method="post" @submit.prevent="create_product">
                                    <div class="mb-0 mt-2">
                                        <label for="barcode" class="form-label">Barcode</label>
                                        <div class="input-group">
                                            <input type="text" id="barcode" class="form-control ip-1 bg-light" placeholder="eg: 00000000000"
                                                v-model="product.barcode"
                                                :disabled="product.scanner"
                                                :class="{'border-muted': product.scanner, 'border-success': !product.scanner}"
                                                >
                                            <button class="btn" type="button" id="barcode-addon"
                                                :class="{'btn-success': product.scanner, 'btn-secondary': !product.scanner}"
                                                @click="product.scanner=!product.scanner">
                                                <span class="fa fa-barcode"></span>
                                                Use Scanner
                                            </button>
                                        </div>
                                        <p class="my-2 text-center text-sm text-info" v-if="product.scanner">Barcode input will be filled using a scanner</p>
                                        <p class="my-2 text-center text-sm text-success" v-if="!product.scanner">Barcode input data will be filled manually by typing</p>
                                    </div>
                                    <div class="mb-3">
                                        <label for="name" class="form-label">Name</label>
                                        <input type="text" id="name" class="form-control ip-1 bg-light" v-model="product.name" placeholder="eg: amstel">
                                    </div>
                                    <div class="mb-3">
                                        <label for="type" class="form-label">type</label>
                                        <input type="text" id="type" class="form-control ip-1 bg-light" v-model="product.type" placeholder="eg: 750ml">
                                    </div>
                                    <div class="mb-4">
                                        <label for="price" class="form-label">Unit Price</label>
                                        <div class="input-group">
                                            <span class="input-group-text" id="price-addon">
                                                R
                                            </span>
                                            <input type="text" id="price" class="form-control ip-1 bg-light" v-model="product.unit_price" placeholder="eg: 00.00">
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

                    <div class="col-md-5">
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item fw-bold h5 my-0 py-3">Recently Created Products</li>
                            <li class="list-group-item py-3 d-flex justify-content-between" v-for="item in product.list" :key="item.id">
                                <span>{{ item.name }} {{ item.type }}</span>
                                <span class="">Unit Price: <span class="fw-bold text-success">R{{ item.unit_price }}</span></span>
                            </li>
                            <li class="list-group-item text-center text-danger my-0 py-5" v-if="product.list.length <1">
                                there are no recently created product items
                            </li>
                        </ul>
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
export default {
    components: { NavigationBar, SideMenuBar },
    setup() {

        const product = reactive({
            loading: false,
            scanner: false,
            barcode: '',
            name: '',
            type: '',
            unit_price: '',
            list: [],
            error: ''
        })

        const create_product = async() => {
            try {
                const product_data = {
                    barcode: product.barcode,
                    name: product.name,
                    type: product.type,
                    unit_price: product.unit_price
                }
                const { data } = await axios.post("/admin/products", product_data)
                const message = data.message
                const { data: recent } = await axios.get(`/admin/products/${data.id}`)
                product.list.push(recent)
                product.loading = false
                product.barcode = ''
                product.name = ''
                product.type = ''
                product.unit_price = ''
                product.error = ''
                notify({
                    title: 'New Product Created Successful',
                    type: 'success',
                    text: message
                })
            } catch (error) {
                product.loading = false
                const errorMessage = error.response? error.response.data :error
                product.error = errorMessage
                notify({
                    title: 'Create Products Error',
                    text: errorMessage,
                    type: 'error'
                })
            }
        }

        return {
            product,
            create_product
        }
    }
}
</script>