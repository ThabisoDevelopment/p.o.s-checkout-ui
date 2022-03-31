<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light mb-3">
        <div class="container">
            <router-link class="navbar-brand" :to="{ name: 'Admin' }">
                <span class="fw-bold h3 text-dark">P.O.S SYSTEM</span>
                <small class="text-sm px-1">by anestordev</small>
            </router-link>

            <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                
                <li class="nav-item dropdown">
                    <router-link to="#" class="nav-link dropdown-toggle" id="navbarDropdownMenu" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <span class="fa fa-user"></span>
                        {{ username }}
                    </router-link>
                    <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenu">
                        <li>
                            <router-link class="dropdown-item py-2" :to="{ name: 'Home' }">Exit Admin</router-link>
                        </li>
                        <li>
                            <router-link class="dropdown-item py-2" :to="{ name: 'Home' }">
                                <span class="fa fa-user pe-2"></span>
                                Profile
                            </router-link>
                        </li>
                        <li>
                            <button class="dropdown-item py-2" @click="logout">
                                <span class="fa fa-sign-out-alt pe-2"></span>
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