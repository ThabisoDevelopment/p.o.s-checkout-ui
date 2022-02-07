<template>
    <div class="container">
        {{ welcome }}
    </div>
</template>
<script>
export default {
    setup(){

        const welcome = "hello welcome to checkout"

        return {
            welcome
        }
    }
}
</script>