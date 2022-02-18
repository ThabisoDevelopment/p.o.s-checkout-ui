<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light mb-3">
        <div class="container">
            <router-link class="navbar-brand" to="/">
                <span class="fw-bold text-dark">P.O.S</span>
                <small class="text-sm px-1">by anestordev</small>
            </router-link>

            <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                <li class="nav-item dropdown mx-2">
                    <router-link to="#" class="nav-link dropdown-toggle" id="navbarDropdownMenu" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        {{ username }}
                    </router-link>
                    <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenu">
                        <li><button class="dropdown-item" @click="logout">logout</button></li>
                    </ul>
                </li>
            </ul>
        </div>
    </nav>
</template>
<script>
export default {
    name: "Navigation",
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