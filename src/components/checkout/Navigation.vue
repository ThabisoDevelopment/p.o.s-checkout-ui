<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light mb-3">
        <div class="container">
            <router-link class="navbar-brand" to="/">
                <span class="fw-bold h3 text-dark">CHECKOUT</span>
                <small class="text-sm px-1">by anestordev</small>
            </router-link>

            <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                <li class="nav-item mx-3">
                    <router-link to="#" class="nav-link mx-2" role="button" data-bs-toggle="modal" data-bs-target="#addByBarcodeModal">
                        <span class="fa fa-plus"></span>
                        By Barcode
                    </router-link>
                </li>
                <li class="nav-item dropdown">
                    <router-link to="#" class="nav-link dropdown-toggle" id="navbarDropdownMenu" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <span class="fa fa-user"></span>
                        {{ username }}
                    </router-link>
                    <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenu">
                        <li>
                            <button class="dropdown-item" @click="logout">
                                <span class="fa fa-sign-out-alt"></span>
                                logout
                            </button>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </nav>
</template>
<script>
export default {
    setup() {
        const username = localStorage.getItem('username')
        const logout = ()=> {
            localStorage.removeItem('token')
            localStorage.removeItem('username')
            window.location.href = '/login'
        }
        return { username, logout }
    }
}
</script>