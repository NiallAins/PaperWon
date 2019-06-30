<template>
    <div class="view-papers">
        <h1> Exam papers by year </h1>
        <h2> 2019 </h2>
        <div>
            <router-link :to="'/papers/2019/1'">Higher Level Paper One</router-link>
        </div>
        <div>
            <router-link :to="'/papers/2019/2'">Higher Level Paper Two</router-link>
        </div>
    </div>
</template>

<style scoped>
   .view-papers div {
       padding: 10px;
   }
</style>

<script>
export default {
    name: 'papers'
}
</script>