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
                        <router-link class="nav-link text-light h4 my-auto" :to="{ name: 'Reports' }">Recent Store Reports</router-link>
                    </li>
                    <li class="nav-item my-auto">
                        <router-link class="nav-link text-warning" :to="{ name: 'Sales' }">
                            <span class="fa fa-dollar-sign pe-1"></span>
                            Sales
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import NavigationBar from "@/components/home/NavigationBar.vue"
import SideMenuBar from "@/components/home/SideMenuBar.vue"
export default {
    components: { NavigationBar, SideMenuBar },
    setup() {

    }
}
</script>