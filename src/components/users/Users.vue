<template>
    <!-- Admin Navigationr Bar -->
    <navigation-bar />

    <div class="container-fluid">
        <div class="row">
            <!-- Setup Side menu bar for nav -->
            <side-menu-bar />

            <!-- Every thing else goes hear  -->
            <div class="col">
                <p class="">welcome to users</p>
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