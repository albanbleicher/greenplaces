<template>
  <div class="home">
    <div class="bg"></div>
    <div class="headline">
      <canvas class="rock"></canvas>
      <div class="headline-content">
        <h1>Green places</h1>
        <p>Walk barefoot in the city</p>
      </div>
      <a href="#" class="cta-scroll"><img src="../assets/icons/arrow-down.svg" alt="Scroll to discover"></a>
      <div class="headline-data">
        <div class="bottom-left">
          <p><span class="label">Pollution :</span> {{pollution.toPrecision(4)}}%</p>
          <p><span class="label">Superficie :</span> {{displayed_superficie.toPrecision(5)}} km²</p>
        </div>
        <div class="bottom-right">
          <p><span class="label">Espèces végétales :</span> {{pollution.toPrecision(4)}}%</p>
          <p><span class="label">Espaces verts :</span> {{ev_count}}</p>
        </div>
      </div>
    </div>
    <!-- <div class="timeline">
      <Timeline/>
    </div> -->
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
export default {
  name: 'Home',
  data() {
    return {
      proportionalite_ev:0,
      superficie_ev: 0,
      superficie_bois: 1.692e+7, // pas dispo depuis l'API :(
      superficie_paris:1.054e+8, // 105.4 km2,
      ev_count:0, // espaces verts, parcs et bois
      displayed_superficie:0,
      pollution:0
    }
  },
  async mounted() {
    this.addRock();
    await this.loadData()
    await this.getPollution()
  },
  methods: {
    addRock() {
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

      loader.load('/untitled.glb', (gltf) => {
        // called when the resource is loaded

        // pointing Mesh
        model = gltf.scene.children[0]
        // Overiding Material
        model.material = material
        model.position.y = 0
        model.scale.x = 5.2
        model.scale.y = 5.2
        model.scale.z = 5.2
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
        place.fields.categorie == "Parc"
        
    )
    this.places.forEach(element => {
      if(element.fields.categorie === "Espace Vert") {
        this.ev_count++;
      }
      if(element.fields.surface_totale_reelle) {
        this.superficie_ev += parseInt(element.fields.surface_totale_reelle)
      }
      
    });
    this.proportionalite_ev = (((this.superficie_ev+this.superficie_bois)/this.superficie_paris)*100).toPrecision(4)
    this.displayed_superficie = Math.sqrt(this.superficie_ev+this.superficie_bois)
    },
    async getPollution() {
      let yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0)
      yesterday.setMinutes(0)
      yesterday.setSeconds(0)
      yesterday = yesterday.getDate() + '/'+yesterday.getMonth()+'/'+yesterday.getFullYear();
      console.log(yesterday)
      // on récupère le taux de no2 dans l'air
      let data = await axios.get('https://services8.arcgis.com/gtmasQsdfwbDAQSQ/arcgis/rest/services/mes_idf_horaire_no2/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=false&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=id+DESC&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=')
      let releves = data.data.features;

      let yesterdayReleves = []
      for(let i =0; i<50; i++) {
        let itemDate = new Date(releves[i].attributes.date_debut);
        itemDate = itemDate.getDate() + '/'+itemDate.getMonth()+'/'+itemDate.getFullYear();

      // console.log(itemDate)
      if(itemDate === yesterday) {
        // console.log('match')
        yesterdayReleves.push(releves[i].attributes.valeur)
      }
      }
      let somme = 0;
      yesterdayReleves.forEach(item => {
        somme+=item
      })
     this.pollution = ((somme/yesterdayReleves.length)/200)*100;
    } 
 },
}
</script>
