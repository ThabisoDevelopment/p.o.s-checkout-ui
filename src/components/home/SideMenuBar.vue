<template>
    <div class="col-3 col-lg-2 shadow-sm bg-light vh-100">
        <div class="d-flex p-3 mb-2">
            <p class="my-0 p-0 h3 fw-bold text">
                <span class="fa fa-list"></span>
                <span class="ps-2">Menu</span>
            </p>
        </div>
        <ul class="nav nav-pills flex-column">
            <li class="nav-item">
                <router-link :to="{ name: 'Admin' }" class="nav-link text-dark">
                    <span class="fa fa-home pe-2"></span>
                    Dashboard
                </router-link>
            </li>
            <li class="nav-item">
                <router-link :to="{ name: 'Orders' }" class="nav-link text-dark">
                    <span class="fa fa-file pe-2"></span>
                    Orders
                </router-link>
            </li>
            <li class="nav-item">
                <router-link :to="{ name: 'Reports' }" class="nav-link text-dark">
                    <span class="fa fa-chart-bar pe-2"></span>
                    Reports
                </router-link>
            </li>
            <li class="nav-item">
                <router-link :to="{ name: 'Products' }" class="nav-link text-dark">
                    <span class="fa fa-shopping-cart pe-2"></span>
                    Products
                </router-link>
            </li>
            <li class="nav-item">
                <router-link :to="{ name: 'Promotions' }" class="nav-link text-dark">
                    <span class="fa fa-bullhorn pe-2"></span>
                    Promotions
                </router-link>
            </li>
            <li class="nav-item">
                <router-link :to="{ name: 'Users' }" class="nav-link text-dark">
                    <span class="fa fa-users pe-2"></span>
                    Users
                </router-link>
            </li>
        </ul>
    </div>
</template>