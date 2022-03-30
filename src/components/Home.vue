<template>
    <div class="row justify-content-center">
        
        <div class="col-5">
            <router-link :to="{ name: 'Checkout' }"> Checkout </router-link>
        </div>
        <div class="col-5">
            <router-link :to="{ name: 'Checkout' }"> Store Management </router-link>
        </div>
    </div>
</template>