<template>
    <div class="container">
        <div class="row">
            <div class="col-md-6 px-2">
                <div class="row bg-secondary rounded mb-3 py-3">
                    <div class="col-5 text-light">Name</div>
                    <div class="col-2 text-light">Type</div>
                    <div class="col-2 text-light">QTY</div>
                    <div class="col-2 text-light">Price</div>
                </div>

                <div class="row py-2 border-bottom mb-2">
                    <div class="col-5">Heineken</div>
                    <div class="col-2">660 ml</div>
                    <div class="col-2">4</div>
                    <div class="col-2">R100.00</div>
                </div>
                <div class="row py-2 border-bottom" v-for="product in checkout.products" :key="product.id">
                    {{ product }}
                </div>
            </div>

            <div class="col-md-6">
                <div class="card border-0">
                    <div class="card-header border-0 btn-group p-0">
                        <button class="btn btn-warning btn-lg">CASH MONEY</button>
                        <button class="btn btn-primary btn-lg">CREDIT CARD</button>
                    </div>
                    <div class="card-body pb-3">
                        <div class="input-group border mb-5">
                            <label for="promotion" class="form-label bg-light ip-1 my-auto rounded-s pe-3">COUPON</label>
                            <input type="text" class="form-control ip-1 bg-light border-0" v-model="checkout.coupon.code">
                            <btn class="input-group-text btn-success border-0 px-3" id="promotion-addon">
                                apply
                            </btn>
                        </div>

                        <p class="card-text h4 mb-3">Coupon Price: <span class="text-danger fw-bold">-R4.00</span></p>
                        <p class="card-text h3">Total Price: <span class="text-success fw-bold">R171.00</span></p>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>
<script>
import { reactive } from '@vue/reactivity'
import axios from 'axios'
import { onMounted } from '@vue/runtime-core'
export default {
    setup(){

        const checkout = reactive({
            is_cash: true,
            coupon: {
                exist: false,
                code: '',
                price: 0.00
            },
            products: [],
            total_price: 0.00,
            cash_money: 0.00,
            change_money: 0.00
        })

        const get_product_by_barcode = async(barcode)=> {
            try {
                const { data } = await axios.get(`/product/ ${barcode}`)
                console.log(data)
                checkout.products.push(data)
            } catch (error) {
                const errorMessage = error.response? error.response.data.message :error.message
                console.log(errorMessage)
            }   
        }

        onMounted(()=> get_product_by_barcode("12345"))

        return {
            checkout
        }
    }
}
</script>