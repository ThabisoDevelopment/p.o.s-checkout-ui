<template>
    <!-- Checkout Navbar Navigation -->
    <Navigation />

    <div class="container mb-4">
        <div class="row">
            <div class="col-md-6 px-2">
                <div class="row bg-secondary rounded mb-3 py-3">
                    <div class="col-4 text-light">Name</div>
                    <div class="col-2 text-light">Type</div>
                    <div class="col-2 text-light">QTY</div>
                    <div class="col-2 text-light">Price</div>
                    <div class="col-2"></div>
                </div>

                <div class="row py-2 border-bottom" v-for="product in checkout.products" :key="product.id">
                    <div class="col-4 my-auto">{{ product.name }}</div>
                    <div class="col-2 my-auto">{{ product.type }}</div>
                    <div class="col-2 my-auto">
                        <input type="text" class="form-control" @input="update_product_qty(product)" v-model="product.qty">
                    </div>
                    <div class="col-2 my-auto">R{{ product.total_price.toFixed(2) }}</div>
                    <div class="d-grid col-2 mx-auto">
                        <button class="btn btn-outline-danger border-0" @click="remove_product_item(product.id)">
                            <span class="fa fa-trash"></span>
                        </button>
                    </div>
                </div>
                <div class="row mt-5" v-if="checkout.products.length>0">
                    <div class="col-4 p-0">
                        <button class="btn btn-outline-secondary" @click="clear_checkout">clear cart</button>
                    </div>
                </div>
            </div>

            <div class="col-md-6">
                <div class="card border-w-3 shadow" :class="{'border-warning': checkout.is_cash, 'border-primary': !checkout.is_cash }">
                    <div class="card-header border-0 btn-group p-0">
                        <button class="btn rounded-0 btn-warning fw-bold text-dark btn-lg" @click="cash_card_toggler('cash')">CASH MONEY</button>
                        <button class="btn rounded-0 btn-primary fw-bold text-light btn-lg" @click="cash_card_toggler('card')">CREDIT CARD</button>
                    </div>
                    <div class="card-body pb-3" >
                        <form action="#" method="post" @submit.prevent="sale_checkout">
                            <div class="input-group mb-5">
                                <span class="input-group-text border-0">COUPON</span>
                                <input type="text" aria-label="coupon" class="form-control fw-bold ip-1 border-0" v-model="coupon.code">
                                <button class="btn border-0 btn-secondary px-3 border-0" type="button" @click="verify_coupon">apply</button>
                            </div>
                            <p class="card-text h4 mb-4" v-if="coupon.exist">Coupon Price: <span class="text-danger fw-bold">-R{{ coupon.price.toFixed(2) }}</span></p>
                            <div class="d-flex justify-content-between align-item-center mb-3">
                                <p class="card-text h3">Total Price: <span class="text-success fw-bold">R{{ checkout.total_price.toFixed(2) }}</span></p>
                                <p class="card-text h3" v-if="checkout.is_cash && checkout.cash_change>0">Change: <span class="text-primary fw-bold">R{{ checkout.cash_change.toFixed(2) }}</span></p>
                            </div>
                            <div class="input-group mb-3" v-if="checkout.is_cash">
                                <span class="input-group-text fw-bold">CASH</span>
                                <span class="input-group-text fw-bold pe-0">R</span>
                                <input type="text" aria-label="cash" class="form-control fw-bold ip-1 border-start-0" placeholder="0.00" 
                                @input="calculate_change"
                                @keyup.enter="submit"
                                v-model="checkout.cash">
                            </div>
                            <div class="d-grid col-10 mx-auto">
                                <button class="btn btn-lg" type="submit" :class="{'btn-success': checkout.active, 'btn-secondary': !checkout.active }">
                                    <span v-if="!checkout.loading">checkout</span>
                                    <span v-if="checkout.loading" class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    </div>

    
    <!-- Modal for when checkout is complete - like a short version of a slip -->
    <button type="button" style="display:none;" id="modalCheckoutShow" data-bs-toggle="modal" data-bs-target="#checkoutModal"></button>
    <div class="modal fade" id="checkoutModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title fw-bold" id="staticBackdropLabel">{{ checkout.message }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p class="" v-for="item in checkout.products" :key="item.id">
                        <span class="pe-2 fw-bold">{{ item.qty }}</span>
                        <span class="">{{ item.name }}</span>
                    </p>
                    <h3 class="mb-2">Total Price: <span class="ps-2">R{{ checkout.total_price.toFixed(2) }}</span></h3>
                    <h3 class="mb-2" v-if="checkout.is_cash">Change: <span class="fw-bold ps-2 text-success">R{{ checkout.cash_change.toFixed(2) }}</span></h3>
                </div>
                <div class="modal-footer border-0 pt-0">
                    <div class="d-grid col-8 mx-auto">
                        <button type="button" id="modalDissmissBtn" class="btn btn-primary" data-bs-dismiss="modal" @click="clear_checkout">Clear Checkout</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- This modal for entering barcode to find product if scanner occured an error -->
    <div class="modal fade" id="addByBarcodeModal" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addByBarcodeLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header border-0">
                    <h5 class="modal-title h4 fw-bold" id="addByBarcodeLabel">Enter Barcode For Product</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form action="#" method="post" class="row" @submit.prevent="find_product_by_enter_barcode">
                        <div class="input-group mb-3 border-0">
                            <span class="input-group-text border-0">Barcode</span>
                            <input type="text" aria-label="coupon" class="form-control fw-bold ip-1 border-0" v-model="find_product.barcode">
                        </div>
                        <p class="my-2" v-if="find_product.name">
                            <span class="fa fa-check-square"></span>
                            {{ find_product.name }} - {{ find_product.type }} - R{{ find_product.unit_price }}
                        </p>
                        <div class="btn-group col-12 mt-3" role="group">
                            <button class="btn btn-secondary" type="submit">
                                <span>find product</span>
                                <span class="fa fa-search ps-2"></span>
                                <span v-if="checkout.loading" class="spinner-grow spinner-grow-sm ps-2" role="status" aria-hidden="true"></span>
                            </button>
                            <button class="btn btn-primary" @click="get_product_by_barcode(find_product.b_code)">
                                <span class="fa fa-plus pe-2"></span>
                                add to cart
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

</template>
<script>
import Navigation from "@/components/checkout/Navigation.vue"
import { reactive } from '@vue/reactivity'
import axios from 'axios'
import { onMounted } from '@vue/runtime-core'
import { notify } from "@kyvg/vue3-notification"
export default {
    components: { Navigation },
    setup(){

        /** Checout variables */
        const checkout = reactive({
            loading: false,
            active: false,
            is_cash: true,
            products: [],
            total_price: 0.00,
            cash: '',
            cash_change: 0.00,
            message: ''
        })

        const coupon = reactive({
            exist: false,
            code: '',
            price: 0.00
        })
        const verify_coupon = async()=> {
            try {
                if (!coupon.exist) throw 'Sorry! coupon are not availabe right now!'
                const code = { coupon_code : coupon.code }
                const { data } = await axios.post(`/coupon/verify`, code)
                /**
                 * expected results
                 * valid, code, price
                 */
                console.log(data)
            } catch (error) {
                const errorMesseage = error.message || error
                notify({
                    title: "Coupon Verifiction Error",
                    text: errorMesseage,
                    type: 'error'
                })
            }
        }
        
        /** Calculate the total price of checkout.total_price 
        *   this price if for count all the product in checkout.products
        */
        const calculate_total_price = ()=> {
            checkout.total_price = 0
            checkout.products.forEach(product => {
                checkout.total_price += product.total_price
            })
            if (coupon.exist) checkout.total_price = (checkout.total_price - coupon.price)
            if (checkout.is_cash) calculate_change()
        }
        
        /** Calculate the cash change if is_cash==true  */
        const calculate_change = ()=> {
            const change = (checkout.cash - checkout.total_price)
            checkout.active = false
            checkout.cash_change = 0
            if (checkout.products.length > 0 && change >= 0) {
                checkout.cash_change = change
                checkout.active = true
            }
        }

        /** Get the product by the barcode
         *  push data to checkout.products for products lists
         *  And calculate total  price for each product
         */
        const get_product_by_barcode = async(barcode)=> {
            try {
                const { data } = await axios.get(`/product/ ${barcode}`)
                const index = checkout.products.findIndex(item => item.id == data.id)
                if (index >= 0) {
                    const available_qty = (data.quantity - checkout.products[index].qty)
                    if (available_qty < 1) throw `Sorry! there are no more ${data.name} available in stock`
                    checkout.products[index].qty += 1
                    checkout.products[index].total_price = (data.unit_price * checkout.products[index].qty)
                    return calculate_total_price()
                }
                data.qty = 1
                data.total_price = (data.unit_price * data.qty)
                checkout.products.push(data)
                calculate_total_price()
            } catch (error) {
                const errorMesseage = error.message || error
                notify({
                    title: "Checkout Product Warning",
                    text: errorMesseage,
                    type: 'warn'
                })
            }   
        }

        /** Find product by entering barcode - variables */
        const find_product = reactive({
            loading: false,
            barcode: '',
            b_code: '',
            id: '',
            name: '',
            type: '',
            unit_price: 0
        })
        /** Find product by entering barcode */
        const find_product_by_enter_barcode = async() => {
            try {
                find_product.loading = true
                const { data } = await axios.get(`/product/ ${find_product.barcode}`)
                console.log(data)
                find_product.b_code = data.barcode
                find_product.name = data.name
                find_product.type = data.type
                find_product.unit_price = data.unit_price
                find_product.loading = false
            } catch (error) {
                const errorMesseage = error.message || error
                find_product.loading = false
                notify({
                    title: "Find Product By Barcode Error",
                    text: errorMesseage,
                    type: 'error'
                })
            } 
        }

        /** Validate and POST submit checkout data */
        const sale_checkout = async()=> {
            try {
                if (!checkout.active) throw 'You must add at least one product to cart and enter money if pay is cash'
                checkout.loading = true
                const inputData = {
                    products: checkout.products,
                    total_price: checkout.total_price,
                    is_cash: checkout.is_cash,
                    cash: checkout.cash,
                    cash_change: checkout.cash_change,
                }
                let has_error = {
                    error: false,
                    message: ''
                }
                inputData.products.forEach(product => {
                    if (product.qty < 1) {
                        has_error.error = true
                        has_error.message = `${product.name} quantity must be at least one`
                    }
                })
                if (has_error.error) throw has_error.message
                const { data } = await axios.post("/checkout", inputData)
                checkout.message = data.message
                document.querySelector("#modalCheckoutShow").click()
            } catch (error) {
                checkout.loading = false
                const errorMesseage = error.message || error
                notify({
                    title: "Checkout Error",
                    text: errorMesseage,
                    type: 'error'
                })
            }
        }

        /** Clear all variables after sale_checkout POST submit went success */
        const clear_checkout = ()=> {
            checkout.loading = false
            checkout.active = false
            checkout.is_cash = true
            checkout.products = []
            checkout.total_price = 0.00
            checkout.cash = ''
            checkout.cash_change = 0.00
            coupon.exist = false
            coupon.code = ''
            coupon.price = 0.00,
            checkout.message = ''
        }

        /** Remove single product by ID from checkout products */
        const remove_product_item = id => {
            const index  = checkout.products.findIndex(item => item.id == id)
            checkout.products.splice(index, 1)
            calculate_total_price()
            calculate_change()
        }

        /** Toogler fuction to choose transaction will be CASH || CARD */
        const cash_card_toggler = (option) => {
            if (option == 'cash') {
                checkout.is_cash = true
                checkout.cash = ''
                return calculate_change()
            }
            checkout.is_cash = false
            if (checkout.products.length < 1) return checkout.active = false 
            checkout.active = true
        }

        /** Update Single product from checkout products */
        const update_product_qty = (product) => {
            const remaining_qty = Number(product.quantity - product.qty)
            const index = checkout.products.findIndex(item => item.id == product.id)
            if(remaining_qty > 0) {
                checkout.products[index].total_price = Number(product.unit_price * product.qty)
                calculate_total_price()  
            }
            else {
                checkout.active = false
                checkout.products[index].qty = 1
                notify({
                    title: "Update Product Quantity Error",
                    text: `Sorry! there are only ${product.quantity} ${product.name} left in store`,
                    type: 'error'
                })
            }
        }

        /** Get and Assemble Data to BARCODE from SCANNER  */
        let raw_barcode = { barcode: '', clear: true }
        const generate_barcode = event => {
            if (raw_barcode.clear) raw_barcode.barcode = ''
            if (event.code == 'Alt' || event.code == 'AltLeft' || event.code == 'AltRight') {
                return raw_barcode.clear = true
            }
            if (event.code == 'Enter') {
                raw_barcode.clear = true
                return get_product_by_barcode(raw_barcode.barcode)
            }
            raw_barcode.clear = false
            raw_barcode.barcode += event.key
        }
        onMounted(()=> document.addEventListener('keydown', generate_barcode))

        return {
            checkout,
            coupon,
            find_product,
            verify_coupon,
            calculate_change,
            sale_checkout,
            clear_checkout,
            remove_product_item,
            cash_card_toggler,
            get_product_by_barcode,
            find_product_by_enter_barcode,
            update_product_qty
        }
    }
}
</script>