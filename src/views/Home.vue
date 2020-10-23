<template>
  <div class="wrapper">
    <transition name="fade">
    <div v-show="!isLoading && !rockIsLoading" class="inner-wrapper">
    <div class="headline">
      <canvas class="rock"></canvas>
      <div class="headline-content">
        <h1>Green Spaces</h1>
        <p>Évolution de la végétation dans Paris</p>
      </div>
      <a href="#" class="cta-scroll"><img src="../assets/icons/arrow-down.svg" alt="Scroll to discover"></a>
      <div class="headline-data">
        <div class="bottom-left">
          <p><span class="label">Pollution </span> {{pollution.toPrecision(4)}}%</p>
          <p><span class="label">Superficie </span> {{displayed_superficie.toPrecision(4)}} km²</p>
        </div>
        <div class="bottom-right">
          <p><span class="label">Espèces végétales </span> {{tree_species.length}}</p>
          <p><span class="label">Espaces verts </span> {{ev_count}}</p>
        </div>
      </div>
    </div>  
    <Timeline v-if='floreReady' :data_ev="places" :prop1970="proportionalite_ev_1970" :superficie1970="superficie_ev_1970" :data_arbres='data_arbres'/>
    <FloreParis v-if='floreReady' :data='data_arbres'/>
    </div>
    </transition>
    <transition name="fade">
    <div class="loader" v-if='isLoading && !rockIsLoading'>
        <h1>Green Spaces</h1>
        <p>Comptage des arbres, évaluation de l'air ambiant, tracé des graphiques, modélisations...</p>
    </div>
    </transition>
  </div>
</template>

