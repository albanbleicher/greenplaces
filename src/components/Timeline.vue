<template>
  <div class="timeline">
    <div class="sub">
            <h2>Parc atlas</h2>
        <p>Vue d'ensemble des parcs, jardins et autres espaces verts ouverts à Paris depuis 1970</p>
        </div>
        <img class="map" :src="map[mapImage]" alt="Map">
        <div class="navigate-years">
          <div class="back">
            <transition name="fade">
          <img @click="doAnimation" v-if='animYear===2020' src="@/assets/icons/arrow-left.svg" alt="Passé">
            </transition>
          </div>
          <div class="label">{{animYear}}</div>
          <div class="now">
            <transition name="fade">
          <img @click="doAnimation" v-if="animYear===1990" src="@/assets/icons/arrow-right.svg" alt="Présent">
            </transition>
          </div>
        </div>
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
        <canvas id="myChart" width="300" height="300"></canvas>
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
      animYear: 1990
    }
  },
  async mounted() {
    this.map  = [
  require('@/assets/map/0001.png'),
require('@/assets/map/0002.png'),
require('@/assets/map/0003.png'),
require('@/assets/map/0004.png'),
require('@/assets/map/0005.png'),
require('@/assets/map/0006.png'),
require('@/assets/map/0007.png'),
require('@/assets/map/0008.png'),
require('@/assets/map/0009.png'),
require('@/assets/map/0010.png'),
require('@/assets/map/0011.png'),
require('@/assets/map/0012.png'),
require('@/assets/map/0013.png'),
require('@/assets/map/0014.png'),
require('@/assets/map/0015.png'),
require('@/assets/map/0016.png'),
require('@/assets/map/0017.png'),
require('@/assets/map/0018.png'),
require('@/assets/map/0019.png'),
require('@/assets/map/0020.png'),
require('@/assets/map/0021.png'),
require('@/assets/map/0022.png'),
require('@/assets/map/0023.png'),
require('@/assets/map/0024.png'),
require('@/assets/map/0025.png'),
require('@/assets/map/0026.png'),
require('@/assets/map/0027.png'),
require('@/assets/map/0028.png'),
require('@/assets/map/0029.png'),
require('@/assets/map/0030.png'),
require('@/assets/map/0031.png'),
require('@/assets/map/0032.png'),
require('@/assets/map/0033.png'),
require('@/assets/map/0034.png'),
require('@/assets/map/0035.png'),
require('@/assets/map/0036.png'),
require('@/assets/map/0037.png'),
require('@/assets/map/0038.png'),
require('@/assets/map/0039.png'),
require('@/assets/map/0040.png')
]
    await this.callTrees()
    console.log('treee',this.data_arbres)
    this.opened_2020 = this.data_ev.filter(item => item.fields.annee_ouverture === "2020");
    this.doGraph();

  },
  methods: {
    moveLabel(e){
      console.log('ok')
      var percentage = (this.animYear *100) / 2020;
      console.log(percentage)
      

    },
    async callTrees(){
      // let response = await axios.get('https://opendata.paris.fr/api/records/1.0/search/?dataset=arbresremarquablesparis&q=&rows=500&facet=genre&facet=espece&facet=stadedeveloppement&facet=varieteoucultivar&facet=dateplantation&facet=libellefrancais');
      // this.trees = response.data.records;
      // console.log(this.trees)
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
            borderWidth: 10,
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
      console.log(self.showLabel)

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
      if(self.animYear === 1990) {
        add = setInterval(()=>{
          self.mapImage <39 ? self.mapImage++ : clearInterval(add)
        },30)
        self.animYear = 2020
      }
      else {
remove = setInterval(()=>{
          self.mapImage >0 ? self.mapImage-- : clearInterval(remove)
        },30)
        self.animYear = 1990
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