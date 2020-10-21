<template>
    <div class="flore">
        <div class="sub">
            <h2>La flore de Paris</h2>
        <p>Cliquer sur les flêches du slider des familles d’arbre les plus rencontrées dans les parcs de Paris sur les années 1830 à 2020 pour en apprendre plus.</p>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
export default {
    mounted() {
        // console.log(this.data)

    },
    props: {
        data:{
            type:Object,
            required:true
        }
    }
}
</script>