<script>
// @ is an alias to /src
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Timeline from '@/components/Timeline.vue'
import axios from 'axios'
import moment from 'vue-moment'
import FloreParis from '../components/FloreParis'
export default {
  name: 'Home',
  components: {
    Timeline,
    FloreParis,
  },
  data() {
    return {
      proportionalite_ev:0,
      superficie_ev: 0,
      proportionalite_ev_1970:0,
      superficie_ev_1970: 0,
      superficie_bois: 1.9e+7, // pas dispo depuis l'API :(
      superficie_paris:1.05e+8, // 105.4 km2,
      ev_count:0, // espaces verts, parcs et bois
      displayed_superficie:0,
      pollution:0,
      data_arbres:{},
      floreReady:false,
      tree_species:[],
      isLoading:true,
      rockIsLoading:true
    }
  },
  async mounted() {
    this.addRock();
    await this.loadData()
    await this.getPollution()
  },
  methods: {
    addRock() {
      var self = this;
      // move the rock
      const canvas = document.querySelector('.rock')
      let time = 0
      let scene = new THREE.Scene()
      let camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      )
      var renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
      })
      renderer.setClearColor(0x000000, 0)
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(window.devicePixelRatio)

      let manager = new THREE.LoadingManager()
      let textureLoader = new THREE.TextureLoader(manager)
      const loader = new GLTFLoader()
      let model
      let texture = textureLoader.load('/rock.jpg')
      let material = new THREE.MeshBasicMaterial({
        map: texture,
      })

      loader.load('/rock_.glb', (gltf) => {
        // called when the resource is loaded
        self.rockIsLoading = false;
        // pointing Mesh
        model = gltf.scene.children[0]
        // Overiding Material
        model.material = material
        model.position.y = 2
        model.scale.x = 13
        model.scale.y = 13
        model.scale.z = 13
        // Add to scene
        scene.add(model)
        let pointLight = new THREE.PointLight(0xffffff, 1)
        pointLight.position.x = -20
        pointLight.position.y = 20
        scene.add(pointLight)

        let ambientLight = new THREE.AmbientLight(0x111111)
        scene.add(ambientLight)
      })
      window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setPixelRatio(window.devicePixelRatio)
      })

      camera.position.z = 20

      // à chaque image : 60fps
      const update = () => {
        requestAnimationFrame(update)
        time += 0.001
       if(model)  {
          model.rotation.y = time
        model.rotation.z = time
       }

        // Render WebGL Scene
        renderer.render(scene, camera)
      }
      requestAnimationFrame(update)
    },
    async loadData() {
      let data = await axios.get(
      'https://opendata.paris.fr/api/records/1.0/search/?dataset=espaces_verts&rows=2000'
    )
    this.places = data.data.records.filter(
      (place) =>
        place.fields.categorie == "Bois" ||
        place.fields.categorie == "Espace Vert" ||
        place.fields.categorie == "Parc" ||
        place.fields.categorie == "Square" ||
        place.fields.categorie == "Promenade" ||
        place.fields.categorie == "Jardin"
    )
    this.places.forEach(element => {
      if(element.fields.categorie === "Espace Vert") {
        this.ev_count++;
      }
      if(element.fields.surface_totale_reelle) {
      this.superficie_ev += element.fields.surface_totale_reelle
      }
      
    });
    this.proportionalite_ev = (this.superficie_ev+this.superficie_bois) / this.superficie_paris
    this.displayed_superficie =  (this.superficie_bois+this.superficie_ev)/1e+6
    //pour 1970
    let data_1970 = await axios.get(
      'https://opendata.paris.fr/api/records/1.0/search/?dataset=espaces_verts&rows=2000'
    )
    this.places_1970 = data_1970.data.records.filter(
      (place) =>
        place.fields.categorie == "Bois" ||
        place.fields.categorie == "Espace Vert" ||
        place.fields.categorie == "Parc" &&
        place.fields.annee_ouverture <= 1990
        
    )
    this.places_1970.forEach(element => {
      if(element.fields.categorie === "Espace Vert") {
        this.ev_count++;
      }
      if(element.fields.surface_totale_reelle) {
        this.superficie_ev_1970 += parseInt(element.fields.surface_totale_reelle)
      }
      
    });
    this.proportionalite_ev_1970 = (this.superficie_ev_1970+this.superficie_bois) / this.superficie_paris
    this.superficie_ev_1970 =  (this.superficie_bois+this.superficie_ev_1970)/1e+6
    // data arbres

     axios.get('https://opendata.paris.fr/api/records/1.0/search/?dataset=arbresremarquablesparis&rows=2000&q=&facet=genre&facet=espece&facet=stadedeveloppement&facet=varieteoucultivar&facet=dateplantation&facet=libellefrancais').then(response => {
       this.data_arbres = response;
       this.tree_species = []
       response.data.records.forEach(item => {
        if(!this.tree_species.includes(item.fields.espece)) {
           this.tree_species.push(item.fields.espece)
        }
       })
       this.floreReady=true
     });
    },
    async getPollution() {
      let yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0)
      yesterday.setMinutes(0)
      yesterday.setSeconds(0)
      yesterday = yesterday.getDate() + '/'+yesterday.getMonth()+'/'+yesterday.getFullYear();
      // on récupère le taux de no2 dans l'air
      let data = await axios.get('https://services8.arcgis.com/gtmasQsdfwbDAQSQ/arcgis/rest/services/mes_idf_horaire_no2/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=false&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=id+DESC&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=')
      let releves = data.data.features;

      let yesterdayReleves = []
      for(let i =0; i<50; i++) {
        let itemDate = new Date(releves[i].attributes.date_debut);
        itemDate = itemDate.getDate() + '/'+itemDate.getMonth()+'/'+itemDate.getFullYear();

      if(itemDate === yesterday) {
        yesterdayReleves.push(releves[i].attributes.valeur)
      }
      }
      let somme = 0;
      yesterdayReleves.forEach(item => {
        somme+=item
      })
     this.pollution = ((somme/yesterdayReleves.length)/200)*100;
     this.isLoading =false;
     document.body.classList.add('loaded')
    } 
 },
}
</script>
