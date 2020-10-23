<template>
  <div class="timeline">
    <div class="sub">
            <h2>Parc atlas</h2>
        <p>Vue d'ensemble des parcs, jardins et autres espaces verts ouverts à Paris depuis 1970</p>
        </div>
          <div class="navigate-years">
          <div class="back">
            <transition name="fade">
          <img @click="doAnimation" v-if='animYear===2020' src="@/assets/icons/arrow-left.svg" alt="Passé">
            </transition>
          </div>
          <div class="label">{{animYear}}</div>
          <div class="now">
            <transition name="fade">
          <img @click="doAnimation" v-if="animYear===1970" src="@/assets/icons/arrow-right.svg" alt="Présent">
            </transition>
          </div>
        </div>
        <p class="sub-info"><img :src="require('@/assets/leaf.svg')" alt="Leaf">{{opened_2020.length}} espaces verts et parcs ouverts cette année</p>

        <img v-for="(image, key) in map" :src="image" alt="img" :key='key' class="loader">
        <img class="map" :src="map[mapImage]" alt="Map">
    <div class="infos">
      <div class="infos-element">
        <h2>Surface</h2>
        <p>Les espaces verts occupaient <b>{{((prop1970)*100).toPrecision(4)}}%</b> de Paris (<b>{{(superficie1970).toPrecision(4)}} km²</b>) en 1990. plus de 354 espèces d'arbres existe sur ces zones aujourd'hui. De nos jours, on peut retrouver <b>{{data_arbres.data.nhits}}</b> arbres d'exceptions dans Paris.</p>
      </div>
      <div class="infos-element">
        <h2>Ouvert dans l'année</h2>
        <ul>
          <li v-for="(place, key) in opened_2020" :key='key'>{{place.fields.nom_ev}}</li>
        </ul>
      </div>
      <div class="infos-element">
        <h2>Typologie des espaces verts</h2>
        <canvas id="myChart"></canvas>
        <p class="label" v-if='showLabel'>{{chartLabel}}  <b>{{chartValue}}</b></p>
        <!-- <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repudiandae accusantium dicta voluptate fugit nulla est repellat nemo aliquid totam alias ad, molestiae, hic numquam placeat quibusdam temporibus rem minima officia!</p> -->
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import Chart from 'chart.js';
import { log } from 'three';
 
export default {
  data() {
    return {
      trees: [],
      opened_2020: [],
      showLabel:false,
      chartLabel:'',
      chartValue:'',
      map: [],
      mapImage:0,
      animYear: 1970
    }
  },
  created() {

  },
  async mounted() {
    await this.callTrees()
    this.opened_2020 = this.data_ev.filter(item => item.fields.annee_ouverture === "2020");
    this.doGraph();
        this.map  = [
  require('@/assets/map/1.png'),
require('@/assets/map/2.png'),
require('@/assets/map/3.png'),
require('@/assets/map/4.png'),
require('@/assets/map/5.png'),
require('@/assets/map/6.png'),
require('@/assets/map/7.png'),
require('@/assets/map/8.png'),
require('@/assets/map/9.png'),
require('@/assets/map/10.png'),
require('@/assets/map/11.png'),
require('@/assets/map/12.png'),
require('@/assets/map/13.png'),
require('@/assets/map/14.png'),
require('@/assets/map/15.png'),
require('@/assets/map/16.png'),
require('@/assets/map/17.png'),
require('@/assets/map/18.png'),
require('@/assets/map/19.png'),
require('@/assets/map/20.png'),
require('@/assets/map/21.png'),
require('@/assets/map/22.png'),
require('@/assets/map/23.png'),
require('@/assets/map/24.png'),
require('@/assets/map/25.png'),
require('@/assets/map/26.png'),
require('@/assets/map/27.png'),
require('@/assets/map/28.png'),
require('@/assets/map/29.png'),
require('@/assets/map/30.png'),
require('@/assets/map/31.png'),
require('@/assets/map/32.png'),
require('@/assets/map/33.png'),
require('@/assets/map/34.png'),
require('@/assets/map/35.png'),
require('@/assets/map/36.png'),
require('@/assets/map/37.png'),
require('@/assets/map/38.png'),
require('@/assets/map/39.png'),
require('@/assets/map/40.png')
]

  },
  methods: {
    moveLabel(e){
      var percentage = (this.animYear *100) / 2020;
      

    },
    async callTrees(){
      // let response = await axios.get('https://opendata.paris.fr/api/records/1.0/search/?dataset=arbresremarquablesparis&q=&rows=500&facet=genre&facet=espece&facet=stadedeveloppement&facet=varieteoucultivar&facet=dateplantation&facet=libellefrancais');
      // this.trees = response.data.records;
    }, 
    doGraph() {
      var self = this;
      let count_ev = [
        this.data_ev.filter(item => item.fields.categorie === "Espace Vert").length,
        this.data_ev.filter(item => item.fields.categorie === "Square").length,
        this.data_ev.filter(item => item.fields.categorie === "Parc").length,
        this.data_ev.filter(item => item.fields.categorie === "Promenade").length,
        this.data_ev.filter(item => item.fields.categorie === "Jardin").length,
      ]
      var ctx = document.getElementById('myChart').getContext('2d');
      Chart.defaults.global.elements.arc.margin=100
      var myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['Espaces verts', 'Squares', 'Parcs', "Promenades", "Jardins"],
        datasets: [{
            data: count_ev,
            backgroundColor: [
                'rgba(6, 157, 93, 0.3)',
                'rgba(6, 157, 93, 0.3)',
                'rgba(6, 157, 93, 0.3)',
                'rgba(6, 157, 93, 0.3)',
                'rgba(6, 157, 93, 0.3)',
               
            ],
            borderColor: [
              '#1A1A1A',
              '#1A1A1A',
              '#1A1A1A',
              '#1A1A1A',
              '#1A1A1A',
            ],
            hoverBackgroundColor: [
              '#069D5D',
              '#069D5D',
              '#069D5D',
              '#069D5D',
              '#069D5D',
            ],
            borderWidth: 5,
        }]
    },
    options: {
      tooltips: {
        enabled:false
      },
         onHover: function(e) {
     var item = myChart.getElementAtEvent(e);
    if (item.length) {
      self.showLabel = true;
      self.chartLabel = item[0]._model.label;
      self.chartValue = count_ev[item[0]._index];
    }
    else {
      self.showLabel = false;
    }

    }, 
      responsive:true,
      layout: {
            visibility:'hidden'
        },
      legend: {
            display: false,
      },
        scales: {
            yAxes: [{
                display:false,
                ticks: {
                    beginAtZero: true
                }
            }],
            xAxes: [{
                 display:false
            }],
        }
    },
 
});

    },
    doAnimation() {
      var self = this;
      let add, remove
      if(self.animYear === 1970) {
        add = setInterval(()=>{
          self.mapImage <39 ? self.mapImage++ : clearInterval(add)
        },30)
        self.animYear = 2020
      }
      else {
remove = setInterval(()=>{
          self.mapImage >0 ? self.mapImage-- : clearInterval(remove)
        },30)
        self.animYear = 1970
      }
    }
  },
   props: {
        data_arbres:{
            type:Object,
            required:true
        },
        data_ev:{
            type:Array,
            required:true
        },
        prop1970:{
          type: Number,
          required:true
        },
        superficie1970:{
          type: Number,
          required:true
        },
  
    }
}
</script>